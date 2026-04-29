# docs/daily-chat

每日 Cursor AI 对话日报，由脚本自动生成。

## 文件说明

| 文件 | 说明 |
|------|------|
| `YYYY-MM-DD.md` | 当天的对话日报（提交到 git） |
| `launchd.log` | 定时任务标准输出日志，**不提交** |
| `launchd-error.log` | 定时任务错误日志，**不提交** |

## 日报格式

每份日报包含：

- **概览**：当日用户消息数量、涉及会话数、提到的文件数
- **对话记录**：按会话分组，每条显示用户问题 + AI 回复摘要
- **涉及文件**：AI 回复中提到的源文件路径列表

## 手动执行

```bash
# 生成今天的日报
python3 scripts/gen_daily_report.py

# 生成指定日期的日报
python3 scripts/gen_daily_report.py --date 2026-04-08
```

> 脚本会自动扫描 `~/.cursor/projects/*/agent-transcripts/*/*.jsonl`，
> 并按消息时间戳归档到目标日期，自动去重。

## 定时任务管理

```bash
# 安装定时任务（每天 17:00 自动执行）
bash scripts/install_launchd.sh

# 查看任务状态
launchctl list | grep com.zero2x.daily-report

# 查看最近日志
tail -f docs/daily-chat/launchd.log

# 卸载定时任务
bash scripts/install_launchd.sh --uninstall
```
