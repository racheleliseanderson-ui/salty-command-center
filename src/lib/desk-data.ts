export type ToolStatus = "live" | "beta" | "planned";

export type ToolSuite = "host" | "layer" | "dine" | "architecture";

export type Tool = {
  id: string;
  slug: "kitchen-bar" | "menu-builder" | "occasion-os" | "restaurant-intelligence";
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
  suite: ToolSuite;
  fleet: boolean;
};

const RI_CASE_FILES = 225;
const RI_ENRICHED = 111;

export const RI_COVERAGE = {
  caseFiles: RI_CASE_FILES,
  enriched: RI_ENRICHED,
  neverEnriched: RI_CASE_FILES - RI_ENRICHED,
  regions: 15,
  usStates: 14,
  outsideUs: "British Columbia",
  regionNote: "14 US states + British Columbia",
  occasions: 14,
  pathways: 6,
  generatedAt: "2026-08-12",
} as const;

export const TOOL_VERSIONS = {
  "kitchen-bar": { build: "Availability Packet 1.0", contract: "1.0" },
  "menu-builder": { package: "0.6.0", engine: "0.4.3", contract: "1.1.0", build: "Package 0.6.0 · Engine 0.4.3" },
  "occasion-os": { build: "Host Planning Instrument V2", shortBuild: "V2", contract: "1.1.0" },
  "restaurant-intelligence": { build: `Case set ${RI_COVERAGE.caseFiles} · ${RI_COVERAGE.enriched} enriched`, contract: "Reader-initiated" },
} as const;

