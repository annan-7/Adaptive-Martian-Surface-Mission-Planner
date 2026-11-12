"""Extract only verified USGS inputs from a downloaded SIM 3464 ZIP."""
import argparse
from pathlib import Path
from zipfile import ZipFile
parser=argparse.ArgumentParser();parser.add_argument('archive');args=parser.parse_args()
with ZipFile(args.archive) as archive:
    for name in archive.namelist():
        if name.endswith('/'):continue
        if name.endswith('/nili_THEMIS_DayIR_Controlled_oct2018.tif'):
            target=Path('data/raw/themis-day.tif')
        elif '/Geodatabase/Nili.gdb/' in name and not name.endswith('.lock'):
            target=Path('data/raw/extracted/Nili.gdb')/Path(name).name
        else:continue
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(archive.read(name))
