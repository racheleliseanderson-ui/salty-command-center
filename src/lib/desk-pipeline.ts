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
    name: "Guests & constraints",
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
        detail: "Attention is the scarcest input. Overstating it corrupts every later step.",
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
    name: "Menu",
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
    name: "Stress-test the night",
    owner: "Menu Builder",
    decision: "Can this kitchen finish this menu on time?",
    produces: "Balance · Make Ahead · Service Fit · Equipment Fit · Host Freedom",
    duration: "10 min",
    tool: "menu-builder",
    gates: [
      {
        id: "stress.clear",
        label: "No unresolved requirement",
        detail: "If a real requirement is not met, we'll stop rather than guess. Simplify within bounds or stand the plan down.",
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
    name: "Share with Occasions",
    owner: "Desk",
    decision: "What moves forward, and what stays behind?",
    produces: "Menu, stress summary, and locked dish",
    duration: "2 min",
    tool: "desk",
    gates: [
      {
        id: "handoff.scope",
        label: "Share carries the menu, not private notes",
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
    decision: "Is the plan held, or is it being improvised?",
    produces: "A night that finishes on time",
    duration: "During service",
    tool: "occasion-os",
    gates: [
      {
        id: "service.hold",
        label: "First course leaves the pass on the declared minute",
        detail: "The route is only real if the first course lands on time.",
        hard: false,
      },
    ],
  },
];

export const ALL_GATES: Gate[] = STAGES.flatMap((s) => s.gates);

export type Evidence = {
  id: string;
  stageId: string;
  gateId: string | null;
  name: string;
  size: number;
  type: string;
  addedAt: string;
  /** Inline copy, retained only for small files so the export is self-contained. */
  dataUrl: string | null;
};

export type RunState = {
  status: RunStatus;
  stage: number;
  gates: Record<string, boolean>;
  log: { at: string; kind: "control" | "gate" | "stage" | "stop" | "note" | "evidence"; text: string }[];
  startedAt: string | null;
  /** First-party notes, keyed by stage id. */
  notes: Record<string, string>;
  /** Attachment records, keyed by stage id. */
  evidence: Record<string, Evidence[]>;
};

export const EMPTY_RUN: RunState = {
  status: "idle",
  stage: 0,
  gates: {},
  log: [],
  startedAt: null,
  notes: {},
  evidence: {},
};

/** Bytes above which a file is recorded by reference only, never copied. */
export const EVIDENCE_INLINE_LIMIT = 1_000_000;

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

/** Deterministic, self-contained package of the run as it stands on this device. */
export function buildRunPackage(state: RunState) {
  return {
    format: "salty-desk.run-package",
    version: "1.1.0",
    exportedAt: new Date().toISOString(),
    run: {
      status: state.status,
      openedAt: state.startedAt,
      openStage: STAGES[state.stage]?.code ?? null,
      progress: `${runProgress(state)}%`,
    },
    stages: STAGES.map((s) => ({
      code: s.code,
      name: s.name,
      owner: s.owner,
      decision: s.decision,
      produces: s.produces,
      cleared: state.status === "complete" || STAGES.indexOf(s) < state.stage,
      gates: s.gates.map((g) => ({
        label: g.label,
        kind: g.hard ? "hard" : "soft",
        signed: state.gates[g.id] === true,
      })),
      notes: state.notes[s.id]?.trim() || null,
      evidence: (state.evidence[s.id] ?? []).map((e) => ({
        name: e.name,
        size: e.size,
        type: e.type,
        addedAt: e.addedAt,
        gate: s.gates.find((g) => g.id === e.gateId)?.label ?? null,
        retained: e.dataUrl ? "inline" : "by reference only",
        dataUrl: e.dataUrl,
      })),
    })),
    log: state.log,
    limits: [
      "No allergen or dietary safety guarantee at any stage.",
      "Evidence is first-party and local. Nothing was uploaded to produce this package.",
      "Files above 1 MB are listed by name, size and type only.",
    ],
  };
}

export function runPackageMarkdown(state: RunState) {
  const pkg = buildRunPackage(state);
  const lines: string[] = [
    "# Salty Desk — this plan",
    "",
    `- Exported: ${pkg.exportedAt}`,
    `- Status: ${statusCopy(state.status).label}`,
    `- Opened: ${state.startedAt ?? "—"}`,
    `- Open step: ${STAGES.find((st) => st.code === pkg.run.openStage)?.name ?? "—"} (${pkg.run.progress} cleared)`,
    "",
  ];
  for (const s of pkg.stages) {
    lines.push(`## ${s.name} — ${s.cleared ? "cleared" : "not cleared"}`);
    lines.push(`Owner: ${s.owner} · Decision: ${s.decision}`);
    lines.push("");
    for (const g of s.gates) {
      lines.push(`- [${g.signed ? "x" : " "}] (${g.kind === "hard" ? "required" : "optional"}) ${g.label}`);
    }
    lines.push("");
    lines.push(`Notes: ${s.notes ?? "—"}`);
    if (s.evidence.length) {
      lines.push("", "Evidence:");
      for (const e of s.evidence) {
        lines.push(
          `- ${e.name} · ${formatBytes(e.size)} · ${e.type || "unknown type"} · ${e.gate ? `requirement: ${e.gate}` : "step-level"} · ${e.retained}`,
        );
      }
    }
    lines.push("");
  }
  lines.push("## Standing limits", ...pkg.limits.map((l) => `- ${l}`), "");
  lines.push("## Plan log", ...state.log.map((e) => `- ${e.at} · ${e.kind} · ${e.text}`));
  return lines.join("\n");
}


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
      return { label: "In progress", note: "Checking each step before the plan moves on." };
    case "held":
      return { label: "Paused", note: "Nothing advances while paused. Deliberate pause." };
    case "aborted":
      return {
        label: "Stood down",
        note: "The plan was stopped, not failed. Dining out is a correct outcome.",
      };
    case "complete":
      return { label: "Ready", note: "Every step signed off. Service window carried." };
    default:
      return { label: "Ready to start", note: "Add information to begin. Take the steps in order." };
  }
}
