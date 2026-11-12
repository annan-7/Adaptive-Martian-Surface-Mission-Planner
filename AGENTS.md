# AGENTS.md — MARS COMPASS

> Repository-wide instructions for Codex and other coding agents. Read this file before changing any code, documentation, data, or tests.

## 0. Mission and non-negotiable outcome

Build **MARS COMPASS v0.3**, an **executable, testable, science-first, map-centered Mars EVA decision-support prototype** for the NASA Space Apps *Interplanetary Survival Guide: Martian Map* concept.

The prototype must demonstrate how a hypothetical astronaut on Mars and an Earth mission planner can reason about **geological objectives, route changes, evidence provenance, recommendation assumptions, and delayed communication**. It is an educational/hackathon prototype, **not flight software or an operational safety system**.

**Codex MUST deliver working application code**, automated tests, reproducible run instructions, and documented data provenance. Do not stop at wireframes, architecture diagrams, or TODOs. Do not claim to have run commands or verified sources unless you actually did so.

**Primary research hypothesis:** A science-rich, spatially grounded interface that links changed observations to affected science goals and recommendation assumptions improves understanding compared with (A) a conventional layered map and (B) the same map with a timeline. This hypothesis is **unproven**. The application must permit fair comparison, not assume superiority.

## 1. Operating rules: truth before polish

1. **Never fabricate NASA datasets, scientific conclusions, coordinates, rover images, acquisition metadata, citations, route safety, participant responses, or test results.**
2. Distinguish clearly in both UI and data: `VERIFIED_SOURCE`, `SCIENTIFIC_INTERPRETATION`, `SIMULATED_SCENARIO`, `DERIVED_FROM_SIMULATION`, and `UNVERIFIED`.
3. `VERIFIED_SOURCE` means an accessible primary source has been checked and its relevant claim recorded; a plausible URL or model memory is not verification. If network access is unavailable, mark it `UNVERIFIED` and do not claim it was checked.
4. Never present fictional astronaut stations, habitat locations, route lines, travel times, time reserves, hazards, or mission constraints as measured NASA facts. Every scenario screen must show a prominent **SIMULATED EVA — NOT FOR OPERATIONAL USE** label.
5. Do not draw a fictional route on a real map as if georeferenced. Either (a) verify the coordinate system, footprint, and route geometry, and label it simulated, or (b) use a separate **SCHEMATIC ROUTE — NOT GEOREFERENCED** panel. A real-image backdrop does not validate a path.
6. If a source, image, dataset, coordinate, license, or scientific interpretation cannot be verified, **record the gap and use an explicit placeholder**. Never silently substitute a guessed value.
7. Do not claim that NASA systems lack features without evidence. Mars Trek, BASALT/Minerva, Playbook, xGDS, AEGIS, and other systems may already cover related functionality.
8. Never invent usability participants, pilot sessions, success rates, user quotations, or comparative results. A scripted agent simulation is a **dry-run**, not a human pilot.
9. Never imply that a positive time margin alone proves EVA safety. This prototype does not validate life support, radiation, communications availability, astronaut physiology, traversability, or operational authority.
10. When instructions conflict, prioritize factual integrity, explicit uncertainty, functional correctness, and test reproducibility. Explain any unavoidable deviation.

## 2. Scope and success criteria

### In scope for v0.3

- Working local web app with an interactive **Mars science map** using verified, attributed source layers where feasible.
- Evidence-backed Jezero science target cards, with source links, observations, interpretations, uncertainties, and objective trade-offs.
- Distinct **Astronaut** and **Earth Planner** perspectives.
- Deterministic scenario playback with **20-minute simulated one-way communication delay**.
- Timestamped observation, transmission, receipt, and recommendation records; role-specific knowledge boundaries.
- Route-change explanation and transparent, explicitly simulated time-budget arithmetic.
- Three comparable study modes: **A — Map**, **B — Map + Timeline**, **C — MARS COMPASS**.
- A facilitator/testing interface, task prompts, answer key protected from participant view, event log, and export of **real user-entered** observations.
- Unit/integration tests, documentation, source registry, and runnable build.