export const TOOLS: Tool[] = [
  {
    id: "SC-KBI-001", slug: "kitchen-bar", name: "Kitchen & Bar Intelligence", short: "See the shelf. Rank the pour.",
    useWhen: "You're cooking from what's already on the pantry and bar — not from a shopping list.",
    notFor: "Sequencing a hosted night, ranking restaurants, or certifying allergens.",
    decision: "What's on the shelf, what pairs, and what can you cook from it tonight?",
    summary: "Daily pantry and bar layer. Scan a shelf, rank a pour, match what's already in the house, then hand a clean availability packet to Occasion OS. Pairing is explainable chemistry plus recipe practice — Occasions stays the planner.",
    status: "live", statusNote: "Availability Packet 1.0", href: "https://kitchen.saltnotes.blog/",
    metrics: [{ value: "90s", label: "Bar reads" }, { value: "1.0", label: "Packet" }],
    capabilities: ["Vision: scan a shelf or fridge, review every candidate, then commit", "Pairing: molecular overlap plus recipe co-occurrence, with explainable scores", "Inventory + match: local-first pantry and bar, expiry ranking, Almost, Smart Buy", "Availability Packet 1.0 — you send it; nothing moves silently"],
    refusals: ["Allergen claims or cross-contact control", "Silent inference into Occasion OS", "Replacing the occasion planner", "Recipes treated as gospel"],
    handoffOut: "Availability Packet 1.0 → Occasion OS (user-initiated)", track: "host", suite: "layer", fleet: true,
  },
  {
    id: "SC-MB-001", slug: "menu-builder", name: "Menu Builder", short: "Menu architecture + stress test",
    useWhen: "You know you're cooking, but not whether the menu survives service.",
    notFor: "Deciding whether to host at all, or where to eat instead.",
    decision: "Can this kitchen finish this menu on time?",
    summary: "Five-role architecture, stress meters, anchor locking, bounded simplification, and hard stops. Scores Balance, Make Ahead, Service Fit, Equipment Fit, and Host Freedom from declared inputs — then hands a clean packet to Occasion OS.",
    status: "live", statusNote: "Architecture layer inside Occasion OS · contract 1.1.0", href: "https://occasion.saltnotes.blog/architecture",
    metrics: [{ value: "5", label: "Roles" }, { value: "5", label: "Stress axes" }],
    capabilities: ["Five roles with congruence / contrast / balanced pairing modes", "Operational stress test with hard stops (allergen boundary, plated capacity)", "Anchor re-scoring when you lock a dish", "Bounded budget-pressure simplification — additive, never formula-breaking"],
    refusals: ["AI menu generation", "Allergen safety or cross-contact control", "Recipes, pricing, or nutrition advice", "Accounts or cloud sync"],
    handoffOut: "Menu architecture + stress summary + anchor → Occasion OS", track: "host", suite: "architecture", fleet: false,
  },
  {
    id: "SC-OOS-001", slug: "occasion-os", name: "Occasion Operating System", short: "The night, sequenced",
    useWhen: "The menu is settled and the night still has to run itself.",
    notFor: "Choosing dishes, ranking restaurants, or reading the pantry.",
    decision: "What happens, in what order, and who is holding it?",
    summary: "Host planning instrument with Plan, Architecture (five-role menu stress — the SC-MB-001 engine, in-app), and Card under one chrome. Receives Kitchen & Bar Availability Packet 1.0. Architecture is not a separate peer tool on this desk — it lives here. Dietary categories stay planning filters — never allergy guarantees.",
    status: "live", statusNote: "Host Planning Instrument · local plan state", href: "https://occasion.saltnotes.blog",
    metrics: [{ value: "3", label: "Layers" }, { value: "1.1.0", label: "Receives" }],
    capabilities: ["Layered host path: Plan · Architecture · Card under one visual system", "Condition-driven host plan: guests, service style, attention, capacity", "Controlled route — shop → prep → serve, without theater", "In-app Architecture (SC-MB-001 engine) + contract 1.1.0 apply-to-plan", "Food-safety boundary surfaced on every plan"],
    refusals: ["Allergen-safe guarantees", "Silent cross-app inference", "Star ratings or social proof", "Forced accounts for core planning"],
    handoffIn: "Menu Builder packet (contract 1.1.0) · Kitchen & Bar Availability Packet 1.0",
    handoffOut: "Optional occasion context → Restaurant Intelligence", track: "host", suite: "host", fleet: true,
  },
  {
    id: "SC-RI-001", slug: "restaurant-intelligence", name: "Restaurant Intelligence", short: "Dine out, with receipts",
    useWhen: "The night is better off-site and the room still has to fit the occasion.",
    notFor: "Cooking, pantry matching, prep sequencing, or menu construction.",
    decision: "Which room fits this occasion — and what must still be confirmed?",
    summary: "Situation-aware ranking from first-party evidence only. Multi-layer findings, booking pathways, confirm burden, guest-constraint matrix, and official conflicts — so you choose the room that fits the occasion, not the photograph.",
    status: "live", statusNote: `${RI_COVERAGE.caseFiles} first-party case files · ${RI_COVERAGE.regions} regions`, href: "https://deepdish.saltnotes.blog",
    metrics: [{ value: String(RI_COVERAGE.caseFiles), label: "Case files" }, { value: String(RI_COVERAGE.regions), label: "Regions" }],
    capabilities: ["Situation rank: occasion, party size, days-out, max commitment, planning load", "Multi-layer findings (critical + watch) with confidence labels", "Unknowns, thin fields, and official conflicts preserved — never collapsed", "Booking pathways: Phone, Resy, OpenTable, Tock, Direct"],
    refusals: ["Star ratings or aggregator scores", "Silent resolution of conflicting claims", "Live menu scraping as gospel", "Skipping direct confirmation on operating changes"],
    handoffIn: "Optional occasion context (reader-initiated)",
    handoffOut: "First-party case file + evidence trail → Salt Notes records", track: "dine", suite: "dine", fleet: true,
  },
];

export type PacketRow = { field: string; reason: string };

export type Handoff = {
  from: string; fromId: string; to: string; toId: string; contract: string; tag: string; purpose: string; breaksIf: string;
  moves: PacketRow[]; stays: PacketRow[]; canConclude: string[]; cannotConclude: string[];
};

