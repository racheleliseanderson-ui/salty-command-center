/**
 * Pipeline run model. A run is the operational spine of the suite: intake →
 * menu architecture → stress test → handoff packet → route build → service.
 *
 * Deterministic, local, and gate-driven. A stage cannot be signed off until
 * its declared gates are checked, and a hard gate refuses rather than warns.
 */

export type RunStatus = "idle" | "running" | "held" | "aborted" | "complete";

export type Gate = {
  id: string;
  label: string;
  detail: string;
  hard: boolean;
};

export type Stage = {
  id: string;
  code: string;
  name: string;
  owner: string;
  decision: string;
  produces: string;
  duration: string;
  tool: "menu-builder" | "occasion-os" | "restaurant-intelligence" | "desk";
  gates: Gate[];
};

export const STAGES: Stage[] = [
  {
    id: "intake",
    code: "P1",
    name: "Intake",
    owner: "Desk",
    decision: "Are the constraints declared, or are we guessing?",
    produces: "Declared case: guests, service style, attention, equipment",
    duration: "10 min",
    tool: "desk",
    gates: [
      {
        id: "intake.count",
        label: "Guest count and service style are fixed",
        detail: "A range is not a count. Pick the number the kitchen has to finish for.",
        hard: true,
      },
      {
        id: "intake.attention",
        label: "Host attention is honestly declared",
        detail: "Attention is the scarcest input in the run. Overstating it corrupts every later stage.",
        hard: true,
      },
      {
        id: "intake.equipment",
        label: "Oven, burner and cold storage limits noted",
        detail: "Equipment fit is scored from this, not inferred.",
        hard: false,
      },
    ],
  },
  {
    id: "architecture",
    code: "P2",
    name: "Menu architecture",
    owner: "Menu Builder",
    decision: "Does the menu have a shape, or just dishes?",
    produces: "Five-role architecture + locked anchor",
    duration: "25 min",
    tool: "menu-builder",
    gates: [
      {
        id: "arch.roles",
        label: "All five roles filled or deliberately empty",
        detail: "An accidental gap reads as balance failure later. Empty on purpose is fine.",
        hard: true,
      },
      {
        id: "arch.anchor",
        label: "Anchor locked if the table needs one",
        detail: "Locking re-scores the rest of the menu against the anchor.",
        hard: false,
      },
    ],
  },
  {
    id: "stress",
    code: "P3",
    name: "Stress test",
    owner: "Menu Builder",
    decision: "Can this kitchen finish this menu on time?",
    produces: "Balance · Make Ahead · Service Fit · Equipment Fit · Host Freedom",
    duration: "10 min",
    tool: "menu-builder",
    gates: [
      {
        id: "stress.clear",
        label: "No unresolved hard stop",
        detail: "A hard stop is a refusal. Simplify within bounds or stand the run down.",
        hard: true,
      },
      {
        id: "stress.plated",
        label: "Plated capacity checked against the real pass",
        detail: "Plated service multiplies attention cost at the worst possible minute.",
        hard: true,
      },
      {
        id: "stress.simplify",
        label: "Budget-pressure simplification applied where needed",
        detail: "Additive substitutions only — never formula-breaking.",
        hard: false,
      },
    ],
  },
  {
    id: "handoff",
    code: "P4",
    name: "Handoff packet",
    owner: "Desk",
    decision: "What moves forward, and what stays behind?",
    produces: "Contract 1.1.0 packet: architecture, stress summary, anchor",
    duration: "2 min",
    tool: "desk",
    gates: [
      {
        id: "handoff.scope",
        label: "Packet carries architecture, not private notes",
        detail: "Drafts, rejected dishes and personal notes stay in the originating tool.",
        hard: true,
      },
      {
        id: "handoff.explicit",
        label: "Transfer is explicit and reader-initiated",
        detail: "Nothing crosses tools without an action you took on purpose.",
        hard: true,
      },
    ],
  },
  {
    id: "route",
    code: "P5",
    name: "Route build",
    owner: "Occasion OS",
    decision: "What happens, in what order, and who is holding it?",
    produces: "Shop → prep → serve route against declared attention",
    duration: "20 min",
    tool: "occasion-os",
    gates: [
      {
        id: "route.sequence",
        label: "Shop, prep and serve stages each have an owner",
        detail: "An unowned stage is the one that fails at 19:40.",
        hard: true,
      },
      {
        id: "route.dietary",
        label: "Dietary categories treated as planning filters only",
        detail: "The suite gives no allergen safety guarantee at any stage.",
        hard: true,
      },
    ],
  },
  {
    id: "service",
    code: "P6",
    name: "Service window",
    owner: "You",
    decision: "Is the run held, or is it being improvised?",
    produces: "A night that finishes on time",
    duration: "Live",
    tool: "occasion-os",
    gates: [
      {
        id: "service.hold",
        label: "First course leaves the pass on the declared minute",
        detail: "The route is only real if the first handoff lands on time.",
        hard: false,
      },
    ],
  },
];

export const ALL_GATES: Gate[] = STAGES.flatMap((s) => s.gates);

export type RunState = {
  status: RunStatus;
  stage: number;
  gates: Record<string, boolean>;
  log: { at: string; kind: "control" | "gate" | "stage" | "stop"; text: string }[];
  startedAt: string | null;
};

export const EMPTY_RUN: RunState = {
  status: "idle",
  stage: 0,
  gates: {},
  log: [],
  startedAt: null,
};

export function hardGatesFor(stage: Stage) {
  return stage.gates.filter((g) => g.hard);
}

export function stageCleared(stage: Stage, gates: Record<string, boolean>) {
  return hardGatesFor(stage).every((g) => gates[g.id] === true);
}

export function blockingGates(stage: Stage, gates: Record<string, boolean>) {
  return hardGatesFor(stage).filter((g) => gates[g.id] !== true);
}

export function runProgress(state: RunState) {
  const cleared = state.status === "complete" ? STAGES.length : state.stage;
  return Math.round((Math.min(cleared, STAGES.length) / STAGES.length) * 100);
}

export function statusCopy(status: RunStatus): { label: string; note: string } {
  switch (status) {
    case "running":
      return { label: "Running", note: "Stage gates are open for sign-off." };
    case "held":
      return { label: "Held", note: "Nothing advances while the run is held. Deliberate pause." };
    case "aborted":
      return {
        label: "Stood down",
        note: "The run was refused, not failed. Dining out is a correct outcome.",
      };
    case "complete":
      return { label: "Closed", note: "Every stage signed off. Service window carried." };
    default:
      return { label: "Idle", note: "No run open. Start one to take the stages in order." };
  }
}
