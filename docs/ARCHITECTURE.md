# Architecture

React + TypeScript + Vite implement the browser app. MapLibre GL JS renders a locally packaged, pre-warped Mars raster and matching geologic polygons. Tailwind CSS and a locally owned shadcn/ui-pattern Button (Radix Slot + CVA) supply interface primitives. Zustand stores role, condition, variant, clock, selection and real interaction records. Python, Rasterio's bundled GDAL, Fiona's GDAL vector reader and PyProj process geospatial inputs offline. There is no backend, database, websocket, Cesium or inference service.

- `data/sources.json`, `src/evidence.ts`: evidence registry and typed scientific cards.
- `data/scenarios`, `src/scenario.ts`: fixed event inputs, variants and computed checkpoint budgets.
- `src/knowledge.ts`: the only participant projection/export boundary. Filter events before computing local travel estimates or review statuses.
- `src/ScienceMap.tsx`: authentic regional map. Map geometry never contains simulated EVA paths.
- `src/study.ts`, `src/store.ts`: presentation conditions and timestamped local interaction records.
- `facilitator/`: separately served facilitator console. Answer keys never enter the participant build.
- `scripts/process_geodata.py`: explicit Mars CRS transformations and metadata emission.

Role/condition/variant are fixed when a participant URL is opened. Historical time controls reconstruct local knowledge; they never alter deterministic fixture values. Conditions all receive the same projected view. A shows raw messages, assumptions and arithmetic; B adds chronology; C adds explicit dependency/review reasoning. No hidden role-global event object is passed to participant components or exports.

This is local experimental separation, not adversarial security: a participant with developer tools can inspect client-side scenario fixture code. Use the production `dist` server, not Vite's development server, for sessions. Serve the facilitator directory separately and keep its screen and URL private. Static browser software cannot prevent someone deliberately editing URL parameters or inspecting JavaScript. Strong access control would require a validated backend requirement; it is not silently claimed here.

Geospatial portability is limited by the custom Mars coordinate contract. Generated GeoJSON has angular Mars coordinates, not Earth positions. See MARS_COORDINATE_PROOF.md. No Earth distance methods are used. Rasterio wheels bundle GDAL; no standalone system `gdalinfo` executable is required.
