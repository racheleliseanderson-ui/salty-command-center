/**
 * Host vs. dine — a burden comparison, not a score.
 *
 * There is no number here, and that is the point. Two nights are not comparable
 * on one axis: hosting spends your attention and your kitchen, dining out spends
 * your money and your confirmation calls. What the desk can honestly do is lay
 * the real burdens side by side, say which way each one leans and why, name what
 * it cannot judge yet, and point at the next thing worth finding out.
 *
 * Every reading below is derived only from what the reader declared. Where a
 * reading would require information the desk does not have, it says "unknown"
 * instead of guessing — an unknown is a reason to go look, not a reason to
 * invent a tiebreaker.
 */

import type { Answers } from "./desk-triage";
import type { Tool } from "./desk-data";

export type Lean = "host" | "dine" | "even" | "unknown";

export type BurdenRow = {
  id: string;
  label: string;
  /** What this costs you if you host. */
  host: string;
  /** What this costs you if you go out. */
  dine: string;
  lean: Lean;
};

export type NextInvestigation = {
  headline: string;
  detail: string;
  tool: Tool["slug"];
  action: string;
};

export type Comparison = {
  rows: BurdenRow[];
  /** What the desk cannot read yet, phrased as a question worth answering. */
  unknowns: string[];
  next: NextInvestigation;
  /** Present only when a declared constraint makes hosting fail outright. */
  hardStop?: string;
  /** True when the reader has declared too little for any of this to mean much. */
  thin: boolean;
};

const COVERS_LABEL: Record<NonNullable<Answers["covers"]>, string> = {
  small: "2–4",
  medium: "5–8",
  large: "9+",
};

export function compareHostAndDine(answers: Answers, hardStop?: string): Comparison {
  const rows: BurdenRow[] = [];
  const unknowns: string[] = [];
  const declared = Object.values(answers).filter(Boolean).length;

  /* Time before the night ------------------------------------------------- */
  if (answers.runway === "tonight") {
    rows.push({
      id: "runway",
      label: "Time before the night",
      host: "No prep window. Everything happens today, in one pass.",
      dine: "No prep window needed, but same-day tables are the hardest to get.",
      lean: "even",
    });
  } else if (answers.runway === "days") {
    rows.push({
      id: "runway",
      label: "Time before the night",
      host: "Prep can be staged across a few days, which is where hosting gets easier.",
      dine: "Comfortable booking window for most rooms.",
      lean: "host",
    });
  } else if (answers.runway === "weeks") {
    rows.push({
      id: "runway",
      label: "Time before the night",
      host: "Everything can be sequenced. Time is not the constraint.",
      dine: "Long lead opens rooms that need advance notice.",
      lean: "even",
    });
  } else {
    unknowns.push("How long you have before the night — it changes almost every other line.");
  }

  /* The shopping gap ------------------------------------------------------ */
  if (answers.mode === "pantry") {
    rows.push({
      id: "shopping",
      label: "Shopping gap",
      host: "You've said you're cooking from what's in the house. No shop, or a short one.",
      dine: "No shopping, but you pay for the meal instead.",
      lean: "host",
    });
  } else if (answers.mode === "cook" && answers.runway === "tonight") {
    rows.push({
      id: "shopping",
      label: "Shopping gap",
      host: "A same-day shop sits between you and service. That trip is the risk.",
      dine: "Nothing to buy.",
      lean: "dine",
    });
  } else if (answers.mode === "cook") {
    rows.push({
      id: "shopping",
      label: "Shopping gap",
      host: "A shop is needed, but it can happen before the day itself.",
      dine: "Nothing to buy.",
      lean: "even",
    });
  } else {
    unknowns.push("What's already in the house — Kitchen & Bar can tell you in a few minutes.");
  }

  /* Party size ------------------------------------------------------------ */
  if (answers.covers) {
    const size = COVERS_LABEL[answers.covers];
    if (answers.covers === "large") {
      rows.push({
        id: "covers",
        label: "Party size",
        host: `${size} is where a home kitchen starts to bind: plates, oven space, and seats all at once.`,
        dine: `${size} needs a room that can actually seat it, and usually a deposit or a set menu.`,
        lean: "even",
      });
    } else if (answers.covers === "medium") {
      rows.push({
        id: "covers",
        label: "Party size",
        host: `${size} is manageable at home if service is simple.`,
        dine: `${size} books easily almost anywhere.`,
        lean: "even",
      });
    } else {
      rows.push({
        id: "covers",
        label: "Party size",
        host: `${size} is loose. Very little binds at this size.`,
        dine: `${size} is the easiest party to seat, including walk-in.`,
        lean: "host",
      });
    }
  } else {
    unknowns.push("How many are coming — it's the single biggest input on both sides.");
  }

  /* Host attention -------------------------------------------------------- */
  if (answers.attention === "none") {
    rows.push({
      id: "attention",
      label: "Your attention during service",
      host: "You've said you have none. Hosting spends exactly this, and there is no substitute for it.",
      dine: "Someone else works the pass. Your attention stays at the table.",
      lean: "dine",
    });
  } else if (answers.attention === "split") {
    rows.push({
      id: "attention",
      label: "Your attention during service",
      host: "Split between hosting and cooking. Workable, but the menu has to be built for it.",
      dine: "Undivided — you're a guest at your own night.",
      lean: "dine",
    });
  } else if (answers.attention === "hands-on") {
    rows.push({
      id: "attention",
      label: "Your attention during service",
      host: "You can work the pass. This is the condition hosting is actually designed for.",
      dine: "Nothing to spend it on.",
      lean: "host",
    });
  } else {
    unknowns.push("How much attention you'll have during service — this decides more than the menu does.");
  }

  /* Service complexity ---------------------------------------------------- */
  if (answers.covers && answers.attention) {
    const tight = answers.covers !== "small" && answers.attention !== "hands-on";
    rows.push({
      id: "service",
      label: "Service complexity",
      host: tight
        ? "Plated service at this size, with this attention, is where home nights fall over."
        : "Service can stay simple: one or two things going out at a time.",
      dine: "Service is someone else's problem entirely.",
      lean: tight ? "dine" : "host",
    });
  }

  /* Kitchen capacity ------------------------------------------------------ */
  if (answers.mode === "cook" || answers.mode === "pantry") {
    unknowns.push(
      "Whether your oven, burners and cold space can hold the menu — Occasion OS asks this directly.",
    );
  }

  /* Restaurant confirmation burden ---------------------------------------- */
  if (answers.covers === "large" || answers.runway === "tonight") {
    rows.push({
      id: "confirm",
      label: "What you'd still have to confirm",
      host: "Nothing external. The kitchen is yours and it answers to you.",
      dine:
        answers.covers === "large"
          ? "Large parties bring deposits, set menus and a named-manager call. That's real work."
          : "A same-day table means calling around, and holding nothing until someone says yes.",
      lean: "host",
    });
  } else if (answers.covers) {
    rows.push({
      id: "confirm",
      label: "What you'd still have to confirm",
      host: "Nothing external.",
      dine: "One booking, and any access or dietary questions confirmed directly with the room.",
      lean: "even",
    });
  }

  const next = recommendNext(answers, rows, unknowns, hardStop);

  const comparison: Comparison = { rows, unknowns, next, thin: declared < 2 };
  if (hardStop) comparison.hardStop = hardStop;
  return comparison;
}

