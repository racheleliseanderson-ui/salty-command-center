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

<<<<<<< Updated upstream
export const TOOL_VERSIONS = {
  "kitchen-bar": { build: "Share your shelf with Occasions", contract: "Share with Occasions" },
  "menu-builder": { package: "0.6.0", engine: "0.4.3", contract: "1.1.0", build: "Menu stress inside Occasion OS" },
  "occasion-os": { build: "Host planning", shortBuild: "V2", contract: "1.1.0" },
  "restaurant-intelligence": { build: `${RI_COVERAGE.caseFiles} restaurant files`, contract: "You choose what to send" },
} as const;

=======
>>>>>>> Stashed changes
export const TOOLS: Tool[] = [
  {
    id: "SC-KBI-001", slug: "kitchen-bar", name: "Kitchen & Bar Intelligence", short: "See the shelf. Rank the pour.",
    useWhen: "You're cooking from what's already on the pantry and bar — not from a shopping list.",
    notFor: "Sequencing a hosted night, ranking restaurants, or certifying allergens.",
    decision: "What's on the shelf, what pairs, and what can you cook from it tonight?",
<<<<<<< Updated upstream
    summary: "Daily pantry and bar. Scan a shelf, rank a pour, match what's already in the house, then share your shelf with Occasions if you choose. Pairing is shared aroma notes plus real recipes — Occasions stays the planner.",
    status: "live", statusNote: "Share your shelf with Occasions", href: "https://kitchen.saltnotes.blog/",
    metrics: [{ value: "90s", label: "Bar reads" }, { value: "You send it", label: "Share with Occasions" }],
    capabilities: ["Scan a shelf or fridge, review every candidate, then commit", "Pairing: shared aroma notes plus real recipes, with reasons you can read", "Inventory + match: pantry and bar on this device, expiry ranking, Almost, Smart Buy", "Share your shelf with Occasions — you send it; nothing moves silently"],
    refusals: ["Allergen claims or cross-contact control", "Silent inference into Occasion OS", "Replacing the occasion planner", "Recipes treated as gospel"],
    handoffOut: "Share your shelf with Occasions (you send it)", track: "host", suite: "layer", fleet: true,
=======
    summary: "Daily pantry and bar layer. Scan a shelf, rank a pour, match what's already in the house, then send a clean availability list to Occasion OS when a night needs planning. Pairing is explainable chemistry plus recipe practice — Occasions stays the planner.",
    status: "live", statusNote: "Sends a confirmed availability list — only when you send it", href: "https://kitchen.saltnotes.blog/",
    metrics: [{ value: "90s", label: "Bar read" }, { value: "2", label: "Pantry + bar" }],
    capabilities: ["Vision: scan a shelf or fridge, review every candidate, then commit", "Pairing: molecular overlap plus recipe co-occurrence, with explainable scores", "Inventory + match: local-first pantry and bar, expiry ranking, Almost, Smart Buy", "A confirmed availability list — you send it; nothing moves on its own"],
    refusals: ["Allergen claims or cross-contact control", "Silent inference into Occasion OS", "Replacing the occasion planner", "Recipes treated as gospel"],
    handoffOut: "Confirmed availability list → Occasion OS, only when you send it", track: "host", suite: "layer", fleet: true,
>>>>>>> Stashed changes
  },
  {
    id: "SC-MB-001", slug: "menu-builder", name: "Menu Builder", short: "Menu building + stress test",
    useWhen: "You know you're cooking, but not whether the menu survives service.",
    notFor: "Deciding whether to host at all, or where to eat instead.",
    decision: "Can this kitchen finish this menu on time?",
<<<<<<< Updated upstream
    summary: "Five-role menu building, stress meters, locking a dish, bounded simplification, and we'll stop rather than guess. Scores Balance, Make Ahead, Service Fit, Equipment Fit, and Host Freedom from what you declared — then hands a clean plan to Occasion OS.",
    status: "live", statusNote: "Menu stress inside Occasion OS", href: "https://occasion.saltnotes.blog/architecture",
    metrics: [{ value: "5", label: "Roles" }, { value: "5", label: "Stress axes" }],
    capabilities: ["Five roles with congruence / contrast / balanced pairing modes", "Operational stress test that stops when a real requirement is not met (allergen boundary, plated capacity)", "Re-scoring when you lock a dish", "Bounded budget-pressure simplification — additive, never formula-breaking"],
=======
    summary: "Five-role architecture, stress meters, anchor locking, and bounded simplification — and it stops when a constraint genuinely cannot be met. Scores Balance, Make Ahead, Service Fit, Equipment Fit, and Host Freedom from what you declare, then hands the finished menu to Occasion OS.",
    status: "live", statusNote: "A layer inside Occasion OS, not a separate app", href: "https://occasion.saltnotes.blog/architecture",
    metrics: [{ value: "5", label: "Roles" }, { value: "5", label: "Stress axes" }],
    capabilities: ["Five roles with congruence / contrast / balanced pairing modes", "Operational stress test that stops on a real conflict — allergen boundary, plated capacity", "Anchor re-scoring when you lock a dish", "Bounded budget-pressure simplification — additive, never formula-breaking"],
>>>>>>> Stashed changes
    refusals: ["AI menu generation", "Allergen safety or cross-contact control", "Recipes, pricing, or nutrition advice", "Accounts or cloud sync"],
    handoffOut: "Menu, stress summary, and locked dish → Occasion OS", track: "host", suite: "architecture", fleet: false,
  },
  {
    id: "SC-OOS-001", slug: "occasion-os", name: "Occasion Operating System", short: "The night, sequenced",
    useWhen: "The menu is settled and the night still has to run itself.",
    notFor: "Choosing dishes, ranking restaurants, or reading the pantry.",
    decision: "What happens, in what order, and who is holding it?",
<<<<<<< Updated upstream
    summary: "Host planning with Plan, menu building (five-role menu stress, in-app), and Card under one look. Receives your shelf from Kitchen & Bar if you send it. Menu building is not a separate peer tool on this desk — it lives here. Dietary categories stay planning filters — never allergy guarantees.",
    status: "live", statusNote: "Host planning · stays on this device", href: "https://occasion.saltnotes.blog",
    metrics: [{ value: "3", label: "Layers" }, { value: "You send it", label: "Receives" }],
    capabilities: ["Layered host path: Plan · menu building · Card under one visual system", "Condition-driven host plan: guests, service style, attention, capacity", "Controlled route — shop → prep → serve, without theater", "In-app menu building plus apply-to-plan", "Food-safety boundary surfaced on every plan"],
    refusals: ["Allergen-safe guarantees", "Silent cross-app inference", "Star ratings or social proof", "Forced accounts for core planning"],
    handoffIn: "Settled menu · shelf from Kitchen & Bar, if you send it",
=======
    summary: "Host planning tool with Plan, Architecture (five-role menu stress, built in), and Card under one roof. Accepts the availability list from Kitchen & Bar. Architecture is not a separate tool on this desk — it lives here. Dietary categories stay planning filters — never allergy guarantees.",
    status: "live", statusNote: "Your plan stays on this device", href: "https://occasion.saltnotes.blog",
    metrics: [{ value: "3", label: "Layers" }, { value: "2", label: "Tools it takes from" }],
    capabilities: ["Layered host path: Plan · Architecture · Card under one visual system", "Condition-driven host plan: guests, service style, attention, capacity", "Controlled route — shop → prep → serve, without theater", "Architecture built in — apply a finished menu straight to the plan", "Food-safety boundary surfaced on every plan"],
    refusals: ["Allergen-safe guarantees", "Silent cross-app inference", "Star ratings or social proof", "Forced accounts for core planning"],
    handoffIn: "Finished menu from Menu Builder · availability list from Kitchen & Bar",
>>>>>>> Stashed changes
    handoffOut: "Optional occasion context → Restaurant Intelligence", track: "host", suite: "host", fleet: true,
  },
  {
    id: "SC-RI-001", slug: "restaurant-intelligence", name: "Restaurant Intelligence", short: "Dine out, with receipts",
    useWhen: "The night is better off-site and the room still has to fit the occasion.",
    notFor: "Cooking, pantry matching, prep sequencing, or menu construction.",
    decision: "Which room fits this occasion — and what must still be confirmed?",
    summary: "Situation-aware ranking from first-hand evidence only. Multi-layer findings, booking pathways, confirm burden, guest-constraint matrix, and official conflicts — so you choose the room that fits the occasion, not the photograph.",
    status: "live", statusNote: `${RI_COVERAGE.caseFiles} first-hand case files · ${RI_COVERAGE.regions} regions`, href: "https://deepdish.saltnotes.blog",
    metrics: [{ value: String(RI_COVERAGE.caseFiles), label: "Case files" }, { value: String(RI_COVERAGE.regions), label: "Regions" }],
    capabilities: ["Situation rank: occasion, party size, days-out, max commitment, planning load", "Multi-layer findings (critical + watch) with confidence labels", "Unknowns, thin fields, and official conflicts preserved — never collapsed", "Booking pathways: Phone, Resy, OpenTable, Tock, Direct"],
    refusals: ["Star ratings or aggregator scores", "Silent resolution of conflicting claims", "Live menu scraping as gospel", "Skipping direct confirmation on operating changes"],
    handoffIn: "Optional occasion context (reader-initiated)",
    handoffOut: "First-hand case file + evidence trail → Salt Notes records", track: "dine", suite: "dine", fleet: true,
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
<<<<<<< Updated upstream
    contract: "Share your shelf with Occasions", tag: "Primary",
=======
    contract: "A confirmed pantry and bar list", tag: "Primary",
>>>>>>> Stashed changes
    purpose: "So the night is planned against what is actually on the shelf — not against a shopping list you have not yet committed.",
    breaksIf: "If recipes, guest names, or inferred allergen claims travelled, Occasion OS would treat a pantry snapshot as a certified plan.",
    moves: [
      { field: "Confirmed pantry and bar contents", reason: "The route can only sequence what is actually available." },
      { field: "Declared intent (cook, mix, pack)", reason: "Occasion OS needs the job, not the vision candidates you discarded." },
    ],
    stays: [
      { field: "Raw vision candidates you did not confirm", reason: "Unreviewed detections are not inventory." },
      { field: "Recipes, pairing scores, and shopping suggestions", reason: "Those are local execution, not occasion state." },
      { field: "Anything you did not explicitly send", reason: "Nothing moves in the background. Silence is withholding, not consent." },
    ],
<<<<<<< Updated upstream
    canConclude: ["What is on the shelf tonight", "Which declared items you can share with Occasions"],
=======
    canConclude: ["What is on the shelf tonight", "Which confirmed items you can send onward"],
>>>>>>> Stashed changes
    cannotConclude: ["That a dish is allergen-safe", "That Occasion OS should silently adopt the pantry as the menu"],
  },
  {
    from: "Menu Builder", fromId: "SC-MB-001", to: "Occasion Operating System", toId: "SC-OOS-001",
<<<<<<< Updated upstream
    contract: "Settled menu", tag: "Primary",
=======
    contract: "The finished menu and its stress reading", tag: "Primary",
>>>>>>> Stashed changes
    purpose: "So the night can be sequenced against a menu that has already been stress-tested — not against a wish list.",
    breaksIf: "If drafts and simplification history travelled too, Occasion OS would route a menu you already rejected.",
    moves: [
      { field: "Menu shape (roles, dishes, pairing mode)", reason: "The prep route is built per dish role; without roles there is no sequence to build." },
      { field: "Stress summary across five axes", reason: "Occasion OS needs the pressure profile to know which step to protect first." },
      { field: "Locked anchor and its re-scoring effect", reason: "An anchor fixes one dish's timing; the route has to respect it, not re-litigate it." },
    ],
    stays: [
      { field: "Draft menus you discarded", reason: "A rejected draft is not a decision. Sending it would let it be re-proposed." },
      { field: "Simplification history and budget pressure inputs", reason: "These are reasoning, not output. Occasion OS has no job that needs them." },
      { field: "Anything you did not explicitly send", reason: "Nothing moves in the background. Silence is withholding, not consent." },
    ],
    canConclude: ["Which dishes need heat, hands, or the pass at the same moment", "Where the plan is already at capacity before guests arrive"],
    cannotConclude: ["Why you chose this menu over another", "That any dietary category is an allergy-safe claim"],
  },
  {
    from: "Occasion Operating System", fromId: "SC-OOS-001", to: "Restaurant Intelligence", toId: "SC-RI-001",
    contract: "Only what you choose to send", tag: "Optional",
    purpose: "So a room can be ranked against the same occasion you were planning — when hosting is no longer the right outcome.",
    breaksIf: "If the host plan travelled, a restaurant surface would hold your kitchen state for a night that is not happening.",
    moves: [
      { field: "Occasion type, party size, and date window", reason: "Capacity and booking fit cannot be ranked without these three." },
      { field: "Planning-filter dietary categories (never allergy claims)", reason: "Used to filter rooms worth calling — the confirm still happens live, with the kitchen." },
    ],
    stays: [
      { field: "Full host plan, prep route, and shopping state", reason: "None of it has a reader job on the dine-out side." },
<<<<<<< Updated upstream
      { field: "Guest names and private notes", reason: "What you share is public-safe. Guest identity never leaves the tool it was typed into." },
=======
      { field: "Guest names and private notes", reason: "Nothing private travels. Guest identity never leaves the tool it was typed into." },
>>>>>>> Stashed changes
      { field: "Any inference about why you switched to dining out", reason: "The desk does not build a motive record. The switch is a choice, not a signal." },
    ],
    canConclude: ["Which rooms can physically seat the party in the window", "Which rooms are worth the confirm call for your filters"],
    cannotConclude: ["That a room is allergy-safe for anyone at the table", "That hosting was the wrong call, or why you changed your mind"],
  },
  {
    from: "Restaurant Intelligence", fromId: "SC-RI-001", to: "Salt Notes records", toId: "Editorial",
<<<<<<< Updated upstream
    contract: "You choose what to send", tag: "Optional",
    purpose: "So a night you actually had becomes a first-party record with its unknowns still visible.",
=======
    contract: "Nothing private travels", tag: "Optional",
    purpose: "So a night you actually had becomes a first-hand record with its unknowns still visible.",
>>>>>>> Stashed changes
    breaksIf: "If shortlists and rejections travelled, the record would read as a ranking you never published.",
    moves: [
      { field: "First-hand case file", reason: "What was observed at the source, dated, with the observer's position stated." },
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
<<<<<<< Updated upstream
  { id: "fail-closed", group: "Safety", limit: "We'll stop the plan if a real requirement is not met: capacity, allergen boundary, official conflicts", why: "A quietly degraded plan is more dangerous than a stopped one, because it still looks like a plan.", instead: "We'll stop rather than guess, and name the requirement that was not met. Stopping is an outcome, not an error to click past." },
  { id: "movement", group: "Data movement", limit: "No silent movement of data between tools", why: "Each tool owns its own state. Background sync would make a share something you did not choose.", instead: "You send only what is public-safe, and the map shows what travels and what is withheld before you send it." },
=======
  { id: "fail-closed", group: "Safety", limit: "The plan stops when a declared limit is genuinely breached — seating, allergen boundary, a conflicting official listing", why: "A plan that quietly shrinks to fit is more dangerous than one that stops, because it still looks like a plan.", instead: "The tool stops and names the limit it hit. That is an answer about your night, not an error to click past." },
  { id: "movement", group: "Data movement", limit: "No silent movement of data between tools", why: "Each tool keeps its own information. Syncing in the background would move your night between tools without you choosing it.", instead: "You send it yourself, and the map shows exactly what travels and what stays behind before you do." },
>>>>>>> Stashed changes
  { id: "account", group: "Data movement", limit: "No forced account for core planning tools", why: "Planning is local work. An account requirement would collect identity the tools do not need.", instead: "Core planning runs on local state. Nothing is uploaded to use the desk." },
  { id: "rankings", group: "Evidence", limit: "No star ratings, social-proof collapse, or inferred “best restaurant” rankings", why: "A single score hides the disagreement that made it. Collapsed proof cannot be audited.", instead: "First-hand case files with confidence labels and open unknowns left visible, ranked only against your stated occasion." },
  { id: "educational", group: "Scope", limit: "Educational planning only — not professional kitchen, medical, or legal advice", why: "The suite has no view of your kitchen, your health, or your jurisdiction.", instead: "Use it to make the decision legible, then take the decision to the people qualified to certify it." },
];

export const PHILOSOPHY = [
  { k: "Reader-job-first", v: "Every surface names the decision it serves before it shows a control." },
<<<<<<< Updated upstream
  { k: "You send it", v: "Nothing moves between tools unless you choose to move it." },
=======
  { k: "Nothing moves on its own", v: "Nothing travels between tools unless you choose to send it." },
>>>>>>> Stashed changes
  { k: "Educational planning only", v: "Planning intelligence, not professional certification." },
  { k: "First-hand evidence", v: "Case files come from the source, with unknowns left visible." },
  { k: "No allergen guarantees", v: "Dietary categories are filters. Safety stays with the kitchen." },
<<<<<<< Updated upstream
  { k: "We'll stop rather than guess", v: "If a real requirement is not met, the plan stops instead of quietly degrading." },
=======
  { k: "Real conflicts stop the plan", v: "When a declared limit is genuinely breached, the plan stops and names the limit instead of quietly shrinking to fit." },
>>>>>>> Stashed changes
];

export const KITCHEN_BAR = TOOLS.find((t) => t.slug === "kitchen-bar")!;
export const MENU_BUILDER = TOOLS.find((t) => t.slug === "menu-builder")!;
export const OCCASION_OS = TOOLS.find((t) => t.slug === "occasion-os")!;
export const RESTAURANT_INTELLIGENCE = TOOLS.find((t) => t.slug === "restaurant-intelligence")!;

export type Counter = { value: number; suffix?: string; label: string; note: string };

export const SUITE_COUNTERS: Counter[] = [
<<<<<<< Updated upstream
  { value: 3, label: "Available now", note: "Kitchen & Bar · Occasion OS · Restaurant Intelligence" },
  { value: RI_COVERAGE.caseFiles, label: "Case files", note: `${RI_COVERAGE.enriched} with a first-party page read` },
  { value: RI_COVERAGE.regions, label: "Regions", note: RI_COVERAGE.regionNote },
  { value: 1, suffix: "", label: "Share with Occasions", note: "You send it — nothing silent" },
=======
  { value: 3, label: "Live tools", note: "Kitchen & Bar · Occasion OS · Restaurant Intelligence" },
  { value: RI_COVERAGE.caseFiles, label: "Case files", note: `${RI_COVERAGE.enriched} enriched · first-hand only` },
  { value: RI_COVERAGE.regions, label: "Regions", note: RI_COVERAGE.regionNote },
  { value: 4, label: "Ways to send onward", note: "Every one triggered by you" },
>>>>>>> Stashed changes
];

export type LedgerRow = {
  id: string; name: string; state: "Live" | "Beta" | "Planned"; build: string; contract: string; updated: string; accepts: string; rejects: string;
};

export const LEDGER: LedgerRow[] = [
<<<<<<< Updated upstream
  { id: "SC-KBI-001", name: "Kitchen & Bar Intelligence", state: "Live", build: TOOL_VERSIONS["kitchen-bar"].build, contract: "Share your shelf with Occasions", updated: "2026-08-19", accepts: "Shelf or fridge scan, local inventory, declared cook/mix intent", rejects: "Allergen claims, silent inference, replacing Occasion OS" },
  { id: "SC-MB-001", name: "Menu building (inside Occasion OS)", state: "Live", build: TOOL_VERSIONS["menu-builder"].build, contract: "Settled menu", updated: "2026-08-11", accepts: "Declared occasion, guests, service style, attention, equipment", rejects: "Allergen safety claims, recipes, pricing, cloud accounts" },
  { id: "SC-OOS-001", name: "Occasion Operating System", state: "Live", build: TOOL_VERSIONS["occasion-os"].build, contract: "Receives a settled menu · shelf from Kitchen & Bar if you send it", updated: "2026-08-11", accepts: "Settled menus, Kitchen & Bar selections, host conditions, capacity and attention", rejects: "Silent cross-app inference, allergen guarantees, forced accounts" },
  { id: "SC-RI-001", name: "Restaurant Intelligence", state: "Live", build: TOOL_VERSIONS["restaurant-intelligence"].build, contract: TOOL_VERSIONS["restaurant-intelligence"].contract, updated: RI_COVERAGE.generatedAt, accepts: "Occasion, party size, days-out, commitment ceiling, planning load", rejects: "Aggregator scores, resolved conflicts, unverified operating changes" },
];

export const DESK_LOG = [
  { date: "2026-08-19", id: "SC-KBI-001", entry: "Kitchen & Bar Intelligence added as a first-class desk tool. Share your shelf with Occasions when you choose to." },
];

export const GLOSSARY = [
  { term: "Share with Occasions", def: "Confirmed pantry and bar contents you choose to send. No recipes, no allergen claims, no silent inference." },
  { term: "Anchor", def: "A dish you lock before the rest of the menu is scored. Locking one re-scores every other role against it." },
  { term: "We'll stop rather than guess", def: "A real requirement that is not met stops the plan — capacity, allergen boundary, or an official conflict. Not a warning you can click past." },
  { term: "Stress axis", def: "One of five operational readings: Balance, Make Ahead, Service Fit, Equipment Fit, Host Freedom." },
  { term: "What travels", def: "The shape of what you send between tools. The receiving tool only uses what you chose to send; if something doesn't match, it stops rather than guess." },
=======
  { id: "SC-KBI-001", name: "Kitchen & Bar Intelligence", state: "Live", build: "Reads the shelf, ranks the pour", contract: "Sends a confirmed availability list", updated: "2026-08-19", accepts: "Shelf or fridge scan, local inventory, declared cook/mix intent", rejects: "Allergen claims, silent inference, replacing Occasion OS" },
  { id: "SC-MB-001", name: "Architecture (inside Occasion OS)", state: "Live", build: "Five-role menu shape and stress test", contract: "Sends the finished menu and its stress reading", updated: "2026-08-11", accepts: "Declared occasion, guests, service style, attention, equipment", rejects: "Allergen safety claims, recipes, pricing, cloud accounts" },
  { id: "SC-OOS-001", name: "Occasion Operating System", state: "Live", build: "Plan, Architecture and Card in one place", contract: "Takes in finished menus and availability lists", updated: "2026-08-11", accepts: "Finished menus from Menu Builder, availability lists from Kitchen & Bar, host conditions, capacity and attention", rejects: "Silent cross-app inference, allergen guarantees, forced accounts" },
  { id: "SC-RI-001", name: "Restaurant Intelligence", state: "Live", build: `${RI_COVERAGE.caseFiles} first-hand case files · ${RI_COVERAGE.enriched} enriched`, contract: "Keeps your records yours — you choose what to send", updated: RI_COVERAGE.generatedAt, accepts: "Occasion, party size, days-out, commitment ceiling, planning load", rejects: "Aggregator scores, resolved conflicts, unverified operating changes" },
];

export const DESK_LOG = [
  { date: "2026-08-19", id: "SC-KBI-001", entry: "Kitchen & Bar Intelligence joins the desk as a full tool. It can send a confirmed availability list into Occasion OS — but only when you send it." },
];

export const GLOSSARY = [
  { term: "Availability list", def: "The confirmed pantry and bar contents you choose to send from Kitchen & Bar. No recipes, no allergen claims, nothing added that you did not confirm." },
  { term: "Anchor", def: "A dish you lock before the rest of the menu is scored. Locking one re-scores every other role against it." },
  { term: "Blocking constraint", def: "A limit the night genuinely cannot be built around — seating, an allergen boundary, or a conflicting official listing. The plan stops and names it rather than shrinking to fit." },
  { term: "Stress axis", def: "One of five operational readings: Balance, Make Ahead, Service Fit, Equipment Fit, Host Freedom." },
>>>>>>> Stashed changes
  { term: "Confirm burden", def: "How much you must still verify directly with a room before the booking is real." },
  { term: "Thin field", def: "A record with too little first-hand evidence to rank confidently. Kept visible rather than filled in." },
  { term: "Planning filter", def: "A dietary category used to shape a plan. Never a safety guarantee — cross-contact stays with the kitchen." },
];

export type ToolDetail = {
  slug: Tool["slug"]; inputs: string[]; returns: string[]; hardStops: string[]; wrongTool: { name: string; reason: string }[];
};

export const TOOL_DETAILS: Record<Tool["slug"], ToolDetail> = {
  "kitchen-bar": {
    slug: "kitchen-bar",
    inputs: ["A shelf, fridge, or bar you can photograph or edit", "Declared intent — cook tonight, mix a drink, or pack for an occasion", "Local inventory you are willing to keep on-device"],
<<<<<<< Updated upstream
    returns: ["Confirmed pantry and bar contents", "Explainable pairing scores (aroma notes + recipes)", "Expiry ranking, Almost matches, and Smart Buy suggestions", "Share with Occasions, only if you send it"],
    hardStops: ["Allergen certification — this layer will not claim it", "Silent push into Occasion OS", "Treating a vision candidate as confirmed without your review"],
=======
    returns: ["Confirmed pantry and bar contents", "Explainable pairing scores (molecule + recipe)", "Expiry ranking, Almost matches, and Smart Buy suggestions", "A confirmed availability list, only if you send it"],
    hardStops: ["Allergen certification — the layer will not claim it", "Silent push into Occasion OS", "Treating a vision candidate as confirmed without your review"],
>>>>>>> Stashed changes
    wrongTool: [{ name: "Menu Builder", reason: "Stress-tests a menu; it does not read the shelf." }, { name: "Occasion Operating System", reason: "Sequences the night; it is not the pantry." }, { name: "Restaurant Intelligence", reason: "Ranks rooms; it has no view of your bar." }],
  },
  "menu-builder": {
    slug: "menu-builder",
    inputs: ["Occasion type and guest count", "Service style — plated, family, buffet, standing", "Host attention available during service", "Oven, burner, cold, and counter capacity", "Budget pressure, if any"],
<<<<<<< Updated upstream
    returns: ["Five-role menu with pairing mode", "Stress reading across all five axes", "Stops with the requirement that triggered them", "Effect when a dish is locked", "A plan Occasion OS can sequence"],
    hardStops: ["Plated service beyond declared capacity", "Allergen boundary reached — we'll stop rather than reassure", "Equipment contention that cannot be sequenced away"],
=======
    returns: ["Five-role menu architecture with pairing mode", "Stress reading across all five axes", "A clear stop, naming the constraint that caused it", "Anchor effect when a dish is locked", "A finished menu Occasion OS can plan against"],
    hardStops: ["Plated service beyond declared capacity", "Allergen boundary reached — the tool stops rather than reassures", "Equipment contention that cannot be sequenced away"],
>>>>>>> Stashed changes
    wrongTool: [{ name: "Kitchen & Bar Intelligence", reason: "Reads the shelf; it does not architect a menu." }, { name: "Occasion Operating System", reason: "Sequences the night; it does not choose dishes." }, { name: "Restaurant Intelligence", reason: "Ranks rooms; it has no view of your kitchen." }],
  },
  "occasion-os": {
    slug: "occasion-os",
<<<<<<< Updated upstream
    inputs: ["A settled menu — ideally from menu building", "Optional shelf from Kitchen & Bar, if you send it", "Guests, service style, and room constraints", "Attention you can hold during service", "Days available before the night"],
=======
    inputs: ["A settled menu — ideally one finished in Menu Builder", "An optional availability list from Kitchen & Bar", "Guests, service style, and room constraints", "Attention you can hold during service", "Days available before the night"],
>>>>>>> Stashed changes
    returns: ["Condition-driven host plan", "Shop → prep → serve route with holding points", "Dietary categories carried forward as planning filters", "Food-safety boundary printed on every plan"],
    hardStops: ["Prep route that cannot fit the days declared", "Service plan that exceeds host attention", "Any request to certify a dish as allergen-safe"],
    wrongTool: [{ name: "Kitchen & Bar Intelligence", reason: "Daily execution; run it when the shelf is the question." }, { name: "Menu Builder", reason: "Decides whether the menu survives; run it first." }, { name: "Restaurant Intelligence", reason: "The alternative when hosting does not survive." }],
  },
  "restaurant-intelligence": {
    slug: "restaurant-intelligence",
    inputs: ["Occasion and party size", "Days out and the commitment ceiling you accept", "Planning load you are willing to carry", "Guest constraints as planning filters"],
    returns: ["Situation rank across first-hand case files", "Critical and watch findings with confidence labels", "Booking pathway and confirm burden", "Open unknowns and official conflicts, preserved"],
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
<<<<<<< Updated upstream
  { label: "Available now", value: "3", note: "Equal intelligence depth" },
  { label: "OOS layers", value: "3", note: "Plan · menu · Card" },
  { label: "KBI domains", value: "2", note: "Food + Bar unified" },
  { label: "RI case files", value: String(RI_COVERAGE.caseFiles), note: "First-party only" },
  { label: "Regions", value: String(RI_COVERAGE.regions), note: RI_COVERAGE.regionNote },
  { label: "Share with Occasions", value: "You send it", note: "Nothing silent" },
=======
  { label: "Live tools", value: "3", note: "Equal depth on every one" },
  { label: "Occasion OS layers", value: "3", note: "Plan · Architecture · Card" },
  { label: "Kitchen & Bar", value: "2", note: "Pantry and bar in one place" },
  { label: "Restaurant case files", value: String(RI_COVERAGE.caseFiles), note: "First-hand only" },
  { label: "Regions", value: String(RI_COVERAGE.regions), note: RI_COVERAGE.regionNote },
  { label: "Ways to send onward", value: "4", note: "Every one triggered by you" },
>>>>>>> Stashed changes
] as const;

export const HOST_PATH = [
  { step: 1, title: "Host plan + menu building", appId: "occasion-os", toolSlug: "occasion-os" as const, summary: "Declare occasion, guests, service, equipment, and dietary filters. Use menu building for five-role menus and stress meters, then Plan for shop → prep → serve." },
  { step: 2, title: "Or dine out", appId: "restaurant-intelligence", toolSlug: "restaurant-intelligence" as const, summary: "When the night is better off-site, rank restaurants by situation — occasion, party, commitment, unknowns — and confirm the hard details live." },
] as const;
