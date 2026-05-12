"""
NexusAI 全站代码审计工具
扫描 src/ 目录，输出审计报告到 audit_report.md
"""
import os, re, json, sys
from collections import defaultdict
from pathlib import Path

SRC = Path("D:/game/game/ai数据网/projects/src")

results = {
    "hardcoded_keys": [],      # 硬编码密钥/Token
    "console_log": [],         # 线上遗留console.log
    "todos": [],               # TODO/FIXME
    "mock_data": [],           # 残留 mock 数据
    "potential_bugs": [],      # 潜在逻辑问题
    "security_issues": [],     # 安全问题
}

KEY_PATTERNS = [
    (r'(?i)(sk[-_][a-z0-9]{10,}|pk[-_][a-z0-9]{10,})', 'API Key pattern'),
    (r'(?i)ghp_[a-zA-Z0-9]{36}', 'GitHub Token'),
    (r'(?i)re_[a-zA-Z0-9]{24,}', 'Resend API Key'),
    (r'(?i)vcp_[a-zA-Z0-9]{40,}', 'Vercel Token'),
    (r'(?i)api[-_]?key["\']?\s*[:=]\s*["\'][a-zA-Z0-9_-]{16,}', '硬编码 API Key'),
]

def scan_file(fpath):
    rel = fpath.relative_to(SRC.parent)
    try:
        text = fpath.read_text('utf-8')
    except:
        return
    lines = text.split('\n')
    
    if any(p in str(fpath) for p in ['node_modules', '.next', 'dist', '.git']):
        return
    
    # 1. 硬编码密钥
    for pat, desc in KEY_PATTERNS:
        compiled = re.compile(pat)
        for i, line in enumerate(lines, 1):
            if compiled.search(line) and 'example' not in line.lower() and 'placeholder' not in line.lower():
                if 'process.env' in line or 'env.' in line:
                    continue
                results["hardcoded_keys"].append({
                    "file": str(rel), "line": i, "type": desc,
                    "snippet": line.strip()[:100]
                })
    
    # 2. console.log
    if fpath.suffix in ('.tsx', '.ts', '.jsx', '.js'):
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            if 'console.log(' in stripped and not stripped.startswith('//'):
                results["console_log"].append({
                    "file": str(rel), "line": i,
                    "snippet": stripped[:100]
                })
    
    # 3. TODO/FIXME/HACK
    if fpath.suffix in ('.tsx', '.ts', '.jsx', '.js', '.css', '.py'):
        for i, line in enumerate(lines, 1):
            lower = line.lower()
            for kw in ['todo', 'fixme', 'hack', 'xxx']:
                if kw in lower and ('//' in line.strip()[:3] or '/*' in line.strip()[:3] or '#' in line.strip()[:2]):
                    results["todos"].append({
                        "file": str(rel), "line": i, "type": kw.upper(),
                        "snippet": line.strip()[:100]
                    })
                    break
    
    # 4. mock数据残留
    if fpath.suffix in ('.tsx', '.ts', '.jsx', '.js'):
        for i, line in enumerate(lines, 1):
            if re.search(r'\bmock\w+\s*[:=]\s*\{', line, re.I):
                if 'test' not in str(fpath).lower() and '//' not in line.split('//')[0]:
                    results["mock_data"].append({
                        "file": str(rel), "line": i,
                        "snippet": line.strip()[:100]
                    })
    
    # 5. fetch 未检查响应状态
    if fpath.suffix in ('.tsx', '.ts', '.jsx', '.js'):
        for i, line in enumerate(lines, 1):
            if 'await fetch(' in line or '.then(fetch' in line:
                next_lines = lines[i:min(i+5, len(lines))]
                joined = ''.join(next_lines).lower()
                if 'res.ok' not in joined and 'response.ok' not in joined and '.status' not in joined:
                    if '//' not in line.split('fetch')[0]:
                        results["potential_bugs"].append({
                            "file": str(rel), "line": i,
                            "type": "fetch未检查响应状态",
                            "snippet": line.strip()[:100]
                        })
    
    # 6. Base64 token（伪加密）
    if fpath.suffix in ('.ts', '.tsx'):
        for i, line in enumerate(lines, 1):
            if 'base64' in line and 'toString' in line and 'auth_token' in text.lower():
                results["security_issues"].append({
                    "file": str(rel), "line": i,
                    "type": "Base64伪加密作为认证Token",
                    "snippet": line.strip()[:100]
                })
    
    # 7. 硬编码密码/secret
    if fpath.suffix in ('.ts', '.tsx', '.js', '.jsx'):
        for i, line in enumerate(lines, 1):
            if re.search(r'(password|passwd|secret)\s*[:=]\s*["\']', line, re.I):
                if 'example' not in line.lower() and 'env' not in line.lower():
                    results["security_issues"].append({
                        "file": str(rel), "line": i,
                        "type": "硬编码密码/密钥",
                        "snippet": line.strip()[:100]
                    })


# 扫描
tsx_files = list(SRC.rglob("*.tsx")) + list(SRC.rglob("*.ts")) + list(SRC.rglob("*.js")) + list(SRC.rglob("*.jsx"))
for f in tsx_files:
    scan_file(f)

# 生成 Markdown 报告
report = []
report.append("# NexusAI 全站代码审计报告\n")
report.append(f"- 扫描时间: 2026-05-12")
report.append(f"- 扫描文件数: {len(tsx_files)}")
report.append(f"- 发现总问题数: {sum(len(v) for v in results.values())}\n")

total = sum(len(v) for v in results.values())
report.append("| 类别 | 数量 | 严重程度 |")
report.append("|------|------|---------|")

severity = {
    "hardcoded_keys": "严重",
    "console_log": "低",
    "todos": "低",
    "mock_data": "中",
    "potential_bugs": "高",
    "security_issues": "严重",
}
for k, v in results.items():
    if v:
        report.append(f"| {k} | {len(v)} | {severity.get(k, '中')} |")

for k, v in results.items():
    if not v:
        continue
    report.append(f"\n---\n## {k} ({len(v)}处)\n")
    sev = severity.get(k, '中')
    if sev in ('严重', '高'):
        report.append(f"> 严重程度: **{sev}**，需要尽快处理\n")
    
    for item in v:
        report.append(f"- **{item['file']}:{item['line']}** - {item.get('type', '')}")
        report.append(f"  ```")
        report.append(f"  {item['snippet']}")
        report.append(f"  ```")

report_path = Path("D:/game/game/ai数据网/projects/audit_report.md")
report_path.write_text('\n'.join(report), encoding='utf-8')
print(f"Report saved to {report_path}")
print(f"Total files scanned: {len(tsx_files)}")
print(f"Total issues found: {total}")