function recommendNext(
  answers: Answers,
  rows: BurdenRow[],
  unknowns: string[],
  hardStop?: string,
): NextInvestigation {
  if (hardStop) {
    return {
      headline: "Find the room, not the menu",
      detail:
        "What you've declared breaks hosting before the cooking starts. That isn't a failure — it just means the useful next question is which room fits.",
      tool: "restaurant-intelligence",
      action: "Rank rooms for this night",
    };
  }

  if (!answers.mode || !answers.covers) {
    return {
      headline: "Answer the desk first",
      detail:
        "Two more answers and this comparison stops being generic. Party size and where the night happens change every line above.",
      tool: "occasion-os",
      action: "Finish the brief",
    };
  }

  if (answers.mode === "pantry" || (answers.mode === "cook" && answers.runway === "tonight")) {
    return {
      headline: "Read the shelf before you decide",
      detail:
        "The shopping gap is doing the most work in this comparison and it's the one thing you can settle in a few minutes. Find out what's actually in the house, then come back.",
      tool: "kitchen-bar",
      action: "See what's available",
    };
  }

  const dineLeans = rows.filter((r) => r.lean === "dine").length;
  const hostLeans = rows.filter((r) => r.lean === "host").length;

  if (dineLeans > hostLeans) {
    return {
      headline: "Price the dine-out side properly",
      detail:
        "More burdens lean out than in, mostly on attention and service. Before you commit either way, see whether a room can actually take this party on this date — that's the fastest way to make the choice real.",
      tool: "restaurant-intelligence",
      action: "See which rooms fit",
    };
  }

  if (unknowns.length > 1) {
    return {
      headline: "Test whether the night survives",
      detail:
        "Nothing here rules hosting out, but the capacity questions are still open. Occasion OS asks them directly and will stop you if the plan doesn't hold.",
      tool: "occasion-os",
      action: "Sequence the night",
    };
  }

  return {
    headline: "Build the night you already have",
    detail:
      "The burdens lean toward hosting on what you've declared. The remaining risk is the menu itself — whether it can be finished on time in your kitchen.",
    tool: "occasion-os",
    action: "Plan the night",
  };
}
