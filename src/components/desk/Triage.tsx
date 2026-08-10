import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, RotateCcw, TriangleAlert } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TOOLS } from "@/lib/desk-data";
import { QUESTIONS, evaluate, type Answers } from "@/lib/desk-triage";

export function Triage() {
  const [answers, setAnswers] = useState<Answers>({});
  const verdict = useMemo(() => evaluate(answers), [answers]);
  const answered = Object.values(answers).filter(Boolean).length;

  return (
    <div className="panel grain rounded-lg p-6 sm:p-9">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label-mono text-brass">Triage console</p>
          <h3 className="mt-3 font-display text-3xl leading-tight text-bone sm:text-4xl">
            Which tool do you actually need?
          </h3>
          <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-muted-foreground">
            Four declared constraints. Deterministic and local — nothing is uploaded, nothing is
            inferred, no account. The desk will also say which tools are wrong for you.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAnswers({})}
          disabled={answered === 0}
          className="label-mono inline-flex items-center gap-2 border border-border px-3 py-2 text-[0.6rem] transition-colors hover:border-brass/50 hover:text-brass disabled:opacity-40"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
        {QUESTIONS.map((q, qi) => (
          <fieldset key={q.key} className="bg-ink-deep p-5 sm:p-6">
            <legend className="label-mono text-brass">
              {String(qi + 1).padStart(2, "0")} · {q.key}
            </legend>
            <p className="mt-2 font-display text-xl leading-snug text-bone">{q.label}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {q.options.map((o) => {
                const active = answers[q.key] === (o.value as never);
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [q.key]: active ? undefined : (o.value as never),
                      }))
                    }
                    className={
                      active
                        ? "border border-brass bg-brass/15 px-3 py-2 text-left text-[0.8rem] text-brass transition-colors"
                        : "border border-border px-3 py-2 text-left text-[0.8rem] text-foreground/80 transition-colors hover:border-brass/50 hover:text-brass"
                    }
                  >
                    <span className="block font-medium">{o.label}</span>
                    <span className="label-mono mt-1 block text-[0.55rem]">{o.note}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {/* Verdict */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        <div
          className={
            verdict.hardStop
              ? "border border-destructive/50 bg-destructive/10 p-6"
              : "panel-brass rounded-lg p-6"
          }
        >
          <p className="label-mono text-brass">Verdict</p>
          <h4 className="mt-3 font-display text-3xl leading-tight text-bone">{verdict.headline}</h4>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-foreground/85">{verdict.detail}</p>

          {verdict.hardStop ? (
            <p className="mt-5 flex gap-3 border-t border-destructive/40 pt-4 text-[0.85rem] leading-relaxed text-foreground/85">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive-foreground" />
              {verdict.hardStop}
            </p>
          ) : null}

          <p className="label-mono mt-6 leading-relaxed">{verdict.handoff}</p>

          {verdict.entry ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/tools/$slug"
                params={{ slug: verdict.entry }}
                className="inline-flex items-center gap-2 border border-brass/50 bg-brass/10 px-4 py-2.5 text-[0.8rem] tracking-wide text-brass transition-colors hover:bg-brass hover:text-primary-foreground"
              >
                Read the entry point
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={TOOLS.find((t) => t.slug === verdict.entry)!.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-2 py-2.5 text-[0.8rem] tracking-wide text-muted-foreground transition-colors hover:text-brass"
              >
                Launch it now
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          ) : null}
        </div>

        <ul className="space-y-3">
          {verdict.ranked.map((r, i) => {
            const tool = TOOLS.find((t) => t.slug === r.slug)!;
            const lead = i === 0 && verdict.entry !== null;
            return (
              <li
                key={r.slug}
                className={
                  lead
                    ? "border border-brass/40 bg-brass/5 p-5 transition-opacity"
                    : "border border-border p-5 opacity-55 transition-opacity"
                }
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-xl leading-tight text-bone">{tool.name}</p>
                  <span className="label-mono text-brass">{r.fit}% fit</span>
                </div>
                <div className="mt-3 h-px w-full bg-border">
                  <div
                    className="h-px bg-brass transition-[width] duration-700"
                    style={{ width: `${r.fit}%` }}
                  />
                </div>
                <p className="mt-3 text-[0.82rem] leading-relaxed text-muted-foreground">
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
