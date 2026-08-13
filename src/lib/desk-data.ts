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

/* --------------------------------------------------------------------------
 * Single source of truth — card metrics, hero counters, and the ledger
 * all read from these objects so they cannot drift apart again.
 * ----------------------------------------------------------------------- */

/**
 * Restaurant Intelligence corpus snapshot (coverage.json, 2026-08-12).
 *
 * A **case file** is every first-party record in the live set — thin fields
 * and unknowns included, each with an openable dossier. The enriched/resolved
 * subset is tracked separately and is never labelled "case files".
 *
 * Regions are jurisdictions (14 US states + British Columbia), not metro areas.
 */
export const RI_COVERAGE = {
  caseFiles: 225,
  enriched: 111,
  regions: 15,
  usStates: 14,
  outsideUs: "British Columbia",
  regionNote: "14 US states + British Columbia",
  occasions: 14,
  pathways: 6,
  generatedAt: "2026-08-12",
} as const;

/** Public build / contract identity for each tool. */
export const TOOL_VERSIONS = {
  "menu-builder": {
    package: "0.6.0",
    engine: "0.4.3",
    contract: "1.1.0",
    build: "Package 0.6.0 · Engine 0.4.3",
  },
  "occasion-os": {
    build: "Host Planning Instrument V2",
    shortBuild: "V2",
    contract: "1.1.0",
  },
  "restaurant-intelligence": {
    build: `Case set ${RI_COVERAGE.caseFiles}`,
    contract: "Reader-initiated",
  },
} as const;

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
    statusNote: "Standalone instrument · also layered inside Occasion OS as Architecture",
    href: "https://occasion.saltnotes.blog/architecture",
    metrics: [
      { value: "5", label: "Roles" },
      { value: "5", label: "Stress axes" },
      { value: TOOL_VERSIONS["menu-builder"].contract, label: "Contract" },
      { value: TOOL_VERSIONS["menu-builder"].package, label: "Package" },
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
      "Host shell with three layers: Plan (night route), Architecture (menu stress under the same chrome), and Card (table wording). Receives Menu Builder packets (contract 1.1.0) and keeps dietary categories as planning filters — never allergy guarantees.",
    status: "live",
    statusNote: "Host Planning Instrument · local plan state",
    href: "https://occasion.saltnotes.blog",
    metrics: [
      { value: "2", label: "Modes" },
      { value: "3", label: "Route stages" },
      { value: TOOL_VERSIONS["occasion-os"].contract, label: "Receives" },
      { value: TOOL_VERSIONS["occasion-os"].shortBuild, label: "Build" },
    ],
    capabilities: [
      "Layered host path: Plan · Architecture · Card under one visual system",
      "Condition-driven host plan: guests, service style, attention, capacity",
      "Controlled route — shop → prep → serve, without theater",
      "In-app Architecture (SC-MB-001 engine) + contract 1.1.0 apply-to-plan",
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
    statusNote: `${RI_COVERAGE.caseFiles} first-party case files · unknowns preserved`,
    href: "https://deepdish.saltnotes.blog",
    metrics: [
      { value: String(RI_COVERAGE.caseFiles), label: "Case files" },
      { value: String(RI_COVERAGE.regions), label: "Regions" },
      { value: String(RI_COVERAGE.occasions), label: "Occasions" },
      { value: String(RI_COVERAGE.pathways), label: "Pathways" },
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

export type PacketRow = { field: string; reason: string };

export type Handoff = {
  from: string;
  fromId: string;
  to: string;
  toId: string;
  contract: string;
  tag: string;
  purpose: string;
  breaksIf: string;
  moves: PacketRow[];
  stays: PacketRow[];
  canConclude: string[];
  cannotConclude: string[];
};

export const HANDOFFS: Handoff[] = [
  {
    from: "Menu Builder",
    fromId: "SC-MB-001",
    to: "Occasion Operating System",
    toId: "SC-OOS-001",
    contract: "Contract 1.1.0",
    tag: "Primary",
    purpose:
      "So the night can be sequenced against a menu that has already been stress-tested — not against a wish list. Primary path can run in-app (Architecture → Plan) or cross-origin from standalone Menu Builder.",
    breaksIf:
      "If drafts and simplification history travelled too, Occasion OS would route a menu you already rejected.",
    moves: [
      {
        field: "Menu architecture (roles, dishes, pairing mode)",
        reason: "The prep route is built per dish role; without roles there is no sequence to build.",
      },
      {
        field: "Stress summary across five axes",
        reason: "Occasion OS needs the pressure profile to know which step to protect first.",
      },
      {
        field: "Locked anchor and its re-scoring effect",
        reason: "An anchor fixes one dish's timing; the route has to respect it, not re-litigate it.",
      },
    ],
    stays: [
      {
        field: "Draft menus you discarded",
        reason: "A rejected draft is not a decision. Sending it would let it be re-proposed.",
      },
      {
        field: "Simplification history and budget pressure inputs",
        reason: "These are reasoning, not output. Occasion OS has no job that needs them.",
      },
      {
        field: "Anything you did not explicitly send",
        reason: "There is no background sync. Silence is withholding, not consent.",
      },
    ],
    canConclude: [
      "Which dishes need heat, hands, or the pass at the same moment",
      "Where the plan is already at capacity before guests arrive",
    ],
    cannotConclude: [
      "Why you chose this menu over another",
      "That any dietary category is an allergy-safe claim",
    ],
  },
  {
    from: "Occasion Operating System",
    fromId: "SC-OOS-001",
    to: "Restaurant Intelligence",
    toId: "SC-RI-001",
    contract: "Reader-initiated",
    tag: "Optional",
    purpose:
      "So a room can be ranked against the same occasion you were planning — when hosting is no longer the right outcome.",
    breaksIf:
      "If the host plan travelled, a restaurant surface would hold your kitchen state for a night that is not happening.",
    moves: [
      {
        field: "Occasion type, party size, and date window",
        reason: "Capacity and booking fit cannot be ranked without these three.",
      },
      {
        field: "Planning-filter dietary categories (never allergy claims)",
        reason: "Used to filter rooms worth calling — the confirm still happens live, with the kitchen.",
      },
    ],
    stays: [
      {
        field: "Full host plan, prep route, and shopping state",
        reason: "None of it has a reader job on the dine-out side.",
      },
      {
        field: "Guest names and private notes",
        reason: "Packets are public-safe. Guest identity never leaves the tool it was typed into.",
      },
      {
        field: "Any inference about why you switched to dining out",
        reason: "The desk does not build a motive record. The switch is a choice, not a signal.",
      },
    ],
    canConclude: [
      "Which rooms can physically seat the party in the window",
      "Which rooms are worth the confirm call for your filters",
    ],
    cannotConclude: [
      "That a room is allergy-safe for anyone at the table",
      "That hosting failed, or why",
    ],
  },
  {
    from: "Restaurant Intelligence",
    fromId: "SC-RI-001",
    to: "Salt Notes records",
    toId: "Editorial",
    contract: "Public-safe packet",
    tag: "Optional",
    purpose:
      "So a night you actually had becomes a first-party record with its unknowns still visible.",
    breaksIf:
      "If shortlists and rejections travelled, the record would read as a ranking you never published.",
    moves: [
      {
        field: "First-party case file",
        reason: "What was observed at the source, dated, with the observer's position stated.",
      },
      {
        field: "Evidence trail with confidence labels and open unknowns",
        reason: "A record without its unknowns reads as certainty it never had.",
      },
    ],
    stays: [
      {
        field: "Your shortlists and rejections",
        reason: "A rejection is private judgment, not evidence about the room.",
      },
      {
        field: "Booking attempts and confirm burden notes",
        reason: "Operational friction on your side says nothing durable about the venue.",
      },
    ],
    canConclude: [
      "What was true at that room, on that date, from the source",
      "Which questions were left open",
    ],
    cannotConclude: [
      "A star rating or a 'best restaurant' ordering",
      "Anything about rooms you considered but never visited",
    ],
  },
];

export type BoundaryGroup = "Safety" | "Data movement" | "Evidence" | "Scope";

export type Boundary = {
  id:
    | "allergen"
    | "movement"
    | "rankings"
    | "account"
    | "educational"
    | "fail-closed";
  group: BoundaryGroup;
  limit: string;
  why: string;
  instead: string;
};

export const BOUNDARIES: Boundary[] = [
  {
    id: "allergen",
    group: "Safety",
    limit: "No allergen safety or cross-contact control",
    why: "Cross-contact is a kitchen-surface and handling problem. No planning tool can observe it, so no planning tool can certify it.",
    instead:
      "Dietary categories work as planning filters. The safety conversation happens live, with whoever is cooking.",
  },
  {
    id: "fail-closed",
    group: "Safety",
    limit: "Fail closed on hard stops: capacity, allergen boundary, official conflicts",
    why: "A quietly degraded plan is more dangerous than a refused one, because it still looks like a plan.",
    instead:
      "The tool refuses and names the breached constraint. A refusal is an outcome, not an error to click past.",
  },
  {
    id: "movement",
    group: "Data movement",
    limit: "No silent movement of data between tools",
    why: "Each tool owns its own state. Background sync would make a handoff something you did not choose.",
    instead:
      "You send a public-safe packet, and the map shows what travels and what is withheld before you send it.",
  },
  {
    id: "account",
    group: "Data movement",
    limit: "No forced account for core planning tools",
    why: "Planning is local work. An account requirement would collect identity the tools do not need.",
    instead: "Core planning runs on local state. Nothing is uploaded to use the desk.",
  },
  {
    id: "rankings",
    group: "Evidence",
    limit: "No star ratings, social-proof collapse, or inferred “best restaurant” rankings",
    why: "A single score hides the disagreement that made it. Collapsed proof cannot be audited.",
    instead:
      "First-party case files with confidence labels and open unknowns left visible, ranked only against your stated occasion.",
  },
  {
    id: "educational",
    group: "Scope",
    limit: "Educational planning only — not professional kitchen, medical, or legal advice",
    why: "The suite has no view of your kitchen, your health, or your jurisdiction.",
    instead:
      "Use it to make the decision legible, then take the decision to the people qualified to certify it.",
  },
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
 * Suite telemetry — derived from RI_COVERAGE / TOOL_VERSIONS so it can later
 * be swapped for a live feed without touching components.
 * ----------------------------------------------------------------------- */

export type Counter = { value: number; suffix?: string; label: string; note: string };

export const SUITE_COUNTERS: Counter[] = [
  { value: RI_COVERAGE.caseFiles, label: "Case files", note: "First-party restaurant records" },
  { value: RI_COVERAGE.regions, label: "Regions", note: RI_COVERAGE.regionNote },
  { value: RI_COVERAGE.occasions, label: "Occasions", note: "Situation types the suite recognises" },
  { value: RI_COVERAGE.pathways, label: "Booking pathways", note: "Phone, Resy, OpenTable, Tock, Direct, Walk-in" },
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
    build: TOOL_VERSIONS["menu-builder"].build,
    contract: `Emits ${TOOL_VERSIONS["menu-builder"].contract}`,
    updated: "2026-08-11",
    accepts: "Declared occasion, guests, service style, attention, equipment",
    rejects: "Allergen safety claims, recipes, pricing, cloud accounts",
  },
  {
    id: "SC-OOS-001",
    name: "Occasion Operating System",
    state: "Live",
    build: TOOL_VERSIONS["occasion-os"].build,
    contract: `Receives ${TOOL_VERSIONS["occasion-os"].contract}`,
    updated: "2026-08-11",
    accepts: "Menu Builder packets, host conditions, capacity and attention",
    rejects: "Silent cross-app inference, allergen guarantees, forced accounts",
  },
  {
    id: "SC-RI-001",
    name: "Restaurant Intelligence",
    state: "Live",
    build: TOOL_VERSIONS["restaurant-intelligence"].build,
    contract: TOOL_VERSIONS["restaurant-intelligence"].contract,
    updated: RI_COVERAGE.generatedAt,
    accepts: "Occasion, party size, days-out, commitment ceiling, planning load",
    rejects: "Aggregator scores, resolved conflicts, unverified operating changes",
  },
];

export const DESK_LOG = [
  {
    date: "2026-08-12",
    id: "SC-OOS-001",
    entry: "Architecture layer shipped inside Occasion OS: Plan · Architecture · Card under one chrome. SC-MB-001 engine runs in-app; standalone Menu Builder remains live.",
  },
  {
    date: "2026-08-11",
    id: "Desk",
    entry: "Production URLs locked: Menu Builder, Occasion OS (planner-suite), RI (deep-dish). Menu Builder elevated to 0.6.0 with scenario spine and packet stage.",
  },
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
