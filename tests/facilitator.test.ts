import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { expect, it, vi } from "vitest";

function consoleFixture() {
  const fields: Record<string, { value: string; textContent: string; onclick?: () => void }> = {};
  for (const [id, value] of Object.entries({ origin: "http://localhost:4173", participant: "synthetic", role: "earth", condition: "A", variant: "primary", time: "865", notes: "", status: "", key: "", launch: "", advance: "", export: "" }))
    fields[id] = { value, textContent: "" };
  const child = { closed: false, postMessage: vi.fn() };
  const open = vi.fn((_url: string) => child);
  let exported: Blob | undefined;
  class ExportURL extends URL {
    static createObjectURL(blob: Blob) { exported = blob; return "blob:synthetic"; }
    static revokeObjectURL() {}
  }
  const fetch = vi.fn();
  runInNewContext(readFileSync("facilitator/app.js", "utf8"), {
    document: { getElementById: (id: string) => fields[id], querySelector: () => ({}), createElement: () => ({ click: vi.fn() }) },
    window: { open }, location: { origin: "http://localhost:4174" }, crypto: { randomUUID: () => "synthetic-session" },
    URL: ExportURL, Blob, fetch, setTimeout: (fn: () => void) => fn(),
  });
  return { fields, child, open, fetch, readExport: async () => JSON.parse(await exported!.text()) };
}
it("launch joins anonymous participant and session IDs without fetching the answer key", () => {
  const f = consoleFixture();
  f.fields.launch.onclick!();
  const url = new URL(f.open.mock.calls[0][0] as string);
  expect(url.searchParams.get("participant")).toBe("synthetic");
  expect(url.searchParams.get("session")).toBe("synthetic-session");
  expect(url.searchParams.get("facilitatorOrigin")).toBe("http://localhost:4174");
  expect(f.fetch).not.toHaveBeenCalled();
});
it("sends phase control only to the launched origin and session", () => {
  const f = consoleFixture();
  f.fields.launch.onclick!();
  f.fields.time.value = "880";
  f.fields.advance.onclick!();
  expect(f.child.postMessage).toHaveBeenCalledWith({ type: "mars-compass:set-time", sessionId: "synthetic-session", time: 880 }, "http://localhost:4173");
  expect(f.fields.status.textContent).toContain("no acknowledgment is inferred");
});
it("export retains launched assignment and actual notes, even if form selections change", async () => {
  const f = consoleFixture();
  f.fields.launch.onclick!();
  f.fields.condition.value = "C";
  f.fields.notes.value = "SYNTHETIC DRY-RUN — NOT HUMAN TESTING";
  f.fields.export.onclick!();
  expect(await f.readExport()).toMatchObject({ condition: "A", role: "earth", sessionId: "synthetic-session", participant: "synthetic", notes: "SYNTHETIC DRY-RUN — NOT HUMAN TESTING" });
});
it("rejects non-web participant URLs and unopened time controls", () => {
  const f = consoleFixture();
  f.fields.origin.value = "javascript:alert(1)";
  f.fields.launch.onclick!();
  expect(f.open).not.toHaveBeenCalled();
  f.fields.advance.onclick!();
  expect(f.child.postMessage).not.toHaveBeenCalled();
});
