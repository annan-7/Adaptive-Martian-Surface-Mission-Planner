# Implementation review — 2026-11-12 (America/Santiago)

## Verdict

**NOT READY** for a human pilot until the updated browser suite and Python geodata checks run on an unrestricted local machine. Implementation, TypeScript tests and production build are complete; current WebGL rendering and cross-window interaction have not been verified. No human pilot was conducted. All automated checks are **SYNTHETIC DRY-RUN — NOT HUMAN TESTING**.

This report supersedes earlier validation claims for this revision. The repository already contained science cards, map assets, scenario logic, A/B/C modes, a notebook and a facilitator console. Existing functionality was retained and corrected. The preexisting user modification to `index.html` was not edited.

## Delivered

- `src/ScienceMap.tsx`, `src/map.ts`: official MapLibre v6/Vite worker bundling (`?worker&url`), packaged CSS, explicit Mercator projection, validated Mars metadata, footprint-derived framing, resize/cleanup handling, loading/error/retry states, source-linked fallback, map reset, layer controls and direct S1/S2/provenance access. No fictional route is drawn on real geography.
- `src/App.tsx`, `src/SessionSetup.tsx`, `src/style.css`: mission brief, independent demo session controls, explicit science classifications, existing science/options/advice/change panels, visible timestamped notebook log and anonymous session identification. Task ratings reset between responses; restarting an active timer is disabled.
- `src/knowledge.ts`, `src/recommendations.ts`: local-evidence review, invalid-input rejection and export filtering by role, condition, variant and historical time. A/B exports omit C's derived explanations while preserving identical facts.
- `src/store.ts`, `src/sessionControl.ts`, `facilitator/index.html`, `facilitator/app.js`: facilitator phase-release controls, trusted opener/origin/session checks, historical access within released phases, participant/session IDs shared by both exports, assignment captured at launch and genuine notes only. The private key remains outside the participant build.
- `tests/map.test.ts`, `tests/ui.test.tsx`, `tests/facilitator.test.ts`, `tests/scenario.test.ts`, `tests/e2e/`: numerical registration, rendered-panel privacy, console behavior, export isolation, phase boundaries and expanded browser tests.
- `scripts/verify_build.mjs`, `package.json`: build asset/key-exclusion verification and private facilitator run command.
- `README.md`, `docs/ARCHITECTURE.md`, `docs/EVIDENCE_REGISTER.md`, `docs/TEST_PROTOCOL.md`, `docs/LIMITATIONS.md`, `docs/MARS_COORDINATE_PROOF.md`, `data/sources.json`: updated run instructions, evidence recheck and limitations. Existing AGENTS, project brief, fixtures and scenario specification remain applicable.

## Verified science and technical sources

Reopened NASA's Jezero watery-past article and inspected the Kodiak layering and upper-scarp boulder passages. These support the S1 ancient delta/lake and S2 energetic-flood interpretations. Corrected its source section locator to “Moving Boulders.” Reopened NASA's delta image record and checked Mastcam-Z and the February 22, 2021 acquisition statement. No photograph was redistributed.

Opened the official USGS companion publication page and inspected retained GIS readme, metadata and pamphlet text. Original publication/PDF/GIS metadata requests returned HTTP 403; the GIS archive was not re-downloaded. Existing GIS verification dates and limitations are preserved. No new map coordinates or scientific claim were guessed.

Inspected MapLibre's official ESM/Vite installation documentation. The actual installed MercatorCoordinate implementation agrees with all four retained raster control points within 0.000001 output pixel. This verifies mathematical display alignment, not surveyed ground truth or navigation suitability.

## Simulated

All EVA positions/routes, terrain changes, communication delay, event times, travel/science/return durations, reserve, deadline and recommendations remain fictional. Canonical totals/margins remain 145/−20, 105/+20, 80/+45 and original S2 130/−5. Primary S2 remains original 120/+5 and revised 135/−10. Neither positive margins nor recommendation status establish safety.

## Commands actually executed

Runtime: Node 24.22.1, npm 12.2.1, system Python 3.14.8.

| Command | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed after correcting a test mock signature |
| `npm test` | 33 tests passed in 5 files |
| `npm run build` | Passed; large-bundle warning remains |
| `npm run verify:build` | Passed: emitted worker referenced by app, local map assets present, facilitator files/key excluded |
| `node --check facilitator/app.js` | Passed |
| `git diff --check` | Passed |
| `npx playwright test --list` | 11 browser tests discovered; listing is not execution |
| `npm run test:e2e` | Blocked during HTTP server startup: socket PermissionError / Operation not permitted; no browser test pass claimed |
| `python3 -m pytest -q` | Blocked: pytest is not installed |
| `uv --cache-dir /tmp/mars-compass-uv venv --python python3 .venv` | Created local environment |
| `uv --cache-dir /tmp/mars-compass-uv pip install --python .venv/bin/python -r requirements.lock.txt` | Failed: PyPI DNS resolution unavailable |

The initial 13 existing TypeScript tests also passed before edits. Intermediate test failures (GeoJSON module import and a mock's TypeScript signature) were corrected. The browser tool attempted localhost:5173 and received connection refused. No screenshots or human results were invented.

## Known gaps

Current browser rendering, actual layer toggles, mobile appearance, WebGL fallback and facilitator cross-window controls require execution on the target browser. Static React tests isolate the map; they do not establish browser behavior. The five existing Python tests and byte-identical raster reproduction were not rerun. Regional imagery remains 100 m source resolution with source-reported map offsets; constituent acquisition dates and physical EVA reachability remain unknown. The JPL Kodiak asset remains excluded/unverified.

The client-side deterministic fixture is inspectable in developer tools. Facilitator controls are supervised UI separation, not authentication. Notes remain in memory until export; unsaved notebook drafts/timers reset on leaving their panel. Export before closing or starting another session. A closed/reloaded facilitator tab cannot recover its old child-window reference. The bundle remains large and accessibility has not been comprehensively audited.

## Next action

Run `npm run test:e2e` and the documented Python tests on the user's machine, inspect the actual map and facilitator phase controls, then run one consented primary-variant participant session and export their real explanations/timings and separate facilitator scores.
