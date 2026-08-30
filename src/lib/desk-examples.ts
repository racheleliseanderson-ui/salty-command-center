import type { Answers } from "./desk-triage";
import { BOUNDARIES, type Boundary } from "./desk-data";

const COVERS_LABEL: Record<NonNullable<Answers["covers"]>, string> = {
  small: "2–4",
  medium: "5–8",
  large: "9+",
};

const RUNWAY_LABEL: Record<NonNullable<Answers["runway"]>, string> = {
  tonight: "tonight",
  days: "a few days",
  weeks: "weeks",
};

const ATTENTION_LABEL: Record<NonNullable<Answers["attention"]>, string> = {
  "hands-on": "hands-on",
  split: "split between hosting and cooking",
  none: "none during service",
};

export function describeCase(a: Answers): string[] {
  const out: string[] = [];
  if (a.mode)
    out.push(
      a.mode === "cook" ? "Cooking at home" : a.mode === "out" ? "Going out" : "Undecided",
    );
  if (a.covers) out.push(`${COVERS_LABEL[a.covers]} covers`);
  if (a.attention) out.push(`Attention: ${ATTENTION_LABEL[a.attention]}`);
  if (a.runway) out.push(`Runway: ${RUNWAY_LABEL[a.runway]}`);
  return out;
}

/** Worked packet example, written from the reader's declared constraints. */
export function packetExample(
  a: Answers,
  handoffId: string,
): { moves: string[]; withheld: string[] } | null {
  const answered = Object.values(a).filter(Boolean).length;
  if (answered === 0) return null;

  const covers = a.covers ? COVERS_LABEL[a.covers] : "party size not declared";
  const runway = a.runway ? RUNWAY_LABEL[a.runway] : "runway not declared";
  const attention = a.attention ? ATTENTION_LABEL[a.attention] : "attention not declared";

  if (handoffId === "SC-MB-001") {
    return {
      moves: [
        `Menu for ${covers} — dish roles and pairing mode only`,
        `Stress summary, with the attention axis set to "${attention}"`,
        a.runway === "tonight"
          ? "No prep window declared, so the anchor travels as fixed"
          : `Locked anchor and the re-score it caused (${runway} of prep available)`,
      ],
      withheld: [
        "Every earlier draft you simplified away",
        "Budget pressure inputs behind the menu",
        a.mode === "unsure"
          ? "The fact that you had not decided whether to host"
          : "Your reasons for choosing this menu",
      ],
    };
  }

  if (handoffId === "SC-OOS-001") {
    return {
      moves: [
        `Occasion type, ${covers} covers, and a date window of ${runway}`,
        "Dietary categories as planning filters — never as allergy claims",
      ],
      withheld: [
        "The full prep route and shopping state",
        "Guest names and any private note",
        "Any inference about why the night moved out of your kitchen",
      ],
    };
  }

  return {
    moves: [
      "The case file for the room you actually sat in, dated",
      "Evidence trail with confidence labels and the unknowns left open",
    ],
    withheld: [
      "The rooms you shortlisted and rejected",
      `Confirm burden notes from booking on ${runway} of notice`,
    ],
  };
}

/** Which standing limits are actually binding on the declared case. */
export function bindingBoundaries(a: Answers): { boundary: Boundary; because: string }[] {
  const answered = Object.values(a).filter(Boolean).length;
  if (answered === 0) return [];

  const hit = (id: Boundary["id"], because: string) => ({
    boundary: BOUNDARIES.find((b) => b.id === id)!,
    because,
  });

  const out: { boundary: Boundary; because: string }[] = [];

  if (a.mode !== "out") {
    out.push(
      hit(
        "allergen",
        "You are cooking, so cross-contact sits on your surfaces — outside anything the suite can observe.",
      ),
    );
  } else {
    out.push(
      hit(
        "allergen",
        "You are eating out, so the allergen conversation belongs to that kitchen, live — filters only narrow who to call.",
      ),
    );
  }

  if (
    (a.covers === "large" && a.attention === "none") ||
    (a.runway === "tonight" && (a.covers === "large" || a.attention === "none"))
  ) {
    out.push(
      hit(
        "fail-closed",
        "Your combination does not meet a real requirement. The plan stops rather than quietly degrading.",
      ),
    );
  }

  if (a.mode === "out" || a.attention === "none") {
    out.push(
      hit(
        "rankings",
        "You will be choosing a room. Rooms are ranked against your occasion, never collapsed into a score.",
      ),
    );
  }

  if (answered >= 2) {
    out.push(
      hit(
        "movement",
        "These answers stay on this device. Nothing reaches another tool until you send it.",
      ),
    );
  }

  return out;
}
