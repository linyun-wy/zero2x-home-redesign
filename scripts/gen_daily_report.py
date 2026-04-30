#!/usr/bin/env python3
"""
每日 Cursor 对话日报生成脚本
用法: python3 scripts/gen_daily_report.py [--date YYYY-MM-DD]
  --date  指定生成哪天的日报（默认今天）
"""

import json
import re
import sys
import argparse
from datetime import datetime, date
from pathlib import Path
from collections import defaultdict
from typing import List, Dict, Tuple

# ── 配置 ────────────────────────────────────────────────────────────────────

# Cursor transcript 目录（全局）
SCRIPT_DIR   = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
PROJECT_NAME = PROJECT_ROOT.name  # Test-OneID

# Cursor 存储 transcripts 的路径
CURSOR_TRANSCRIPTS_BASE = Path.home() / ".cursor" / "projects"

# 输出目录
OUTPUT_DIR = PROJECT_ROOT / "docs" / "daily-chat"
# AI 回复摘要最大字符数
SUMMARY_MAX_CHARS = 120

# 提取文件路径的正则（匹配 src/xxx.vue 等）
FILE_PATTERN = re.compile(
    r'(?:^|[\s`\'"])([a-zA-Z0-9_\-./]+\.(?:vue|ts|tsx|js|jsx|css|json|md|py|sh))',
    re.MULTILINE
)

# 过滤掉太短或无意义的路径
MIN_PATH_LEN = 4


# ── 工具函数 ─────────────────────────────────────────────────────────────────

def extract_text_from_content(content) -> str:
    """从 message.content（list 或 str）中提取纯文本。"""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text":
                parts.append(item.get("text", ""))
        return "\n".join(parts)
    return ""


