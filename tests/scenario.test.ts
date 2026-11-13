import { describe, it, expect } from "vitest";
import { options, variants } from "../src/scenario";
import {
  project,
  participantExport,
  type Role,
  type Condition,
} from "../src/knowledge";
describe("locked arithmetic", () => {
  it("preserves canonical totals and margins", () => {
    expect(
      options(variants.canonical, 35).map((o) => [o.total, o.margin]),
    ).toEqual([
      [145, -20],
      [105, 20],
      [80, 45],
    ]);
    expect(options(variants.canonical, 20)[0]).toMatchObject({
      total: 130,
      margin: -5,
    });
  });
  it("primary observation alone crosses the constraint", () => {
    expect(options(variants.primary, 20)[0].margin).toBe(5);
    expect(options(variants.primary, 35)[0].margin).toBe(-10);
  });
});
describe("local knowledge and exports", () => {
  const has = (role: Role, time: number, id: string) =>
    project(role, time, "canonical").messages.some((m) => m.id === id);
  it("delivers O-01 at exact boundary", () => {
    expect(has("mars", 859, "O-01")).toBe(false);
    expect(has("mars", 860, "O-01")).toBe(true);
    expect(has("earth", 865, "O-01")).toBe(false);
    expect(has("earth", 879, "O-01")).toBe(false);
    expect(has("earth", 880, "O-01")).toBe(true);
  });
  it("delivers R-02 at exact boundary", () => {
    expect(has("earth", 884, "R-02")).toBe(false);
    expect(has("earth", 885, "R-02")).toBe(true);
    expect(has("mars", 904, "R-02")).toBe(false);
    expect(has("mars", 905, "R-02")).toBe(true);
  });
  it("requires locally known contradiction", () => {
    expect(project("earth", 865, "canonical").recommendations[0].status).toBe(
      "not_reassessed",
    );
    expect(project("mars", 865, "canonical").recommendations[0].status).toBe(
      "requires_review",
    );
    expect(project("earth", 880, "canonical").recommendations[0].status).toBe(
      "requires_review",
    );
  });
  it("never infers acknowledgment", () => {
    for (const role of ["mars", "earth"] as const)
      for (let t = 840; t <= 930; t++)
        expect(
          project(role, t, "canonical").messages.every((m) => !m.acknowledged),
        ).toBe(true);
  });
  it("no unseen content in participant selectors and exports, across conditions", () => {
    for (const condition of ["A", "B", "C"] as Condition[]) {
      const json = JSON.stringify(
        participantExport(project("earth", 865, "canonical"), condition, []),
      );
      for (const forbidden of [
        "loose terrain",
        "O-01",
        "R-02",
        "revisedTravel",
        "answerKey",
      ])
        expect(json).not.toContain(forbidden);
    }
  });
  it("historical rewind removes later knowledge", () => {
    expect(has("mars", 905, "R-02")).toBe(true);
    expect(has("mars", 865, "R-02")).toBe(false);
  });
  it("conditions have identical facts", () => {
    const exports = (["A", "B", "C"] as Condition[]).map((condition) => {
      const { condition: _, ...rest } = participantExport(
        project("mars", 865, "primary"),
        condition,
        [],
      );
      return { ...rest, recommendations: rest.recommendations.map(r => {
        const { status: _status, reason: _reason, ...facts } = r as typeof r & { status?: string; reason?: string };
        return facts;
      }) };
    });
    expect(exports[0]).toEqual(exports[1]);
    expect(exports[1]).toEqual(exports[2]);
  });
});
it("A/B exports do not add C's automatic dependency explanations", () => {
  for (const condition of ["A", "B"] as const) {
    const exported = participantExport(project("mars", 865, "primary"), condition, []);
    expect(exported.recommendations[0]).not.toHaveProperty("reason");
    expect(exported.recommendations[0]).not.toHaveProperty("status");
  }
  expect(participantExport(project("mars", 865, "primary"), "C", []).recommendations[0]).toHaveProperty("status", "requires_review");
});
it("historical export excludes records entered at future scenario times", () => {
  const records = [
    { scenarioTime: 865, value: "checkpoint entry", role: "earth" as const, condition: "C" as const, variant: "primary" as const },
    { scenarioTime: 905, value: "later knowledge", role: "earth" as const, condition: "C" as const, variant: "primary" as const },
  ];
  expect(
    participantExport(project("earth", 865, "primary"), "C", records).records,
  ).toEqual([records[0]]);
});
it("exports reject records from another role, condition or variant", () => {
  const base = { scenarioTime: 865, role: "earth" as const, condition: "C" as const, variant: "primary" as const };
  expect(participantExport(project("earth", 865, "primary"), "C", [
    base, { ...base, role: "mars" }, { ...base, condition: "A" }, { ...base, variant: "canonical" },
  ]).records).toEqual([base]);
});
it("rejects invalid clock inputs rather than inventing initial knowledge", () => {
  for (const time of [839, NaN, Infinity, 865.5])
    expect(() => project("earth", time, "primary")).toThrow();
});
it("all variants keep exact budget components in every role's view", () => {
  for (const variant of ["primary", "canonical"] as const) {
    for (const role of ["earth", "mars"] as const) {
      for (const time of [840, 860, 865, 880, 885, 905]) {
        const view = project(role, time, variant);
        expect(view.options).toEqual(options(variants[variant], view.travel));
        for (const message of view.messages) {
          expect(message.created).toBeLessThanOrEqual(time);
          expect(message.cutoff).toBeLessThanOrEqual(message.created);
        }
      }
    }
  }
});
it("all noninitial transmissions have exactly twenty minutes delay", () => {
  for (const message of project("earth", 905, "primary").messages)
    if (!message.initialShared)
      expect(message.received - message.sent).toBe(20);
});
