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
  /** Primary fleet surfaces only. Architecture lives inside Occasion OS. */
  suite: ToolSuite;
  /** When true, shown on the home desk as a peer tool. */
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
  "kitchen-bar": {
    build: "Availability Packet 1.0",
    contract: "1.0",
  },
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
    build: `Case set ${RI_COVERAGE.caseFiles} · ${RI_COVERAGE.enriched} enriched`,
    contract: "Reader-initiated",
  },
} as const;

export const TOOLS: Tool[] = [
  {
    id: "SC-KBI-001",
    slug: "kitchen-bar",
    name: "Kitchen & Bar Intelligence",
    short: "See the shelf. Rank the pour.",
    useWhen: "You're cooking from what's already on the pantry and bar — not from a shopping list.",
    notFor: "Sequencing a hosted night, ranking restaurants, or certifying allergens.",
    decision: "What's on the shelf, what pairs, and what can you cook from it tonight?",
    summary:
      "Daily pantry and bar layer. Scan a shelf, rank a pour, match what's already in the house, then hand a clean availability packet to Occasion OS. Pairing is explainable chemistry plus recipe practice — Occasions stays the planner.",
    status: "live",
    statusNote: "Availability Packet 1.0",
    href: "https://kitchen.saltnotes.blog/",
    metrics: [
      { value: "90s", label: "Bar reads" },
      { value: "1.0", label: "Packet" },
    ],
    capabilities: [
      "Vision: scan a shelf or fridge, review every candidate, then commit",
      "Pairing: molecular overlap plus recipe co-occurrence, with explainable scores",
      "Inventory + match: local-first pantry and bar, expiry ranking, Almost, Smart Buy",
      "Availability Packet 1.0 — you send it; nothing moves silently",
    ],
    refusals: [
      "Allergen claims or cross-contact control",
      "Silent inference into Occasion OS",
      "Replacing the occasion planner",
      "Recipes treated as gospel",
    ],
    handoffOut: "Availability Packet 1.0 → Occasion OS (user-initiated)",
    track: "host",
    suite: "layer",
    fleet: true,
  },
  {
    id: "SC-MB-001",
    slug: "menu-builder",
    name: "Menu Builder",
    short: "Menu architecture + stress test",
    useWhen: "You know you're cooking, but not whether the menu survives service.",
    notFor: "Deciding whether to host at all, or where to eat instead.",
    decision: "Can this kitchen finish this menu on time?",
    summary:
      "Five-role architecture, stress meters, anchor locking, bounded simplification, and hard stops. Scores Balance, Make Ahead, Service Fit, Equipment Fit, and Host Freedom from declared inputs — then hands a clean packet to Occasion OS.",
    status: "live",
    statusNote: "Architecture layer inside Occasion OS · contract 1.1.0",
    href: "https://occasion.saltnotes.blog/architecture",
    metrics: [
      { value: "5", label: "Roles" },
      { value: "5", label: "Stress axes" },
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
    suite: "architecture",
    fleet: false,
  },
  {
    id: "SC-OOS-001",
    slug: "occasion-os",
    name: "Occasion Operating System",
    short: "The night, sequenced",
    useWhen: "The menu is settled and the night still has to run itself.",
    notFor: "Choosing dishes, ranking restaurants, or reading the pantry.",
    decision: "What happens, in what order, and who is holding it?",
    summary:
      "Host planning instrument with Plan, Architecture (five-role menu stress — the SC-MB-001 engine, in-app), and Card under one chrome. Receives Kitchen & Bar Availability Packet 1.0. Architecture is not a separate peer tool on this desk — it lives here. Dietary categories stay planning filters — never allergy guarantees.",
    status: "live",
    statusNote: "Host Planning Instrument · local plan state",
    href: "https://occasion.saltnotes.blog",
    metrics: [
      { value: "3", label: "Layers" },
      { value: "1.1.0", label: "Receives" },
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
    handoffIn: "Menu Builder packet (contract 1.1.0) · Kitchen & Bar Availability Packet 1.0",
    handoffOut: "Optional occasion context → Restaurant Intelligence",
    track: "host",
    suite: "host",
    fleet: true,
  },
  {
    id: "SC-RI-001",
    slug: "restaurant-intelligence",
    name: "Restaurant Intelligence",
    short: "Dine out, with receipts",
    useWhen: "The night is better off-site and the room still has to fit the occasion.",
    notFor: "Cooking, pantry matching, prep sequencing, or menu construction.",
    decision: "Which room fits this occasion — and what must still be confirmed?",
    summary:
      "Situation-aware ranking from first-party evidence only. Multi-layer findings, booking pathways, confirm burden, guest-constraint matrix, and official conflicts — so you choose the room that fits the occasion, not the photograph.",
    status: "live",
    statusNote: `${RI_COVERAGE.caseFiles} first-party case files · ${RI_COVERAGE.regions} regions`,
    href: "https://deepdish.saltnotes.blog",
    metrics: [
      { value: String(RI_COVERAGE.caseFiles), label: "Case files" },
      { value: String(RI_COVERAGE.regions), label: "Regions" },
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
    suite: "dine",
    fleet: true,
  },
];
