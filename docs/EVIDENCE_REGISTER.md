# Evidence register

Initial asset verification was recorded on 2026-11-11; review access attempts below are dated 2026-11-12 (America/Santiago). VERIFIED_SOURCE applies to inspected source claims, not EVA suitability. Scientific interpretations remain separately labeled in the app.

## USGS-SIM3464 — VERIFIED_SOURCE

**Geologic map of Jezero crater and the Nili Planum region, Mars** — USGS

URL: https://pubs.usgs.gov/publication/sim3464

Locator: Pamphlet front matter and Base Map and Data (p. 3); GIS readme, metadata and raster CRS

Instrument: Mars Odyssey THEMIS (displayed raster); MRO CTX (geology mapping base). Acquisition date: Not established.

- The published region spans 76.8–77.8° E and 17.7–18.7° N.
- The GIS contains Mars Transverse Mercator rasters and matching geologic vectors on a 3,396,190 m sphere.
- The included THEMIS daytime infrared raster has 100 m pixels, confirmed from its affine transform.
- Jezero fan 1 and fan 2 unit polygons come directly from GeoUnits_v1.

Terms: USGS pamphlet states product is mostly public domain, except items marked copyrighted. No copyright exception found for included GIS raster or vectors. Metadata: access constraints None; use requires GIS software. Attribute Sun and Stack (2020), USGS, NASA/THEMIS. No NASA endorsement.

Caveat: Geologic mapping reports random 100–200 m offsets from the later mission operations CTX mosaic. Regional display cannot resolve strata or validate traversability.

## NASA-JEZERO-2021 — VERIFIED_SOURCE

**NASA’s Perseverance Sheds More Light on Jezero Crater’s Watery Past** — NASA / JPL

URL: https://www.nasa.gov/solar-system/nasas-perseverance-sheds-more-light-on-jezero-craters-watery-past/

Locator: “Perseverance’s Kodiak Moment” and “Moving Boulders” sections; scarp mosaic caption

Instrument: Mastcam-Z and SuperCam Remote Micro-Imager (RMI). Acquisition date: 2021-04-17 for the scarp mosaic caption only; not a universal acquisition date.

- Inclined and horizontal layering on Kodiak’s eastern face supports the ancient river-delta/lake interpretation.
- Stones and boulders occur in higher scarp deposits; the science team interprets later energetic flooding.

Terms: Text used as attributed supporting evidence. No image redistributed from this page.

Caveat: NASA report of research, not an independently reproduced sedimentological analysis. No claim of biosignature detection, accessible samples, or EVA reachability.

## NASA-DELTA-IMAGE — VERIFIED_SOURCE

**Perseverance View of the Delta in Jezero Crater** — NASA

URL: https://science.nasa.gov/resource/perseverance-view-of-the-delta-in-jezero-crater/

Locator: Image description

Instrument: Mastcam-Z. Acquisition date: 2021-02-22.

- Mastcam-Z photographed a delta remnant; NASA describes it as evidence of an ancient river meeting a lake.

Terms: Source link only; image not redistributed.

Caveat: Surface perspective image is not a georeferenced orbital map.

## JPL-KODIAK-IMAGE — UNVERIFIED

**Perseverance Captures Image of Kodiak** — NASA/JPL

URL: https://www.jpl.nasa.gov/images/pia24802-perseverance-captures-image-of-kodiak/

Locator: Not inspected: blocked request

Instrument: Unknown. Acquisition date: Not established.


Terms: Not verified; asset excluded.

Caveat: HTTP 403 from CloudFront. Do not treat the proposed URL as evidence.

## Asset and transformation ledger

- `data/raw/themis-day.tif`: extracted from `sim3464_JezeroNili_FINAL/Rasters/USGS_THEMIS_IR_controlled_mosaic_oct2018/nili_THEMIS_DayIR_Controlled_oct2018.tif` in the actual USGS database ZIP. SHA-256: `81db7210842dcd6e8049787b9ea20967c5ee9eff4984aefe6a13a70bd7bedbe9`. 565 × 594 pixels, unsigned byte, affine pixel size 100 × 100 m. Source CRS is recorded verbatim in `public/data/map-metadata.json`.
- `public/data/jezero-themis.png`: bilinear resampling into custom Mars spherical Mercator. Display derivative; no scientific radiometric analysis or enhancement claim. No arbitrary image overlay on Earth coordinates.
- `public/data/geology.geojson`: actual USGS `MapBoundary` and `GeoUnits_v1` polygons whose names contain “Jezero fan,” transformed on the same Mars sphere. 25 features, including the boundary. No invented waypoint coordinates. These source geologic units are scientific interpretations, not direct astronaut observations; VERIFIED_SOURCE identifies the inspected provenance.
- `public/data/map-metadata.json`: precise source/display WKT, affine transforms, extent, control points and checksum. Derived processing metadata, not independent geodetic ground truth.
- Source map footprint: 76.8–77.8° E, 17.7–18.7° N, as stated in metadata and pamphlet. Raster footprint is read from its affine transform; it is not assumed to equal the published map boundary.
- No public tile endpoint was assumed or used. All displayed map imagery is locally served from the inspected GIS archive. No external surface-photo asset is redistributed.

## Rights verification

USGS pamphlet front matter was downloaded and inspected. It states that the product is mostly public domain and exceptions are identified in text. No exception was found for the included GIS raster or vector layers. GIS metadata states access constraints “None” and use constraints “GIS Software is required to view these data.” The standalone USGS copyright webpage returned HTTP 403; it is not cited as inspected support. Redistribution uses the publication's own terms and full attribution. NASA/JPL source photographs are not copied into the app.

## Source attempts and exclusions

The proposed NASA Science watery-past URL returned a “Page not found” page. The NASA www.nasa.gov mission URL resolved to the inspected solar-system article recorded above. The JPL Kodiak catalog URL returned HTTP 403. NASA Mars Trek and PDS are not integrated or represented as verified layers. No fabricated tile service, coordinates, images or acquisition metadata is substituted.

## Simulated and derived values

All data in `data/scenarios/` and all schematic positions, mission deadlines, reserves, travel/science/return times and recommendations are SIMULATED_SCENARIO. Option totals and margins are DERIVED_FROM_SIMULATION. They are not NASA measurements or standards. Science-card EVA activities are hypothetical. The source texts support geology only, never route safety.

## Review — 2026-11-12

Reopened the two NASA pages and inspected the Kodiak strata, upper-scarp boulders, interpretation, instrument and acquisition passages. Corrected the NASA article section locator to “Moving Boulders.” No new scientific or image asset was invented.

Opened https://www.usgs.gov/maps/geologic-map-jezero-crater-and-nili-planum-region-mars and inspected its map scope, authors and mapping-base description. Its abstract has malformed latitude/longitude labels; use the retained GIS metadata bounding coordinates, not that typo. Original publication/PDF/readme/metadata URLs returned HTTP 403 in this review. Inspected the retained source readme, metadata, pamphlet front matter and processing metadata. Preserved the previous GIS verification date: no claim of re-downloading or independently re-extracting the GIS archive this turn.

Technical reference (not a science source): https://maplibre.org/maplibre-gl-js/docs/ — inspected ESM → Vite installation. It prescribes a self-contained worker import with `?worker&url`, `setWorkerUrl`, and the packaged stylesheet. The integration follows that pattern. No Earth basemap or meter scale was introduced.