### Out of scope unless explicitly approved

- Flight-ready route planning, certified EVA safety, real-time Mars communications, actual crew tracking, autonomous mission control, unvalidated oxygen/battery calculations, or live NASA operational feeds.
- Large-scale AI agent autonomy and opaque LLM-based mission recommendations. All required demo decisions must be reproducible without an LLM.
- Expanding to the whole planet at the expense of a scientifically credible Jezero demonstration.

### Definition of done

A reviewer can clone the repository, follow README instructions, start the app, inspect at least two evidence-backed Jezero science cards, run the complete delayed-communication scenario in both roles, compare A/B/C conditions, see the origin and assumptions of every important value, and execute passing automated tests. All missing evidence and limitations are disclosed.

## 3. Scientific study area and evidence policy

**Study area:** Jezero Crater, particularly the western delta and Kodiak butte as scientific reference features. **Do not assert that Kodiak and another exposure are reachable by one hypothetical EVA** without independently validated geometry and traversability. The first prototype may use a real geological context map plus a separately labeled schematic traverse.

**Scientific objective S1 — Ancient delta deposition:** Examine the geological meaning of inclined and layered sedimentary strata, relevant to reconstructing river/delta deposition into an ancient lake.

**Scientific objective S2 — Later energetic flooding:** Examine the geological meaning of coarse-grained and boulder-rich delta deposits, relevant to high-energy flow episodes.

The above are **evidence-informed science questions**, not confirmed astronaut sampling locations. Do not claim specific mineral detections, sample availability, or biosignatures unless separately sourced.

### Starting points for source verification (NOT pre-verified by this file)

- USGS *Geologic Map of Jezero Crater and the Nili Planum Region, Mars*, SIM 3464: https://pubs.usgs.gov/publication/sim3464
- NASA/JPL Kodiak image catalog: https://www.jpl.nasa.gov/images/pia24802-perseverance-captures-image-of-kodiak/
- NASA Jezero delta image: https://science.nasa.gov/resource/perseverance-view-of-the-delta-in-jezero-crater/
- NASA Mars Trek: https://trek.nasa.gov/mars/
- NASA Planetary Data System: https://pds.nasa.gov/
- NASA/JPL Perseverance mission science pages: https://science.nasa.gov/mission/mars-2020-perseverance/

**Mandatory source verification procedure:**

1. Open each proposed source; confirm the page/document exists and supports the exact claim. Record access date, institution, title, URL, relevant figure/page, instrument, acquisition date (only if explicitly documented), and usage/licensing terms when available.
2. Prefer primary NASA/JPL/USGS/PDS records and peer-reviewed scientific papers. Do not cite image-search snippets or uninspected links as proof.
3. For map tiles/rasters, verify license/terms, spatial reference, footprint, resolution, attribution, and whether a working public endpoint actually exists. Do not guess tile URLs or API endpoints.
4. Store evidence in `data/sources.json` and `docs/EVIDENCE_REGISTER.md`. Every science card and real map layer must link to its source record by stable ID.
5. Keep scientific interpretation distinct from direct observation. E.g., “visible inclined layers” is an observation; “delta deposition” is an interpretation supported by cited research.
6. If an imagery service cannot be integrated lawfully or reliably, use an explicitly attributed local image **only if permission and provenance are confirmed**; otherwise show a source-linked placeholder. The app must still run offline with its schematic scenario.
7. Do not hardcode purported NASA coordinates, exact distances, or landing/astronaut site locations from memory. If not verified, omit them.

## 4. Product experience and required screens

The **map must remain the primary surface**, not a decorative panel behind a generic dashboard.

