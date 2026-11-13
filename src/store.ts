import { create } from "zustand";
import type { Role, Condition } from "./knowledge";
import type { Variant } from "./scenario";
import { facilitatorOrigin } from "./sessionControl";
export type StudyRecord = {
  at: string;
  scenarioTime: number;
  role: Role;
  condition: Condition;
  variant: Variant;
  type: string;
  value: string;
};
type State = {
  role: Role;
  condition: Condition;
  variant: Variant;
  time: number;
  selected: string;
  tab: string;
  records: StudyRecord[];
  participant: string;
  sessionId: string;
  facilitatorOrigin: string | null;
  releasedTime: number;
  release: (time: number) => void;
  set: (patch: Partial<Pick<State, "time" | "selected" | "tab">>) => void;
  log: (type: string, value: string) => void;
};
const params = new URLSearchParams(location.search);
const requestedTime = Number(params.get("time") ?? 840);
const initialTime = Number.isFinite(requestedTime)
  ? Math.max(840, Math.min(905, Math.round(requestedTime)))
  : 840;
const role: Role = params.get("role") === "earth" ? "earth" : "mars";
const condition: Condition =
  params.get("condition") === "A"
    ? "A"
    : params.get("condition") === "B"
      ? "B"
      : "C";
const variant: Variant =
  params.get("variant") === "canonical" ? "canonical" : "primary";
const controllerOrigin = facilitatorOrigin(params.get("facilitatorOrigin"));
export const useMission = create<State>((set, get) => ({
  role,
  condition,
  variant,
  time: initialTime,
  selected: "S1",
  tab: "science",
  records: [],
  participant: (params.get("participant") ?? "").slice(0, 80),
  sessionId: params.get("session")?.slice(0, 80) || crypto.randomUUID(),
  facilitatorOrigin: controllerOrigin,
  releasedTime: controllerOrigin ? initialTime : 905,
  release: (time) => {
    if (!Number.isInteger(time) || time < 840 || time > 905) return;
    set({ releasedTime: Math.max(get().releasedTime, time), time });
    get().log("facilitator-time", String(time));
  },
  set: (patch) => {
    if (patch.time !== undefined && (!Number.isInteger(patch.time)
      || patch.time < 840 || patch.time > get().releasedTime)) return;
    set(patch);
    get().log("interaction", JSON.stringify(patch));
  },
  log: (type, value) => {
    const s = get();
    set({
      records: [
        ...s.records,
        {
          at: new Date().toISOString(),
          scenarioTime: s.time,
          role: s.role,
          condition: s.condition,
          variant: s.variant,
          type,
          value,
        },
      ],
    });
  },
}));