export const HANDOFFS: Handoff[] = [
  {
    from: "Kitchen & Bar Intelligence", fromId: "SC-KBI-001", to: "Occasion Operating System", toId: "SC-OOS-001",
    contract: "Availability Packet 1.0", tag: "Primary",
    purpose: "So the night is planned against what is actually on the shelf — not against a shopping list you have not yet committed.",
    breaksIf: "If recipes, guest names, or inferred allergen claims travelled, Occasion OS would treat a pantry snapshot as a certified plan.",
    moves: [
      { field: "Confirmed pantry and bar contents", reason: "The route can only sequence what is actually available." },
      { field: "Declared intent (cook, mix, pack)", reason: "Occasion OS needs the job, not the vision candidates you discarded." },
    ],
    stays: [
      { field: "Raw vision candidates you did not confirm", reason: "Unreviewed detections are not inventory." },
      { field: "Recipes, pairing scores, and shopping suggestions", reason: "Those are local execution, not occasion state." },
      { field: "Anything you did not explicitly send", reason: "There is no background sync. Silence is withholding, not consent." },
    ],
    canConclude: ["What is on the shelf tonight", "Which declared items can leave as an availability packet"],
    cannotConclude: ["That a dish is allergen-safe", "That Occasion OS should silently adopt the pantry as the menu"],
  },
  {
    from: "Menu Builder", fromId: "SC-MB-001", to: "Occasion Operating System", toId: "SC-OOS-001",
    contract: "Contract 1.1.0", tag: "Primary",
    purpose: "So the night can be sequenced against a menu that has already been stress-tested — not against a wish list.",
    breaksIf: "If drafts and simplification history travelled too, Occasion OS would route a menu you already rejected.",
    moves: [
      { field: "Menu architecture (roles, dishes, pairing mode)", reason: "The prep route is built per dish role; without roles there is no sequence to build." },
      { field: "Stress summary across five axes", reason: "Occasion OS needs the pressure profile to know which step to protect first." },
      { field: "Locked anchor and its re-scoring effect", reason: "An anchor fixes one dish's timing; the route has to respect it, not re-litigate it." },
    ],
    stays: [
      { field: "Draft menus you discarded", reason: "A rejected draft is not a decision. Sending it would let it be re-proposed." },
      { field: "Simplification history and budget pressure inputs", reason: "These are reasoning, not output. Occasion OS has no job that needs them." },
      { field: "Anything you did not explicitly send", reason: "There is no background sync. Silence is withholding, not consent." },
    ],
    canConclude: ["Which dishes need heat, hands, or the pass at the same moment", "Where the plan is already at capacity before guests arrive"],
    cannotConclude: ["Why you chose this menu over another", "That any dietary category is an allergy-safe claim"],
  },
  {
    from: "Occasion Operating System", fromId: "SC-OOS-001", to: "Restaurant Intelligence", toId: "SC-RI-001",
    contract: "Reader-initiated", tag: "Optional",
    purpose: "So a room can be ranked against the same occasion you were planning — when hosting is no longer the right outcome.",
    breaksIf: "If the host plan travelled, a restaurant surface would hold your kitchen state for a night that is not happening.",
    moves: [
      { field: "Occasion type, party size, and date window", reason: "Capacity and booking fit cannot be ranked without these three." },
      { field: "Planning-filter dietary categories (never allergy claims)", reason: "Used to filter rooms worth calling — the confirm still happens live, with the kitchen." },
    ],
    stays: [
      { field: "Full host plan, prep route, and shopping state", reason: "None of it has a reader job on the dine-out side." },
      { field: "Guest names and private notes", reason: "Packets are public-safe. Guest identity never leaves the tool it was typed into." },
      { field: "Any inference about why you switched to dining out", reason: "The desk does not build a motive record. The switch is a choice, not a signal." },
    ],
    canConclude: ["Which rooms can physically seat the party in the window", "Which rooms are worth the confirm call for your filters"],
    cannotConclude: ["That a room is allergy-safe for anyone at the table", "That hosting failed, or why"],
  },
  {
    from: "Restaurant Intelligence", fromId: "SC-RI-001", to: "Salt Notes records", toId: "Editorial",
    contract: "Public-safe packet", tag: "Optional",
    purpose: "So a night you actually had becomes a first-party record with its unknowns still visible.",
    breaksIf: "If shortlists and rejections travelled, the record would read as a ranking you never published.",
    moves: [
      { field: "First-party case file", reason: "What was observed at the source, dated, with the observer's position stated." },
      { field: "Evidence trail with confidence labels and open unknowns", reason: "A record without its unknowns reads as certainty it never had." },
    ],
    stays: [
      { field: "Your shortlists and rejections", reason: "A rejection is private judgment, not evidence about the room." },
      { field: "Booking attempts and confirm burden notes", reason: "Operational friction on your side says nothing durable about the venue." },
    ],
    canConclude: ["What was true at that room, on that date, from the source", "Which questions were left open"],
    cannotConclude: ["A star rating or a 'best restaurant' ordering", "Anything about rooms you considered but never visited"],
  },
];

