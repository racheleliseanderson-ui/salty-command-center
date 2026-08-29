/**
 * The Desk decision record.
 *
 * The triage answers are the working brief: what the reader declared. This file
 * is the layer above it — what the reader decided, which tool is holding the
 * work, what came back, and what is still open. It is deliberately small and it
 * lives on this device only. No account, no upload, no sync.
 *
 * It never invents state. Every field here is either something the reader
 * declared or something a specialist tool handed back because the reader chose
 * to send it.
 */

import type { Answers } from "./desk-triage";
import type { Tool } from "./desk-data";
import type { DecisionBlock, SaltyApp } from "./salty-handoff/contract.ts";

export const DECISION_STORAGE_KEY = "salty-desk-decision-v1";
export const DECISION_EVENT = "salty-desk-decision-change";

export type DecisionPath = "undecided" | "host" | "dine";

export type PathSwitch = {
  at: string;
  from: DecisionPath;
  to: DecisionPath;
};

export type DeskDecision = {
  id: string;
  createdAt: string;
  updatedAt: string;
  /** What the reader told the desk. Mirrors the triage answers. */
  answers: Answers;
  /** Which way the night is currently pointed. */
  path: DecisionPath;
  /** The specialist tool the reader was last sent to, if any. */
  activeTool: Tool["slug"] | null;
  /** What a specialist tool handed back, in the reader's own terms. */
  conclusion: string | null;
  /** Confirmations the reader still owes someone. */
  unresolved: string[];
  /** The desk's recommendation for the next move. */
  nextStep: string | null;
  /** Every time the night changed direction. Kept so the desk can say so. */
  switches: PathSwitch[];
  /** A room returned from Restaurant Intelligence, when the reader sent it back. */
  room: DecisionBlock | null;
};

const APP_FOR_SLUG: Record<Tool["slug"], SaltyApp> = {
  "kitchen-bar": "kitchen",
  "menu-builder": "occasion",
  "occasion-os": "occasion",
  "restaurant-intelligence": "restaurant",
};

export const appForTool = (slug: Tool["slug"]): SaltyApp => APP_FOR_SLUG[slug];

export const TOOL_LABELS: Record<Tool["slug"], string> = {
  "kitchen-bar": "Kitchen & Bar",
  "menu-builder": "Architecture",
  "occasion-os": "Occasion OS",
  "restaurant-intelligence": "Restaurant Intelligence",
};

function newId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function createDecision(answers: Answers = {}): DeskDecision {
  const now = new Date().toISOString();
  return {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    answers,
    path: pathFromAnswers(answers),
    activeTool: null,
    conclusion: null,
    unresolved: [],
    nextStep: null,
    switches: [],
    room: null,
  };
}

export function pathFromAnswers(answers: Answers): DecisionPath {
  if (answers.mode === "out") return "dine";
  if (answers.mode === "cook" || answers.mode === "pantry") return "host";
  return "undecided";
}

/** A decision worth resuming is one the reader actually started. */
export function isResumable(decision: DeskDecision | null): decision is DeskDecision {
  if (!decision) return false;
  const declared = Object.values(decision.answers).filter(Boolean).length;
  return declared > 0 || decision.activeTool !== null || decision.room !== null;
}

/** How far along the reader is. Used for the resume card, not for scoring. */
export function decisionStage(decision: DeskDecision): "declared" | "in-a-tool" | "concluded" {
  if (decision.conclusion || decision.room) return "concluded";
  if (decision.activeTool) return "in-a-tool";
  return "declared";
}

/**
 * One sentence naming where the reader left off, in plain language.
 * e.g. "Hosting for 6, this Saturday — you were last in Occasion OS."
 */
