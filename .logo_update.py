from pathlib import Path
import re
root = Path('.')
files = [root / 'index.html'] + sorted((root / 'pages').glob('*.html'))
for p in files:
    text = p.read_text(encoding='utf-8')
    icon_href = 'images/general/logo-01.jpg' if p.parent == root else '../images/general/logo-01.jpg'
    if '<link rel="icon"' not in text:
        text = text.replace(
            '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <link rel="icon" href="{}" />'.format(icon_href)
        )
    text = re.sub(
        r'<span class="logo-icon">♛</span>\s*<span class="logo-text"',
        '<img src="{}" alt="Official logo" class="nav-logo-img" />\n        <span class="logo-text"'.format(icon_href),
        text
    )
    p.write_text(text, encoding='utf-8')
print('Updated', len(files), 'HTML files')
