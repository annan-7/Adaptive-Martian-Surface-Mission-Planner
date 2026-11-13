# Limitations

- Educational simulated EVA; not flight software or an operational safety system. Every mission value, path, time, reserve, recommendation and event is fictional. No route optimizer, certified safety, oxygen/battery model, crew physiology, radiation validation, communications availability or operational authority.
- The authentic map is regional THEMIS daytime infrared imagery at 100 m source resolution. The source GIS uses geologic mapping based on a semi-controlled CTX mosaic and warns of 100–200 m offsets from later operations CTX. Mathematical registration is tested; absolute ground truth and traversability are not. No Kodiak pin or claimed astronaut station is invented.
- The map and schematic are separate. Real S1/S2 reference features are not confirmed reachable points in one EVA. Fine strata and boulders cannot be resolved in the regional map. Source text, not regional pixels, supports the science cards.
- The NASA Kodiak image URL returned HTTP 403 and is excluded. The standalone USGS web copyright page also returned 403; inspected publication front matter and GIS metadata provide the rights basis for included GIS products. No explicit copyrighted exception for those GIS inputs was found. Surface image assets are not redistributed.
- Mosaic constituent acquisition dates are not established. The October 2018 filename label is not represented as acquisition time. No mineral or biosignature detection, sample availability or NASA safety standard is claimed.
- R-02 is a conditional fixed-checkpoint comparison, not a current instruction based on known crew progress. No explicit acknowledgment event exists. Historical budgets are always labeled 14:25.
- Participant state and notes are held in memory and must be exported before refresh. There is no central collection server or personal-data storage. Facilitator correctness scoring is manual.
- The separate facilitator directory keeps answer keys out of the production participant build. Static client code still contains deterministic scenario fixtures. This prevents accidental UI/export disclosure, not deliberate source-code inspection. Use supervised production sessions, never an exposed Vite development server.
- The browser map needs WebGL; attributed raster/source fallback and the schematic remain available when initialization fails. External source links need network; scenario and map assets run offline once the local server is running.
- No human testing completed. The research hypothesis is unproven. Repeated scenarios can teach answers; counterbalancing and first-exposure analysis are necessary. Accessibility includes labels, keyboard controls, visible focus and responsive layout; no full assistive-technology certification is claimed.

## Current review limits (2026-11-12)

- Browser startup is blocked here by `PermissionError: [Errno 1] Operation not permitted` when binding a local HTTP server. The browser also found no running app at localhost:5173. New map loading, responsive layout and cross-window phase controls still need a real browser run.
- `python3 -m pytest -q` cannot run because pytest is absent. A project virtual environment was created, but installing the pinned dependencies failed at PyPI DNS resolution. Reprojection and byte-identical raster reproduction were not rerun.
- USGS original publication/PDF/GIS URLs returned HTTP 403 during this review. Its accessible official companion page and retained source documents were inspected; the GIS archive was not downloaded again.
- Source projection and angular alignment checks pass in the real MapLibre implementation; those checks do not establish ground truth, traversability or physical distances.
- Participant notes are held in memory. Export before reload/close. The notebook’s unsaved draft and timer reset if its panel unmounts; finish/save a response before switching tabs.
- A closed/reloaded facilitator tab cannot recover control of an existing child session. Start a fresh session after exporting. Future phases are UI-controlled, not secret from an adversarial user.
- The JavaScript bundle remains large; Vite's size warning is retained. No performance or assistive-technology certification is claimed.
