export type ToolStatus = "live" | "beta" | "planned";

export type Tool = {
  id: string;
  slug: "menu-builder" | "occasion-os" | "restaurant-intelligence";
  name: string;
  short: string;
  useWhen: string;
  notFor: string;
  decision: string;
  summary: string;
  status: ToolStatus;
  statusNote: string;
  href: string;
  metrics: { value: string; label: string }[];
  capabilities: string[];
  refusals: string[];
  handoffIn?: string;
  handoffOut?: string;
  track: "host" | "dine";
};

export const TOOLS: Tool[] = [
  {
    id: "SC-MB-001",
    slug: "menu-builder",
    name: "Menu Builder",
    short: "Menu architecture + stress test",
    useWhen: "You know you're cooking, but not whether the menu survives service.",
    notFor: "Deciding whether to host at all, or where to eat instead.",
    decision: "Can this kitchen finish this menu on time?",
    summary:
      "Five-role architecture, stress meters, anchor locking, bounded simplification, and hard stops. Scores Balance, Make Ahead, Service Fit, Equipment Fit, and Host Freedom from your declared inputs — then hands a clean packet to Occasion OS.",
    status: "live",
    statusNote: "Deterministic engine · browser-only storage",
    href: "https://salty-menu-builder.vercel.app/",
    metrics: [
      { value: "5", label: "Roles" },
      { value: "5", label: "Stress axes" },
      { value: "1.1.0", label: "Contract" },
      { value: "0.4.3", label: "Engine" },
    ],
    capabilities: [
      "Five roles with congruence / contrast / balanced pairing modes",
      "Operational stress test with hard stops (allergen boundary, plated capacity)",
      "Anchor re-scoring when you lock a dish",
      "Bounded budget-pressure simplification — additive, never formula-breaking",
    ],
    refusals: [
      "AI menu generation",
      "Allergen safety or cross-contact control",
      "Recipes, pricing, or nutrition advice",
      "Accounts or cloud sync",
    ],
    handoffOut: "Menu architecture + stress summary + anchor → Occasion OS",
    track: "host",
  },
  {
    id: "SC-OOS-001",
    slug: "occasion-os",
    name: "Occasion Operating System",
    short: "The night, sequenced",
    useWhen: "The menu is settled and the night still has to run itself.",
    notFor: "Choosing dishes, or ranking restaurants.",
    decision: "What happens, in what order, and who is holding it?",
    summary:
      "Set conditions, build a controlled hosting route, then shop, prep, and serve from one plan. Receives Menu Builder packets and keeps dietary categories as planning filters — never allergy guarantees.",
    status: "live",
    statusNote: "Host plan · local + plan state",
    href: "https://salty-occasion-os.vercel.app/",
    metrics: [
      { value: "2", label: "Modes" },
      { value: "3", label: "Route stages" },
      { value: "1.1.0", label: "Receives" },
      { value: "1.8.0", label: "Build" },
    ],
    capabilities: [
      "Condition-driven host plan: guests, service style, attention, capacity",
      "Controlled route — shop → prep → serve, without theater",
      "Menu Builder handoff receiver (contract 1.1.0)",
      "Food-safety boundary surfaced on every plan",
    ],
    refusals: [
      "Allergen-safe guarantees",
      "Silent cross-app inference",
      "Star ratings or social proof",
      "Forced accounts for core planning",
    ],
    handoffIn: "Menu Builder packet (contract 1.1.0)",
    handoffOut: "Optional occasion context → Restaurant Intelligence",
    track: "host",
  },
  {
    id: "SC-RI-001",
    slug: "restaurant-intelligence",
    name: "Restaurant Intelligence",
    short: "Dine out, with receipts",
    useWhen: "The night is better off-site and the room still has to fit the occasion.",
    notFor: "Cooking, prep sequencing, or menu construction.",
    decision: "Which room fits this occasion — and what must still be confirmed?",
    summary:
      "Situation-aware ranking from first-party evidence only. Multi-layer findings, booking pathways, confirm burden, guest-constraint matrix, and official conflicts — so you choose the room that fits the occasion, not the photograph.",
    status: "live",
    statusNote: "First-party case files · unknowns preserved",
    href: "https://salty-restaurant-intelligence.vercel.app/",
    metrics: [
      { value: "41+", label: "Case files" },
      { value: "26+", label: "Regions" },
      { value: "14", label: "Occasions" },
      { value: "6", label: "Pathways" },
    ],
    capabilities: [
      "Situation rank: occasion, party size, days-out, max commitment, planning load",
      "Multi-layer findings (critical + watch) with confidence labels",
      "Unknowns, thin fields, and official conflicts preserved — never collapsed",
      "Booking pathways: Phone, Resy, OpenTable, Tock, Direct",
    ],
    refusals: [
      "Star ratings or aggregator scores",
      "Silent resolution of conflicting claims",
      "Live menu scraping as gospel",
      "Skipping direct confirmation on operating changes",
    ],
    handoffIn: "Optional occasion context (reader-initiated)",
    handoffOut: "First-party case file + evidence trail → Salt Notes records",
    track: "dine",
  },
];

