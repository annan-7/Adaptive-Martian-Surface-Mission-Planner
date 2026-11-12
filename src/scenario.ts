import variants from "../data/scenarios/variants.json";
export type Variant = keyof typeof variants;
export type Scenario = typeof variants.canonical;
export { variants };
export const clock = (minutes: number) =>
  `${Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;
export function options(s: Scenario, travel: number) {
  const available = s.deadline - s.checkpoint;
  return [
    {
      id: "S2",
      label: "Continue to S2",
      travel,
      science: s.s2Science,
      return: s.s2Return,
      retains: "S2 investigation",
      defers: "S1 completion not assumed",
    },
    {
      id: "S1",
      label: "Finish S1 only",
      travel: 0,
      science: s.s1Science,
      return: s.s1Return,
      retains: "S1 completion",
      defers: "S2 investigation",
    },
    {
      id: "return",
      label: "Return now",
      travel: 0,
      science: 0,
      return: s.immediateReturn,
      retains: "Existing observations only",
      defers: "Further S1 and S2 work",
    },
  ].map((o) => ({
    ...o,
    reserve: s.reserve,
    total: o.travel + o.science + o.return + s.reserve,
    margin: available - (o.travel + o.science + o.return + s.reserve),
  }));
}
