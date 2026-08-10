import { STAGES } from "@/lib/desk-pipeline";
import { BOUNDARIES, DESK_LOG, GLOSSARY, HANDOFFS, LEDGER, TOOLS } from "@/lib/desk-data";

export type SearchKind = "tool" | "handoff" | "limit" | "term" | "ledger" | "log" | "stage";

export type SearchHit = {
  id: string;
  kind: SearchKind;
  kindLabel: string;
  title: string;
  detail: string;
  /** Internal route, when there is one. */
  to?: string;
  params?: { slug: string };
  /** External tool surface. */
  href?: string;
  haystack: string;
};

export const KIND_LABEL: Record<SearchKind, string> = {
  tool: "Tool",
  handoff: "Handoff",
  limit: "Limit",
  term: "Term",
  ledger: "Ledger",
  log: "Desk log",
  stage: "Run stage",
};

function entry(
  kind: SearchKind,
  id: string,
  title: string,
  detail: string,
  extra: string[],
  link: Partial<Pick<SearchHit, "to" | "params" | "href">> = {},
): SearchHit {
  return {
    id,
    kind,
    kindLabel: KIND_LABEL[kind],
    title,
    detail,
    haystack: [title, detail, ...extra].join(" ").toLowerCase(),
    ...link,
  };
}

/** Flattened, deterministic index over everything the desk holds. */
export const SEARCH_INDEX: SearchHit[] = [
  ...STAGES.map((st) =>
    entry(
      "stage",
      `stage-${st.id}`,
      `${st.code} · ${st.name}`,
      st.decision,
      [st.owner, st.produces, st.duration, ...st.gates.flatMap((g) => [g.label, g.detail])],
      { to: "/pipeline" },
    ),
  ),
  ...TOOLS.map((t) =>
    entry(
      "tool",
      `tool-${t.slug}`,
      t.name,
      t.decision,
      [t.id, t.short, t.useWhen, t.notFor, t.summary, ...t.capabilities, ...t.refusals],
      { to: "/tools/$slug", params: { slug: t.slug } },
    ),
  ),
  ...HANDOFFS.map((h) =>
    entry(
      "handoff",
      `handoff-${h.fromId}-${h.toId}`,
      `${h.from} → ${h.to}`,
      h.purpose,
      [
        h.contract,
        h.tag,
        h.breaksIf,
        ...h.moves.flatMap((m) => [m.field, m.reason]),
        ...h.stays.flatMap((s) => [s.field, s.reason]),
        ...h.canConclude,
        ...h.cannotConclude,
      ],
      { to: "/handoffs" },
    ),
  ),
  ...BOUNDARIES.map((b) =>
    entry("limit", `limit-${b.id}`, b.limit, b.why, [b.group, b.instead], { to: "/boundary" }),
  ),
  ...GLOSSARY.map((g) => entry("term", `term-${g.term}`, g.term, g.def, [], { to: "/reference" })),
  ...LEDGER.map((r) =>
    entry("ledger", `ledger-${r.id}`, `${r.name} — ${r.state}`, r.accepts, [
      r.id,
      r.build,
      r.contract,
      r.rejects,
      r.updated,
    ], { to: "/reference" }),
  ),
  ...DESK_LOG.map((l, i) =>
    entry("log", `log-${i}`, `${l.id} · ${l.date}`, l.entry, [], { to: "/reference" }),
  ),
];

/** Token-AND matching so "menu stress" narrows instead of widening. */
export function search(query: string, kinds?: SearchKind[]): SearchHit[] {
  const pool = kinds && kinds.length ? SEARCH_INDEX.filter((h) => kinds.includes(h.kind)) : SEARCH_INDEX;
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return pool;
  return pool
    .map((hit) => {
      let score = 0;
      for (const tk of tokens) {
        if (!hit.haystack.includes(tk)) return null;
        if (hit.title.toLowerCase().includes(tk)) score += 3;
        else score += 1;
      }
      return { hit, score };
    })
    .filter((r): r is { hit: SearchHit; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.hit);
}