export const HANDOFFS = [
  {
    from: "Menu Builder",
    fromId: "SC-MB-001",
    to: "Occasion Operating System",
    toId: "SC-OOS-001",
    contract: "Contract 1.1.0",
    tag: "Primary",
    moves: [
      "Menu architecture (roles, dishes, pairing mode)",
      "Stress summary across five axes",
      "Locked anchor and its re-scoring effect",
    ],
    stays: [
      "Draft menus you discarded",
      "Simplification history and budget pressure inputs",
      "Anything you did not explicitly send",
    ],
  },
  {
    from: "Occasion Operating System",
    fromId: "SC-OOS-001",
    to: "Restaurant Intelligence",
    toId: "SC-RI-001",
    contract: "Reader-initiated",
    tag: "Optional",
    moves: [
      "Occasion type, party size, and date window",
      "Planning-filter dietary categories (never allergy claims)",
    ],
    stays: [
      "Full host plan, prep route, and shopping state",
      "Guest names and private notes",
      "Any inference about why you switched to dining out",
    ],
  },
  {
    from: "Restaurant Intelligence",
    fromId: "SC-RI-001",
    to: "Salt Notes records",
    toId: "Editorial",
    contract: "Public-safe packet",
    tag: "Optional",
    moves: ["First-party case file", "Evidence trail with confidence labels and open unknowns"],
    stays: ["Your shortlists and rejections", "Booking attempts and confirm burden notes"],
  },
];

export const BOUNDARIES = [
  "No allergen safety or cross-contact control — dietary tags are planning filters only",
  "No silent movement of data between tools until you choose a handoff",
  "No star ratings, social proof collapse, or inferred “best restaurant” rankings",
  "No forced account for core planning tools",
  "Educational only — not professional kitchen, medical, or legal advice",
  "Fail closed on hard stops: capacity, allergen boundary, official conflicts",
];

export const PHILOSOPHY = [
  { k: "Reader-job-first", v: "Every surface names the decision it serves before it shows a control." },
  { k: "Explicit handoffs only", v: "Nothing moves between tools unless you choose to move it." },
  { k: "Educational planning only", v: "Planning intelligence, not professional certification." },
  { k: "First-party evidence", v: "Case files come from the source, with unknowns left visible." },
  { k: "No allergen guarantees", v: "Dietary categories are filters. Safety stays with the kitchen." },
  { k: "Fail closed", v: "Hard constraints stop the plan instead of quietly degrading it." },
];

export const MENU_BUILDER = TOOLS[0]!;
export const OCCASION_OS = TOOLS[1]!;
export const RESTAURANT_INTELLIGENCE = TOOLS[2]!;

/* --------------------------------------------------------------------------
 * Suite telemetry — hand-curated, shaped so it can later be swapped for a
 * live feed without touching components.
 * ----------------------------------------------------------------------- */

export type Counter = { value: number; suffix?: string; label: string; note: string };

export const SUITE_COUNTERS: Counter[] = [
  { value: 41, suffix: "+", label: "Case files", note: "First-party restaurant records" },
  { value: 26, suffix: "+", label: "Regions", note: "Covered by Restaurant Intelligence" },
  { value: 14, label: "Occasions", note: "Situation types the suite recognises" },
  { value: 6, label: "Booking pathways", note: "Phone, Resy, OpenTable, Tock, Direct, Walk-in" },
  { value: 5, label: "Stress axes", note: "Balance, make-ahead, service, equipment, freedom" },
  { value: 5, label: "Menu roles", note: "Architecture slots per menu" },
];

export type LedgerRow = {
  id: string;
  name: string;
  state: "Live" | "Beta" | "Planned";
  build: string;
  contract: string;
  updated: string;
  accepts: string;
  rejects: string;
};

export const LEDGER: LedgerRow[] = [
  {
    id: "SC-MB-001",
    name: "Menu Builder",
    state: "Live",
    build: "Engine 0.4.3",
    contract: "Emits 1.1.0",
    updated: "2026-07-30",
    accepts: "Declared occasion, guests, service style, attention, equipment",
    rejects: "Allergen safety claims, recipes, pricing, cloud accounts",
  },
  {
    id: "SC-OOS-001",
    name: "Occasion Operating System",
    state: "Live",
    build: "Build 1.8.0",
    contract: "Receives 1.1.0",
    updated: "2026-07-22",
    accepts: "Menu Builder packets, host conditions, capacity and attention",
    rejects: "Silent cross-app inference, allergen guarantees, forced accounts",
  },
  {
    id: "SC-RI-001",
    name: "Restaurant Intelligence",
    state: "Live",
    build: "Case set 41",
    contract: "Reader-initiated",
    updated: "2026-08-04",
    accepts: "Occasion, party size, days-out, commitment ceiling, planning load",
    rejects: "Aggregator scores, resolved conflicts, unverified operating changes",
  },
];

