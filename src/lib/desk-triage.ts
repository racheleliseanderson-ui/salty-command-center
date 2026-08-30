import type { Tool } from "./desk-data";

export type Answers = {
  mode?: "cook" | "pantry" | "out" | "unsure";
  covers?: "small" | "medium" | "large";
  attention?: "hands-on" | "split" | "none";
  runway?: "tonight" | "days" | "weeks";
};

export type Verdict = {
  ranked: { slug: Tool["slug"]; fit: number; reason: string }[];
  entry: Tool["slug"] | null;
  headline: string;
  detail: string;
  handoff: string;
  hardStop?: string;
};

export const QUESTIONS = [
  {
    key: "mode" as const,
    label: "Where does the night happen?",
    options: [
      { value: "cook" as const, label: "I'm cooking", note: "Kitchen is committed" },
      { value: "pantry" as const, label: "From the pantry & bar", note: "Cook what's already in the house" },
      { value: "out" as const, label: "We're going out", note: "A room has to fit" },
      { value: "unsure" as const, label: "Undecided", note: "That is a valid answer" },
    ],
  },
  {
    key: "covers" as const,
    label: "How many at the table?",
    options: [
      { value: "small" as const, label: "2–4", note: "Loose constraints" },
      { value: "medium" as const, label: "5–8", note: "Service starts to bind" },
      { value: "large" as const, label: "9+", note: "Capacity becomes the constraint" },
    ],
  },
  {
    key: "attention" as const,
    label: "How much attention do you actually have during service?",
    options: [
      { value: "hands-on" as const, label: "Hands-on", note: "I can work the pass" },
      { value: "split" as const, label: "Split", note: "Hosting and cooking at once" },
      { value: "none" as const, label: "None", note: "I need to be at the table" },
    ],
  },
  {
    key: "runway" as const,
    label: "How much runway before the night?",
    options: [
      { value: "tonight" as const, label: "Tonight", note: "No prep window" },
      { value: "days" as const, label: "A few days", note: "Prep can be staged" },
      { value: "weeks" as const, label: "Weeks", note: "Everything is sequenceable" },
    ],
  },
];

const NOT_THIS_TOOL: Record<Tool["slug"], string> = {
  "kitchen-bar": "Wrong tool: it reads the shelf, it does not sequence a hosted night.",
  "menu-builder": "Wrong tool: it will not tell you whether to host, or where to eat.",
  "occasion-os": "Wrong tool: it sequences a night, it does not choose the food.",
  "restaurant-intelligence": "Wrong tool: it has no view of your kitchen, pantry, or prep.",
};

const clamp = (n: number) => Math.max(4, Math.min(98, Math.round(n)));

