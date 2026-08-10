import { ArrowRight, Lock } from "lucide-react";
import { HANDOFFS } from "@/lib/desk-data";

export function HandoffMap({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-5">
      {HANDOFFS.map((h) => (
        <article key={h.fromId + h.toId} className="panel rounded-lg p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label-mono border border-brass/40 px-2 py-1 text-brass">{h.tag}</span>
            <span className="label-mono">{h.contract}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-5">
            <Node name={h.from} id={h.fromId} />
            <ArrowRight className="h-5 w-5 text-brass" />
            <Node name={h.to} id={h.toId} />
          </div>

          {!compact && (
            <div className="mt-7 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
              <div className="bg-ink-deep p-5">
                <p className="label-mono text-brass">Moves forward</p>
                <ul className="mt-3 space-y-2 text-[0.84rem] leading-relaxed text-foreground/85">
                  {h.moves.map((m) => (
                    <li key={m} className="flex gap-3">
                      <span className="mt-2 h-px w-3 shrink-0 bg-brass/70" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-ink-deep p-5">
                <p className="label-mono flex items-center gap-2">
                  <Lock className="h-3 w-3" /> Stays behind
                </p>
                <ul className="mt-3 space-y-2 text-[0.84rem] leading-relaxed text-muted-foreground">
                  {h.stays.map((s) => (
                    <li key={s} className="flex gap-3">
                      <span className="mt-2 h-px w-3 shrink-0 bg-border" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function Node({ name, id }: { name: string; id: string }) {
  return (
    <span className="min-w-0">
      <span className="block font-display text-xl leading-tight text-bone">{name}</span>
      <span className="label-mono">{id}</span>
    </span>
  );
}
