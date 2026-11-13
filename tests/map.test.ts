import { expect, it } from "vitest";
import { MercatorCoordinate } from "maplibre-gl";
import metadata from "../public/data/map-metadata.json";
import { readFileSync } from "node:fs";
import type { FeatureCollection } from "geojson";
import { boundsOf, parseMapMetadata } from "../src/map";
const geology: FeatureCollection = JSON.parse(readFileSync("public/data/geology.geojson", "utf8"));

it("validates real Mars metadata and computes the view from its footprint", () => {
  const m = parseMapMetadata(metadata);
  expect(boundsOf(m.corners)).toEqual([m.corners[3], m.corners[1]]);
});
it("rejects absent provenance, Earth radius, malformed and reversed corners", () => {
  for (const value of [null, {}, { ...metadata, radiusMeters: 6378137 },
    { ...metadata, corners: [[0, NaN]] }, { ...metadata, corners: [...metadata.corners].reverse() },
    { ...metadata, evidenceType: "UNVERIFIED" }]) {
    expect(() => parseMapMetadata(value)).toThrow();
  }
});
it("actual MapLibre Mercator positions agree with all retained Mars raster control points", () => {
  const m = parseMapMetadata(metadata);
  const tl = MercatorCoordinate.fromLngLat(m.corners[0]);
  const br = MercatorCoordinate.fromLngLat(m.corners[2]);
  for (const control of metadata.controls) {
    const p = MercatorCoordinate.fromLngLat({ lng: control.lonlat[0], lat: control.lonlat[1] });
    expect((p.x - tl.x) / (br.x - tl.x) * metadata.outputShape[0]).toBeCloseTo(control.outputPixel[0], 6);
    expect((p.y - tl.y) / (br.y - tl.y) * metadata.outputShape[1]).toBeCloseTo(control.outputPixel[1], 6);
  }
});
it("map features carry source IDs and contain no fictional EVA points or routes", () => {
  expect(geology.features).toHaveLength(metadata.overlayFeatureCount);
  for (const f of geology.features) {
    expect(f.properties?.sourceId).toBe(metadata.sourceId);
    expect(["Polygon", "MultiPolygon"]).toContain(f.geometry.type);
    expect(["MapBoundary", "GeoUnits_v1"]).toContain(f.properties?.layer);
  }
});
