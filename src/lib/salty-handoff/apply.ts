/**
 * Desk-specific mapping onto Salty Handoff v2.
 * Not vendored — each app owns how a packet becomes its own controls.
 */

import { createHandoff, handoffUrl } from "./codec.ts";
import type { HandoffIntent, SaltyApp, SaltyHandoff, TimingWindow } from "./contract.ts";
import { updateDecision, type DeskDecision } from "../desk-decision.ts";
import type { Answers } from "../desk-triage";
import type { Tool } from "../desk-data";

export type BriefIntent =
  | "cook-from-here"
  | "build-menu"
  | "run-night"
  | "choose-restaurant"
  | "host-or-dine";
export type BriefParty = "1-2" | "3-6" | "7-12" | "13+";
export type BriefHorizon = "now" | "today" | "few-days" | "later";
export type BriefFriction = "ingredients" | "time" | "guest-fit" | "service" | "budget";

export type WorkingBrief = {
  intent: BriefIntent;
  party: BriefParty;
  horizon: BriefHorizon;
  friction: BriefFriction;
  savedAt: string;
};

export const BRIEF_STORAGE_KEY = "salty-desk-working-brief-v1";

const PARTY_SIZE: Record<BriefParty, number> = {
  "1-2": 2,
  "3-6": 6,
  "7-12": 8,
  "13+": 14,
};

const TIMING: Record<BriefHorizon, TimingWindow> = {
  now: "tonight",
  today: "tonight",
  "few-days": "days",
  later: "weeks",
};

export const FRICTION_LABEL: Record<BriefFriction, string> = {
  ingredients: "what I already have",
  time: "time",
  "guest-fit": "guest fit",
  service: "service load",
  budget: "budget",
};

const TOOL_FOR_APP: Record<SaltyApp, Tool["slug"] | null> = {
  desk: null,
  kitchen: "kitchen-bar",
  occasion: "occasion-os",
  restaurant: "restaurant-intelligence",
};

export function isBriefComplete(
  brief: Partial<WorkingBrief>,
): brief is WorkingBrief {
  return Boolean(brief.intent && brief.party && brief.horizon && brief.friction);
}

export function readBrief(): WorkingBrief | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BRIEF_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WorkingBrief>;
    if (!isBriefComplete(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeBrief(brief: WorkingBrief | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!brief) window.localStorage.removeItem(BRIEF_STORAGE_KEY);
    else window.localStorage.setItem(BRIEF_STORAGE_KEY, JSON.stringify(brief));
  } catch {
    /* this device only — a failed write is not a failed decision */
  }
}

export function routeForBrief(intent: BriefIntent): {
  app: SaltyApp;
  path: string;
  handoffIntent: HandoffIntent;
  tool: Tool["slug"];
} {
  switch (intent) {
    case "cook-from-here":
      return { app: "kitchen", path: "/", handoffIntent: "cook-from-pantry", tool: "kitchen-bar" };
    case "build-menu":
      return {
        app: "occasion",
        path: "/architecture",
        handoffIntent: "host",
        tool: "menu-builder",
      };
    case "run-night":
      return { app: "occasion", path: "/", handoffIntent: "host", tool: "occasion-os" };
    case "choose-restaurant":
      return {
        app: "restaurant",
        path: "/",
        handoffIntent: "dine-out",
        tool: "restaurant-intelligence",
      };
    case "host-or-dine":
      return { app: "occasion", path: "/", handoffIntent: "undecided", tool: "occasion-os" };
  }
}

export function handoffFromBrief(brief: WorkingBrief): { url: string; handoff: SaltyHandoff } {
  const route = routeForBrief(brief.intent);
  const body: Omit<SaltyHandoff, "v" | "from" | "to" | "at" | "intent"> = {
    party: { size: PARTY_SIZE[brief.party] },
    timing: { window: TIMING[brief.horizon] },
    constraint: FRICTION_LABEL[brief.friction],
  };
  if (brief.intent === "choose-restaurant") {
    body.occasion = { type: "Dining out" };
  } else if (brief.intent === "run-night" || brief.intent === "build-menu") {
    body.occasion = { type: "Hosted dinner" };
  }
  const handoff = createHandoff("desk", route.app, route.handoffIntent, body);
  return { url: handoffUrl(handoff, route.path), handoff };
}

/** Resume a specialist with the brief the reader already declared. */
export function resumeUrlForTool(brief: WorkingBrief, slug: Tool["slug"]): string {
  const intent: BriefIntent =
    slug === "kitchen-bar"
      ? "cook-from-here"
      : slug === "menu-builder"
        ? "build-menu"
        : slug === "restaurant-intelligence"
          ? "choose-restaurant"
          : brief.intent === "host-or-dine"
            ? "host-or-dine"
            : "run-night";
  return handoffFromBrief({ ...brief, intent }).url;
}

export function answersFromBrief(brief: Partial<WorkingBrief>): Answers {
  const answers: Answers = {};
  if (brief.intent === "cook-from-here") answers.mode = "pantry";
  else if (brief.intent === "choose-restaurant") answers.mode = "out";
  else if (brief.intent === "host-or-dine") answers.mode = "unsure";
  else if (brief.intent) answers.mode = "cook";

  if (brief.party === "1-2") answers.covers = "small";
  else if (brief.party === "3-6") answers.covers = "medium";
  else if (brief.party === "7-12" || brief.party === "13+") answers.covers = "large";

  if (brief.horizon === "later") answers.runway = "weeks";
  else if (brief.horizon === "few-days") answers.runway = "days";
  else if (brief.horizon) answers.runway = "tonight";

  if (brief.friction === "service") answers.attention = "split";
  else if (brief.friction === "time") answers.attention = "none";
  else if (brief.friction) answers.attention = "hands-on";

  return answers;
}

export function applyReturningHandoff(
  decision: DeskDecision,
  handoff: SaltyHandoff,
): DeskDecision {
  const room = handoff.decision ?? null;
  const conclusion = room?.room
    ? `${room.room} came back from Restaurant Intelligence.`
    : "A restaurant decision came back.";
  const tool = TOOL_FOR_APP[handoff.from] ?? "restaurant-intelligence";
  const nextPath = handoff.intent === "host" ? "host" : "dine";
  return updateDecision(decision, {
    path: nextPath,
    activeTool: tool,
    conclusion,
    unresolved: room?.unresolved ?? [],
    nextStep: room?.unresolved?.length
      ? "Confirm the open questions before treating this as booked."
      : room?.room
        ? "The room is chosen. Confirm live details before you book."
        : "Review what came back, then decide the next move.",
    room,
  });
}
