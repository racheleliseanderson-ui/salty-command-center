import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { DecisionDesk } from "@/components/desk/DecisionDesk";
import { ImportedContext } from "@/components/desk/ImportedContext";
import { QuickStart } from "@/components/desk/QuickStart";
import { ResumeCard } from "@/components/desk/ResumeCard";
import { useDeskDecision } from "@/hooks/use-desk-decision";
import { useSaltyImport } from "@/hooks/use-salty-import";
import { FLEET_TOOLS } from "@/lib/desk-data";
import { createDecision, isResumable, readDecision, writeDecision } from "@/lib/desk-decision";
import {
  applyReturningHandoff,
  readBrief,
  resumeUrlForTool,
  writeBrief,
} from "@/lib/salty-handoff/apply";
import { shouldApply } from "@/lib/salty-handoff/import-session.ts";
import heroPass from "@/assets/hero-pass.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salty Desk — Decide what happens next" },
      {
        name: "description",
        content:
          "Choose the job, open the right Salty & Clever specialist immediately, or add party, timing and the main constraint when carrying context will save work.",
      },
    ],
  }),
  component: Desk,
});

function Desk() {
  const { decision, hydrated, startFresh } = useDeskDecision();
  const resumable = isResumable(decision);
  const { session, apply, ignore } = useSaltyImport("desk", resumable, hydrated);
  const [startingAnother, setStartingAnother] = useState(false);
  const appliedRef = useRef(false);

  useEffect(() => {
    if (appliedRef.current) return;
    if (!shouldApply(session) || !session.handoff) return;
    appliedRef.current = true;
    const current = readDecision() ?? createDecision();
    writeDecision(applyReturningHandoff(current, session.handoff));
    setStartingAnother(false);
  }, [session]);

  const showResume = hydrated && resumable && !startingAnother && session.phase !== "offered";
  const brief = hydrated ? readBrief() : null;
  const resumeHref = useMemo(() => {
    if (!decision?.activeTool || !brief) return undefined;
    return resumeUrlForTool(brief, decision.activeTool);
  }, [decision, brief]);

  function startAnother() {
    writeBrief(null);
    startFresh();
    setStartingAnother(true);
    document.getElementById("quick-start")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-dvh min-w-0 overflow-x-hidden bg-ink">
      <DeskHeader />

      <ImportedContext
        session={session}
        onApply={apply}
        onIgnore={ignore}
        applyLabel="Use this decision"
      />

      {showResume && decision ? (
        <section className="mx-auto max-w-[1120px] min-w-0 px-5 pt-10 sm:px-8 sm:pt-14">
          <ResumeCard
            decision={decision}
            onStartAnother={startAnother}
            resumeHref={resumeHref}
          />
        </section>
      ) : (
        <section className="relative isolate overflow-hidden">
          <img
            src={heroPass}
            alt="Hands finishing a plate on a dark kitchen pass under brass service light"
            width={1600}
            height={1104}
            className="media-tone absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="ink-veil absolute inset-0" />
          <div className="hairline-grid absolute inset-0 opacity-40" />

          <div className="relative mx-auto max-w-[1120px] min-w-0 px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
            <p className="label-mono text-brass">Salty & Clever · Salty Desk</p>
            <h1 className="display-xl mt-6 max-w-[18ch] text-bone">
              Start with the decision.
              <span className="block text-brass">Keep the context.</span>
            </h1>
            <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-foreground/85">
              Choose what you are trying to accomplish and go straight to the specialist that owns
              it. Add more context only when it will save you from answering the same questions twice.
            </p>
            <div className="mt-10 flex min-w-0 flex-wrap gap-3">
              <a
                href="#quick-start"
                className="press tap inline-flex min-h-11 items-center gap-2 bg-brass px-5 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone"
              >
                Choose the job
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#decision-desk"
                className="press tap inline-flex min-h-11 items-center gap-2 border border-bone/30 px-5 py-3 text-sm font-medium tracking-wide text-bone transition-colors hover:border-brass hover:text-brass"
              >
                Carry more context first
              </a>
            </div>
            <p className="mt-12 max-w-[46ch] border-l border-brass/50 pl-5 font-display text-2xl leading-snug text-bone/90">
              One question should have one obvious place to start.
            </p>
          </div>
        </section>
      )}

      {!showResume ? (
        <div id="quick-start">
          <QuickStart />
        </div>
      ) : null}

      <DecisionDesk />

      {!showResume ? (
        <section className="border-y border-border bg-ink-deep">
          <div className="mx-auto max-w-[1120px] min-w-0 px-5 py-16 sm:px-8 sm:py-20">
            <p className="label-mono text-brass">The specialists</p>
            <div className="mt-3 flex min-w-0 flex-wrap items-end justify-between gap-5">
              <div className="min-w-0">
                <h2 className="max-w-[22ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
                  Three tools. Three different jobs.
                </h2>
                <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
                  The quick start gets you there. These notes only explain the decision each
                  specialist owns — they do not turn Desk into another destination.
                </p>
              </div>
            </div>

            <div className="mt-10 grid min-w-0 gap-4 lg:grid-cols-3">
              {FLEET_TOOLS.map((tool) => (
                <article key={tool.id} className="panel flex min-w-0 flex-col rounded-lg p-6">
                  <p className="label-mono text-brass">{tool.name}</p>
                  <h3 className="mt-3 font-display text-2xl leading-snug text-bone">{tool.decision}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {tool.useWhen}
                  </p>
                  <p className="mt-6 text-sm text-muted-foreground">
                    Use the working brief only when this tool benefits from the extra context.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-[1120px] min-w-0 gap-5 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2">
        <article className="panel min-w-0 rounded-lg p-6 sm:p-8">
          <p className="label-mono text-brass">What Salty Desk owns</p>
          <h2 className="mt-3 font-display text-3xl leading-snug text-bone">
            The decision before the specialist work.
          </h2>
          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/85">
            <li className="border-l border-brass/50 pl-4">
              Establish the job: cook, build the menu, run the night, choose the room, or compare
              hosting with dining out.
            </li>
            <li className="border-l border-brass/50 pl-4">
              Keep party size, timing and the main constraint in one Night Record when they matter.
            </li>
            <li className="border-l border-brass/50 pl-4">
              Remember the active specialist, what came back and the next useful move.
            </li>
          </ul>
        </article>

        <article className="panel min-w-0 rounded-lg p-6 sm:p-8">
          <p className="label-mono text-brass">Continuity between tools</p>
          <h2 className="mt-3 font-display text-3xl leading-snug text-bone">
            Carry the decision, not the whole application.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            The Night Record carries one decision, its current state, the next step and a resume
            point. Detailed shelf matching, menu feasibility and restaurant ranking stay inside the
            specialist that owns them. Nothing moves unless you ask it to.
          </p>
          <div className="mt-7 flex flex-wrap gap-5">
            <Link to="/memory" className="inline-flex min-h-11 items-center gap-2 text-sm text-brass hover:text-bone">
              Open remembered context <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/handoffs" className="inline-flex min-h-11 items-center gap-2 text-sm text-brass hover:text-bone">
              Review the handoff map <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </section>

      <DeskFooter />
    </div>
  );
}
