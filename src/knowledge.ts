import events from "../data/scenarios/events.json";
import { options, variants, type Variant } from "./scenario";
import { assessRecommendation } from "./recommendations";
export type Role = "mars" | "earth";
export type Condition = "A" | "B" | "C";
export function project(role: Role, time: number, variant: Variant) {
  if ((role !== "mars" && role !== "earth") || !Object.hasOwn(variants, variant)
      || !Number.isInteger(time) || time < 840) {
    throw new Error("Invalid role, variant or fictional clock minute");
  }
  const messages = events
    .filter(
      (e) =>
        (e.initialShared && e.created <= time) ||
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
        ...assessRecommendation(m, observation),
      })),
  };
}
export type Knowledge = ReturnType<typeof project>;
export function participantExport(
  view: Knowledge,
  condition: Condition,
  records: { scenarioTime: number; role: Role; condition: Condition; variant: Variant }[],
) {
  return {
    schemaVersion: "0.3",
    evidenceType: "SIMULATED_SCENARIO",
    condition,
    ...view,
    recommendations: condition === "C" ? view.recommendations : view.recommendations.map(({ status: _status, reason: _reason, ...facts }) => facts),
    records: records.filter((r) => r.scenarioTime <= view.time
      && r.role === view.role && r.condition === condition && r.variant === view.variant),
  };
}
