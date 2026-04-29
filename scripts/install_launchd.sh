#!/usr/bin/env bash
# =============================================================================
# install_launchd.sh
# 将每日日报生成脚本注册为 macOS launchd 定时任务（每天 17:00 执行）
# 用法: bash scripts/install_launchd.sh [--uninstall]
# =============================================================================

set -euo pipefail

LABEL="com.zero2x.daily-report"
PLIST_DIR="$HOME/Library/LaunchAgents"
PLIST_PATH="$PLIST_DIR/$LABEL.plist"

# 脚本和项目的绝对路径
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/gen_daily_report.py"
LOG_DIR="$PROJECT_ROOT/docs/daily-chat"
LOG_FILE="$LOG_DIR/launchd.log"
ERR_FILE="$LOG_DIR/launchd-error.log"

# 找到可用的 python3
find_python() {
    for py in python3 /usr/bin/python3 /usr/local/bin/python3; do
        if command -v "$py" &>/dev/null; then
            echo "$py"
            return
        fi
    done
    echo "❌ 未找到 python3，请先安装 Python 3。" >&2
    exit 1
}

# ── 卸载 ────────────────────────────────────────────────────────────────────
if [[ "${1:-}" == "--uninstall" ]]; then
    if [ -f "$PLIST_PATH" ]; then
        launchctl unload "$PLIST_PATH" 2>/dev/null || true
        rm -f "$PLIST_PATH"
        echo "✅ 已卸载定时任务 $LABEL"
    else
        echo "ℹ️  未找到已安装的定时任务，无需卸载。"
    fi
    exit 0
fi

# ── 安装 ────────────────────────────────────────────────────────────────────
PYTHON_BIN="$(find_python)"
echo "使用 Python: $PYTHON_BIN"
echo "脚本路径:    $PYTHON_SCRIPT"
echo "项目目录:    $PROJECT_ROOT"
echo "日志文件:    $LOG_FILE"

# 创建日志目录
mkdir -p "$LOG_DIR"

# 若已注册，先卸载旧版本
if launchctl list | grep -q "$LABEL" 2>/dev/null; then
    echo "检测到旧版定时任务，先卸载…"
    launchctl unload "$PLIST_PATH" 2>/dev/null || true
fi

# 生成 plist
cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${LABEL}</string>

    <key>ProgramArguments</key>
    <array>
        <string>${PYTHON_BIN}</string>
        <string>${PYTHON_SCRIPT}</string>
    </array>

    <!-- 每天 17:00 执行 -->
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>17</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>${LOG_FILE}</string>

    <key>StandardErrorPath</key>
    <string>${ERR_FILE}</string>

    <!-- 如果错过执行时间（例如电脑关机），下次启动时补跑 -->
    <key>RunAtLoad</key>
    <false/>

    <key>WorkingDirectory</key>
    <string>${PROJECT_ROOT}</string>
</dict>
</plist>
EOF

echo "已写入 plist: $PLIST_PATH"

# 注册定时任务
launchctl load "$PLIST_PATH"
echo ""
echo "✅ 定时任务已安装！每天 17:00 自动生成日报。"
echo ""
echo "常用命令："
echo "  立即手动运行:  python3 $PYTHON_SCRIPT"
echo "  查看任务状态:  launchctl list | grep $LABEL"
echo "  查看日志:      tail -f $LOG_FILE"
echo "  卸载定时任务:  bash $SCRIPT_DIR/install_launchd.sh --uninstall"
