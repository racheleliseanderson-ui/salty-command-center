# Boundary + Handoff depth, portable triage, mobile, colour-blind safety

## What changes

### 1. Triage becomes interactive and portable
- The four constraint answers persist (local only) so they follow you across the desk.
- Triage gains progressive state: a step counter, "2 of 4 declared", live re-ranking as each answer lands, an inline "why this changed" line naming the constraint that moved the verdict, and per-option keyboard support.
- A compact "Your declared constraints" chip row appears on `/handoffs` and `/boundary` when answers exist, with a link back to re-declare or clear them.
- Nothing is uploaded; wording stays explicit that this is local and reader-initiated.

### 2. `/handoffs` — clearer moves vs stays, with worked examples
- Each handoff card gets a plain-language framing line: what the packet is *for*, and what breaks if it moved more than it does.
- "Moves forward" / "Stays behind" become a labelled two-column contract with an explicit reason per row (not just a list), plus a "what the receiving tool can and cannot conclude" note.
- New inline **worked example** per handoff, tailored to your triage selection: a rendered sample packet using your covers/attention/runway (e.g. 9+ covers, split attention, few days) showing the exact field values that would travel and the ones that would be withheld. With no selection, a neutral default example renders and invites you to declare constraints.
- A short "before you send" checklist replaces the current generic rules block, and hard-stop cases show that a refused stop never travels as an approval.

### 3. `/boundary` — constraints stated in operational terms
- Each hard limit gets: the limit, the reason it exists, and what happens instead (the fail-closed behaviour), rather than a one-line bullet.
- Limits are grouped into Safety, Data movement, Evidence, and Scope so the page reads as a contract, not a disclaimer.
- Tailored section: when triage answers exist, the boundaries that actually bind your case are surfaced first with a one-line "this applies to you because…" — including the hard-stop explanation when your constraints breach one.
- Standing rules keep the dry voice; the educational-only and allergen statements stay verbatim in substance.

### 4. Mobile compatibility pass
- Header/nav: constraint chips, tool nav and theme toggle recompose for narrow widths instead of wrapping awkwardly.
- Every text-plus-widget header row moves to `grid-cols-[minmax(0,1fr)_auto]` with `min-w-0` / `shrink-0` / `truncate`, promoted to flex at `sm:`.
- Handoff cards stack with the arrow rotating to vertical; moves/stays columns stack with retained labels.
- Triage option buttons become full-width tap targets at ≥44px; display type scales down a step on mobile; `h-dvh` replaces `h-screen`.
- Reviewed at 390px, 768px and desktop before finishing.

### 5. Colour-blind accessibility
- No status is carried by colour alone. Moves/stays, verdicts and hard stops each get an icon plus a text label (`MOVES` / `WITHHELD` / `HARD STOP`), and fit bars get a numeric value plus a differing edge treatment.
- Fit bars and status dots use distinguishable non-hue cues (dashed vs solid rule, filled vs outlined marker).
- A colour-vision-safe palette variant sits alongside the existing theme toggle: swaps the red/green oxblood-and-pine signalling for a blue/amber pair that stays separable under deuteranopia, protanopia and tritanopia, in both light and dark.
- Contrast checked against AA for brass-on-ink and ink-on-bone at small sizes; tokens adjusted where they fail.
- Accessible names on every icon-only control, `aria-pressed` on toggles, `aria-live` on the verdict region.

## Technical notes
- New `src/hooks/use-triage-state.ts` holding answers in `localStorage` (`salty-desk-triage`), read after hydration to avoid mismatch; `Triage.tsx` switches to it from local `useState`.
- New `src/lib/desk-examples.ts` deriving worked packet examples from `Answers` + `HANDOFFS`; pure, deterministic, no network.
- `desk-data.ts` `BOUNDARIES` upgrades from `string[]` to `{ group, limit, why, instead }[]`; `HANDOFFS` rows gain `reason` per moves/stays entry and a `purpose` + `cannotConclude` field. `/boundary` and `/handoffs` update to the new shapes.
- New `src/components/desk/ConstraintChips.tsx` and `src/components/desk/HandoffExample.tsx`.
- Palette variant added in `src/styles.css` as a `.cvd` class on `<html>` with overridden semantic tokens, applied in the same pre-paint script as the theme; `use-theme.ts` gains the third preference.
- Content and presentation only — no backend, no data collection.
