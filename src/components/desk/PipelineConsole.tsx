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
      <div className="grid gap-6 border-b border-border p-5 sm:p-8">
        <div className="min-w-0">
          <p className="label-mono text-brass">Plan the night</p>
          <h3 className="mt-3 font-display text-3xl leading-[0.95] text-bone sm:text-5xl">
            Six steps.
            <span className="block text-brass">None skipped.</span>
          </h3>
          <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
            Start planning and take the steps in order: guests & constraints, menu, stress-test the
            night, share with Occasions, then the service window. We'll stop rather than guess —
            the plan will not advance until a real requirement is signed. Local, no account.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {idle || stopped ? (
            <Control onClick={start} tone="primary" icon={<Play className="h-4 w-4" />}>
              {stopped ? "Start a new plan" : "Start planning"}
            </Control>
          ) : (
            <>
              <Control
                onClick={advance}
                tone={blocking.length ? "blocked" : "primary"}
                icon={<SkipForward className="h-4 w-4" />}
                disabled={run.status === "held"}
              >
                {run.stage === STAGES.length - 1 ? "Finish this plan" : "Confirm & continue"}
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
            Download this plan (text)
          </Control>
          <Control
            onClick={() => exportPackage("json")}
            icon={<Download className="h-3.5 w-3.5" />}
            disabled={idle}
          >
            Download this plan (JSON)
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
          v={`${active.name}`}
          note={`Owner: ${active.owner} · ${active.duration}`}
        />
        <Readout k="Steps signed" v={`${signed} of ${STAGES.length} steps cleared`} note={`${Object.values(run.gates).filter(Boolean).length} individual sign-offs on record`} />
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
              <span className="label-mono block text-[0.58rem]">More information needed · {active.name}</span>
              {blocking.length} requirement{blocking.length > 1 ? "s" : ""} not confirmed yet:{" "}
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
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg leading-tight text-bone">{s.name}</span>
                <span className="label-mono text-[0.55rem]">{cleared ? "Cleared" : current ? "In progress" : "Waiting"}</span>
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
        note={run.notes[STAGES[open]!.id] ?? ""}
        evidence={run.evidence[STAGES[open]!.id] ?? []}
        onNote={setNote}
        onNoteCommit={logNote}
        onAttach={addEvidence}
        onRemove={removeEvidence}
      />


      {/* ── Run log ───────────────────────────────────────────── */}
      <div className="border-t border-border p-5 sm:p-8">
        <p className="label-mono text-brass">Plan log</p>
        {run.log.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Empty. Every control and sign-off is recorded here, on this device. Add information to begin.
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
  note,
  evidence,
  onNote,
  onNoteCommit,
  onAttach,
  onRemove,
}: {
  index: number;
  gates: Record<string, boolean>;
  editable: boolean;
  onToggle: (id: string, label: string) => void;
  note: string;
  evidence: Evidence[];
  onNote: (stageId: string, text: string) => void;
  onNoteCommit: (stageId: string, code: string) => void;
  onAttach: (
    stageId: string,
    code: string,
    gateId: string | null,
    files: FileList | File[],
  ) => void | Promise<void>;
  onRemove: (stageId: string, id: string, code: string) => void;
}) {

  const stage = STAGES[index]!;
  const tool = stage.tool === "desk" ? null : TOOL_BY_SLUG[stage.tool];

  return (
    <div className="grid gap-px bg-border lg:grid-cols-[1fr_1.15fr]">
      <div className="bg-surface p-5 sm:p-8">
        <p className="label-mono text-brass">
          {stage.owner}
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
              Open this step
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <p className="label-mono mt-7 leading-relaxed">Stays on this desk — no other tool needed for this step.</p>
        )}
      </div>

      <fieldset className="bg-ink-deep p-5 sm:p-8">
        <legend className="label-mono text-brass">What must be true</legend>
        <p className="mt-2 max-w-[52ch] text-[0.83rem] leading-relaxed text-muted-foreground">
          Sign each requirement you have actually satisfied. We'll stop rather than guess on the
          ones marked required; the others are recorded and let the plan continue.
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
                      {g.hard ? "Required · we'll stop rather than guess" : "Optional · recorded"}
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

      <EvidencePanel
        stage={stage}
        editable={editable}
        note={note}
        evidence={evidence}
        onNote={onNote}
        onNoteCommit={onNoteCommit}
        onAttach={onAttach}
        onRemove={onRemove}
      />
    </div>
  );
}

/**
 * First-party evidence for the open stage: a note field and attachments that can
 * be tied to a specific gate decision. Files stay on this device; small ones are
 * copied into the exported packet, larger ones are recorded by reference only.
 */
