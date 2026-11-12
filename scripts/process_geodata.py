"""Reproject USGS Mars rasters and vectors on the SAME Mars sphere.

MapLibre consumes angular coordinates using normalized spherical Mercator.
No EPSG:3857 datum conversion, Earth distances, scale control or geolocation.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import numpy as np
import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling
from pyproj import CRS, Transformer
from PIL import Image

RADIUS = 3396190.0
MARS_GEOGRAPHIC = CRS.from_proj4(f'+proj=longlat +R={RADIUS} +no_defs')
MARS_MERCATOR = CRS.from_proj4(f'+proj=merc +R={RADIUS} +lon_0=0 +k=1 +units=m +no_defs')

def normalized_mercator(lon, lat):
    return ((lon + 180) / 360, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2)

def transform_geometry(coordinates, transformer):
    if isinstance(coordinates[0], (int, float)):
        return list(transformer.transform(*coordinates[:2]))
    return [transform_geometry(c, transformer) for c in coordinates]

def process(raster, output, geodatabase=None):
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    with rasterio.open(raster) as source:
        assert abs(source.crs.to_dict()['a'] - RADIUS) < 0.01 if 'a' in source.crs.to_dict() else '3396190' in source.crs.to_wkt()
        transform, width, height = calculate_default_transform(source.crs, MARS_MERCATOR, source.width, source.height, *source.bounds)
        destination = np.zeros((height, width), dtype='uint8')
        reproject(rasterio.band(source, 1), destination, src_transform=source.transform, src_crs=source.crs,
                  dst_transform=transform, dst_crs=MARS_MERCATOR, resampling=Resampling.bilinear)
        Image.fromarray(destination).save(output / 'jezero-themis.png')
        inverse = Transformer.from_crs(MARS_MERCATOR, MARS_GEOGRAPHIC, always_xy=True)
        xy_corners = [transform @ (0, 0), transform @ (width, 0), transform @ (width, height), transform @ (0, height)]
        corners = [list(inverse.transform(*p)) for p in xy_corners]
        to_geo = Transformer.from_crs(source.crs, MARS_GEOGRAPHIC, always_xy=True)
        to_merc = Transformer.from_crs(source.crs, MARS_MERCATOR, always_xy=True)
        controls=[]
        for col,row in [(0,0),(source.width/2,source.height/2),(source.width,source.height),(100,200)]:
            x,y=source.transform @ (col,row);lon,lat=to_geo.transform(x,y);mx,my=to_merc.transform(x,y)
            px,py=~transform @ (mx,my)
            controls.append(dict(sourcePixel=[col,row],sourceXY=[x,y],lonlat=[lon,lat],outputPixel=[px,py]))
        metadata=dict(sourceId='USGS-SIM3464',evidenceType='VERIFIED_SOURCE',radiusMeters=RADIUS,
            sourceCRS=source.crs.to_wkt(),displayCRS=MARS_MERCATOR.to_wkt(),sourceResolutionMeters=list(source.res),
            sourceShape=[source.width,source.height],sourceTransform=list(source.transform)[:6],
            outputTransform=list(transform)[:6],outputShape=[width,height],corners=corners,controls=controls,
            sourceSHA256=hashlib.sha256(Path(raster).read_bytes()).hexdigest(),
            caveat='Regional 100 m imagery. Geologic source reports 100–200 m offsets from mission operations CTX. Not navigation data.')
    if geodatabase:
        import fiona
        features=[]
        for layer in ['MapBoundary','GeoUnits_v1']:
            with fiona.open(geodatabase,layer=layer) as collection:
                transformer=Transformer.from_crs(collection.crs_wkt,MARS_GEOGRAPHIC,always_xy=True)
                for feature in collection:
                    props=dict(feature['properties'])
                    # Keep the real mapped delta units, not fictional EVA target points.
                    if layer!='MapBoundary' and 'Jezero fan' not in str(props.get('name','')):continue
                    geometry=feature['geometry']
                    features.append(dict(type='Feature',properties=dict(sourceId='USGS-SIM3464',layer=layer,name=props.get('name') or 'Published map boundary'),
                        geometry=dict(type=geometry['type'],coordinates=transform_geometry(geometry['coordinates'],transformer))))
        (output/'geology.geojson').write_text(json.dumps(dict(type='FeatureCollection',features=features),separators=(',',':')))
        metadata['overlayFeatureCount']=len(features)
    (output/'map-metadata.json').write_text(json.dumps(metadata,indent=2))
    return metadata

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--raster',default='data/raw/themis-day.tif');parser.add_argument('--geodatabase');parser.add_argument('--output',default='public/data')
    args=parser.parse_args();print(json.dumps(process(args.raster,args.output,args.geodatabase),indent=2))
