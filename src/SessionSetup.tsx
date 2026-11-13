import { useState } from "react";
import { useMission } from "./store";
import { conditions } from "./study";
import { variants, clock, type Variant } from "./scenario";
import type { Condition, Role } from "./knowledge";

export function SessionSetup() {
  const current = useMission();
  const [role, setRole] = useState<Role>(current.role);
  const [condition, setCondition] = useState<Condition>(current.condition);
  const [variant, setVariant] = useState<Variant>(current.variant);
  const [time, setTime] = useState(current.time);
  const query = new URLSearchParams({ role, condition, variant, time: String(time) });
  return <details className="session-setup">
    <summary>Explore roles and study modes</summary>
    <p>Open an independent demo session. Current notes remain in this tab. During a pilot, follow the facilitator’s assignment.</p>
    <div className="session-fields">
      <label>Role<select value={role} onChange={e => setRole(e.target.value as Role)}>
        <option value="mars">Astronaut</option><option value="earth">Earth Planner</option>
      </select></label>
      <label>Condition<select value={condition} onChange={e => setCondition(e.target.value as Condition)}>
        {Object.entries(conditions).map(([id, c]) => <option key={id} value={id}>{id} — {c.label}</option>)}
      </select></label>
      <label>Scenario variant<select value={variant} onChange={e => setVariant(e.target.value as Variant)}>
        {Object.entries(variants).map(([id, s]) => <option key={id} value={id}>{s.label}</option>)}
      </select></label>
      <label>Initial time<select value={time} onChange={e => setTime(Number(e.target.value))}>
        {Array.from(new Set([840, 860, 865, 880, 885, 905, time])).sort((a,b) => a-b).map(t => <option key={t} value={t}>{clock(t)}</option>)}
      </select></label>
    </div>
    <a href={`?${query}`} target="_blank" rel="noopener noreferrer">Open independent session ↗</a>
  </details>;
}
