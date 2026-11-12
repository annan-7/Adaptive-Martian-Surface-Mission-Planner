import { useEffect, useState } from "react";
import {
  Compass,
  Radio,
  ArrowUpRight,
  Download,
  Play,
  Pause,
  ChevronRight,
  FlaskConical,
  Clock3,
  Layers3,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { ScienceMap } from "./ScienceMap";
import { useMission } from "./store";
import { project, participantExport, type Knowledge } from "./knowledge";
import { clock, variants } from "./scenario";
import { scienceCards, sources } from "./evidence";
import { conditions, tasks } from "./study";

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="tag">{children}</span>;
}
function ScienceCard({ id }: { id: string }) {
  const card = scienceCards.find((c) => c.id === id) ?? scienceCards[0];
  return (
    <article className="science-card">
      <div className="section-heading">
        <span className="site-number">{card.id}</span>
        <span className="eyebrow">SCIENCE OBJECTIVE</span>
      </div>
      <h2>{card.title}</h2>
      <p className="muted">{card.region}</p>
      <p className="question">{card.question}</p>
      <Tag>{card.evidenceType}</Tag>
      <h3>Reported observation</h3>
      <p>{card.observation}</p>
      <h3>Scientific interpretation</h3>
      <p>{card.interpretation}</p>
      <h3>Uncertainty</h3>
      <p>{card.uncertainty}</p>
      <div className="inset">
        <Tag>SIMULATED_SCENARIO</Tag>
        <h3>Hypothetical EVA activity</h3>
        <p>{card.activity}</p>
        <p>{card.deferred}</p>
      </div>
      <h3>Evidence trail</h3>
      {card.sourceIds.map((id) => {
        const s = sources.find((s) => s.id === id)!;
        return (
          <a
            className="source-link"
            href={s.url}
            key={id}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              {id}
              <small>
                {s.status} · checked {s.accessed}
              </small>
            </span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        );
      })}
    </article>
  );
}
function Messages({ view }: { view: Knowledge }) {
  return (
    <section>
      <h2>Local message records</h2>
      <p className="muted">
        Only received messages and this role’s own actions. Delivery does not
        establish acknowledgment.
      </p>
      {view.messages.map((m) => (
        <article className="message" key={m.id}>
          <div className="row">
            <strong>
              {m.id} · {m.kind}
            </strong>
            <Tag>{m.author === "mars" ? "Astronaut" : "Earth Planner"}</Tag>
          </div>
          <p>{m.text}</p>
          <dl className="facts">
            <dt>Created / observed</dt>
            <dd>{clock(m.created)}</dd>
            <dt>Sent</dt>
            <dd>{m.initialShared ? "Preexisting agreement" : clock(m.sent)}</dd>
            <dt>Local receipt</dt>
            <dd>
              {m.receivedAt === null ? "Own record" : clock(m.receivedAt)}
            </dd>
            {!m.initialShared && (
              <>
                <dt>Scheduled remote arrival</dt>
                <dd>{clock(m.received)} · fixed simulator</dd>
              </>
            )}
            <dt>Delivery evidence</dt>
            <dd>{m.delivery}</dd>
            <dt>Acknowledgment</dt>
            <dd>Not established</dd>
            <dt>Travel assumption</dt>
            <dd>{m.travelAssumption} minutes to S2</dd>
            <dt>Evidence cutoff</dt>
            <dd>{clock(m.cutoff)}</dd>
          </dl>
        </article>
      ))}
    </section>
  );
}
function Options({ view }: { view: Knowledge }) {
  const s = variants[view.variant];
  const log = useMission((x) => x.log);
  const [choice, setChoice] = useState("");
  return (
    <section>
      <h2>Compare the checkpoint</h2>
      <p className="muted">
        Fixed 14:25 analysis using your role’s known estimates. These are not
        current remaining-work predictions.
      </p>
      <Tag>DERIVED_FROM_SIMULATION</Tag>
      <div className="budget-head">
        <div>
          <strong>{s.deadline - s.checkpoint}</strong>
          <span>minutes available</span>
        </div>
        <div>
          <strong>{clock(s.deadline)}</strong>
          <span>fictional deadline</span>
        </div>
        <div>
          <strong>{s.reserve}</strong>
          <span>minutes reserve</span>
        </div>
      </div>
      <p>
        Margin = available − (travel + science + return + reserve). Reserve is a
        scenario rule, not a NASA standard.
      </p>
      {view.options.map((o) => (
        <article className="option" key={o.id}>
          <div className="row">
            <h3>{o.label}</h3>
            <strong className={o.margin < 0 ? "negative" : "positive"}>
              {o.margin > 0 ? "+" : ""}
              {o.margin} min
            </strong>
          </div>
          <p className="arithmetic">
            {o.travel} travel + {o.science} science + {o.return} return +{" "}
            {o.reserve} reserve = <b>{o.total} min</b>
          </p>
          <p>
            {o.margin < 0
              ? "Violates fictional time constraint"
              : "Fits fictional time constraint"}
          </p>
          <p className="muted">
            Retains: {o.retains}. Defers: {o.defers}.
          </p>
          <Button
            size="sm"
            variant={choice === o.id ? "default" : "outline"}
            onClick={() => {
              setChoice(o.id);
              log("option-selected", o.label);
            }}
          >
            {choice === o.id ? "Selected for comparison" : "Consider option"}
          </Button>
        </article>
      ))}
      <p className="caution">
        A positive margin does not prove EVA safety. Life support, radiation,
        physiology and traversability are not validated.
      </p>
    </section>
  );
}
function Review({ view, explain }: { view: Knowledge; explain: boolean }) {
  return (
    <section>
      <h2>Recommendation history</h2>
      <p className="muted">
        Advice is conditional. Evidence age alone does not establish a false
        assumption.
      </p>
      {view.recommendations.map((r) => (
        <article className="message" key={r.id}>
          <div className="row">
            <h3>{r.id} · Earth Planner</h3>
            {explain && <Tag>{r.status}</Tag>}
          </div>
          <p>{r.text}</p>
          <dl className="facts">
            <dt>Created</dt>
            <dd>{clock(r.created)}</dd>
            <dt>Evidence cutoff</dt>
            <dd>{clock(r.cutoff)}</dd>
            <dt>Local receipt</dt>
            <dd>
              {r.receivedAt === null
                ? "Author’s own record"
                : clock(r.receivedAt)}
            </dd>
            <dt>S2 travel assumption</dt>
            <dd>{r.travelAssumption} minutes</dd>
            <dt>Scope</dt>
            <dd>14:25 checkpoint, fictional time rule only</dd>
            <dt>Acknowledgment</dt>
            <dd>Not established</dd>
          </dl>
          {explain && (
            <div className="inset">
              <strong>{r.status}</strong>
              <p>{r.reason}</p>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
function Inspector({ view }: { view: Knowledge }) {
  return (
    <section>
      <h2>S1–S2 segment</h2>
      <Tag>SIMULATED_SCENARIO</Tag>
      {view.observation ? (
        <>
          <h3>Travel assumption changed</h3>
          <p>{view.observation.text}</p>
          <dl className="facts">
            <dt>Old / new travel</dt>
            <dd>20 / {view.travel} minutes</dd>
            <dt>Observer</dt>
            <dd>Astronaut</dd>
            <dt>Observed and sent</dt>
            <dd>14:20</dd>
            <dt>Local receipt</dt>
            <dd>{view.role === "mars" ? "Local observation" : "14:40"}</dd>
            <dt>Affected objective</dt>
            <dd>S2 · Later energetic flooding</dd>
          </dl>
          <p>
            Unknown: real geometry, traversability, crew actions since
            transmission, and all unmodeled safety constraints.
          </p>
        </>
      ) : (
        <p>
          No local change observation available. S2 travel assumption:{" "}
          {view.travel} minutes. Remote conditions are unknown.
        </p>
      )}
    </section>
  );
}
function Study() {
  const state = useMission();
  const [task, setTask] = useState(0);
  const [answer, setAnswer] = useState("");
  const [started, setStarted] = useState<number | null>(null);
  const [workload, setWorkload] = useState("");
  const [confidence, setConfidence] = useState("");
  const [status, setStatus] = useState("");
  return (
    <section>
      <h2>Study notebook</h2>
      <p className="muted">
        Real entries only. No participant results or correctness scores are
        generated.
      </p>
      <label className="field">
        Task
        <select
          value={task}
          onChange={(e) => {
            setTask(Number(e.target.value));
            setStarted(null);
            setAnswer("");
            setStatus("");
          }}
        >
          {tasks.map((_, i) => (
            <option key={i} value={i}>
              Task {i + 1}
            </option>
          ))}
        </select>
      </label>
      <p className="question">{tasks[task]}</p>
      <Button
        variant="outline"
        onClick={() => {
          setStarted(performance.now());
          state.log("task-start", String(task + 1));
          setStatus("Task timer started.");
        }}
      >
        Start task timer
      </Button>
      <label className="field">
        Your explanation and confusion
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your own observation or reasoning"
        />
      </label>
      <label className="field">
        Workload (1 low–7 high)
        <select value={workload} onChange={(e) => setWorkload(e.target.value)}>
          <option value="">Not recorded</option>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <label className="field">
        Confidence (1 low–7 high)
        <select
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
        >
          <option value="">Not recorded</option>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <Button
        disabled={!answer.trim()}
        onClick={() => {
          state.log(
            "task-response",
            JSON.stringify({
              task: task + 1,
              answer,
              elapsedSeconds:
                started === null
                  ? null
                  : Math.round((performance.now() - started) / 1000),
              workload: workload || null,
              confidence: confidence || null,
              correctness: null,
            }),
          );
          setStatus("Entry saved in this session. Export before closing.");
          setAnswer("");
          setStarted(null);
        }}
      >
        Save real entry
      </Button>
      <p role="status">{status}</p>
      <p className="muted">
        Entries stay in memory until exported. Refreshing clears them.
        Facilitator scores correctness separately.
      </p>
    </section>
  );
}
function Provenance() {
  return (
    <section>
      <h2>Source register</h2>
      <p className="muted">
        Checked source claims, interpretations and simulated inputs remain
        distinct.
      </p>
      {sources.map((s) => (
        <article className="message" key={s.id}>
          <Tag>{s.status}</Tag>
          <h3>{s.id}</h3>
          <a href={s.url} target="_blank" rel="noreferrer">
            {s.title}
          </a>
          <p>
            {s.institution} · checked {s.accessed}
          </p>
          <ul>
            {s.claims.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p>
            <b>Instrument:</b> {s.instrument ?? "Unverified"}
          </p>
          <p>
            <b>Acquisition:</b> {s.acquisitionDate ?? "Not established"}
          </p>
          <p>
            <b>Terms:</b> {s.terms}
          </p>
          <p className="caution">{s.caveat}</p>
        </article>
      ))}
    </section>
  );
}

export default function App() {
  const state = useMission();
  const { role, time, variant, condition, selected, tab } = state;
  const view = project(role, time, variant);
  const mode = conditions[condition];
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      const s = useMission.getState();
      if (s.time >= 905) {
        setPlaying(false);
        return;
      }
      s.set({ time: Math.min(905, s.time + 1) });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing]);
  const select = (id: string) => state.set({ selected: id, tab: "science" });
  const exportSession = () => {
    const data = participantExport(view, condition, state.records);
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `mars-compass-${role}-${condition}-${clock(time).replace(":", "")}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const tabs = [
    ["science", "Science"],
    ["messages", "Messages"],
    ["options", "Options"],
    ["review", "Advice"],
    ["study", "Notebook"],
    ["sources", "Sources"],
  ];
  return (
    <>
      <div className="simulation-banner">
        SIMULATED EVA — NOT FOR OPERATIONAL USE{" "}
        <span>Educational prototype · v0.3</span>
      </div>
      <header className="app-header">
        <div className="brand">
          <Compass size={30} aria-hidden="true" />
          <div>
            <h1>MARS COMPASS</h1>
            <span>SCIENCE / CONTEXT / DECISIONS</span>
          </div>
        </div>
        <div className="header-meta">
          <span>
            <span className="status-dot" />{" "}
            {role === "mars" ? "Astronaut" : "Earth Planner"}
          </span>
          <span>
            Condition {condition} · {mode.label}
          </span>
          <Button variant="outline" size="sm" onClick={exportSession}>
            <Download size={15} aria-hidden="true" />
            Export session
          </Button>
        </div>
      </header>
      <div className="mission-strip">
        <div>
          <span className="eyebrow">JEZERO FIELD STUDY</span>
          <strong>Evidence before decisions.</strong>
        </div>
        <div className="connection">
          <Radio size={18} aria-hidden="true" />
          <span>
            20 min one-way delay
            <small>
              Fixed simulation · {view.lastReceivedAge} min since last received
              data
            </small>
          </span>
        </div>
        <div>
          <span className="eyebrow">SCENARIO VARIANT</span>
          <span>{variants[variant].label}</span>
        </div>
      </div>
      <main className="workspace">
        <div className="spatial-column">
          <ScienceMap onSelect={() => select("S1")} />
          <section className="route-panel">
            <div className="row">
              <div>
                <span className="eyebrow">SIMULATED_SCENARIO</span>
                <h2>SCHEMATIC ROUTE — NOT GEOREFERENCED</h2>
              </div>
              <Tag>No distance scale</Tag>
            </div>
            <div className="route-track">
              <button
                onClick={() => state.set({ tab: "options" })}
                className="route-node"
              >
                <span>H</span>
                <b>Return point</b>
                <small>Fictional</small>
              </button>
              <div className="route-line" />
              <button
                onClick={() => select("S1")}
                className={
                  "route-node " + (selected === "S1" ? "selected" : "")
                }
              >
                <span>S1</span>
                <b>Delta deposition</b>
                <small>Science reference</small>
              </button>
              <button
                className={
                  "segment " +
                  (mode.dependencies && view.observation ? "changed" : "")
                }
                onClick={() => state.set({ tab: "inspector" })}
              >
                <span>{view.travel} min travel</span>
                {mode.dependencies && view.observation ? (
                  <small>Changed assumption · inspect</small>
                ) : (
                  <small>Inspect segment</small>
                )}
                <ChevronRight size={18} aria-hidden="true" />
              </button>
              <button
                onClick={() => select("S2")}
                className={
                  "route-node " + (selected === "S2" ? "selected" : "")
                }
              >
                <span>S2</span>
                <b>Energetic flooding</b>
                <small>Science reference</small>
              </button>
            </div>
            <p className="muted">
              Reference features are not established EVA waypoints. Reachability
              between real outcrops is unknown.
            </p>
          </section>
          <section className="clock-panel">
            <div className="row">
              <div className="clock-readout">
                <Clock3 size={20} aria-hidden="true" />
                <strong>{clock(time)}</strong>
                <span>fictional clock</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPlaying(!playing)}
              >
                {playing ? (
                  <Pause size={14} aria-hidden="true" />
                ) : (
                  <Play size={14} aria-hidden="true" />
                )}
                {playing ? "Pause" : "Play"} · 1 min/s
              </Button>
            </div>
            <label className="sr-only" htmlFor="scenario-clock">
              Scenario time
            </label>
            <input
              id="scenario-clock"
              type="range"
              min="840"
              max="905"
              step="1"
              value={time}
              onChange={(e) => {
                setPlaying(false);
                state.set({ time: Number(e.target.value) });
              }}
            />
            <div className="clock-stops">
              {[840, 860, 865, 880, 885, 905].map((t) => (
                <button
                  key={t}
                  aria-pressed={time === t}
                  onClick={() => {
                    setPlaying(false);
                    state.set({ time: t });
                  }}
                >
                  {clock(t)}
                </button>
              ))}
            </div>
            <p className="muted">
              Historical knowledge view · advance only on facilitator cue during
              a study.
            </p>
          </section>
          {mode.timeline && (
            <section className="timeline">
              <div className="section-heading">
                <Layers3 size={17} aria-hidden="true" />
                <h2>Local chronology</h2>
              </div>
              {view.messages.map((m) => (
                <div className="timeline-event" key={m.id}>
                  <time>{clock(m.receivedAt ?? m.created)}</time>
                  <span>
                    <b>{m.id}</b> · {m.delivery}
                  </span>
                </div>
              ))}
            </section>
          )}
        </div>
        <aside className="detail-panel">
          <nav className="detail-tabs" aria-label="Mission details">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                aria-current={tab === id ? "page" : undefined}
                onClick={() => state.set({ tab: id })}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="detail-body">
            {tab === "science" && (
              <>
                <div className="site-switch">
                  <Button
                    variant={selected === "S1" ? "default" : "outline"}
                    size="sm"
                    onClick={() => select("S1")}
                  >
                    <FlaskConical size={14} aria-hidden="true" />
                    S1 · Deposition
                  </Button>
                  <Button
                    variant={selected === "S2" ? "default" : "outline"}
                    size="sm"
                    onClick={() => select("S2")}
                  >
                    S2 · Flooding
                  </Button>
                </div>
                <ScienceCard id={selected} />
              </>
            )}
            {tab === "messages" && <Messages view={view} />}{" "}
            {tab === "options" && <Options view={view} />}{" "}
            {tab === "review" && (
              <Review view={view} explain={mode.dependencies} />
            )}{" "}
            {tab === "inspector" && <Inspector view={view} />}{" "}
            {tab === "study" && <Study />} {tab === "sources" && <Provenance />}
          </div>
        </aside>
      </main>
      <footer>
        Research prototype · hypothesis unproven{" "}
        <span>Real geology / fictional EVA / explicit uncertainty</span>
      </footer>
    </>
  );
}