1. **Science Map / Mission Overview**: region label, genuine verified layer controls, source attribution, science targets, route-context mode, current role, scenario time, and obvious simulated-vs-real distinction. Clearly separate real geographic evidence from schematic fictional route geometry.
2. **Science Target Card**: S1/S2 geological question, observed evidence, scientific interpretation, provenance, uncertainty, hypothetical EVA activity, and consequence if deferred.
3. **Observation / Change Inspector**: location or schematic segment, old/new travel estimate, who observed it, observation/transmission/receipt timestamps, affected science objective, and unknowns.
4. **Options / Trade-offs**: show reproducible time-budget components, scientific objectives retained or deferred, assumptions, constraint violations, and no unsupported safety verdicts.
5. **Recommendation / Decision History**: recommendation author, creation time, evidence cutoff, assumptions, status (`not_reassessed`, `requires_review`, `reassessed`, etc.), receipt time, and role-specific visibility.
6. **Facilitator / Test Mode**: condition A/B/C selection, role, scenario event control, task presentation, hidden answer key, real participant notes, timestamps, and export. Never prepopulate observations as human test outcomes.

### Interaction rules

- Selecting a science site reveals geological evidence and provenance.
- Selecting a changed route segment reveals the observation and its affected assumptions.
- Users can compare alternatives without the UI claiming an algorithm has certified them.
- Each role sees **only messages actually received by that role at the selected time**, plus its own local observations and actions.
- Users can inspect what was known *at a historical time*, not just the latest global state.
- The interface distinguishes **message sent**, **message received**, **message acknowledged**, and **recommendation valid under stated assumptions**. Never infer acknowledgment from sending or receiving.
- Show meaningful empty/unknown states; avoid confident-looking invented values.
- Use accessible color-independent labels, keyboard navigation, readable contrast, and clear units.

## 5. Canonical deterministic EVA scenario

All clock times are on one **synchronized fictional scenario clock**; do not conflate with Mars local solar time or actual mission operations. The scenario is entirely simulated. One-way Mars–Earth delay is fixed at **20 minutes** for this test (not a universal physical constant).

### Mission event schedule

| Time | Event | Mars knowledge | Earth knowledge |
|---|---|---|---|
| 14:00 | Original science plan agreed | Original plan | Original plan |
| 14:20 | Crew observes loose terrain, revises S2 traverse from 20 to 35 minutes; sends O-01 | O-01 immediately | Does not yet have O-01 |
| 14:25 | Crew must evaluate options | Original plan + O-01 | Original plan only |
| 14:40 | O-01 arrives on Earth | O-01 | O-01 now available |
| 14:45 | Earth sends revised recommendation R-02 | Does not yet have R-02 | R-02 created and sent |
| 15:05 | R-02 arrives on Mars | R-02 now available | No implied crew acknowledgment |

At 14:25 Earth **must not** see the 14:20 observation or be warned about the specific unseen hazard. Earth may see the age of its last received data. At 14:40 Earth may reassess earlier advice, but cannot assume what crew decided after O-01 was transmitted.

### Locked scenario budget at decision checkpoint 14:25

- Hard return deadline: **16:30**.
- Time available: **125 minutes**.
- Required scenario reserve: **30 minutes** (fictional rule, not NASA standard).
- **Continue to S2:** travel 35 + science 25 + return 55 + reserve 30 = **145 minutes**, margin **−20 minutes**.
- **Finish S1 only:** additional travel 0 + science 20 + return 55 + reserve 30 = **105 minutes**, margin **+20 minutes**.
- **Return now:** additional travel 0 + science 0 + return 50 + reserve 30 = **80 minutes**, margin **+45 minutes**.
- Original S2 estimate before the observation: 20 + 25 + 55 + 30 = **130 minutes**, margin **−5 minutes** *at the 14:25 checkpoint*.

**Critical experimental confound:** The original S2 plan already violates the time constraint by five minutes at 14:25, even before the terrain update. Keep this scenario as a *complex reasoning* variant, but create an **additional matched primary pilot variant** where the original plan is feasible at the decision checkpoint and the new observation alone causes a violation. Document every number and ensure equivalent data across A/B/C. Do not silently alter the locked scenario above.

