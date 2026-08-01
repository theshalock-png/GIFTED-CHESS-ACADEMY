from pathlib import Path
from shutil import copy2

training = Path('images/training')
mapping = {
    'session-11.jpg': 'Inclusive Chess Day Empowers Children With___.jpg',
    'session-12.jpg': 'These Photos Of People Playing Chess Will Make You___.jpg',
    'session-13.jpg': 'Happy New Month___Life is a lot like chess, every….jpg',
    'session-14.jpg': 'Join the Drifting Towards Simplicity Community.jpg',
    'session-15.jpg': 'GSE 15_ Wooden Folding 2-in-1 Chess and Checkers Board Game Combo Set with Chess Storage Slots Drawer.jpg',
}
for dest, src in mapping.items():
    src_path = training / src
    dest_path = training / dest
    if not src_path.exists():
        print(f'MISSING SOURCE: {src_path}')
        continue
    try:
        copy2(src_path, dest_path)
        print(f'Copied {src_path.name} -> {dest}')
    except Exception as e:
        print('ERROR copying', src_path, '->', dest, e)
