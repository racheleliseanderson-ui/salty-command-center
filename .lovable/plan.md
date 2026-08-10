# Lighter ground + dark/light toggle

Two changes: lift the dark theme a step out of near-black, and add a proper theme switch in the header so the desk can run light or dark.

## 1. Lighten the dark theme

Keep the ink-green/brass identity, raise the base luminance so panels read as material rather than void:

- Page ground moves from a near-black ink to a mid-slate ink-green (roughly `oklch(0.13)` → `oklch(0.20)`).
- Deep ground, surface, and raised surface step up in the same proportion so panel separation stays visible.
- Borders and hairlines brighten slightly to keep edges legible on the lighter ground.
- Brass, oxblood, live-green, and bone stay as-is; brass contrast is re-checked against the new ground.

## 2. Light mode

A parallel light palette using the same token names, so no component markup changes:

- Grounds become warm bone/paper tints; the reading-text token flips to deep ink-green.
- Brass darkens to a deeper antique brass for AA contrast on paper.
- Panels get soft ink shadows instead of inset highlights; grain, hairline grid, and ink-veil overlays invert their tint.
- Voice and structure unchanged — light mode reads like a printed operations sheet, not a soft lifestyle site.

## 3. Toggle

- A compact brass sun/moon control in the sticky header (both desktop and mobile), labeled for screen readers.
- Choice persists in local storage; first visit follows the operating-system preference.
- Theme class is applied before first paint so there is no flash of the wrong theme.

## Technical notes

- `src/styles.css`: retune `:root` dark values; add a `.light` block redefining the same custom properties (`--ink*`, `--surface*`, `--bone`, `--border`, shadcn tokens). Overlay utilities (`panel`, `grain`, `hairline-grid`, `ink-veil`, `rule-brass`) get light-theme overrides so they don't wash out.
- New `src/components/desk/ThemeToggle.tsx` plus a small `useTheme` hook; mounted in `DeskHeader` in `src/components/desk/Chrome.tsx`.
- Inline pre-hydration script in `src/routes/__root.tsx` sets the theme class on `<html>` from storage/`prefers-color-scheme`; `theme-color` meta updated per theme.
- No route content, copy, or data changes; `src/lib/desk-data.ts` untouched.

## Verification

Render `/`, `/host-path`, `/handoffs`, `/boundary` in both themes at desktop and mobile widths; confirm imagery, brass accents, and hard-stop oxblood blocks still carry, and no text drops below AA.
