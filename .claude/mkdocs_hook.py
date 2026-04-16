"""
Claude Code PostToolUse hook
docs/*.md 또는 mkdocs.yml 수정 시 mkdocs build를 실행해 site/ 폴더를 갱신합니다.
VS Code Live Server (port 5500)가 site/를 서빙합니다.
"""
import sys
import json
import re
import subprocess

data = json.load(sys.stdin)
file_path = data.get("tool_input", {}).get("file_path", "")

# docs/*.md 또는 mkdocs.yml 파일인지 확인
if not re.search(r"(/docs/.*\.md|mkdocs\.yml)$", file_path, re.IGNORECASE):
    sys.exit(0)

subprocess.run(
    [sys.executable, "-m", "mkdocs", "build", "--config-file", "c:/01_git/2048/mkdocs.yml"],
    capture_output=True,
)

sys.exit(0)
