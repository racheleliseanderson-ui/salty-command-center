import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  readNightFromLocation,
  type SaltyNightRecord,
} from "@/lib/salty-night-record";

function stateLabel(state: SaltyNightRecord["state"]) {
  return state.replace(/-/g, " ");
}

export function NightRecordStrip() {
  const [night, setNight] = useState<SaltyNightRecord | null>(null);

  useEffect(() => {
    setNight(readNightFromLocation("desk"));
  }, []);

  return (
    <section aria-label="Salty Night Record" className="border-t border-border/50 bg-ink-deep">
      <div className="mx-auto flex max-w-[1120px] min-w-0 items-center gap-3 px-5 py-2.5 sm:px-8">
        <span className="label-mono shrink-0 text-brass">Night record</span>
        {night ? (
          <>
            <span className="hidden h-4 w-px shrink-0 bg-border sm:block" aria-hidden />
            <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
              <span className="text-bone">{night.decision}</span>
              <span className="hidden sm:inline"> · {stateLabel(night.state)}</span>
              <span className="hidden md:inline"> · Next: {night.nextStep}</span>
            </p>
            <a
              href={night.resume.url}
              className="tap hidden min-h-9 shrink-0 items-center text-xs text-brass hover:text-bone sm:inline-flex"
            >
              {night.resume.label}
            </a>
          </>
        ) : (
          <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            No night open yet. Choose the job; the record starts with the decision.
          </p>
        )}
        <Link
          to="/memory"
          className="tap inline-flex min-h-9 shrink-0 items-center rounded-sm border border-border px-3 text-xs text-muted-foreground hover:border-brass/50 hover:text-bone"
        >
          Memory
        </Link>
      </div>
    </section>
  );
}
