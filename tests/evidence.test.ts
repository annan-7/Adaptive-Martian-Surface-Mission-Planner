import { expect, it } from "vitest";
import { sources, scienceCards } from "../src/evidence";
import { conditions } from "../src/study";
it("science cards link inspected evidence and expose caveats", () => {
  for (const c of scienceCards) {
    expect(c.evidenceType).toBe("SCIENTIFIC_INTERPRETATION");
    expect(c.uncertainty.length).toBeGreaterThan(30);
    for (const id of c.sourceIds)
      expect(sources.find((s) => s.id === id)?.status).toBe("VERIFIED_SOURCE");
  }
});
it("conditions add organization, not a separate data source", () => {
  expect(conditions.A).toEqual({
    label: "Map",
    timeline: false,
    dependencies: false,
  });
  expect(conditions.B.timeline).toBe(true);
  expect(conditions.B.dependencies).toBe(false);
  expect(conditions.C.dependencies).toBe(true);
});
