import events from "../data/scenarios/events.json";
import { options, variants, type Variant } from "./scenario";
export type Role = "mars" | "earth";
export type Condition = "A" | "B" | "C";
export function project(role: Role, time: number, variant: Variant) {
  const messages = events
    .filter(
      (e) =>
        e.initialShared ||
        (e.author === role ? e.created <= time : e.received <= time),
    )
    .map((e) => ({
      ...e,
      receivedAt: e.initialShared
        ? e.received
        : e.author === role
          ? null
          : e.received,
      delivery: e.initialShared
        ? "shared initial agreement"
        : e.author === role
          ? "sent; remote receipt not confirmed"
          : "received",
      acknowledged: false,
    }));
  const observation = messages.find((m) => m.id === "O-01");
  const travel = observation
    ? variants[variant].revisedTravel
    : variants[variant].originalTravel;
  const latestReceived = Math.max(
    840,
    ...messages.filter((m) => m.receivedAt !== null).map((m) => m.receivedAt!),
  );
  return {
    role,
    time,
    variant,
    messages,
    travel,
    observation: observation ?? null,
    lastReceivedAge: time - latestReceived,
    options: options(variants[variant], travel),
    recommendations: messages
      .filter((m) => m.kind === "recommendation")
      .map((m) => ({
        ...m,
        status:
          m.travelAssumption !== travel
            ? "requires_review"
            : m.id === "R-02"
              ? "reassessed"
              : "not_reassessed",
        reason:
          m.travelAssumption !== travel
            ? "Locally known O-01 contradicts the 20-minute S2 travel assumption."
            : "No locally known contradiction to travel assumption. Time feasibility is a separate check.",
      })),
  };
}
export type Knowledge = ReturnType<typeof project>;
export function participantExport(
  view: Knowledge,
  condition: Condition,
  records: { scenarioTime: number }[],
) {
  return {
    schemaVersion: "0.3",
    evidenceType: "SIMULATED_SCENARIO",
    condition,
    ...view,
    records: records.filter((r) => r.scenarioTime <= view.time),
  };
}
