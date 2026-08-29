import { ArrowUpRight } from "lucide-react";

import { compareHostAndDine, type Lean } from "@/lib/desk-compare";
import { TOOLS } from "@/lib/desk-data";
import type { Answers } from "@/lib/desk-triage";

const LEAN_COPY: Record<Lean, { label: string; className: string }> = {
  host: { label: "Easier at home", className: "text-emerald-300/90" },
  dine: { label: "Easier out", className: "text-sky-300/90" },
  even: { label: "About even", className: "text-muted-foreground" },
  unknown: { label: "Not enough to say", className: "text-muted-foreground" },
};

/**
 * Host vs. dine.
 *
 * No score, no percentage, no verdict bar. Two columns of real burden, a plain
 * lean on each line, an honest list of what the desk cannot judge yet, and one
 * recommended next investigation. A number here would be a guess wearing a
 * uniform.
 */
export function HostVsDine({ answers, hardStop }: { answers: Answers; hardStop?: string }) {
  const comparison = compareHostAndDine(answers, hardStop);
  const tool = TOOLS.find((t) => t.slug === comparison.next.tool);

  return (
    <section
      aria-label="Hosting compared with dining out"
      className="panel min-w-0 overflow-hidden rounded-lg"
    >
      <div className="min-w-0 border-b border-border/60 px-5 py-6 sm:px-8">
        <p className="label-mono text-brass">Host or dine</p>
        <h2 className="mt-3 font-display text-2xl leading-snug text-bone sm:text-3xl">
          What each night actually costs you
        </h2>
        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
          Not a score. The two nights aren't comparable on one axis — hosting spends your
          attention and your kitchen, going out spends money and confirmation calls. Here is what
          you'd be trading, from what you've told the desk.
        </p>
      </div>

      {comparison.hardStop && (
        <p className="border-b border-border/60 bg-ink px-5 py-4 text-sm leading-relaxed text-amber-200/90 sm:px-8">
          {comparison.hardStop}
        </p>
      )}

      {comparison.thin ? (
        <p className="px-5 py-6 text-sm leading-relaxed text-muted-foreground sm:px-8">
          Answer a couple more questions above and this fills in. Right now the desk would be
          guessing, and a guess in a table looks like a fact.
        </p>
      ) : (
        <ul className="min-w-0 divide-y divide-border/50">
          {comparison.rows.map((row) => (
            <li key={row.id} className="min-w-0 px-5 py-5 sm:px-8">
              <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="min-w-0 font-display text-lg leading-snug text-bone">
                  {row.label}
                </h3>
                <p className={`label-mono shrink-0 ${LEAN_COPY[row.lean].className}`}>
                  {LEAN_COPY[row.lean].label}
                </p>
              </div>
              <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-6">
                <div className="min-w-0">
                  <p className="label-mono">If you host</p>
                  <p className="mt-1 break-words text-sm leading-relaxed text-foreground/85">
                    {row.host}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="label-mono">If you go out</p>
                  <p className="mt-1 break-words text-sm leading-relaxed text-foreground/85">
                    {row.dine}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {comparison.unknowns.length > 0 && (
        <div className="min-w-0 border-t border-border/60 px-5 py-5 sm:px-8">
          <p className="label-mono">What the desk can't judge yet</p>
          <ul className="mt-2 space-y-1.5">
            {comparison.unknowns.map((u) => (
              <li key={u} className="flex min-w-0 gap-2 text-sm leading-snug text-muted-foreground">
                <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-border" />
                <span className="min-w-0 break-words">{u}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="min-w-0 border-t border-border/60 bg-ink-deep px-5 py-6 sm:px-8">
        <p className="label-mono text-brass">Worth finding out next</p>
        <h3 className="mt-2 font-display text-xl leading-snug text-bone">
          {comparison.next.headline}
        </h3>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
          {comparison.next.detail}
        </p>
        {tool && (
          <a
            href={tool.href}
            className="press tap mt-5 inline-flex min-h-[44px] items-center gap-2 bg-brass px-5 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone"
          >
            {comparison.next.action}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        )}
      </div>
    </section>
  );
}
