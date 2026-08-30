import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, Clipboard, RotateCcw, Save } from "lucide-react";

import { HostVsDine } from "@/components/desk/HostVsDine";
import { useDeskDecision } from "@/hooks/use-desk-decision";
import {
  answersFromBrief,
  handoffFromBrief,
  isBriefComplete,
  readBrief,
  resumeUrlForTool,
  routeForBrief,
  writeBrief,
  type BriefFriction,
  type BriefHorizon,
  type BriefIntent,
  type BriefParty,
  type WorkingBrief,
} from "@/lib/salty-handoff/apply";

type Recommendation = {
  app: string;
  action: string;
  why: string;
  next: string;
};

const INTENTS: { id: BriefIntent; title: string; detail: string }[] = [
  {
    id: "cook-from-here",
    title: "Cook from what I have",
    detail: "Start with the pantry, fridge, or bar instead of building a shopping list first.",
  },
  {
    id: "build-menu",
    title: "Build a menu that will actually work",
    detail: "Test the menu against timing, equipment, service pressure, and host attention.",
  },
  {
    id: "run-night",
    title: "Plan and run a hosted night",
    detail: "Sequence the night, prep, service, responsibilities, and the plan guests will feel.",
  },
  {
    id: "choose-restaurant",
    title: "Choose where to go",
    detail: "Match the room to the occasion, party, constraints, and what still needs confirmation.",
  },
  {
    id: "host-or-dine",
    title: "I am deciding whether to host or dine out",
    detail: "Use the desk to establish the at-home path first, then keep a clean off-site fallback.",
  },
];

const PARTIES: { id: BriefParty; label: string }[] = [
  { id: "1-2", label: "1–2" },
  { id: "3-6", label: "3–6" },
  { id: "7-12", label: "7–12" },
  { id: "13+", label: "13+" },
];

const HORIZONS: { id: BriefHorizon; label: string }[] = [
  { id: "now", label: "Right now" },
  { id: "today", label: "Today" },
  { id: "few-days", label: "A few days" },
  { id: "later", label: "Later" },
];

const FRICTIONS: { id: BriefFriction; label: string }[] = [
  { id: "ingredients", label: "What I already have" },
  { id: "time", label: "Time" },
  { id: "guest-fit", label: "Guest fit" },
  { id: "service", label: "Service load" },
  { id: "budget", label: "Budget" },
];

function recommendationFor(intent: BriefIntent | ""): Recommendation | null {
  if (!intent) return null;

  if (intent === "cook-from-here") {
    return {
      app: "Kitchen & Bar Intelligence",
      action: "Start with the shelf",
      why: "Your first decision is availability: what is actually here, what pairs, and what can become dinner or a pour without inventing a new shopping trip.",
      next: "If this turns into a hosted meal, carry the confirmed availability forward into Occasion OS.",
    };
  }

  if (intent === "build-menu") {
    return {
      app: "Occasion OS · menu building",
      action: "Stress-test the menu",
      why: "The menu is the problem, so start where timing, equipment, service fit, and host freedom are tested before the rest of the night is sequenced.",
      next: "Once the menu survives the stress test, continue inside Occasion OS to build the operating plan.",
    };
  }

  if (intent === "run-night") {
    return {
      app: "Occasion Operating System",
      action: "Build the operating plan",
      why: "You already know the job is hosting. The useful next step is sequencing prep, service, responsibilities, and the guest-facing plan instead of choosing another tool.",
      next: "If hosting stops making sense, move only the occasion context you need into Restaurant Intelligence.",
    };
  }

  if (intent === "choose-restaurant") {
    return {
      app: "Restaurant Intelligence",
      action: "Rank the room against the occasion",
      why: "You are making a fit decision, not a cooking decision. Start with the room, party, timing, constraints, and what still needs direct confirmation.",
      next: "Keep the occasion context; leave kitchen and prep state behind.",
    };
  }

  return {
    app: "Occasion Operating System",
    action: "Test the at-home path first",
    why: "The cleanest comparison is to make the hosting load visible before abandoning it. If the plan becomes unreasonable, the same occasion can move to Restaurant Intelligence without dragging the kitchen plan with it.",
    next: "If the at-home plan fails on capacity, timing, or attention, switch to Restaurant Intelligence with only the occasion details that still matter.",
  };
}

