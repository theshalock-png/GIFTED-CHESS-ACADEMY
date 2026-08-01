from pathlib import Path
import re
root = Path('.')
files = [root / 'index.html'] + sorted((root / 'pages').glob('*.html'))
pattern = re.compile(r'(<div class="footer-brand">\s*<img[^>]+class="nav-logo-img"[^>]+>)(?:\s*<span class="logo-text">.*?</span>)?\s*</div>', re.S)
for p in files:
    text = p.read_text(encoding='utf-8')
    new_text, count = pattern.subn(r"\1</div>", text)
    if count > 0:
        p.write_text(new_text, encoding='utf-8')
        print(f'Updated {p} ({count} footer brand blocks)')
