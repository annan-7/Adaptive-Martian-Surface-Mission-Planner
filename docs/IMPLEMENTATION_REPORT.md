# Implementation report — 2026-11-11

## Readiness

**READY WITH LIMITATIONS** for a supervised, exploratory facilitated pilot. This is not flight software, a safety validator, a secure examination system, or evidence that condition C outperforms A/B. No human pilot was conducted. All browser flows and entered test strings are **SYNTHETIC DRY-RUN — NOT HUMAN TESTING**.

## Delivered

- `src/App.tsx`, `src/ScienceMap.tsx`, `src/style.css`: runnable responsive map-centered React application, real map layer controls, two science cards, distinct Astronaut and Earth Planner views, schematic segment inspector, options, advice history, raw messages, chronology, notebook and JSON export.
- `src/components/ui/button.tsx`, `components.json`: locally owned shadcn/ui-style Button built with Radix Slot, CVA and Tailwind; native form controls retain keyboard semantics.
- `src/scenario.ts`, `data/scenarios/`: locked canonical arithmetic and matched primary variant, deterministic event schedule, 20-minute simulated one-way delay.
- `src/knowledge.ts`: role/time projection, local-assumption review, no implied acknowledgments, historical participant export filtering. `src/store.ts` uses Zustand.
- `src/study.ts`, `facilitator/index.html`, `facilitator/key.json`: identical A/B/C facts and task prompts, separate private facilitator console, role/condition/variant/initial-time launch controls, manual scoring notes and real-entry export. Answer key is absent from participant production assets.
- `data/sources.json`, `src/evidence.ts`, `data/evidence/`, `docs/EVIDENCE_REGISTER.md`: inspected source claims, retained text, stable source IDs, acquisition/rights caveats and excluded-source gaps.
- `scripts/process_geodata.py`, `scripts/extract_archive.py`, `data/raw/`, `public/data/`: reproducible Mars raster/GeoJSON processing, retained 100 m GeoTIFF, real USGS fan polygons, CRS metadata, control points and SHA-256.
- `tests/`: TypeScript logic/evidence tests, Python reprojection tests, production-browser tests covering map rendering, all three Earth privacy conditions, historical rewind, budget values, astronaut delayed advice, real note capture, mobile keyboard/layout, facilitator launch/export and participant key isolation.
- `README.md`, `docs/PROJECT_BRIEF.md`, `docs/ARCHITECTURE.md`, `docs/SCENARIO_SPEC.md`, `docs/TEST_PROTOCOL.md`, `docs/LIMITATIONS.md`, `docs/MARS_COORDINATE_PROOF.md`: run instructions, architecture, arithmetic, fair study protocol, evidence and readiness limits. Existing `AGENTS.md` preserved.

## Verified science and mapping

USGS SIM 3464 publication page, pamphlet, GIS readme, metadata and actual GIS inputs were inspected. They establish the published region, source map units, Mars sphere/Transverse Mercator parameters and regional imagery provenance. The displayed THEMIS daytime infrared raster is 565 × 594 pixels at 100 m source pixel size. Real Jezero fan 1/2 polygons plus map boundary produce 25 overlay features. The map's 6 m CTX mapping base is **not** misrepresented as the displayed raster resolution.

The NASA watery-past article was opened and its Kodiak stratigraphy and boulder-bearing scarp passages inspected. They support the geological interpretations of ancient river/delta deposition into a lake (S1) and later energetic floods (S2). NASA's delta-image page separately supports the delta-remnant context and explicitly documents a Mastcam-Z acquisition on 2021-02-22. No image from that page is redistributed.

A numerical Mars-coordinate proof and actual browser rendering were completed before the full interface. The initial browser proof passed under installed Brave/Chromium; final browser tests passed using Playwright's downloaded Chromium. The pipeline uses Rasterio 1.5.2 / GDAL 3.12.2 and Fiona 1.10.1 / GDAL 3.9.2, with PyProj 3.8.0. No standalone GDAL CLI was installed. The Mars radius is 3,396,190 m; no Earth datum transformation, Earth distance API or scale bar is used.