/** Deterministic, local scoring. No inference beyond the declared answers. */
export function evaluate(a: Answers): Verdict {
  const answered = Object.values(a).filter(Boolean).length;

  let kbi = 32;
  let mb = 36;
  let os = 30;
  let ri = 28;
  let hardStop: string | undefined;

  if (a.mode === "pantry") {
    kbi += 46;
    mb += 8;
    os -= 4;
    ri -= 18;
  } else if (a.mode === "cook") {
    mb += 28;
    os += 24;
    kbi += 10;
    ri -= 18;
  } else if (a.mode === "out") {
    ri += 48;
    mb -= 22;
    os -= 18;
    kbi -= 16;
  } else if (a.mode === "unsure") {
    kbi += 10;
    ri += 12;
    mb += 6;
  }

  if (a.covers === "medium") {
    mb += 8;
    os += 6;
  } else if (a.covers === "large") {
    mb += 14;
    os += 10;
    ri += 6;
  }

  if (a.attention === "split") {
    os += 12;
  } else if (a.attention === "none") {
    os += 4;
    ri += 18;
    mb -= 8;
    kbi += 4;
  } else if (a.attention === "hands-on") {
    mb += 6;
    kbi += 4;
  }

  if (a.runway === "tonight") {
    if (a.mode === "cook" || a.mode === "pantry") {
      kbi += 22;
      mb -= 8;
      os -= 10;
    } else {
      ri += 16;
      os -= 6;
    }
  } else if (a.runway === "weeks") {
    mb += 8;
    os += 10;
  } else if (a.runway === "days") {
    mb += 6;
    os += 8;
  }

  if (a.mode !== "out") {
    if (a.covers === "large" && a.attention === "none") {
      hardStop =
        "9+ covers with no host attention during service. Plated capacity fails; this is a hard stop, not a warning.";
    } else if (a.runway === "tonight" && a.covers === "large") {
      hardStop =
        "9+ covers with no prep window. The prep route cannot be staged; the plan fails closed.";
    } else if (a.runway === "tonight" && a.attention === "none" && a.mode === "cook") {
      hardStop =
        "Service tonight with no attention to give it. Nothing downstream can recover that.";
    }
  }

  if (hardStop) {
    ri += 40;
    mb -= 20;
    os -= 20;
    kbi -= 12;
  }

  const scored = [
    { slug: "kitchen-bar" as const, fit: clamp(kbi) },
    { slug: "menu-builder" as const, fit: clamp(mb) },
    { slug: "occasion-os" as const, fit: clamp(os) },
    { slug: "restaurant-intelligence" as const, fit: clamp(ri) },
  ].sort((x, y) => y.fit - x.fit);

  const reasonFor = (slug: Tool["slug"], rank: number): string => {
    if (rank > 0) return NOT_THIS_TOOL[slug];
    if (slug === "restaurant-intelligence") {
      if (hardStop) return "Start here: the hosting path does not survive the constraints you declared.";
      if (a.mode === "out") return "Start here: the decision is which room fits, not what to cook.";
      return "Start here: off-site is the lower-risk outcome on these constraints.";
    }
    if (slug === "kitchen-bar") {
      if (a.mode === "pantry") return "Start here: the question is what's already in the house.";
      if (a.runway === "tonight") return "Start here: no prep window — cook from the shelf, then stop.";
      return "Start here: read the pantry before you architect a menu.";
    }
    if (slug === "menu-builder") {
      if (a.covers === "large") return "Start here: at 9+ covers, plated capacity is the binding constraint.";
      return "Start here: settle whether the menu can be finished before sequencing anything.";
    }
    return "Start here: the menu is the easy part — the night is what needs a route.";
  };

  const ranked = scored.map((s, i) => ({ ...s, reason: reasonFor(s.slug, i) }));
  const top = ranked[0]!;

  if (answered === 0) {
    return {
      ranked,
      entry: null,
      headline: "No verdict yet",
      detail:
        "Answer the four questions. The desk will name one entry point and say plainly which tools are wrong for it.",
      handoff: "Nothing moves between tools until you send it.",
    };
  }

  if (hardStop) {
    return {
      ranked,
      entry: "restaurant-intelligence",
      headline: "Don't host this one",
      detail: "The constraints breach a hard stop. Dining out is the correct outcome here, not a failure.",
      handoff:
        "Optional, reader-initiated: occasion type, party size, and date window → Restaurant Intelligence.",
      hardStop,
    };
  }

  const headlines: Record<Tool["slug"], string> = {
    "kitchen-bar": "Start at Kitchen & Bar",
    "menu-builder": "Start at Menu Builder",
    "occasion-os": "Start at Occasion OS",
    "restaurant-intelligence": "Dine out — rank the room",
  };

  const handoffs: Record<Tool["slug"], string> = {
    "kitchen-bar":
      "Next: share your shelf with Occasions. You send it. Nothing silent.",
    "menu-builder":
      "Next: menu, stress summary, and locked dish → Occasion OS.",
    "occasion-os":
      "Next: optional occasion context → Restaurant Intelligence, only if you choose it.",
    "restaurant-intelligence":
      "Next: first-party case file + evidence trail → your own records.",
  };

  return {
    ranked,
    entry: top.slug,
    headline: headlines[top.slug],
    detail: top.reason,
    handoff: handoffs[top.slug],
  };
}
