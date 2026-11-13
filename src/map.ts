export type Position = [number, number];
export type Bounds = [Position, Position];
export type MapMetadata = {
  sourceId: string;
  evidenceType: string;
  radiusMeters: number;
  sourceCRS: string;
  displayCRS: string;
  corners: [Position, Position, Position, Position];
  sourceResolutionMeters: [number, number];
  caveat: string;
};

export function boundsOf(points: Position[]): Bounds {
  return [
    [Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[1]))],
    [Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[1]))],
  ];
}

// Reject missing/terrestrial metadata instead of drawing plausible-looking geography.
export function parseMapMetadata(value: unknown): MapMetadata {
  const m = value as Partial<MapMetadata> | null;
  if (!m || m.sourceId !== "USGS-SIM3464" || m.evidenceType !== "VERIFIED_SOURCE"
    || m.radiusMeters !== 3396190 || !m.sourceCRS?.includes("3396190")
    || !m.displayCRS?.includes("3396190") || typeof m.caveat !== "string"
    || !Array.isArray(m.sourceResolutionMeters) || m.sourceResolutionMeters.length !== 2
    || !m.sourceResolutionMeters.every(n => Number.isFinite(n) && n > 0)
    || !Array.isArray(m.corners) || m.corners.length !== 4
    || !m.corners.every(p => Array.isArray(p) && p.length === 2
      && p.every(Number.isFinite) && Math.abs(p[0]) <= 180 && Math.abs(p[1]) < 85)) {
    throw new Error("Missing or invalid Mars map provenance / coordinates");
  }
  const [tl, tr, br, bl] = m.corners;
  if (!(tl[0] < tr[0] && tl[1] > bl[1] && tl[1] === tr[1]
      && bl[1] === br[1] && tl[0] === bl[0] && tr[0] === br[0])) {
    throw new Error("Expected a pre-warped Mercator rectangle: TL, TR, BR, BL");
  }
  return m as MapMetadata;
}