def clean_user_text(text: str) -> str:
    """清理用户消息：去除系统注入的标签和图片路径说明。"""
    # 去除各种系统注入的 XML 块
    for tag in ['image_files', 'attached_files', 'open_and_recently_viewed_files',
                'system_reminder', 'user_info', 'agent_transcripts', 'rules']:
        text = re.sub(rf'<{tag}>.*?</{tag}>', '', text, flags=re.DOTALL)
    # 去除外链注入块，避免占据整段日报
    text = re.sub(r'<external_links>.*?</external_links>', '', text, flags=re.DOTALL)
    # 去除时间标签，日期已用于归档，不再展示在正文
    text = re.sub(r'<timestamp>.*?</timestamp>', '', text, flags=re.DOTALL)
    # 去除 <user_query> 包裹标签（保留内容）
    text = re.sub(r'</?user_query>', '', text)
    # 去除 [Image] 及其后的文件路径说明，替换为简短标记
    text = re.sub(r'\[Image\]\s*\n?(?:The following images.*?(?=\n\n|\Z))?', '[图片]', text, flags=re.DOTALL)
    # 去除多余空行
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def extract_date_from_user_text(text: str) -> str:
    """从用户消息中的 <timestamp>...<timestamp> 提取 YYYY-MM-DD。"""
    m = re.search(r"<timestamp>(.*?)</timestamp>", text, flags=re.DOTALL)
    if not m:
        return ""

    ts_text = m.group(1).strip()
    # 例：Wednesday, Apr 29, 2026, 5:07 PM (UTC+8)
    # 先去掉尾部时区说明，兼容不同机器写法
    ts_text = re.sub(r"\s+\(UTC[^)]+\)\s*$", "", ts_text)

    for fmt in ("%A, %b %d, %Y, %I:%M %p", "%a, %b %d, %Y, %I:%M %p"):
        try:
            return datetime.strptime(ts_text, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return ""


# 英文内部思考模式（以大写字母开头的短句，或典型 thinking 句式）
_THINKING_PATTERNS = re.compile(
    r'^(?:The user|I need|Let me|Looking at|Actually|Wait|Hmm|OK|Now|So |I '
    r'|I\'m |I should|This is|I can|I\'ll|I think|I see|I want|I have|But |Also )',
    re.IGNORECASE
)


def summarize_assistant(text: str) -> str:
    """
    从 AI 回复中提取第一段有意义的中文摘要。
    - 过滤 <think> 块、英文内部思考段、Markdown 代码块
    """
    # 去除 <think>...</think> 内部思考
    text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
    # 去除 ```代码块```
    text = re.sub(r'```[\s\S]*?```', '', text)
    # 去除 **英文标题** 形式的分析注释行（如 **Checking terminal...**）
    text = re.sub(r'\*\*[A-Z][^*\n]{0,80}\*\*', '', text)

    lines = [l.strip() for l in text.split('\n') if l.strip()]

    # 第一优先：找有实质中文内容的行（≥6个汉字）
    for line in lines:
        cn_chars = len(re.findall(r'[\u4e00-\u9fff]', line))
        if cn_chars >= 6 and not _THINKING_PATTERNS.match(line):
            return line[:SUMMARY_MAX_CHARS] + ("…" if len(line) > SUMMARY_MAX_CHARS else "")

    # 第二优先：找任何有中文的行
    for line in lines:
        if re.search(r'[\u4e00-\u9fff]', line):
            return line[:SUMMARY_MAX_CHARS] + ("…" if len(line) > SUMMARY_MAX_CHARS else "")

    # Fallback：第一行非思考内容
    for line in lines:
        if not _THINKING_PATTERNS.match(line) and len(line) > 5:
            return line[:SUMMARY_MAX_CHARS]

    return "（工具调用 / 代码操作）"


def extract_files(text: str) -> list[str]:
    """从文本中提取出现的文件路径。"""
    matches = FILE_PATTERN.findall(text)
    seen = set()
    result = []
    for m in matches:
        m = m.strip('`\'" ')
        if len(m) >= MIN_PATH_LEN and m not in seen:
            # 过滤掉纯扩展名或明显不是路径的
            if '/' in m or m.startswith('src'):
                seen.add(m)
                result.append(m)
    return result


def parse_jsonl_file(filepath: Path, start_line: int = 0) -> list[dict]:
    """读取 JSONL 文件，从 start_line 开始，返回解析后的行列表。"""
    rows = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i < start_line:
                continue
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                pass
    return rows


# ── 核心逻辑 ──────────────────────────────────────────────────────────────────

def row_date(row: dict) -> str:
    """从 transcript 行里提取 YYYY-MM-DD 日期。"""
    ts = str(row.get("timestamp", ""))
    if len(ts) >= 10:
        return ts[:10]

    # 新版 transcript 无独立 timestamp 字段，时间在 user 消息文本里
    if row.get("role") == "user":
        message = row.get("message", {})
        raw_text = extract_text_from_content(message.get("content", []))
        return extract_date_from_user_text(raw_text)

    return ""


def iter_transcript_jsonl_files() -> List[Path]:
    """扫描所有 Cursor 项目下的 transcript jsonl。"""
    if not CURSOR_TRANSCRIPTS_BASE.exists():
        return []
    return sorted(CURSOR_TRANSCRIPTS_BASE.glob("*/agent-transcripts/*/*.jsonl"))


def collect_sessions(target_date: str) -> dict:
    """
    扫描所有 projects/*/agent-transcripts，按日期汇总并去重。
    返回: {session_short: [{"user","assistant","files"}...]}
    """
    sessions_data: Dict[str, List[dict]] = defaultdict(list)
    seen = set()

    for jsonl_path in iter_transcript_jsonl_files():
        session_uuid = jsonl_path.parent.name
        session_short = session_uuid[:8]
        file_date = datetime.fromtimestamp(jsonl_path.stat().st_mtime).strftime("%Y-%m-%d")
        rows = parse_jsonl_file(jsonl_path)
        pending_user = None

        for row in rows:
            role = row.get("role", "")
            message = row.get("message", {})
            raw_text = extract_text_from_content(message.get("content", []))

            if role == "user":
                msg_date = row_date(row)
                if msg_date:
                    is_target = msg_date == target_date
                else:
                    # 兼容旧 transcript：无 timestamp 时，回退到文件日期判断
                    is_target = file_date == target_date

                if not is_target:
                    pending_user = None
                    continue
                cleaned = clean_user_text(raw_text)
                pending_user = cleaned if cleaned else None
                continue

            if role == "assistant" and pending_user:
                summary = summarize_assistant(raw_text)
                files = extract_files(raw_text)
                key = (session_uuid, pending_user, summary)
                if key not in seen:
                    seen.add(key)
                    sessions_data[session_short].append({
                        "user": pending_user,
                        "assistant": summary,
                        "files": files,
                    })
                pending_user = None

    return dict(sessions_data)


def render_markdown(target_date: str, sessions_data: dict) -> str:
    """将对话数据渲染为 Markdown 日报。"""
    now_str = datetime.now().strftime("%H:%M")

    total_user_msgs = sum(len(convs) for convs in sessions_data.values())
    total_sessions = len(sessions_data)

    all_files: set[str] = set()
    for convs in sessions_data.values():
        for conv in convs:
            all_files.update(conv["files"])

    lines = [
        f"# 开发日报 · {target_date}",
        "",
        f"> 自动生成 · {now_str} | 项目：{PROJECT_NAME}",
        "",
        "## 概览",
        "",
        "| 指标 | 数值 |",
        "|------|------|",
        f"| 本日新增用户消息 | {total_user_msgs} 条 |",
        f"| 涉及 AI 会话 | {total_sessions} 个 |",
        f"| 提到的文件变更 | {len(all_files)} 个 |",
        "",
        "---",
        "",
        "## 对话记录",
        "",
    ]

    for session_short, convs in sessions_data.items():
        lines.append(f"### 会话 · {session_short}")
        lines.append("")
        for idx, conv in enumerate(convs, 1):
            user_text = conv["user"].replace("\n", " ").strip()
            ai_text   = conv["assistant"].replace("\n", " ").strip()
            lines.append(f"**[{idx}]** 用户：{user_text}")
            lines.append(f"AI：{ai_text}")
            lines.append("")
        lines.append("---")
        lines.append("")

    if all_files:
        lines.append("## 涉及文件")
        lines.append("")
        for f in sorted(all_files):
            lines.append(f"- `{f}`")
        lines.append("")
    else:
        lines.append("## 涉及文件")
        lines.append("")
        lines.append("_本日无明确文件变更记录_")
        lines.append("")

    return "\n".join(lines)


# ── 入口 ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="生成 Cursor 对话日报")
    parser.add_argument("--date", default=date.today().isoformat(), help="目标日期 YYYY-MM-DD（默认今天）")
    args = parser.parse_args()

    target_date = args.date

    print(f"[gen_daily_report] 目标日期: {target_date}")

    if not CURSOR_TRANSCRIPTS_BASE.exists():
        print("[ERROR] 未找到 Cursor transcript 根目录，请确认 ~/.cursor/projects 存在。")
        sys.exit(1)
    print(f"[gen_daily_report] Transcript 根目录: {CURSOR_TRANSCRIPTS_BASE}")

    # 收集对话
    sessions_data = collect_sessions(target_date)

    if not sessions_data:
        print(f"[gen_daily_report] {target_date} 无新增对话，跳过生成。")
        return

    # 生成 Markdown
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / f"{target_date}.md"

    md_content = render_markdown(target_date, sessions_data)
    output_path.write_text(md_content, encoding="utf-8")
    print(f"[gen_daily_report] 日报已生成: {output_path}")


if __name__ == "__main__":
    main()
