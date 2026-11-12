# MARS COMPASS v0.3

A runnable Jezero science and delayed-communication prototype. **SIMULATED EVA — NOT FOR OPERATIONAL USE.** Real USGS regional imagery and geology are separate from a fictional schematic traverse. Two evidence-backed science cards, Astronaut/Earth Planner knowledge views, a deterministic 20-minute delay, transparent checkpoint arithmetic and three comparable study modes are included.

## Requirements

- Node.js 22.12+ (tested with 24.19.0), npm, Python 3.12+ (processing tested with 3.12.14).
- WebGL-capable browser. Internet for initial dependency installation and optional source downloads; map assets and scenarios are local afterward.
- Python processing wheels bundle GDAL through Rasterio/Fiona; no separate GDAL CLI needed. `uv` is optional.

## Run

```bash
npm ci
npm run dev
```

Open http://localhost:5173. Default: Astronaut, condition C, primary variant. Example Earth baseline: http://localhost:5173/?role=earth&condition=A&variant=canonical

Allowed URL values: `role=mars|earth`, `condition=A|B|C`, `variant=primary|canonical`. Optional `time=840..905` selects an initial fictional clock minute (840 = 14:00). Role/condition/variant are fixed per session. Refresh clears in-memory notes; export first.

## Production participant and private facilitator servers

```bash
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

In another terminal:

```bash
python3 -m http.server 4174 --bind 127.0.0.1 --directory facilitator
```

Open http://localhost:4174 privately. Select condition, role and variant, then open a participant session. The answer key stays in the separately served facilitator directory; it is not included in `dist`. Use production servers for studies, not the repository-wide Vite development server. This is supervised separation, not adversarial access control.

## Demo workflow

1. Inspect real THEMIS imagery, toggle source layers and select a Jezero fan polygon. Read S1/S2 evidence and caveats.
2. Inspect the separately labeled schematic. Advance Astronaut time to 14:20/14:25. Select S1–S2, compare Options and inspect Advice.
3. Open an Earth session at 14:25: only the original plan is known. Advance to 14:40 for O-01 and 14:45 for R-02.
4. Astronaut does not see R-02 until 15:05. No receipt implies acknowledgment. Rewind to inspect historical knowledge.
5. Compare A/B/C using identical role/variant inputs. A includes raw messages; B adds chronology; C adds assumption-dependency reasoning.
6. In Notebook, start a task timer, enter real observations and save. Export before closing. No human results are prefilled.

Budgets always refer to the fixed 14:25 checkpoint. Canonical S2: original −5 min, updated −20 min. Primary variant reduces only S2 science duration from 25 to 15 minutes: original +5 min, updated −10 min. Positive margins do not certify safety.

## Validate

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements.lock.txt
.venv/bin/python -m pytest -q
```

Alternatively create/install Python with `uv venv --python 3.12 .venv` and `uv pip install --python .venv/bin/python -r requirements.lock.txt`. On Linux, Playwright may require OS libraries (`npx playwright install --with-deps chromium` on supported distributions). `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium npm run test:e2e` supports an existing compatible browser. Browser tests are synthetic dry-runs, not human testing.

## Reproduce the Mars map

The committed source GeoTIFF allows offline raster reproduction:

```bash
.venv/bin/python scripts/process_geodata.py --output /tmp/mars-raster-check
```

To reproduce vector extraction as well, download the verified public GIS archive (approximately 349 MB):

```bash
curl -L --fail https://pubs.usgs.gov/sim/3464/sim3464_database.zip -o /tmp/sim3464_database.zip
.venv/bin/python scripts/extract_archive.py /tmp/sim3464_database.zip
.venv/bin/python scripts/process_geodata.py --geodatabase data/raw/extracted/Nili.gdb
```

See [Mars coordinate proof](docs/MARS_COORDINATE_PROOF.md) for the explicit 3,396,190 m Mars sphere, transformations and control-point tests. No Earth datum, scale bar or distance calculation is used.

## Evidence and study documentation

- [Evidence register](docs/EVIDENCE_REGISTER.md) and [machine-readable sources](data/sources.json)
- [Scenario specification](docs/SCENARIO_SPEC.md)
- [Study protocol](docs/TEST_PROTOCOL.md)
- [Architecture](docs/ARCHITECTURE.md), [project brief](docs/PROJECT_BRIEF.md), [limitations](docs/LIMITATIONS.md)
- [Actual validation and readiness report](docs/IMPLEMENTATION_REPORT.md)

USGS source: Sun, V.Z., and Stack, K.M. (2020), SIM 3464. Imagery: NASA/Mars Odyssey THEMIS, distributed in the USGS GIS product. Map source warns of positional offsets; this is regional science context, not navigation. No human pilot has been completed and the comparative research hypothesis remains unproven.

End-to-end tests build production assets and start isolated participant/facilitator servers. Stop existing servers on ports 4173/4174 first.