export type BoundaryGroup = "Safety" | "Data movement" | "Evidence" | "Scope";

export type Boundary = {
  id: "allergen" | "movement" | "rankings" | "account" | "educational" | "fail-closed";
  group: BoundaryGroup; limit: string; why: string; instead: string;
};

export const BOUNDARIES: Boundary[] = [
  { id: "allergen", group: "Safety", limit: "No allergen safety or cross-contact control", why: "Cross-contact is a kitchen-surface and handling problem. No planning tool can observe it, so no planning tool can certify it.", instead: "Dietary categories work as planning filters. The safety conversation happens live, with whoever is cooking." },
  { id: "fail-closed", group: "Safety", limit: "Fail closed on hard stops: capacity, allergen boundary, official conflicts", why: "A quietly degraded plan is more dangerous than a refused one, because it still looks like a plan.", instead: "The tool refuses and names the breached constraint. A refusal is an outcome, not an error to click past." },
  { id: "movement", group: "Data movement", limit: "No silent movement of data between tools", why: "Each tool owns its own state. Background sync would make a handoff something you did not choose.", instead: "You send a public-safe packet, and the map shows what travels and what is withheld before you send it." },
  { id: "account", group: "Data movement", limit: "No forced account for core planning tools", why: "Planning is local work. An account requirement would collect identity the tools do not need.", instead: "Core planning runs on local state. Nothing is uploaded to use the desk." },
  { id: "rankings", group: "Evidence", limit: "No star ratings, social-proof collapse, or inferred “best restaurant” rankings", why: "A single score hides the disagreement that made it. Collapsed proof cannot be audited.", instead: "First-party case files with confidence labels and open unknowns left visible, ranked only against your stated occasion." },
  { id: "educational", group: "Scope", limit: "Educational planning only — not professional kitchen, medical, or legal advice", why: "The suite has no view of your kitchen, your health, or your jurisdiction.", instead: "Use it to make the decision legible, then take the decision to the people qualified to certify it." },
];

export const PHILOSOPHY = [
  { k: "Reader-job-first", v: "Every surface names the decision it serves before it shows a control." },
  { k: "Explicit handoffs only", v: "Nothing moves between tools unless you choose to move it." },
  { k: "Educational planning only", v: "Planning intelligence, not professional certification." },
  { k: "First-party evidence", v: "Case files come from the source, with unknowns left visible." },
  { k: "No allergen guarantees", v: "Dietary categories are filters. Safety stays with the kitchen." },
  { k: "Fail closed", v: "Hard constraints stop the plan instead of quietly degrading it." },
];

export const KITCHEN_BAR = TOOLS.find((t) => t.slug === "kitchen-bar")!;
export const MENU_BUILDER = TOOLS.find((t) => t.slug === "menu-builder")!;
export const OCCASION_OS = TOOLS.find((t) => t.slug === "occasion-os")!;
export const RESTAURANT_INTELLIGENCE = TOOLS.find((t) => t.slug === "restaurant-intelligence")!;

export type Counter = { value: number; suffix?: string; label: string; note: string };

export const SUITE_COUNTERS: Counter[] = [
  { value: 3, label: "Live tools", note: "Kitchen & Bar · Occasion OS · Restaurant Intelligence" },
  { value: RI_COVERAGE.caseFiles, label: "Case files", note: `${RI_COVERAGE.enriched} enriched · first-party only` },
  { value: RI_COVERAGE.regions, label: "Regions", note: RI_COVERAGE.regionNote },
  { value: 1, suffix: ".0", label: "Kitchen packet", note: "Availability Packet, user-initiated" },
];

export type LedgerRow = {
  id: string; name: string; state: "Live" | "Beta" | "Planned"; build: string; contract: string; updated: string; accepts: string; rejects: string;
};

