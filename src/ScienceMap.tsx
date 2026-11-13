import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapInstance } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { boundsOf, parseMapMetadata, type MapMetadata } from "./map";

// Vite must bundle the worker, not just copy a module with unresolved imports.
maplibregl.setWorkerUrl(workerUrl);
const asset = (name: string) => `${import.meta.env.BASE_URL}data/${name}`;
const geologyLayers = ["fan-fill", "fan-line", "boundary"];

export function ScienceMap({ onSelect, onInspectSource }: {
  onSelect: (id: "S1" | "S2") => void;
  onInspectSource: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapInstance | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [fallbackMissing, setFallbackMissing] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [metadata, setMetadata] = useState<MapMetadata | null>(null);
  const [imagery, setImagery] = useState(true);
  const [geology, setGeology] = useState(true);
  const [feature, setFeature] = useState("");
  const callback = useRef(onSelect);
  useEffect(() => { callback.current = onSelect; }, [onSelect]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let instance: MapInstance | undefined;
    let observer: ResizeObserver | undefined;
    let disposed = false;
    let failed = false;
    const controller = new AbortController();
    setReady(false);
    setError("");
    setFallbackMissing(false);
    const fail = (message: string) => {
      if (disposed) return;
      failed = true;
      setReady(false);
      setError(message);
    };
    const timeout = window.setTimeout(() => fail(
      "Interactive map timed out. Retry or use the attributed image and science cards.",
    ), 20000);

    async function initialize() {
      let m: MapMetadata;
      try {
        const response = await fetch(asset("map-metadata.json"), { signal: controller.signal });
        if (!response.ok) throw new Error("Metadata unavailable");
        m = parseMapMetadata(await response.json());
      } catch {
        fail("Mars map metadata unavailable or invalid. No geographic overlay is displayed.");
        return;
      }
      if (disposed) return;
      setMetadata(m);
      try {
        const current = new maplibregl.Map({
          container: element!,
          style: {
            version: 8,
            projection: { type: "mercator" },
            sources: {},
            layers: [{ id: "background", type: "background", paint: { "background-color": "#171d20" } }],
          },
          bounds: boundsOf(m.corners),
          fitBoundsOptions: { padding: 35, duration: 0 },
          maxZoom: 13,
          renderWorldCopies: false,
          dragRotate: false,
          pitchWithRotate: false,
          attributionControl: false,
        });
        instance = current;
        map.current = current;
        current.touchZoomRotate.disableRotation();
        current.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
        current.getCanvas().setAttribute("aria-label", "Jezero regional map. Use arrow keys to pan and plus or minus to zoom.");
        current.on("error", () => fail(
          "An interactive map asset or worker failed to load. Source links and schematic remain available.",
        ));
        current.on("webglcontextlost", () => fail(
          "WebGL context lost. Retry the map; the schematic and science cards remain available.",
        ));
        current.on("load", () => {
          if (disposed) return;
          try {
          current.addSource("themis", {
            type: "image", url: asset("jezero-themis.png"), coordinates: m.corners,
          });
          current.addLayer({ id: "themis", type: "raster", source: "themis", paint: { "raster-fade-duration": 0 } });
          current.addSource("geology", { type: "geojson", data: asset("geology.geojson") });
          current.addLayer({
            id: "fan-fill", type: "fill", source: "geology",
            filter: ["==", ["get", "layer"], "GeoUnits_v1"],
            paint: { "fill-color": "#f9bd79", "fill-opacity": 0.3 },
          });
          current.addLayer({
            id: "fan-line", type: "line", source: "geology",
            filter: ["==", ["get", "layer"], "GeoUnits_v1"],
            paint: { "line-color": "#ffc98c", "line-width": 2 },
          });
          current.addLayer({
            id: "boundary", type: "line", source: "geology",
            filter: ["==", ["get", "layer"], "MapBoundary"],
            paint: { "line-color": "#a8bdc7", "line-width": 1, "line-dasharray": [4, 4] },
          });
          current.on("click", "fan-fill", e => {
            setFeature(String(e.features?.[0]?.properties?.name ?? "Jezero fan unit"));
            callback.current("S1");
          });
          current.on("mouseenter", "fan-fill", () => { current.getCanvas().style.cursor = "pointer"; });
          current.on("mouseleave", "fan-fill", () => { current.getCanvas().style.cursor = ""; });
          current.once("idle", () => {
            window.clearTimeout(timeout);
            if (!disposed && !failed) setReady(true);
          });
          } catch {
            fail("Map layer initialization failed. No geographic overlay is validated; use the source evidence below.");
          }
        });
        observer = new ResizeObserver(() => { if (!disposed) current.resize(); });
        observer.observe(element!);
      } catch {
        fail("WebGL unavailable. Use the attributed regional image below; interactive layers are unavailable.");
      }
    }
    void initialize();
    return () => {
      disposed = true;
      controller.abort();
      window.clearTimeout(timeout);
      observer?.disconnect();
      instance?.remove();
      map.current = null;
    };
  }, [attempt]);

  useEffect(() => {
    if (!ready || !map.current) return;
    map.current.setLayoutProperty("themis", "visibility", imagery ? "visible" : "none");
    for (const id of geologyLayers) map.current.setLayoutProperty(id, "visibility", geology ? "visible" : "none");
  }, [ready, imagery, geology]);

  return (
    <section className="map-shell" aria-label="Jezero science map">
      <div ref={container} className="map-canvas" data-testid="science-map" data-ready={ready} />
      <div className="map-heading">
        <span className="eyebrow">MARS / JEZERO & NILI PLANUM</span>
        <h2>Read the landscape.</h2>
        <p>Real regional evidence. No EVA route on this map.</p>
      </div>
      {!ready && !error && <p className="map-loading" role="status">Loading local Mars layers…</p>}
      <fieldset className="map-layers">
        <legend>Verified source layers · USGS-SIM3464</legend>
        <label><input type="checkbox" disabled={!ready} checked={imagery} onChange={e => setImagery(e.target.checked)} /> THEMIS daytime IR · 100 m source pixels</label>
        <label><input type="checkbox" disabled={!ready} checked={geology} onChange={e => setGeology(e.target.checked)} /> USGS fan units & map boundary</label>
        <p className="map-legend">Solid amber: mapped fans · dashed: publication boundary</p>
        <p>Mapped units: SCIENTIFIC_INTERPRETATION</p>
        <button className="text-link" disabled={!ready} onClick={() => {
          if (metadata) map.current?.fitBounds(boundsOf(metadata.corners), { padding: 35, duration: 0 });
        }}>Reset map extent</button>
        <div className="map-objectives" aria-label="Regional science references">
          <button onClick={() => onSelect("S1")}>Explore S1 · Deposition</button>
          <button onClick={() => onSelect("S2")}>Explore S2 · Flooding</button>
        </div>
        {feature && <p role="status">Selected: {feature}. Regional unit; not an EVA waypoint.</p>}
        <button className="text-link" onClick={onInspectSource}>Layer provenance and uncertainty</button>
      </fieldset>
      {error && <div className="map-error" role="status">
        <p>{error}</p>
        {fallbackMissing ? <p>Image unavailable — source-linked placeholder. No replacement image is inferred.</p>
          : <img src={asset("jezero-themis.png")} onError={() => setFallbackMissing(true)} alt="USGS SIM 3464 / NASA THEMIS regional daytime infrared mosaic. Static fallback without interactive overlay." />}
        <p>Static source image · USGS-SIM3464 · 100 m source pixels</p>
        <button className="text-link" onClick={() => setAttempt(n => n + 1)}>Retry interactive map</button>
        <div className="map-objectives">
          <button onClick={() => onSelect("S1")}>Inspect S1 evidence</button>
          <button onClick={() => onSelect("S2")}>Inspect S2 evidence</button>
        </div>
      </div>}
      <div className="map-attribution">
        <a href="https://pubs.usgs.gov/publication/sim3464" target="_blank" rel="noreferrer">USGS SIM 3464 · Sun & Stack (2020)</a>
        <span>NASA / THEMIS · Mars sphere · regional context only</span>
      </div>
    </section>
  );
}