function choiceClass(active: boolean) {
  return active
    ? "press min-h-11 rounded-sm border border-brass bg-brass/15 px-3 py-2 text-left text-sm text-bone"
    : "press min-h-11 rounded-sm border border-border bg-ink-deep/50 px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-brass/50 hover:text-bone";
}

export function DecisionDesk() {
  const [intent, setIntent] = useState<BriefIntent | "">("");
  const [party, setParty] = useState<BriefParty | "">("");
  const [horizon, setHorizon] = useState<BriefHorizon | "">("");
  const [friction, setFriction] = useState<BriefFriction | "">("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const { patch, startFresh } = useDeskDecision();

  useEffect(() => {
    const brief = readBrief();
    if (!brief) return;
    setIntent(brief.intent);
    setParty(brief.party);
    setHorizon(brief.horizon);
    setFriction(brief.friction);
    setSavedAt(brief.savedAt);
  }, []);

  const recommendation = useMemo(() => recommendationFor(intent), [intent]);
  const draft: Partial<WorkingBrief> = {
    ...(intent ? { intent } : {}),
    ...(party ? { party } : {}),
    ...(horizon ? { horizon } : {}),
    ...(friction ? { friction } : {}),
  };
  const complete = isBriefComplete(draft);

  const briefText = useMemo(() => {
    if (!recommendation || !intent) return "";
    const intentLabel = INTENTS.find((item) => item.id === intent)?.title ?? intent;
    const partyLabel = PARTIES.find((item) => item.id === party)?.label ?? "Not set";
    const horizonLabel = HORIZONS.find((item) => item.id === horizon)?.label ?? "Not set";
    const frictionLabel = FRICTIONS.find((item) => item.id === friction)?.label ?? "Not set";

    return [
      "Salty Desk working brief",
      `Decision: ${intentLabel}`,
      `Party: ${partyLabel}`,
      `Timing: ${horizonLabel}`,
      `Main constraint: ${frictionLabel}`,
      `Start in: ${recommendation.app}`,
      `Why: ${recommendation.why}`,
      `Next: ${recommendation.next}`,
    ].join("\n");
  }, [friction, horizon, intent, party, recommendation]);

  function persist(brief: WorkingBrief) {
    writeBrief(brief);
    setSavedAt(brief.savedAt);
    const route = routeForBrief(brief.intent);
    patch({
      answers: answersFromBrief(brief),
      activeTool: route.tool,
      nextStep: recommendation?.next ?? null,
    });
  }

  function saveBrief() {
    if (!isBriefComplete(draft)) return;
    persist({ ...draft, savedAt: new Date().toISOString() });
  }

  function continueWithContext() {
    if (!isBriefComplete(draft)) return;
    const brief: WorkingBrief = { ...draft, savedAt: new Date().toISOString() };
    persist(brief);
    window.location.assign(handoffFromBrief(brief).url);
  }

  async function copyBrief() {
    if (!briefText) return;
    try {
      await navigator.clipboard.writeText(briefText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("failed");
    }
  }

  function clearBrief() {
    setIntent("");
    setParty("");
    setHorizon("");
    setFriction("");
    setSavedAt(null);
    setCopyState("idle");
    writeBrief(null);
    startFresh();
  }

  const compareAnswers = answersFromBrief(draft);

  return (
    <>
      <section id="decision-desk" className="mx-auto max-w-[1120px] min-w-0 px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <div className="min-w-0">
            <p className="label-mono text-brass">Decision desk · start here</p>
            <h2 className="mt-3 max-w-[18ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
              Name the job before you choose the app.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              The desk holds a working brief, recommends one starting point, and preserves the
              decision so you do not have to re-orient yourself every time you return.
            </p>

            <fieldset className="mt-9">
              <legend className="label-mono text-bone">1 · What are you trying to do?</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {INTENTS.map((item) => {
                  const active = intent === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setIntent(item.id)}
                      className={
                        active
                          ? "press min-w-0 rounded-lg border border-brass bg-brass/10 p-4 text-left"
                          : "press min-w-0 rounded-lg border border-border bg-ink-deep/45 p-4 text-left transition-colors hover:border-brass/50"
                      }
                    >
                      <span className="flex items-start gap-3">
                        <span
                          className={
                            active
                              ? "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass text-ink-deep"
                              : "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-transparent"
                          }
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-xl leading-tight text-bone">
                            {item.title}
                          </span>
                          <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                            {item.detail}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <fieldset>
                <legend className="label-mono text-bone">2 · Party</legend>
                <div className="mt-3 grid gap-2">
                  {PARTIES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={party === item.id}
                      onClick={() => setParty(item.id)}
                      className={choiceClass(party === item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="label-mono text-bone">3 · Timing</legend>
                <div className="mt-3 grid gap-2">
                  {HORIZONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={horizon === item.id}
                      onClick={() => setHorizon(item.id)}
                      className={choiceClass(horizon === item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="label-mono text-bone">4 · Main constraint</legend>
                <div className="mt-3 grid gap-2">
                  {FRICTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={friction === item.id}
                      onClick={() => setFriction(item.id)}
                      className={choiceClass(friction === item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          <aside className="min-w-0 lg:pt-7">
            <div className="panel sticky top-32 min-w-0 rounded-lg p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="label-mono text-brass">Working brief</p>
                {savedAt ? <span className="label-mono text-live">Saved here</span> : null}
              </div>

              {recommendation ? (
                <>
                  <h3 className="mt-4 font-display text-3xl leading-tight text-bone">
                    {recommendation.action}
                  </h3>
                  <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-brass">
                    {recommendation.app}
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-foreground/85">
                    {recommendation.why}
                  </p>

                  <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border text-sm">
                    <div className="min-w-0 bg-ink-deep p-3">
                      <dt className="label-mono">Party</dt>
                      <dd className="mt-1 text-bone">{party || "Not set"}</dd>
                    </div>
                    <div className="min-w-0 bg-ink-deep p-3">
                      <dt className="label-mono">Timing</dt>
                      <dd className="mt-1 text-bone">
                        {HORIZONS.find((item) => item.id === horizon)?.label ?? "Not set"}
                      </dd>
                    </div>
                    <div className="col-span-2 min-w-0 bg-ink-deep p-3">
                      <dt className="label-mono">Main constraint</dt>
                      <dd className="mt-1 text-bone">
                        {FRICTIONS.find((item) => item.id === friction)?.label ?? "Not set"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-7 border-l border-brass/50 pl-4">
                    <p className="label-mono">After that</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {recommendation.next}
                    </p>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <button
                      type="button"
                      onClick={continueWithContext}
                      disabled={!complete}
                      className="press tap inline-flex min-h-11 items-center justify-center gap-2 bg-brass px-4 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continue with this context
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={saveBrief}
                      disabled={!complete}
                      className="press tap inline-flex min-h-11 items-center justify-center gap-2 border border-border px-4 py-3 text-sm text-bone transition-colors hover:border-brass disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Save className="h-4 w-4" />
                      Save this brief
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <button
                      type="button"
                      onClick={() => void copyBrief()}
                      className="inline-flex min-h-11 items-center gap-2 text-brass hover:text-bone"
                    >
                      <Clipboard className="h-4 w-4" />
                      {copyState === "copied"
                        ? "Copied"
                        : copyState === "failed"
                          ? "Copy unavailable"
                          : "Copy brief"}
                    </button>
                    <button
                      type="button"
                      onClick={clearBrief}
                      className="inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-brass"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Start over
                    </button>
                  </div>

                  {!complete ? (
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                      Add party, timing, and the main constraint to carry this brief into the next tool.
                    </p>
                  ) : (
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                      Nothing travels automatically. You will see this context in the next tool and
                      choose whether to use it.
                    </p>
                  )}
                </>
              ) : (
                <div className="py-14 text-center">
                  <p className="font-display text-2xl text-bone">Choose the job first.</p>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    The desk will give you one starting point and keep the decision visible instead of
                    sending you through another directory.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {intent === "host-or-dine" ? (
        <section className="mx-auto max-w-[1120px] min-w-0 px-5 pb-16 sm:px-8">
          <HostVsDine
            answers={compareAnswers}
            resolveHref={
              isBriefComplete(draft)
                ? (slug) => resumeUrlForTool({ ...draft, savedAt: savedAt ?? new Date().toISOString() }, slug)
                : undefined
            }
          />
        </section>
      ) : null}
    </>
  );
}