export const LEDGER: LedgerRow[] = [
  { id: "SC-KBI-001", name: "Kitchen & Bar Intelligence", state: "Live", build: TOOL_VERSIONS["kitchen-bar"].build, contract: `Emits ${TOOL_VERSIONS["kitchen-bar"].contract}`, updated: "2026-08-19", accepts: "Shelf or fridge scan, local inventory, declared cook/mix intent", rejects: "Allergen claims, silent inference, replacing Occasion OS" },
  { id: "SC-MB-001", name: "Architecture (inside Occasion OS)", state: "Live", build: TOOL_VERSIONS["menu-builder"].build, contract: `Emits ${TOOL_VERSIONS["menu-builder"].contract}`, updated: "2026-08-11", accepts: "Declared occasion, guests, service style, attention, equipment", rejects: "Allergen safety claims, recipes, pricing, cloud accounts" },
  { id: "SC-OOS-001", name: "Occasion Operating System", state: "Live", build: TOOL_VERSIONS["occasion-os"].build, contract: `Receives ${TOOL_VERSIONS["occasion-os"].contract} · Packet 1.0`, updated: "2026-08-11", accepts: "Menu Builder packets, Kitchen & Bar packets, host conditions, capacity and attention", rejects: "Silent cross-app inference, allergen guarantees, forced accounts" },
  { id: "SC-RI-001", name: "Restaurant Intelligence", state: "Live", build: TOOL_VERSIONS["restaurant-intelligence"].build, contract: TOOL_VERSIONS["restaurant-intelligence"].contract, updated: RI_COVERAGE.generatedAt, accepts: "Occasion, party size, days-out, commitment ceiling, planning load", rejects: "Aggregator scores, resolved conflicts, unverified operating changes" },
];

export const DESK_LOG = [
  { date: "2026-08-19", id: "SC-KBI-001", entry: "Kitchen & Bar Intelligence added as a first-class desk tool. Availability Packet 1.0 is the user-initiated handoff into Occasion OS." },
];

export const GLOSSARY = [
  { term: "Availability Packet", def: "Kitchen & Bar contract 1.0. Confirmed pantry and bar contents you choose to send. No recipes, no allergen claims, no silent inference." },
  { term: "Anchor", def: "A dish you lock before the rest of the menu is scored. Locking one re-scores every other role against it." },
  { term: "Hard stop", def: "A refusal, not a warning. The plan does not continue past a hard stop — capacity, allergen boundary, or an official conflict." },
  { term: "Stress axis", def: "One of five operational readings: Balance, Make Ahead, Service Fit, Equipment Fit, Host Freedom." },
  { term: "Contract version", def: "The versioned shape of a handoff packet. A receiver states which version it accepts; mismatches fail closed." },
  { term: "Confirm burden", def: "How much you must still verify directly with a room before the booking is real." },
  { term: "Thin field", def: "A record with too little first-party evidence to rank confidently. Kept visible rather than filled in." },
  { term: "Planning filter", def: "A dietary category used to shape a plan. Never a safety guarantee — cross-contact stays with the kitchen." },
  { term: "Fail closed", def: "When a constraint is breached, the tool stops instead of quietly degrading the plan." },
];

export type ToolDetail = {
  slug: Tool["slug"]; inputs: string[]; returns: string[]; hardStops: string[]; wrongTool: { name: string; reason: string }[];
};

