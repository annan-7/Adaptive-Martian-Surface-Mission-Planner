import { beforeEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.hoisted(() => vi.stubGlobal("location", { search: "" }));
vi.mock("../src/ScienceMap", () => ({ ScienceMap: () => <div>Map isolated in component render checks</div> }));
vi.mock("../src/store", async importOriginal => {
  const { useMission } = await importOriginal<typeof import("../src/store")>();
  // SSR normally reads Zustand's initial state. Render each explicit test projection instead.
  return { useMission: Object.assign((select?: (s: ReturnType<typeof useMission.getState>) => unknown) =>
    select ? select(useMission.getState()) : useMission.getState(), useMission) };
});
import App from "../src/App";
import { useMission } from "../src/store";
import { controlledTime, facilitatorOrigin } from "../src/sessionControl";

beforeEach(() => useMission.setState({ role: "earth", condition: "C", variant: "canonical", time: 865,
  selected: "S1", tab: "science", records: [], facilitatorOrigin: null, releasedTime: 905 }));

for (const condition of ["A", "B", "C"] as const) {
  it(`renders all Earth panels without future evidence in ${condition}`, () => {
    for (const tab of ["brief", "science", "messages", "options", "review", "inspector", "study", "sources"]) {
      useMission.setState({ condition, tab });
      const html = renderToStaticMarkup(<App />);
      expect(html).toContain("SIMULATED EVA — NOT FOR OPERATIONAL USE");
      expect(html).not.toMatch(/O-01|R-02|loose terrain|requires_review|revisedTravel|answerKey|facilitator\/key/);
    }
  });
}
it("both science cards render evidence classification, source identifiers and uncertainty", () => {
  for (const selected of ["S1", "S2"]) {
    useMission.setState({ selected });
    const html = renderToStaticMarkup(<App />);
    for (const text of ["NASA-JEZERO-2021", "VERIFIED_SOURCE", "SCIENTIFIC_INTERPRETATION", "Uncertainty", "Hypothetical EVA activity"])
      expect(html).toContain(text);
  }
});
it("rendered canonical margins and delayed advice follow the role projection", () => {
  useMission.setState({ role: "mars", tab: "options" });
  const html = renderToStaticMarkup(<App />);
  for (const margin of ["-20 min", "+20 min", "+45 min"]) expect(html).toContain(margin);
  useMission.setState({ tab: "review", time: 885 });
  expect(renderToStaticMarkup(<App />)).not.toContain("R-02");
  useMission.setState({ time: 905 });
  expect(renderToStaticMarkup(<App />)).toContain("R-02");
});
it("historical notebook hides future entries and exposes genuine empty state", () => {
  useMission.setState({ tab: "study", records: [{ at: "test", scenarioTime: 905, role: "earth", condition: "C", variant: "canonical", type: "task-response", value: "FUTURE ENTRY" }] });
  const html = renderToStaticMarkup(<App />);
  expect(html).not.toContain("FUTURE ENTRY");
  expect(html).toContain("No local entries yet.");
});
it("facilitated sessions hide mode switching and restrict future clock phases", () => {
  useMission.setState({ facilitatorOrigin: "http://localhost:4174", releasedTime: 865 });
  expect(renderToStaticMarkup(<App />)).not.toContain("Explore roles and study modes");
  useMission.getState().set({ time: 905 });
  expect(useMission.getState().time).toBe(865);
  useMission.getState().release(880);
  expect(useMission.getState().time).toBe(880);
  useMission.getState().set({ time: 840 });
  expect(useMission.getState().time).toBe(840);
  useMission.getState().release(NaN);
  expect(useMission.getState().releasedTime).toBe(880);
});
it("accepts only scoped, typed facilitator time commands", () => {
  expect(facilitatorOrigin("javascript:alert(1)")).toBeNull();
  expect(facilitatorOrigin("https://example.org/path")).toBeNull();
  expect(facilitatorOrigin("http://localhost:4174")).toBe("http://localhost:4174");
  const data = { type: "mars-compass:set-time", sessionId: "test", time: 880 };
  expect(controlledTime(data, "test")).toBe(880);
  for (const invalid of [null, {}, { ...data, type: "other" }, { ...data, time: "880" }, { ...data, time: 906 }, { ...data, time: NaN }])
    expect(controlledTime(invalid, "test")).toBeNull();
  expect(controlledTime(data, "another-session")).toBeNull();
});
