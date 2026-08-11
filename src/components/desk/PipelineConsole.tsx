import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Check,
  CircleDot,
  Download,
  FileText,
  Lock,
  Paperclip,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Square,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  STAGES,
  blockingGates,
  formatBytes,
  statusCopy,
  type Evidence,
} from "@/lib/desk-pipeline";
import { usePipelineRun } from "@/hooks/use-pipeline-run";
import { TOOLS } from "@/lib/desk-data";

const TOOL_BY_SLUG = Object.fromEntries(TOOLS.map((t) => [t.slug, t]));


export function PipelineConsole() {
  const {
    run,
    hydrated,
    start,
    advance,
    rewind,
    hold,
    abort,
    reset,
    toggleGate,
    setNote,
    logNote,
    addEvidence,
    removeEvidence,
    exportPackage,
  } = usePipelineRun();
  const [open, setOpen] = useState(0);


  useEffect(() => setOpen(run.stage), [run.stage]);

  const active = STAGES[run.stage]!;
  const blocking = useMemo(() => blockingGates(active, run.gates), [active, run.gates]);
  const signed = run.status === "complete" ? STAGES.length : run.stage;
  const idle = run.status === "idle";
  const stopped = run.status === "aborted" || run.status === "complete";
  const status = statusCopy(run.status);
  const pct = run.status === "complete" ? 100 : Math.round((run.stage / STAGES.length) * 100);

  return (
    <div className="panel grain rounded-lg">
      {/* ── Transport bar ─────────────────────────────────────── */}
      <div className="grid gap-5 border-b border-border p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <p className="label-mono text-brass">Pipeline run console</p>
          <h3 className="mt-3 font-display text-3xl leading-[0.95] text-bone sm:text-5xl">
            Six stages.
            <span className="block text-brass">No stage skipped.</span>
          </h3>
          <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
            Open a run and take the stages in order. Hard gates refuse rather than warn — the run
            will not advance until they are signed. Local, deterministic, no account.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {idle || stopped ? (
            <Control onClick={start} tone="primary" icon={<Play className="h-4 w-4" />}>
              {stopped ? "Open a new run" : "Open run"}
            </Control>
          ) : (
            <>
              <Control
                onClick={advance}
                tone={blocking.length ? "blocked" : "primary"}
                icon={<SkipForward className="h-4 w-4" />}
                disabled={run.status === "held"}
              >
                {run.stage === STAGES.length - 1 ? "Close run" : "Sign off & advance"}
              </Control>
              <Control onClick={rewind} icon={<SkipBack className="h-4 w-4" />} disabled={run.stage === 0}>
                Reopen previous
              </Control>
              <Control
                onClick={hold}
                icon={run.status === "held" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              >
                {run.status === "held" ? "Release hold" : "Hold"}
              </Control>
              <Control onClick={abort} tone="stop" icon={<Square className="h-4 w-4" />}>
                Stand down
              </Control>
            </>
          )}
          <Control
            onClick={() => exportPackage("markdown")}
            icon={<FileText className="h-3.5 w-3.5" />}
            disabled={idle}
          >
            Export packet (MD)
          </Control>
          <Control
            onClick={() => exportPackage("json")}
            icon={<Download className="h-3.5 w-3.5" />}
            disabled={idle}
          >
            Export packet (JSON)
          </Control>
          <Control onClick={reset} icon={<RotateCcw className="h-3.5 w-3.5" />} disabled={idle}>
            Clear
          </Control>

        </div>
      </div>

      {/* ── Status strip ──────────────────────────────────────── */}
      <div className="grid gap-px border-b border-border bg-border sm:grid-cols-4">
        <Readout k="Status" v={status.label} note={status.note} live={run.status === "running"} />
        <Readout
          k="Stage"
          v={`${active.code} · ${active.name}`}
          note={`Owner: ${active.owner} · ${active.duration}`}
        />
        <Readout k="Gates signed" v={`${signed} of ${STAGES.length} stages cleared`} note={`${Object.values(run.gates).filter(Boolean).length} individual sign-offs on record`} />
        <Readout k="Opened" v={hydrated ? (run.startedAt ?? "—") : "—"} note="Local clock, this device only" />
      </div>

      <div className="h-[3px] w-full bg-border">
        <div
          className="h-[3px] bg-brass transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* ── Refusal notice ────────────────────────────────────── */}
      <div aria-live="polite" className="px-5 sm:px-8">
        {!idle && !stopped && blocking.length > 0 ? (
          <p className="mt-6 flex gap-3 border border-destructive/50 bg-destructive/10 p-4 text-[0.85rem] leading-relaxed text-foreground/85">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive-foreground" />
            <span>
              <span className="label-mono block text-[0.58rem]">Blocked · {active.code}</span>
              {blocking.length} hard gate{blocking.length > 1 ? "s" : ""} unsigned:{" "}
              {blocking.map((g) => g.label).join(" · ")}
            </span>
          </p>
        ) : null}
        {run.status === "aborted" ? (
          <p className="label-mono mt-6 border-l border-destructive pl-4 leading-relaxed text-foreground/80">
            Stood down. That is a result, not a failure — Restaurant Intelligence ranks the room instead.
          </p>
        ) : null}
      </div>

      {/* ── Stage rail ────────────────────────────────────────── */}
      <ol className="snap-rail flex gap-px overflow-x-auto border-y border-border bg-border sm:grid sm:grid-cols-6 sm:overflow-visible">
        {STAGES.map((s, i) => {
          const cleared = run.status === "complete" || i < run.stage;
          const current = i === run.stage && !idle;
          return (
            <li key={s.id} className="min-w-[9.5rem] shrink-0 sm:min-w-0">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-current={current ? "step" : undefined}
                className={`press tap flex h-full w-full flex-col items-start gap-2 p-4 text-left transition-colors ${
                  open === i ? "bg-brass/12" : "bg-surface hover:bg-brass/5"
                }`}
              >
                <span className="label-mono flex items-center gap-1.5 text-brass">
                  {cleared ? <Check className="h-3 w-3" /> : current ? <CircleDot className="h-3 w-3" /> : <Lock className="h-3 w-3 opacity-60" />}
                  {s.code}
                </span>
                <span className="font-display text-lg leading-tight text-bone">{s.name}</span>
                <span className="label-mono text-[0.55rem]">{cleared ? "Cleared" : current ? "Open" : "Waiting"}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* ── Open stage detail ─────────────────────────────────── */}
      <StageDetail
        index={open}
        gates={run.gates}
        editable={!idle && !stopped}
        onToggle={toggleGate}
      />

      {/* ── Run log ───────────────────────────────────────────── */}
      <div className="border-t border-border p-5 sm:p-8">
        <p className="label-mono text-brass">Run log</p>
        {run.log.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Empty. Every control and sign-off is recorded here, on this device.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border border-t border-border">
            {run.log.map((entry, i) => (
              <li key={`${entry.at}-${i}`} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 py-3">
                <span className="label-mono shrink-0 text-[0.58rem]">{entry.at}</span>
                <span
                  className={`text-[0.83rem] leading-relaxed ${
                    entry.kind === "stop" ? "text-destructive-foreground" : "text-foreground/80"
                  }`}
                >
                  {entry.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StageDetail({
  index,
  gates,
  editable,
  onToggle,
}: {
  index: number;
  gates: Record<string, boolean>;
  editable: boolean;
  onToggle: (id: string, label: string) => void;
}) {
  const stage = STAGES[index]!;
  const tool = stage.tool === "desk" ? null : TOOL_BY_SLUG[stage.tool];

  return (
    <div className="grid gap-px bg-border lg:grid-cols-[1fr_1.15fr]">
      <div className="bg-surface p-5 sm:p-8">
        <p className="label-mono text-brass">
          {stage.code} · {stage.owner}
        </p>
        <h4 className="mt-3 font-display text-3xl leading-tight text-bone">{stage.name}</h4>
        <p className="mt-4 font-display text-xl leading-snug text-brass/90">{stage.decision}</p>
        <dl className="mt-6 space-y-3 border-l border-brass/30 pl-4 text-[0.83rem]">
          <div>
            <dt className="label-mono">Produces</dt>
            <dd className="text-foreground/80">{stage.produces}</dd>
          </div>
          <div>
            <dt className="label-mono">Typical window</dt>
            <dd className="text-foreground/80">{stage.duration}</dd>
          </div>
        </dl>

        {tool ? (
          <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
            <Link
              to="/tools/$slug"
              params={{ slug: tool.slug }}
              className="press tap inline-flex items-center justify-center gap-2 border border-brass/50 px-4 text-[0.8rem] tracking-wide text-brass transition-colors hover:bg-brass hover:text-primary-foreground"
            >
              {tool.name} record
            </Link>
            <a
              href={tool.href}
              target="_blank"
              rel="noreferrer"
              className="press tap inline-flex items-center justify-center gap-2 px-2 text-[0.8rem] tracking-wide text-muted-foreground transition-colors hover:text-brass"
            >
              Run the stage
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <p className="label-mono mt-7 leading-relaxed">Held at the desk — no tool leaves this stage.</p>
        )}
      </div>

      <fieldset className="bg-ink-deep p-5 sm:p-8">
        <legend className="label-mono text-brass">Stage gates</legend>
        <p className="mt-2 max-w-[52ch] text-[0.83rem] leading-relaxed text-muted-foreground">
          Sign each gate you have actually satisfied. Hard gates block the advance; soft gates are
          recorded and let the run continue.
        </p>
        <ul className="mt-5 space-y-2">
          {stage.gates.map((g) => {
            const on = gates[g.id] === true;
            return (
              <li key={g.id}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  disabled={!editable}
                  onClick={() => onToggle(g.id, g.label)}
                  className={`press tap grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-3 border p-3 text-left transition-colors disabled:opacity-50 ${
                    on
                      ? "border-brass bg-brass/12"
                      : g.hard
                        ? "border-destructive/40 hover:border-brass/50"
                        : "border-border hover:border-brass/50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${
                      on ? "border-brass bg-brass text-primary-foreground" : "border-border"
                    }`}
                  >
                    {on ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="label-mono block text-[0.55rem]">
                      {g.hard ? "Hard gate · refuses" : "Soft gate · recorded"}
                    </span>
                    <span className={`mt-1 block text-[0.88rem] leading-snug ${on ? "text-brass" : "text-bone"}`}>
                      {g.label}
                    </span>
                    <span className="mt-1 block text-[0.79rem] leading-relaxed text-muted-foreground">
                      {g.detail}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}

function Readout({ k, v, note, live }: { k: string; v: string; note: string; live?: boolean }) {
  return (
    <div className="bg-surface px-5 py-5">
      <p className="label-mono flex items-center gap-2 text-brass">
        {live ? (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-live/60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-live" />
          </span>
        ) : null}
        {k}
      </p>
      <p className="mt-2 font-display text-xl leading-tight text-bone">{v}</p>
      <p className="mt-1 text-[0.76rem] leading-snug text-muted-foreground">{note}</p>
    </div>
  );
}

function Control({
  children,
  onClick,
  icon,
  tone,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
  tone?: "primary" | "stop" | "blocked";
  disabled?: boolean;
}) {
  const base =
    "press tap inline-flex items-center justify-center gap-2 border px-4 text-[0.78rem] tracking-wide transition-colors disabled:opacity-40";
  const skin =
    tone === "primary"
      ? "border-brass bg-brass text-primary-foreground hover:bg-bone"
      : tone === "stop"
        ? "border-destructive/50 text-destructive-foreground hover:bg-destructive/15"
        : tone === "blocked"
          ? "border-dashed border-brass/50 text-brass hover:bg-brass/10"
          : "border-border text-foreground/80 hover:border-brass/50 hover:text-brass";
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${skin}`}>
      {icon}
      {children}
    </button>
  );
}

/**
 * Compact run strip for pages that are not the console: shows the open stage,
 * gate pressure, and the two controls that matter without leaving the page.
 */
export function PipelineStrip() {
  const { run, start, advance, hold } = usePipelineRun();
  const active = STAGES[run.stage]!;
  const blocking = blockingGates(active, run.gates);
  const idle = run.status === "idle";
  const stopped = run.status === "aborted" || run.status === "complete";
  const status = statusCopy(run.status);

  return (
    <div className="panel grid gap-5 rounded-lg p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0">
        <p className="label-mono flex items-center gap-2 text-brass">
          {run.status === "running" ? (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-live/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-live" />
            </span>
          ) : null}
          Run status · {status.label}
        </p>
        <p className="mt-3 font-display text-2xl leading-tight text-bone sm:text-3xl">
          {idle
            ? "No run open. Six stages waiting."
            : stopped
              ? status.note
              : `${active.code} · ${active.name} — ${active.decision}`}
        </p>
        <p className="mt-2 text-[0.84rem] leading-relaxed text-muted-foreground">
          {idle || stopped
            ? "The pipeline runs from declared constraints to the service window, gate by gate."
            : blocking.length > 0
              ? `${blocking.length} hard gate${blocking.length > 1 ? "s" : ""} unsigned. The run will refuse to advance.`
              : "All hard gates signed. This stage can be closed."}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {idle || stopped ? (
          <Control onClick={start} tone="primary" icon={<Play className="h-4 w-4" />}>
            Open run
          </Control>
        ) : (
          <>
            <Control
              onClick={advance}
              tone={blocking.length ? "blocked" : "primary"}
              icon={<SkipForward className="h-4 w-4" />}
              disabled={run.status === "held"}
            >
              Advance
            </Control>
            <Control
              onClick={hold}
              icon={run.status === "held" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            >
              {run.status === "held" ? "Release" : "Hold"}
            </Control>
          </>
        )}
        <Link
          to="/pipeline"
          className="press tap inline-flex items-center justify-center gap-2 px-2 text-[0.8rem] tracking-wide text-muted-foreground transition-colors hover:text-brass"
        >
          Open the console
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
