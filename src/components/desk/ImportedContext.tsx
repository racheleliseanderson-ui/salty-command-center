import { ArrowRight, X } from "lucide-react";

import { summarizeHandoff, describeHandoff } from "@/lib/salty-handoff/codec.ts";
import type { ImportSession } from "@/lib/salty-handoff/import-session.ts";

/**
 * The panel that appears when a reader arrives carrying context from another
 * tool. It shows, in plain words, everything that travelled — then waits.
 * Nothing is written to this app until the reader presses the button.
 */
export function ImportedContext({
  session,
  onApply,
  onIgnore,
  applyLabel = "Use this context",
}: {
  session: ImportSession;
  onApply: () => void;
  onIgnore: () => void;
  applyLabel?: string;
}) {
  if (session.phase === "failed") {
    return (
      <div
        role="status"
        className="panel mx-auto mt-6 flex max-w-[1120px] min-w-0 flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border/70 px-4 py-3 sm:px-6"
      >
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
          {session.message}
        </p>
        <button
          type="button"
          onClick={onIgnore}
          className="press tap inline-flex min-h-[44px] items-center gap-1.5 px-2 text-sm text-muted-foreground transition-colors hover:text-bone"
        >
          Dismiss
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    );
  }

  if (session.phase !== "offered" || !session.handoff) return null;

  const rows = summarizeHandoff(session.handoff);

  return (
    <aside
      aria-label="Context from another tool"
      className="panel mx-auto mt-6 max-w-[1120px] min-w-0 overflow-hidden rounded-lg border border-brass/40 bg-ink-deep"
    >
      <div className="min-w-0 border-b border-border/60 px-4 py-3 sm:px-6">
        <p className="label-mono text-brass">Brought with you</p>
        <p className="mt-2 text-pretty text-base leading-relaxed text-bone">
          {describeHandoff(session.handoff)}
        </p>
      </div>

      <dl className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-3 px-4 py-4 sm:grid-cols-2 sm:px-6">
        {rows.map((row) => (
          <div key={row.label} className="min-w-0">
            <dt className="label-mono">{row.label}</dt>
            <dd className="mt-1 break-words text-sm leading-snug text-foreground/90">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {(session.overwrites || session.stale) && (
        <div className="min-w-0 border-t border-border/60 px-4 py-3 sm:px-6">
          {session.overwrites && (
            <p className="text-sm leading-relaxed text-amber-200/90">
              You already have a decision open here. Using this will replace it.
            </p>
          )}
          {session.stale && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              This is more than a week old — check the date still holds.
            </p>
          )}
        </div>
      )}

      <div className="flex min-w-0 flex-wrap gap-3 border-t border-border/60 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={onApply}
          className="press tap inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 bg-brass px-5 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone sm:flex-none"
        >
          {applyLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onIgnore}
          className="press tap inline-flex min-h-[44px] flex-1 items-center justify-center border border-bone/25 px-5 text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:border-bone/50 hover:text-bone sm:flex-none"
        >
          Ignore
        </button>
      </div>
    </aside>
  );
}