function EvidencePanel({
  stage,
  editable,
  note,
  evidence,
  onNote,
  onNoteCommit,
  onAttach,
  onRemove,
}: {
  stage: (typeof STAGES)[number];
  editable: boolean;
  note: string;
  evidence: Evidence[];
  onNote: (stageId: string, text: string) => void;
  onNoteCommit: (stageId: string, code: string) => void;
  onAttach: (
    stageId: string,
    code: string,
    gateId: string | null,
    files: FileList | File[],
  ) => void | Promise<void>;
  onRemove: (stageId: string, id: string, code: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tie, setTie] = useState<string>("");

  return (
    <div className="bg-surface p-5 sm:p-8 lg:col-span-2">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <label htmlFor={`note-${stage.id}`} className="label-mono text-brass">
            {stage.name} · note
          </label>
          <p className="mt-2 max-w-[52ch] text-[0.83rem] leading-relaxed text-muted-foreground">
            What you observed, what you decided, and why. First-party only — this is your record of
            the step, not a guarantee from the suite.
          </p>
          <textarea
            id={`note-${stage.id}`}
            value={note}
            disabled={!editable}
            onChange={(e) => onNote(stage.id, e.target.value)}
            onBlur={() => onNoteCommit(stage.id, stage.name)}
            rows={6}
            placeholder="e.g. 14 covers fixed, family style. Oven single-rack, so the anchor bakes before service."
            className="mt-4 w-full resize-y border border-border bg-ink-deep p-3 text-[0.86rem] leading-relaxed text-bone placeholder:text-muted-foreground/70 focus:border-brass focus:outline-none disabled:opacity-50"
          />
          <p className="label-mono mt-2 text-[0.55rem]">
            {note.trim().length} characters · saved on this device
          </p>
        </div>

        <div>
          <p className="label-mono text-brass">Evidence attachments</p>
          <p className="mt-2 max-w-[52ch] text-[0.83rem] leading-relaxed text-muted-foreground">
            Attach a photo, receipt, timing sheet or supplier note and tie it to the decision it settles.
            Nothing is uploaded. Files under 1 MB travel inside the downloaded plan; larger ones are
            listed by name, size and type.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <label htmlFor={`tie-${stage.id}`} className="label-mono text-[0.55rem]">
                Tie to decision
              </label>
              <select
                id={`tie-${stage.id}`}
                value={tie}
                disabled={!editable}
                onChange={(e) => setTie(e.target.value)}
                className="tap mt-1 w-full border border-border bg-ink-deep p-2 text-[0.83rem] text-bone focus:border-brass focus:outline-none disabled:opacity-50"
              >
                <option value="">This step — no single requirement</option>
                {stage.gates.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.hard ? "Required" : "Optional"} · {g.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={!editable}
              onClick={() => fileRef.current?.click()}
              className="press tap inline-flex items-center justify-center gap-2 border border-brass/50 px-4 py-2 text-[0.8rem] tracking-wide text-brass transition-colors hover:bg-brass hover:text-primary-foreground disabled:opacity-40"
            >
              <Paperclip className="h-4 w-4" />
              Attach files
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length) void onAttach(stage.id, stage.name, tie || null, files);
              e.target.value = "";
            }}
          />

          {evidence.length === 0 ? (
            <p className="mt-5 border-l border-border pl-4 text-[0.83rem] leading-relaxed text-muted-foreground">
              No notes on this step yet. A signed requirement with no attachment is still signed —
              it just carries less weight in the plan.
            </p>
          ) : (
            <ul className="mt-5 divide-y divide-border border-t border-border">
              {evidence.map((e) => {
                const gate = stage.gates.find((g) => g.id === e.gateId);
                return (
                  <li key={e.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[0.86rem] text-bone">{e.name}</p>
                      <p className="label-mono mt-1 text-[0.55rem]">
                        {formatBytes(e.size)} · {e.type || "unknown type"} · {e.addedAt} ·{" "}
                        {e.dataUrl ? "in this plan" : "by name only"}
                      </p>
                      <p className="mt-1 text-[0.79rem] leading-relaxed text-muted-foreground">
                        {gate ? `Tied to: ${gate.label}` : "Step-level note"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {e.dataUrl ? (
                        <a
                          href={e.dataUrl}
                          download={e.name}
                          className="press tap inline-flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-brass/50 hover:text-brass"
                          aria-label={`Download ${e.name}`}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      ) : null}
                      <button
                        type="button"
                        disabled={!editable}
                        onClick={() => onRemove(stage.id, e.id, stage.name)}
                        aria-label={`Withdraw ${e.name}`}
                        className="press tap inline-flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive-foreground disabled:opacity-40"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
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
            ? "Six steps, from the constraints you declare through to the service window."
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
