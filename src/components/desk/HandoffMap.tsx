import { ArrowDown, ArrowRight, Check, Lock, ShieldCheck, X } from "lucide-react";
import { HANDOFFS } from "@/lib/desk-data";
import { useTriageState } from "@/hooks/use-triage-state";
import { describeCase, packetExample } from "@/lib/desk-examples";

export function HandoffMap({
  compact = false,
  query = "",
}: {
  compact?: boolean;
  query?: string;
}) {
  const { answers } = useTriageState();
  const declared = describeCase(answers);
  const needle = query.trim().toLowerCase();

  const visible = needle
    ? HANDOFFS.filter((h) =>
        [
          h.from,
          h.to,
          h.fromId,
          h.toId,
          h.tag,
          h.contract,
          h.purpose,
          h.breaksIf,
          ...h.moves.flatMap((m) => [m.field, m.reason]),
          ...h.stays.flatMap((m) => [m.field, m.reason]),
          ...h.canConclude,
          ...h.cannotConclude,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
    : HANDOFFS;

  if (visible.length === 0) {
    return (
      <p className="label-mono border border-dashed border-border p-6 leading-relaxed">
        No packet field matches “{query}”. Clear the filter to see all three contracts.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {visible.map((h) => {
        const example = compact ? null : packetExample(answers, h.fromId);
        return (
          <article key={h.fromId + h.toId} className="panel lift rounded-lg p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="label-mono border border-brass/40 px-2 py-1 text-brass">{h.tag}</span>
              <span className="label-mono">{h.contract}</span>
            </div>

            <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-5">
              <Node name={h.from} id={h.fromId} />
              <ArrowRight className="trace-arrow hidden h-5 w-5 shrink-0 text-brass sm:block" />
              <ArrowDown className="h-5 w-5 shrink-0 text-brass sm:hidden" />
              <Node name={h.to} id={h.toId} />
            </div>

            {!compact && (
              <>
                <p className="mt-5 max-w-[70ch] text-[0.88rem] leading-relaxed text-foreground/85">
                  <span className="label-mono block text-brass">Why the packet exists</span>
                  {h.purpose}
                </p>

                <div className="mt-7 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
                  <div className="bg-ink-deep p-5">
                    <p className="label-mono flex items-center gap-2 text-brass">
                      <Check className="h-3.5 w-3.5" /> Moves forward
                    </p>
                    <ul className="mt-4 space-y-4">
                      {h.moves.map((m) => (
                        <li key={m.field} className="border-l border-brass/60 pl-4">
                          <p className="text-[0.86rem] leading-relaxed text-foreground/90">
                            {m.field}
                          </p>
                          <p className="mt-1 text-[0.78rem] leading-relaxed text-muted-foreground">
                            Because: {m.reason}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-ink-deep p-5">
                    <p className="label-mono flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" /> Stays behind
                    </p>
                    <ul className="mt-4 space-y-4">
                      {h.stays.map((s) => (
                        <li key={s.field} className="border-l border-dashed border-border pl-4">
                          <p className="text-[0.86rem] leading-relaxed text-foreground/80">
                            {s.field}
                          </p>
                          <p className="mt-1 text-[0.78rem] leading-relaxed text-muted-foreground">
                            Withheld because: {s.reason}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="label-mono flex items-center gap-2 text-brass">
                      <Check className="h-3.5 w-3.5" /> The receiver can conclude
                    </p>
                    <ul className="mt-3 space-y-2 text-[0.83rem] leading-relaxed text-foreground/85">
                      {h.canConclude.map((c) => (
                        <li key={c} className="flex gap-3">
                          <span className="mt-2 h-px w-3 shrink-0 bg-brass/70" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="label-mono flex items-center gap-2">
                      <X className="h-3.5 w-3.5" /> It cannot conclude
                    </p>
                    <ul className="mt-3 space-y-2 text-[0.83rem] leading-relaxed text-muted-foreground">
                      {h.cannotConclude.map((c) => (
                        <li key={c} className="flex gap-3">
                          <span className="mt-2 h-px w-3 shrink-0 bg-border" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-5 flex gap-3 border-t border-border pt-4 text-[0.82rem] leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                  {h.breaksIf}
                </p>

                {example ? (
                  <div className="mt-6 border border-brass/40 bg-brass/5 p-5">
                    <p className="label-mono text-brass">Worked example · your selection</p>
                    <p className="mt-2 text-[0.82rem] leading-relaxed text-muted-foreground">
                      {declared.join(" · ")}
                    </p>
                    <div className="mt-4 grid gap-5 md:grid-cols-2">
                      <div>
                        <p className="label-mono flex items-center gap-2 text-brass">
                          <Check className="h-3.5 w-3.5" /> Packet would carry
                        </p>
                        <ul className="mt-3 space-y-2 text-[0.83rem] leading-relaxed text-foreground/90">
                          {example.moves.map((m) => (
                            <li key={m} className="border-l border-brass/60 pl-3">
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="label-mono flex items-center gap-2">
                          <X className="h-3.5 w-3.5" /> Packet would withhold
                        </p>
                        <ul className="mt-3 space-y-2 text-[0.83rem] leading-relaxed text-muted-foreground">
                          {example.withheld.map((m) => (
                            <li key={m} className="border-l border-dashed border-border pl-3">
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="label-mono mt-6 border border-dashed border-border p-4 leading-relaxed">
                    Answer the triage console on the desk to see this packet written against your own
                    constraints.
                  </p>
                )}
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}

function Node({ name, id }: { name: string; id: string }) {
  return (
    <span className="min-w-0">
      <span className="block font-display text-lg leading-tight text-bone sm:text-xl">{name}</span>
      <span className="label-mono">{id}</span>
    </span>
  );
}