export const DESK_LOG = [
  {
    date: "2026-08-04",
    id: "SC-RI-001",
    entry: "Confirm-burden labels split from booking pathway; conflicts now surfaced separately.",
  },
  {
    date: "2026-07-30",
    id: "SC-MB-001",
    entry: "Plated-capacity hard stop tightened; anchor re-scoring now reruns all five axes.",
  },
  {
    date: "2026-07-22",
    id: "SC-OOS-001",
    entry: "Handoff receiver pinned to contract 1.1.0; dietary tags labelled as planning filters.",
  },
  {
    date: "2026-07-14",
    id: "Desk",
    entry: "Triage console added: the desk now names the wrong tool as clearly as the right one.",
  },
];

export const GLOSSARY = [
  {
    term: "Anchor",
    def: "A dish you lock before the rest of the menu is scored. Locking one re-scores every other role against it.",
  },
  {
    term: "Hard stop",
    def: "A refusal, not a warning. The plan does not continue past a hard stop — capacity, allergen boundary, or an official conflict.",
  },
  {
    term: "Stress axis",
    def: "One of five operational readings: Balance, Make Ahead, Service Fit, Equipment Fit, Host Freedom.",
  },
  {
    term: "Contract version",
    def: "The versioned shape of a handoff packet. A receiver states which version it accepts; mismatches fail closed.",
  },
  {
    term: "Confirm burden",
    def: "How much you must still verify directly with a room before the booking is real.",
  },
  {
    term: "Thin field",
    def: "A record with too little first-party evidence to rank confidently. Kept visible rather than filled in.",
  },
  {
    term: "Planning filter",
    def: "A dietary category used to shape a plan. Never a safety guarantee — cross-contact stays with the kitchen.",
  },
  {
    term: "Fail closed",
    def: "When a constraint is breached, the tool stops instead of quietly degrading the plan.",
  },
];

export type ToolDetail = {
  slug: Tool["slug"];
  inputs: string[];
  returns: string[];
  hardStops: string[];
  wrongTool: { name: string; reason: string }[];
};

export const TOOL_DETAILS: Record<Tool["slug"], ToolDetail> = {
  "menu-builder": {
    slug: "menu-builder",
    inputs: [
      "Occasion type and guest count",
      "Service style — plated, family, buffet, standing",
      "Host attention available during service",
      "Oven, burner, cold, and counter capacity",
      "Budget pressure, if any",
    ],
    returns: [
      "Five-role menu architecture with pairing mode",
      "Stress reading across all five axes",
      "Hard stops with the constraint that triggered them",
      "Anchor effect when a dish is locked",
      "A packet Occasion OS accepts at contract 1.1.0",
    ],
    hardStops: [
      "Plated service beyond declared capacity",
      "Allergen boundary reached — the tool refuses rather than reassures",
      "Equipment contention that cannot be sequenced away",
    ],
    wrongTool: [
      { name: "Occasion Operating System", reason: "Sequences the night; it does not choose dishes." },
      { name: "Restaurant Intelligence", reason: "Ranks rooms; it has no view of your kitchen." },
    ],
  },
  "occasion-os": {
    slug: "occasion-os",
    inputs: [
      "A settled menu — ideally a Menu Builder packet",
      "Guests, service style, and room constraints",
      "Attention you can hold during service",
      "Days available before the night",
    ],
    returns: [
      "Condition-driven host plan",
      "Shop → prep → serve route with holding points",
      "Dietary categories carried forward as planning filters",
      "Food-safety boundary printed on every plan",
    ],
    hardStops: [
      "Prep route that cannot fit the days declared",
      "Service plan that exceeds host attention",
      "Any request to certify a dish as allergen-safe",
    ],
    wrongTool: [
      { name: "Menu Builder", reason: "Decides whether the menu survives; run it first." },
      { name: "Restaurant Intelligence", reason: "The alternative when hosting does not survive." },
    ],
  },
  "restaurant-intelligence": {
    slug: "restaurant-intelligence",
    inputs: [
      "Occasion and party size",
      "Days out and the commitment ceiling you accept",
      "Planning load you are willing to carry",
      "Guest constraints as planning filters",
    ],
    returns: [
      "Situation rank across first-party case files",
      "Critical and watch findings with confidence labels",
      "Booking pathway and confirm burden",
      "Open unknowns and official conflicts, preserved",
    ],
    hardStops: [
      "Conflicting official claims — surfaced, never resolved silently",
      "Thin field: too little evidence to rank",
      "Operating change that must be confirmed directly before booking",
    ],
    wrongTool: [
      { name: "Menu Builder", reason: "For cooking decisions, not rooms." },
      { name: "Occasion Operating System", reason: "For running a night you are hosting yourself." },
    ],
  },
};
