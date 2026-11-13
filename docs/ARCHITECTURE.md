# Architecture

React + TypeScript + Vite implement the browser app. MapLibre GL JS renders a locally packaged, pre-warped Mars raster and matching geologic polygons. Tailwind CSS and a locally owned shadcn/ui-pattern Button (Radix Slot + CVA) supply interface primitives. Zustand stores role, condition, variant, clock, selection and real interaction records. Python, Rasterio's bundled GDAL, Fiona's GDAL vector reader and PyProj process geospatial inputs offline. There is no backend, database, websocket, Cesium or inference service.

- `data/sources.json`, `src/evidence.ts`: evidence registry and typed scientific cards.
- `data/scenarios`, `src/scenario.ts`: fixed event inputs, variants and computed checkpoint budgets.
- `src/knowledge.ts`, `src/recommendations.ts`: participant projection/export boundary and local-evidence assumption review. Filter events before computing local travel estimates or review statuses.
- `src/ScienceMap.tsx`, `src/map.ts`: regional map, provenance/coordinate validation, metadata-derived framing and explicit failure handling. Map geometry never contains simulated EVA paths.
- `src/study.ts`, `src/store.ts`, `src/SessionSetup.tsx`, `src/sessionControl.ts`: presentation conditions and timestamped local interaction records.
- `facilitator/`: separately served facilitator console. Answer keys never enter the participant build.
- `scripts/process_geodata.py`: explicit Mars CRS transformations and metadata emission.

Role/condition/variant are fixed when a participant URL is opened. Historical time controls reconstruct local knowledge; they never alter deterministic fixture values. Conditions all receive the same projected view. A shows raw messages, assumptions and arithmetic; B adds chronology; C adds explicit dependency/review reasoning. No hidden role-global event object is passed to participant components or exports.

This is local experimental separation, not adversarial security: a participant with developer tools can inspect client-side scenario fixture code. Use the production `dist` server, not Vite's development server, for sessions. Serve the facilitator directory separately and keep its screen and URL private. Static browser software cannot prevent someone deliberately editing URL parameters or inspecting JavaScript. Strong access control would require a validated backend requirement; it is not silently claimed here.

Geospatial portability is limited by the custom Mars coordinate contract. Generated GeoJSON has angular Mars coordinates, not Earth positions. See MARS_COORDINATE_PROOF.md. No Earth distance methods are used. Rasterio wheels bundle GDAL; no standalone system `gdalinfo` executable is required.

## Review changes

MapLibre v6 uses Vite's `?worker&url` import to emit a self-contained worker, alongside its packaged CSS. The view comes from checked raster corner metadata; the explicit Mercator style never switches to an Earth/globe projection. `ResizeObserver` calls `map.resize()`; effect cleanup aborts pending metadata requests, disconnects the observer and removes the map. Startup failure leaves science and schematic controls usable. `scripts/verify_build.mjs` checks emitted assets and exclusion of the private answer key; it does not replace a WebGL browser test.

Facilitated launch passes the console origin, anonymous participant code and a random session ID. The participant accepts clock messages only from its opener at that origin with that session ID and an integer minute in 840–905. The released-time horizon prevents ordinary UI access to future phases; historical access remains. A demo can open an independent role/condition tab without destroying current records. These controls improve supervision but are not authentication or protection against developer-tools inspection.

Exports filter records by role, condition, variant and selected historical time. A/B exports omit C's derived status/reason annotations while retaining identical underlying evidence, recommendation assumptions and arithmetic. Facilitator exports capture the assignment at launch rather than later edited form selections. Session and anonymous participant IDs join both exports.

`tests/ui.test.tsx` renders participant panels with the map isolated. `tests/map.test.ts` uses the real MapLibre Mercator implementation for numerical registration checks. `tests/facilitator.test.ts` executes the console script against controlled DOM/window stubs. These are synthetic unit/integration checks, not browser rendering or human observations.