### Calculation and epistemic rules

- Compute time margins in code from structured inputs; do not hardcode output labels independently.
- Use `margin = available_minutes - (travel + science + return + reserve)`.
- Negative margin means the **fictional time constraint** is violated, not that death/injury is predicted.
- Preserve exact event ordering. A message sent at time `t` arrives at `t + 20 minutes` unless an explicitly documented scenario variant changes delay.
- Recommendation status is evaluated from **locally known** evidence and declared assumptions, not omniscient hidden state.
- Add automated tests for all numbers, delayed arrivals, event visibility, and no implied acknowledgments.

## 6. Architecture: implementation freedom with guardrails

Codex is authorized to choose a minimal maintainable stack based on the existing repository. **Inspect the repo first** and reuse its tools where reasonable. If empty, prefer a lightweight TypeScript web app with a mature map library only if verified layers can be integrated. Avoid a backend unless essential. Explain stack choice briefly in `docs/ARCHITECTURE.md`.

Required boundaries (module names may differ):

- `evidence`: typed source records and science claims; source/claim cross-references.
- `scenario`: deterministic event schedule, time arithmetic, and scenario variants.
- `knowledge`: role-specific visibility projection; no future-data leakage.
- `recommendations`: declared assumptions, evidence cutoff, validity/review status.
- `map`: genuine attributed science/geology layers versus clearly separated schematic route.
- `study`: A/B/C mode configuration and participant/facilitator separation.

Use explicit types/schemas, predictable state transitions, and deterministic fixtures. Avoid pretending to have a physical route optimizer or live NASA API if you do not. No external AI inference is necessary for the core demo.

## 7. Fair prototype comparison

All conditions must use **the same facts, source cards, scenario inputs, and tasks**. Do not sabotage the baseline.

- **A — Layered Map:** science map, science cards, mission brief, raw timestamped messages, and the same underlying scenario values.
- **B — Map + Timeline:** A plus organized chronological events; no automatic explanation of assumption dependencies.
- **C — MARS COMPASS:** B plus spatially linked changed assumptions, affected science objectives, and explicit recommendation-review reasoning.

Do not allow condition C to access evidence unavailable to A or B. If one condition hides data for UI simplicity, it must remain discoverable in all conditions. Use a facilitator-controlled sequence, equivalent variants, and counterbalanced order in the test protocol. Log which condition and scenario were used.

## 8. Test plan and required automated checks

### Mandatory automated tests

1. All canonical option totals and margins match Section 5.
2. Mars O-01 visible to Mars at 14:20; not visible to Earth at 14:25; visible to Earth at 14:40.
3. R-02 visible to Earth when created at 14:45; not visible to Mars before 15:05; visible to Mars at 15:05.
4. No `acknowledged` state without an explicit acknowledgment event.
5. Earth at 14:25 cannot receive UI strings/structured data revealing the specific 14:20 hazard, even through detail panels, hidden tooltips, exports, or state selectors intended for participants.
6. An outdated assumption becomes `requires_review` **only for a role that has received contradicting evidence**; do not conflate age alone with falsity.
7. Science cards display source identifiers, evidence type, and caveats; no unsupported coordinates or NASA safety values.
8. A/B/C conditions share the same scientific and scenario data fixtures.
9. Facilitator answer keys and cross-role secret information are inaccessible in participant-facing UI and participant exports.
10. App starts, builds, and navigates core screens without runtime errors; add a smoke/end-to-end test if tooling permits.

### Human usability pilot (NOT to be fabricated)

Tasks: identify S1/S2 science value; detect changed travel assumption; state what Earth knows at 14:25; assess old recommendation; compare time-constrained alternatives; reconstruct role knowledge at 14:45 and 15:05.

