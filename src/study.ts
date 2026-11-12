import type { Condition } from "./knowledge";
export const conditions: Record<
  Condition,
  { label: string; timeline: boolean; dependencies: boolean }
> = {
  A: { label: "Map", timeline: false, dependencies: false },
  B: { label: "Map + Timeline", timeline: true, dependencies: false },
  C: { label: "MARS COMPASS", timeline: true, dependencies: true },
};
export const tasks = [
  "Explain the distinct scientific value of S1 and S2.",
  "Identify the S2 travel estimate known to your role and its supporting message.",
  "At 14:25, what does Earth know? What remains unknown?",
  "Assess R-01’s travel assumption separately from its time feasibility.",
  "Compare all three alternatives at the fixed 14:25 checkpoint. Explain your choice.",
  "Reconstruct each role’s knowledge at 14:45 and 15:05. Is acknowledgment established?",
];
