import json
import math
from pathlib import Path
import pytest
from pyproj import Transformer
from rasterio import Affine
from scripts.process_geodata import MARS_GEOGRAPHIC, MARS_MERCATOR, RADIUS, normalized_mercator, process

META=json.loads(Path('public/data/map-metadata.json').read_text())

def test_mars_datum_is_explicit():
    assert RADIUS == 3396190
    assert '3396190' in META['sourceCRS']
    assert META['sourceResolutionMeters'] == [100,100]

def test_maplibre_angular_mercator_matches_mars_raster():
    top_left=normalized_mercator(*META['corners'][0]);bottom_right=normalized_mercator(*META['corners'][2])
    w,h=META['outputShape']
    for control in META['controls']:
        x,y=normalized_mercator(*control['lonlat'])
        pixel=((x-top_left[0])/(bottom_right[0]-top_left[0])*w,(y-top_left[1])/(bottom_right[1]-top_left[1])*h)
        assert pixel == pytest.approx(control['outputPixel'],abs=1e-6)

def test_transformation_round_trip():
    forward=Transformer.from_crs(META['sourceCRS'],MARS_GEOGRAPHIC,always_xy=True)
    backward=Transformer.from_crs(MARS_GEOGRAPHIC,META['sourceCRS'],always_xy=True)
    for c in META['controls']:
        assert forward.transform(*c['sourceXY']) == pytest.approx(c['lonlat'],abs=1e-9)
        assert backward.transform(*c['lonlat']) == pytest.approx(c['sourceXY'],abs=1e-6)

def test_real_overlay_within_published_footprint():
    data=json.loads(Path('public/data/geology.geojson').read_text())
    assert len(data['features'])>1
    def points(coords):
        if isinstance(coords[0],(int,float)):yield coords
        else:
            for c in coords:yield from points(c)
    for f in data['features']:
        assert f['properties']['sourceId']=='USGS-SIM3464'
        for lon,lat in points(f['geometry']['coordinates']):
            assert 76.79 < lon < 77.81 and 17.69 < lat < 18.71

def test_offline_raster_reproduction(tmp_path):
    result=process('data/raw/themis-day.tif',tmp_path)
    assert result['sourceSHA256']==META['sourceSHA256']
    assert (tmp_path/'jezero-themis.png').read_bytes()==Path('public/data/jezero-themis.png').read_bytes()