Record actual participant role, condition, scenario variant, task correctness, task time, explanation, confusion, workload, and overconfidence. Exploratory targets (not proof): ≥90% stale-assumption recognition, ≥85% change comprehension, and 25% faster justified decisions than baseline. With small samples, report raw counts and descriptive statistics; do not claim statistical significance or validated operational safety.

A scripted demo or agent-generated roleplay can verify flow and identify logical bugs, but must be labeled **SYNTHETIC DRY-RUN — NOT HUMAN TESTING**.

## 9. Expected repository deliverables

Create or update these files (adapt structure to existing repo, document deviations):

- `AGENTS.md` — this instruction file.
- `README.md` — what it does, exact prerequisites, install/run/test/build commands, demo workflow, limits.
- `docs/PROJECT_BRIEF.md` — challenge alignment, user roles, research hypothesis, scope.
- `docs/ARCHITECTURE.md` — stack choice, module boundaries, data flow, known tradeoffs.
- `docs/EVIDENCE_REGISTER.md` — every checked claim, image, map layer, citation, access date, caveat, licensing status.
- `docs/SCENARIO_SPEC.md` — event timeline, scenario variants, all budget calculations and assumptions.
- `docs/TEST_PROTOCOL.md` — A/B/C controls, participant instructions, astronaut/planner packets, facilitator-only key, pilot steps and rubric.
- `docs/LIMITATIONS.md` — missing verification, non-flight status, scientific/technical gaps, untested hypotheses.
- `data/sources.json` — machine-readable provenance records.
- `data/scenarios/` — typed, deterministic scenario fixtures.
- `src/` (or existing app layout) — complete working UI and logic.
- `tests/` (or framework equivalent) — required unit/integration tests.
- `docs/IMPLEMENTATION_REPORT.md` — implemented features, commands actually executed, results, outstanding issues, evidence gaps, and explicit readiness verdict.

Do not create fake screenshots, fake test logs, fake references, or empty placeholder tests merely to satisfy the file list. If a deliverable is blocked, record why and what is needed.

## 10. Required work sequence

1. **Inspect** repository contents, dependencies, and existing instructions. Do not overwrite user work casually.
2. **Audit evidence** and produce a source register with `verified`/`unverified` status and exact supporting claims. When offline, preserve unverified status.
3. **Lock scenario fixtures** and add deterministic tests for time, messaging, and visibility before implementing presentation.
4. **Build the minimum map-centered UI** with clear verified-vs-simulated separation.
5. **Implement roles and delayed knowledge**; prove no future information leaks through UI or exports.
6. **Implement science cards, options, and recommendation reasoning** with transparent assumptions.
7. **Implement A/B/C study modes** and facilitator-only answer key; preserve data parity.
8. **Run** lint/typecheck/tests/build and, if available, an end-to-end smoke test. Fix failures.
9. **Audit** all visible scientific and operational claims against evidence register.
10. **Report** what works, what remains unverified, and whether the result is ready for a human pilot. Never state “pilot completed” without genuine participant records.

## 11. Communication and reporting format for Codex

At the start of work, state: existing repo findings, implementation plan, source-verification availability, and main risks. Then **execute the plan**; do not ask permission for ordinary coding steps. Ask the user only when an external account, licensing decision, destructive change, or essential product choice genuinely requires authorization.

At completion, report:

- **Delivered:** exact files and features, with paths.
- **Verified science:** sources actually inspected and the precise claims they support.
- **Simulated:** all fictional mission/route/resource values.
- **Validation:** exact commands run and their real pass/fail results.
- **Known gaps:** unverified assets, unsupported assumptions, missing coverage, and deferred work.
- **Pilot readiness:** `READY FOR FACILITATED PILOT`, `READY WITH LIMITATIONS`, or `NOT READY`, with reasons.
- **Next action:** one concrete step to gather real user evidence.

**Never replace uncertainty with confidence. Never replace executable deliverables with a plan.**
