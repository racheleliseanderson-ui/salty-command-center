import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, RotateCcw, TriangleAlert, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TOOLS } from "@/lib/desk-data";
import { QUESTIONS, evaluate } from "@/lib/desk-triage";
import { useTriageState } from "@/hooks/use-triage-state";

export function Triage() {
  const { answers, setAnswer, reset } = useTriageState();
  const verdict = useMemo(() => evaluate(answers), [answers]);
  const answered = Object.values(answers).filter(Boolean).length;

  const prevTop = useRef<string | null>(null);
  const [changed, setChanged] = useState<string | null>(null);

  useEffect(() => {
    const top = verdict.entry;
    if (top && prevTop.current && prevTop.current !== top) {
      const tool = TOOLS.find((t) => t.slug === top);
      setChanged(
        `Now start at ${tool?.name} instead — your last answer changed which constraint matters most.`,
      );
    } else if (!top) {
      setChanged(null);
    }
    prevTop.current = top;
  }, [verdict.entry]);

  return (
    <div className="panel grain min-w-0 overflow-hidden rounded-lg p-5 sm:p-9">
      <div className="grid min-w-0 gap-4 sm:flex sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="label-mono text-brass">Find your starting point</p>
          <h3 className="mt-3 font-display text-2xl leading-tight text-bone sm:text-4xl">
            Which tool do you actually need?
          </h3>
          <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-muted-foreground">
            Four questions about the night you are planning. Your answers stay on this device —
            nothing is uploaded, nothing is guessed at, no account.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="label-mono">
            {answered} of {QUESTIONS.length} answered
          </span>
          <button
            type="button"
            onClick={reset}
            disabled={answered === 0}
            className="press label-mono inline-flex min-h-11 items-center gap-2 border border-border px-3 text-[0.6rem] transition-colors hover:border-brass/50 hover:text-brass disabled:opacity-40"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>

      <div className="mt-4 h-px w-full bg-border">
        <div
          className="h-px bg-brass transition-[width] duration-500"
          style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="mt-8 grid min-w-0 gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
        {QUESTIONS.map((q, qi) => (
          <fieldset key={q.key} className="min-w-0 bg-ink-deep p-4 sm:p-6">
            <legend className="label-mono text-brass">
              Question {qi + 1}
            </legend>
            <p className="mt-2 font-display text-lg leading-snug text-bone sm:text-xl">{q.label}</p>
            <div className="mt-4 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
              {q.options.map((o) => {
                const active = answers[q.key] === (o.value as never);
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setAnswer(q.key, active ? undefined : (o.value as never))}
                    className={
                      active
                        ? "press flex min-h-11 min-w-0 items-start gap-2 border border-brass bg-brass/15 px-3 py-2.5 text-left text-[0.8rem] text-brass"
                        : "press flex min-h-11 min-w-0 items-start gap-2 border border-border px-3 py-2.5 text-left text-[0.8rem] text-foreground/80 hover:border-brass/50 hover:text-brass"
                    }
                  >
                    {active ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : null}
                    <span className="min-w-0">
                      <span className="block font-medium break-words">{o.label}</span>
                      <span className="label-mono mt-1 block text-[0.55rem] break-words">{o.note}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div
          aria-live="polite"
          className={
            verdict.hardStop
              ? "min-w-0 overflow-hidden border border-destructive/50 bg-destructive/10 p-5 sm:p-6"
              : "panel-brass min-w-0 overflow-hidden rounded-lg p-5 sm:p-6"
          }
        >
          <p className="label-mono text-brass">Where to start</p>
          <h4 className="mt-3 font-display text-2xl leading-tight text-bone sm:text-3xl">
            {verdict.headline}
          </h4>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-foreground/85 break-words">
            {verdict.detail}
          </p>

          {verdict.hardStop ? (
            <p className="mt-5 flex gap-3 border-t border-destructive/40 pt-4 text-[0.85rem] leading-relaxed text-foreground/85">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive-foreground" />
              <span className="min-w-0 break-words">
                <span className="label-mono block text-[0.58rem]">Why this will not work as described</span>
                {verdict.hardStop}
              </span>
            </p>
          ) : null}

          {changed ? (
            <p className="label-mono mt-5 border-l border-brass/60 pl-3 leading-relaxed text-brass break-words">
              {changed}
            </p>
          ) : null}

          <p className="label-mono mt-6 leading-relaxed break-words">{verdict.handoff}</p>

          {verdict.entry ? (
            <div className="mt-6 flex min-w-0 flex-wrap gap-3">
              <Link
                to="/tools/$slug"
                params={{ slug: verdict.entry }}
                className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 border border-brass/50 bg-brass/10 px-4 text-[0.8rem] tracking-wide text-brass transition-colors hover:bg-brass hover:text-primary-foreground"
              >
                Read about this tool
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
              <a
                href={TOOLS.find((t) => t.slug === verdict.entry)!.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 px-2 text-[0.8rem] tracking-wide text-muted-foreground transition-colors hover:text-brass"
              >
                Launch it now
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          ) : null}
        </div>

        <ul className="min-w-0 space-y-3">
          {verdict.ranked.map((r, i) => {
            const tool = TOOLS.find((t) => t.slug === r.slug)!;
            const lead = i === 0 && verdict.entry !== null;
            return (
              <li
                key={r.slug}
                className={
                  lead
                    ? "min-w-0 overflow-hidden border border-brass/40 bg-brass/5 p-4 sm:p-5"
                    : "min-w-0 overflow-hidden border border-dashed border-border p-4 opacity-70 sm:p-5"
                }
              >
                <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="min-w-0 font-display text-lg leading-tight text-bone break-words sm:text-xl">
                    {tool.name}
                  </p>
                  <span className="label-mono flex shrink-0 items-center gap-1.5 text-brass">
                    {lead ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {lead ? "Start here" : "Not this one"} · {r.fit}%
                  </span>
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden bg-border">
                  <div
                    className={
                      lead
                        ? "h-1 bg-brass transition-[width] duration-700"
                        : "h-1 fit-hatch transition-[width] duration-700"
                    }
                    style={{ width: `${r.fit}%` }}
                  />
                </div>
                <p className="mt-3 text-[0.82rem] leading-relaxed text-muted-foreground break-words">
                  {r.reason}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
