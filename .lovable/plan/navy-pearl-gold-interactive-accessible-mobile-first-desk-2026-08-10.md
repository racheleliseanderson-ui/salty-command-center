# Navy · Pearl · Gold — interactive, accessible, mobile-first desk

## 1. New palette: navy, pearl, gold
Replace the ink-green / brass system with a navy-and-gold identity, same token names so no markup churn:
- Dark (default): deep navy grounds, layered navy surfaces, gold signal, pearl reading colour, muted slate borders.
- Light: pearl/warm-white grounds, navy ink, gold accents.
- Gold stays the single signal colour; deep garnet for hard stops, teal for live/positive.
- Media overlays and grain retuned so photography reads navy-cool rather than green.

## 2. Four display modes, not two
The header gets one clear display control (segmented, keyboard operable) offering:
- **Navy** (dark default) · **Pearl** (light) · **High contrast black-on-white** · **High contrast white-on-black**
Plus the existing colour-blind-safe switch, now layered on top of any mode: gold/garnet signalling swaps to blue/amber, and every status keeps its icon + text label (MOVES / WITHHELD / HARD STOP). Choices persist locally and apply pre-paint so there is no flash.

## 3. Interactive experience
- **Command palette (⌘K / long-press on mobile):** searches tools, handoff fields, boundary limits, glossary terms and desk log entries; fuzzy matching, grouped results, keyboard arrows, recent items, deep-links straight to the section.
- **Inline search on /reference and /handoffs:** live filter with match highlighting, result counts, empty-state guidance, and a clear button.
- **Triage upgrade:** answers become swipeable/tappable cards with progress, live re-ranking, an "undo last answer" affordance and a shareable-by-copy summary of your declared constraints (still local only).
- **Tool comparison:** pick any two tools and see decision served / use when / not for / handoffs side by side.

## 4. Touch-friendly interactions
- Every control at least 44×44; primary actions 48.
- Swipe between triage steps and between tool cards on mobile; horizontal snap rails instead of cramped grids.
- Bottom sheet for the command palette on small screens; sticky bottom action bar on triage.
- Active/pressed states on touch (no hover-only affordances), momentum-safe scroll rails, `h-dvh` throughout.

## 5. Mobile compatibility pass
- All text-plus-widget rows use `grid-cols-[minmax(0,1fr)_auto]` with `min-w-0` / `shrink-0` / `truncate`, promoted to flex at `sm:`.
- Handoff cards stack with the arrow rotating vertical; moves/stays columns stack with labels retained.
- Display type steps down on mobile; hero recomposes rather than shrinking.
- Reviewed at 390px, 768px and desktop before finishing.

## 6. Language switcher
Yes — feasible, since all copy lives in local data/route files. Adds a lightweight local dictionary (no backend, no translation service) covering navigation, section headings, labels, triage questions and standing constraints in **English, Spanish and French**, with the switcher beside the display control and the choice persisted. Long-form editorial paragraphs stay English in this pass and are marked so, rather than machine-translated badly.

## 7. Motion
- Scroll-reveal with staggered entry, parallax on hero and interstitial imagery, rule-drawing hairlines, animated counters.
- Palette/mode transitions cross-fade instead of snapping; command palette and sheets use scale+fade enter/exit.
- Handoff arrows trace on entry; triage verdict animates its change and announces via `aria-live`.
- All of it respects `prefers-reduced-motion` (reveals become instant, parallax disabled).

## Technical notes
- `src/styles.css`: retoken `:root` and `.light` to navy/pearl/gold; add `.hc-light` / `.hc-dark` mode classes and keep `.cvd` as an orthogonal overlay; add reduced-motion guards.
- `src/hooks/use-theme.ts` generalises from two themes to a `DisplayMode` union; root pre-paint script in `src/routes/__root.tsx` updated to restore mode + cvd + locale.
- New: `src/lib/search-index.ts` (flattens desk data into searchable records), `src/components/desk/CommandPalette.tsx`, `src/components/desk/SearchField.tsx`, `src/components/desk/DisplayControls.tsx`, `src/components/desk/ToolCompare.tsx`, `src/lib/i18n.ts` + `src/hooks/use-locale.ts`.
- `Triage.tsx`, `HandoffMap.tsx`, `Chrome.tsx`, `StatusLedger.tsx` and all five routes updated for the new controls, search, swipe and responsive rules.
- Presentation and content only: no backend, no accounts, no data collection.