export const TOOL_DETAILS: Record<Tool["slug"], ToolDetail> = {
  "kitchen-bar": {
    slug: "kitchen-bar",
    inputs: ["A shelf, fridge, or bar you can photograph or edit", "Declared intent — cook tonight, mix a drink, or pack for an occasion", "Local inventory you are willing to keep on-device"],
    returns: ["Confirmed pantry and bar contents", "Explainable pairing scores (molecule + recipe)", "Expiry ranking, Almost matches, and Smart Buy suggestions", "Availability Packet 1.0, only if you send it"],
    hardStops: ["Allergen certification — the layer will not claim it", "Silent push into Occasion OS", "Treating a vision candidate as confirmed without your review"],
    wrongTool: [{ name: "Menu Builder", reason: "Stress-tests a menu; it does not read the shelf." }, { name: "Occasion Operating System", reason: "Sequences the night; it is not the pantry." }, { name: "Restaurant Intelligence", reason: "Ranks rooms; it has no view of your bar." }],
  },
  "menu-builder": {
    slug: "menu-builder",
    inputs: ["Occasion type and guest count", "Service style — plated, family, buffet, standing", "Host attention available during service", "Oven, burner, cold, and counter capacity", "Budget pressure, if any"],
    returns: ["Five-role menu architecture with pairing mode", "Stress reading across all five axes", "Hard stops with the constraint that triggered them", "Anchor effect when a dish is locked", "A packet Occasion OS accepts at contract 1.1.0"],
    hardStops: ["Plated service beyond declared capacity", "Allergen boundary reached — the tool refuses rather than reassures", "Equipment contention that cannot be sequenced away"],
    wrongTool: [{ name: "Kitchen & Bar Intelligence", reason: "Reads the shelf; it does not architect a menu." }, { name: "Occasion Operating System", reason: "Sequences the night; it does not choose dishes." }, { name: "Restaurant Intelligence", reason: "Ranks rooms; it has no view of your kitchen." }],
  },
  "occasion-os": {
    slug: "occasion-os",
    inputs: ["A settled menu — ideally a Menu Builder packet", "Optional Kitchen & Bar Availability Packet 1.0", "Guests, service style, and room constraints", "Attention you can hold during service", "Days available before the night"],
    returns: ["Condition-driven host plan", "Shop → prep → serve route with holding points", "Dietary categories carried forward as planning filters", "Food-safety boundary printed on every plan"],
    hardStops: ["Prep route that cannot fit the days declared", "Service plan that exceeds host attention", "Any request to certify a dish as allergen-safe"],
    wrongTool: [{ name: "Kitchen & Bar Intelligence", reason: "Daily execution; run it when the shelf is the question." }, { name: "Menu Builder", reason: "Decides whether the menu survives; run it first." }, { name: "Restaurant Intelligence", reason: "The alternative when hosting does not survive." }],
  },
  "restaurant-intelligence": {
    slug: "restaurant-intelligence",
    inputs: ["Occasion and party size", "Days out and the commitment ceiling you accept", "Planning load you are willing to carry", "Guest constraints as planning filters"],
    returns: ["Situation rank across first-party case files", "Critical and watch findings with confidence labels", "Booking pathway and confirm burden", "Open unknowns and official conflicts, preserved"],
    hardStops: ["Conflicting official claims — surfaced, never resolved silently", "Thin field: too little evidence to rank", "Operating change that must be confirmed directly before booking"],
    wrongTool: [{ name: "Kitchen & Bar Intelligence", reason: "For what's already in the house, not a room." }, { name: "Menu Builder", reason: "For cooking decisions, not rooms." }, { name: "Occasion Operating System", reason: "For running a night you are hosting yourself." }],
  },
};

/** The three peer tools on the home desk. Architecture is inside Occasion OS. */
export const FLEET_TOOLS: Tool[] = TOOLS.filter((t) => t.fleet);

export const SUITES = [
  { id: "host" as const, label: "Host Decision Suite", title: "Before you commit the kitchen", blurb: "Architecture the menu inside Occasion OS, stress-test service, then run the night from one host plan — vanity without the collapse, vice without the chaos." },
  { id: "layer" as const, label: "Kitchen & Bar Layer", title: "Before you shop or open another bottle", blurb: "Know what you can actually make from the pantry and the bar — then optionally hand availability into Occasion OS when a night needs planning." },
  { id: "dine" as const, label: "Dine Decision Suite", title: "Before you book the room", blurb: "Rank restaurants by occasion fit and operating reality. Keep unknowns, conflicts, and confirm burden in the open." },
] as const;

export const FLEET_STATS = [
  { label: "Live apps", value: "3", note: "Equal intelligence depth" },
  { label: "OOS layers", value: "3", note: "Plan · Architecture · Card" },
  { label: "KBI domains", value: "2", note: "Food + Bar unified" },
  { label: "RI case files", value: String(RI_COVERAGE.caseFiles), note: "First-party only" },
  { label: "Regions", value: String(RI_COVERAGE.regions), note: RI_COVERAGE.regionNote },
  { label: "Kitchen packet", value: "1.0", note: "User-initiated only" },
] as const;

export const HOST_PATH = [
  { step: 1, title: "Host plan + menu architecture", appId: "occasion-os", toolSlug: "occasion-os" as const, summary: "Declare occasion, guests, service, equipment, and dietary filters. Use Architecture for five-role menu building and stress meters, then Plan for shop → prep → serve." },
  { step: 2, title: "Or dine out", appId: "restaurant-intelligence", toolSlug: "restaurant-intelligence" as const, summary: "When the night is better off-site, rank restaurants by situation — occasion, party, commitment, unknowns — and confirm the hard details live." },
] as const;
