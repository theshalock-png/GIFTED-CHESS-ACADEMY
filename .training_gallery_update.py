from pathlib import Path
from shutil import copy2

root = Path('.')
training = root / 'images' / 'training'

mapping = {
    'session-01.jpg': 'Chess.jpg',
    'session-02.jpg': "Chess at Success Academy is a team effort! It's a….jpg",
    'session-03.jpg': 'Ghana Chess Competition.jpg',
    'session-04.jpg': 'Chess Fete at St_ Nicholas Park!.jpg',
    'session-05.jpg': 'A Chess Garden is Born.jpg',
    'session-06.jpg': '🏆🎉 Congratulations to all the participants of….jpg',
    'session-07.jpg': '36169603252608963.jpg',
    'session-08.jpg': '336503403431062977.jpg',
    'session-09.jpg': '440930619794056596.jpg',
    'session-10.jpg': '5 things to do this weekend in Paris.jpg',
}

for dest, src in mapping.items():
    src_path = training / src
    dest_path = training / dest
    if not src_path.exists():
        print(f'MISSING: {src_path}')
        continue
    copy2(src_path, dest_path)
    print(f'Copied {src_path.name} -> {dest}')