export function describeDecision(decision: DeskDecision): string {
  const bits: string[] = [];
  const { answers } = decision;

  if (decision.path === "dine") bits.push("Eating out");
  else if (decision.path === "host") {
    bits.push(answers.mode === "pantry" ? "Cooking from the pantry" : "Hosting");
  } else bits.push("Still deciding");

  if (answers.covers === "small") bits.push("2–4 at the table");
  else if (answers.covers === "medium") bits.push("5–8 at the table");
  else if (answers.covers === "large") bits.push("9+ at the table");

  if (answers.runway === "tonight") bits.push("tonight");
  else if (answers.runway === "days") bits.push("a few days out");
  else if (answers.runway === "weeks") bits.push("weeks out");

  const head = bits.join(" · ");
  if (decision.room?.room) return `${head} — ${decision.room.room} came back from Restaurant Intelligence.`;
  if (decision.conclusion) return `${head} — ${decision.conclusion}`;
  if (decision.activeTool) return `${head} — you were last in ${TOOL_LABELS[decision.activeTool]}.`;
  return `${head}.`;
}

/**
 * The line that admits the night changed direction, when it did.
 * e.g. "Hosting was explored; switched to dining out."
 */
export function describeSwitch(decision: DeskDecision): string | null {
  const last = decision.switches[decision.switches.length - 1];
  if (!last) return null;
  const word = (p: DecisionPath) =>
    p === "host" ? "hosting" : p === "dine" ? "dining out" : "an undecided night";
  if (last.from === "undecided") return null;
  return `${word(last.from)[0]?.toUpperCase()}${word(last.from).slice(1)} was explored; switched to ${word(last.to)}.`;
}

/* ── persistence ───────────────────────────────────────────────────────────── */

function coerce(value: unknown): DeskDecision | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw["id"] !== "string" || typeof raw["createdAt"] !== "string") return null;
  const answers = (raw["answers"] ?? {}) as Answers;
  const path = raw["path"];
  const base = createDecision(typeof answers === "object" && answers ? answers : {});
  return {
    ...base,
    id: raw["id"],
    createdAt: raw["createdAt"],
    updatedAt: typeof raw["updatedAt"] === "string" ? raw["updatedAt"] : raw["createdAt"],
    path: path === "host" || path === "dine" || path === "undecided" ? path : base.path,
    activeTool: (typeof raw["activeTool"] === "string" ? raw["activeTool"] : null) as
      | Tool["slug"]
      | null,
    conclusion: typeof raw["conclusion"] === "string" ? raw["conclusion"] : null,
    unresolved: Array.isArray(raw["unresolved"])
      ? (raw["unresolved"] as unknown[]).filter((u): u is string => typeof u === "string").slice(0, 12)
      : [],
    nextStep: typeof raw["nextStep"] === "string" ? raw["nextStep"] : null,
    switches: Array.isArray(raw["switches"]) ? (raw["switches"] as PathSwitch[]).slice(-8) : [],
    room: (raw["room"] ?? null) as DecisionBlock | null,
  };
}

export function readDecision(): DeskDecision | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DECISION_STORAGE_KEY);
    if (!raw) return null;
    return coerce(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeDecision(decision: DeskDecision | null): void {
  if (typeof window === "undefined") return;
  try {
    if (decision === null) localStorage.removeItem(DECISION_STORAGE_KEY);
    else localStorage.setItem(DECISION_STORAGE_KEY, JSON.stringify(decision));
  } catch {
    /* storage unavailable — the decision holds for this session only */
  }
  try {
    window.dispatchEvent(new Event(DECISION_EVENT));
  } catch {
    /* no window events in this environment */
  }
}

/** Apply a change and stamp it. Path changes are recorded, never overwritten. */
export function updateDecision(
  decision: DeskDecision,
  patch: Partial<Omit<DeskDecision, "id" | "createdAt" | "switches">>,
): DeskDecision {
  const next: DeskDecision = { ...decision, ...patch, updatedAt: new Date().toISOString() };
  if (patch.path && patch.path !== decision.path) {
    next.switches = [
      ...decision.switches,
      { at: next.updatedAt, from: decision.path, to: patch.path },
    ].slice(-8);
  }
  return next;
}
