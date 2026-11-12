import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapInstance } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
maplibregl.setWorkerUrl(workerUrl);
export function ScienceMap({ onSelect }: { onSelect: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapInstance | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [imagery, setImagery] = useState(true);
  const [geology, setGeology] = useState(true);
  const callback = useRef(onSelect);
  useEffect(() => {
    callback.current = onSelect;
  }, [onSelect]);
  useEffect(() => {
    if (!container.current) return;
    let instance: MapInstance;
    let disposed = false;
    try {
      instance = new maplibregl.Map({
        container: container.current,
        style: {
          version: 8,
          sources: {},
          layers: [
            {
              id: "background",
              type: "background",
              paint: { "background-color": "#171d20" },
            },
          ],
        },
        center: [77.3, 18.2],
        zoom: 8.4,
        minZoom: 7,
        maxZoom: 13,
        attributionControl: false,
      });
      map.current = instance;
      instance.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right",
      );
      instance.on("error", () =>
        setError(
          "Map failed to load. Source links and schematic remain available.",
        ),
      );
      instance.on("load", async () => {
        try {
          const response = await fetch("/data/map-metadata.json");
          if (!response.ok) throw new Error("Missing metadata");
          const metadata = await response.json();
          if (disposed) return;
          instance.addSource("themis", {
            type: "image",
            url: "/data/jezero-themis.png",
            coordinates: metadata.corners as [
              [number, number],
              [number, number],
              [number, number],
              [number, number],
            ],
          });
          instance.addLayer({
            id: "themis",
            type: "raster",
            source: "themis",
            paint: { "raster-fade-duration": 0 },
          });
          instance.addSource("geology", {
            type: "geojson",
            data: "/data/geology.geojson",
          });
          instance.addLayer({
            id: "fan-fill",
            type: "fill",
            source: "geology",
            filter: ["==", ["get", "layer"], "GeoUnits_v1"],
            paint: { "fill-color": "#f9bd79", "fill-opacity": 0.2 },
          });
          instance.addLayer({
            id: "fan-line",
            type: "line",
            source: "geology",
            filter: ["==", ["get", "layer"], "GeoUnits_v1"],
            paint: { "line-color": "#ffc98c", "line-width": 2 },
          });
          instance.addLayer({
            id: "boundary",
            type: "line",
            source: "geology",
            filter: ["==", ["get", "layer"], "MapBoundary"],
            paint: {
              "line-color": "#a8bdc7",
              "line-width": 1,
              "line-dasharray": [4, 4],
            },
          });
          instance.on("click", "fan-fill", () => callback.current());
          instance.on("mouseenter", "fan-fill", () => {
            instance.getCanvas().style.cursor = "pointer";
          });
          instance.on("mouseleave", "fan-fill", () => {
            instance.getCanvas().style.cursor = "";
          });
          if (instance.getContainer().clientWidth < 500) {
            const corners = metadata.corners as [number, number][];
            instance.fitBounds(
              [
                [
                  Math.min(...corners.map((c) => c[0])),
                  Math.min(...corners.map((c) => c[1])),
                ],
                [
                  Math.max(...corners.map((c) => c[0])),
                  Math.max(...corners.map((c) => c[1])),
                ],
              ],
              {
                padding: { top: 90, bottom: 125, left: 20, right: 35 },
                duration: 0,
              },
            );
          }
          instance.once("idle", () => setReady(true));
        } catch {
          if (!disposed)
            setError(
              "Map metadata unavailable. Source links and schematic remain available.",
            );
        }
      });
    } catch {
      setError(
        "WebGL unavailable. View the attributed raster below; interactive layers unavailable.",
      );
    }
    return () => {
      disposed = true;
      instance?.remove();
      map.current = null;
    };
  }, []);
  useEffect(() => {
    if (ready && map.current) {
      map.current.setLayoutProperty(
        "themis",
        "visibility",
        imagery ? "visible" : "none",
      );
      for (const id of ["fan-fill", "fan-line", "boundary"])
        map.current.setLayoutProperty(
          id,
          "visibility",
          geology ? "visible" : "none",
        );
    }
  }, [ready, imagery, geology]);
  return (
    <section className="map-shell" aria-label="Jezero science map">
      <div
        ref={container}
        className="map-canvas"
        data-testid="science-map"
        data-ready={ready}
      />
      <div className="map-heading">
        <span className="eyebrow">MARS / JEZERO & NILI PLANUM</span>
        <h2>Read the landscape.</h2>
        <p>Real regional evidence. No EVA route on this map.</p>
      </div>
      <fieldset className="map-layers">
        <legend>Verified source layers</legend>
        <label>
          <input
            type="checkbox"
            checked={imagery}
            onChange={(e) => setImagery(e.target.checked)}
          />{" "}
          THEMIS daytime IR · 100 m
        </label>
        <label>
          <input
            type="checkbox"
            checked={geology}
            onChange={(e) => setGeology(e.target.checked)}
          />{" "}
          USGS fan units & map boundary
        </label>
        <button className="text-link" onClick={() => callback.current()}>
          Inspect Jezero fan science
        </button>
      </fieldset>
      {error && (
        <div className="map-error" role="status">
          {error}
          <img
            src="/data/jezero-themis.png"
            alt="USGS regional THEMIS daytime infrared mosaic, without overlay"
          />
        </div>
      )}
      <div className="map-attribution">
        <a
          href="https://pubs.usgs.gov/publication/sim3464"
          target="_blank"
          rel="noreferrer"
        >
          USGS SIM 3464 · Sun & Stack (2020)
        </a>
        <span>NASA / THEMIS · Mars sphere · regional context only</span>
      </div>
    </section>
  );
}
