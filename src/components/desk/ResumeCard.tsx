import { Link } from "@tanstack/react-router";
import { ArrowUpRight, RotateCcw } from "lucide-react";

import { TOOLS } from "@/lib/desk-data";
import {
  TOOL_LABELS,
  describeDecision,
  describeSwitch,
  decisionStage,
  type DeskDecision,
} from "@/lib/desk-decision";

/**
 * "Continue where I left off."
 *
 * A returning reader lands on the decision they were already making, not on a
 * menu of four applications. The directory is still below — it just stops being
 * the first thing anyone sees once there is a real decision in progress.
 */
export function ResumeCard({
  decision,
  onStartAnother,
}: {
  decision: DeskDecision;
  onStartAnother: () => void;
}) {
  const stage = decisionStage(decision);
  const switched = describeSwitch(decision);
  const tool = decision.activeTool
    ? TOOLS.find((t) => t.slug === decision.activeTool)
    : undefined;

  const resumeHref = tool?.href;
  const resumeLabel = tool ? `Back to ${TOOL_LABELS[tool.slug]}` : null;

  return (
    <section
      aria-label="Your open decision"
      className="panel min-w-0 overflow-hidden rounded-lg border border-brass/40 bg-ink-deep"
    >
      <div className="min-w-0 px-5 py-6 sm:px-8 sm:py-8">
        <p className="label-mono text-brass">Where you left off</p>
        <h2 className="mt-3 text-pretty font-display text-2xl leading-snug text-bone sm:text-3xl">
          {describeDecision(decision)}
        </h2>

        {switched && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{switched}</p>
        )}

        {decision.room?.room && (
          <p className="mt-4 text-sm leading-relaxed text-foreground/85">
            {decision.room.status === "verified"
              ? "The booking is confirmed."
              : decision.room.status === "hold"
                ? "The booking is on hold until the questions below are answered."
                : "Not booked yet."}
          </p>
        )}

        {decision.unresolved.length > 0 && (
          <div className="mt-5 min-w-0">
            <p className="label-mono">Still to confirm</p>
            <ul className="mt-2 space-y-1.5">
              {decision.unresolved.map((item) => (
                <li
                  key={item}
                  className="flex min-w-0 gap-2 text-sm leading-snug text-foreground/85"
                >
                  <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-brass" />
                  <span className="min-w-0 break-words">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {decision.nextStep && (
          <p className="mt-5 border-l border-brass/50 pl-4 text-sm leading-relaxed text-bone/90">
            {decision.nextStep}
          </p>
        )}
      </div>

      <div className="flex min-w-0 flex-wrap gap-3 border-t border-border/60 px-5 py-4 sm:px-8">
        {resumeHref && resumeLabel ? (
          <a
            href={resumeHref}
            className="press tap inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 bg-brass px-5 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone sm:flex-none"
          >
            {resumeLabel}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        ) : (
          <a
            href="#brief"
            className="press tap inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 bg-brass px-5 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone sm:flex-none"
          >
            {stage === "declared" ? "Pick up the brief" : "Resume"}
          </a>
        )}

        <Link
          to="/host-path"
          className="press tap inline-flex min-h-[44px] flex-1 items-center justify-center border border-bone/25 px-5 text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:border-bone/50 hover:text-bone sm:flex-none"
        >
          See the whole path
        </Link>

        <button
          type="button"
          onClick={onStartAnother}
          className="press tap inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 px-5 text-sm tracking-wide text-muted-foreground transition-colors hover:text-bone sm:flex-none"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Start another decision
        </button>
      </div>
    </section>
  );
}
