# Salty Desk: lighter theme, theme toggle, and a more dynamic desk

Two tracks in one pass: fix the darkness and add a theme switch, then make the desk feel like a live surface with real depth instead of a static orientation page.

## 1. Lighter dark theme + toggle

- Raise the base luminance of the ink-green ground a full step (near-black to mid-slate ink) so panels read as material, not void. Deep ground, surface, and raised surface step up proportionally; borders brighten so edges stay legible.
- Brass, oxblood, live-green, and bone identity colors stay; contrast re-checked on the new ground.
- Add a full light theme using the same token names, so no markup changes: warm bone/paper grounds, deep ink-green reading text, a darker antique brass for AA contrast, soft ink shadows in place of inset highlights, and inverted grain/hairline/veil overlays. Light mode reads like a printed operations sheet, not a soft lifestyle site.
- Compact brass sun/moon toggle in the sticky header (desktop and mobile), screen-reader labeled. Choice persists locally; first visit loads the lighter dark theme.
- Theme class applied before first paint so there is no flash of the wrong theme.

## 2. Interactive triage

New "Which tool do I need?" console on the home page, above the suite sections:

- Three or four dry, constraint-shaped questions: are you cooking or going out, how many at the table, how much attention you actually have, how many days out.
- As answers land, the three tools re-rank live with a fit reading and a one-line reason ("Menu Builder first — plated capacity is the binding constraint at 10 covers"). Non-fitting tools dim rather than disappear, with the reason they are the wrong tool.
- Ends in a routing verdict: the recommended entry point, the handoff that follows it, and the honest "don't host" outcome when the constraints don't survive.
- All scoring is deterministic and local — no backend, no AI, no accounts. Answers can be reset in one click.

## 3. Live-feeling data, hand-curated

Expand `src/lib/desk-data.ts` into a richer local dataset, shaped so it could later be swapped for a live feed without touching components:

- Per-tool build/contract versions, last-updated stamps, engine identifiers, and a short changelog line.
- Suite-level counters (case files, regions, occasions, booking pathways, stress axes) rendered as animated count-ups on scroll.
- A status ledger strip: each tool with state, current contract, and what it will and won't accept right now.
- A short "recent to the desk" list of curated suite changes, dated and dry.

## 4. More pages and depth

- `/tools/menu-builder`, `/tools/occasion-os`, `/tools/restaurant-intelligence` — one detail route per tool: the decision it serves, inputs it demands, what it returns, hard stops, refusals, handoff contract, and launch action. Linked from the triage grid and tool cards.
- `/reference` — glossary of suite vocabulary (anchor, hard stop, stress axis, confirm burden, thin field, contract version) so the language stops being insider-only.
- Existing `/host-path`, `/handoffs`, `/boundary` kept and cross-linked from the new routes.

## 5. Motion and interaction

- Scroll-reveal on section entry, staggered within grids; respects reduced-motion.
- Slow parallax drift on the hero pass and dining-room images.
- Animated metric count-ups, brass hairlines that draw in, hover lifts on tool cards, and an animated arrow on the handoff map that traces what moves forward.
- Sticky section labels on long pages so the reader always knows which decision surface they are in.

## Technical notes

- `src/styles.css`: retune `:root` dark values; add a `.light` block redefining the same custom properties; light overrides for `panel`, `panel-brass`, `grain`, `hairline-grid`, `ink-veil`, `rule-brass`. Add reveal/count-up keyframes plus a `prefers-reduced-motion` guard.
- New: `src/components/desk/ThemeToggle.tsx`, `src/hooks/use-theme.ts`, `src/hooks/use-reveal.ts` (IntersectionObserver), `src/components/desk/Triage.tsx`, `src/components/desk/CountUp.tsx`, `src/components/desk/StatusLedger.tsx`, `src/components/desk/ToolDetail.tsx`.
- New routes: `src/routes/tools.$slug.tsx` (or three explicit files) and `src/routes/reference.tsx`, each with its own `head()` metadata; nav in `Chrome.tsx` extended.
- Pre-hydration inline script in `src/routes/__root.tsx` sets the theme class on `<html>`; `theme-color` meta follows the theme.
- Data stays static-typed in `src/lib/desk-data.ts` (plus a small `desk-triage.ts` for the scoring rules). No backend, no Lovable Cloud, no external calls.

## Verification

Render `/`, the three tool routes, `/host-path`, `/handoffs`, `/boundary`, `/reference` in both themes at desktop and mobile; walk the triage console end to end including the "don't host" outcome; confirm reveal animations fire once, reduced-motion is honored, and no text drops below AA.