## Explicit simulation

All EVA paths, stations, segment changes, travel/science/return minutes, reserve, deadlines, observations, recommendations and communication timings are fictional. Real geographic evidence and simulated route geometry occupy separate panels. Option margins are computed in code and labeled derived from simulation. Canonical original S2 margin is −5 minutes, revised −20; primary original +5, revised −10. All panels retain the non-operational simulation label. R-02 remains a checkpoint analysis, never a clearance based on assumed crew progress.

## Commands actually executed and outcomes

- `npm install` initially hit an idle network timeout; retry completed. Dependency audit then identified critical MapLibre/Vitest issues. Packages were updated to MapLibre 6.17.0 and Vitest 5.1.0; a scoped minimatch 11 override resolved the remaining dev-tool advisory.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: **13 tests passed**, 2 files.
- `npm run build`: passed. Also executed automatically by the production end-to-end workflow. Vite reports a large MapLibre-containing bundle warning; this is an offline local prototype, and no bundle-size optimization claim is made.
- `npx playwright install chromium`: completed, using Playwright's Ubuntu fallback build on the host distribution.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/opt/brave-bin/brave npm run test:e2e`: the initial one-test map proof passed. A later development-server run exposed stale Vite dependency optimization after package upgrades.
- `npm run test:e2e`: final production run **9 tests passed in 25.0 s**, with separate local participant and facilitator servers. Earlier production run exposed a missing MapLibre worker asset; explicit Vite worker-URL bundling fixed it. A facilitator test locator was corrected to use the native combobox accessible name.
- `uv venv --python 3.12 .venv`, Python dependency install, and `uv pip freeze --python .venv/bin/python`: completed. Exact installed packages recorded in `requirements.lock.txt`.
- `.venv/bin/python scripts/process_geodata.py --geodatabase data/raw/extracted/Nili.gdb`: completed; generated authentic raster and vector artifacts. The initial vector-filter test correctly failed because the actual USGS units are named “Jezero fan,” not “delta”; the source-name filter was corrected.
- `.venv/bin/python -m pytest -q`: final **5 tests passed**, without warnings, including byte-identical offline raster reproduction.
- `npm audit` and `npm audit --omit=dev`: **0 vulnerabilities** after dependency fixes.
- Source downloads used `curl`; the USGS archive's central directory and relevant entries were inspected/extracted, including a CRC-checked zlib stream for the displayed TIFF. The original full-archive download timed out after a partial transfer; only required complete entries were used. The provided reproduction script uses Python ZipFile on a complete download.
- Desktop and mobile screenshots from actual browser tests were visually inspected. They are generated test artifacts, not fabricated screenshots or participant results.

## Known gaps and deviations

The JPL Kodiak image URL and standalone USGS copyright webpage returned HTTP 403. The JPL asset was excluded. Rights for the included GIS inputs rely on the inspected USGS publication's public-domain statement and metadata; no marked copyright exception was found for those inputs. NASA surface-image rights were not assumed.

The regional THEMIS raster is coarser than CTX and cannot resolve science-card strata/boulders. Numerical display alignment is proven, not absolute ground truth. Source map offsets of roughly 100–200 m remain. No physical reachability between science reference features is established. Mosaic constituent acquisition dates remain unknown.

No browser-held secret can resist deliberate source-code inspection. The participant production server demonstrably cannot serve facilitator keys/docs, and participant selectors/UI/exports do not reveal unseen role evidence. However client-side deterministic fixtures are inspectable by a motivated user. Supervision and separate facilitator serving are required; stronger authentication would require additional scope.

The product uses Rasterio/Fiona's bundled GDAL rather than a standalone system GDAL installation. A single locally owned shadcn-style Button is sufficient; no unnecessary backend or UI framework expansion was added. Production bundle remains large. Screen-reader and broader hardware validation remain future work. Notes are in memory until exported.

## Next action

Run one consented, supervised participant through the primary variant with a counterbalanced A/B/C assignment. Export their actual explanations/timings and separate facilitator scoring. Report that real session as exploratory evidence, never as operational validation.
