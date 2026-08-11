# Salty Desk — canonical handoff port map

The repo is connected, so the Lovable side is synced. This plan covers the next step: which of this build's parts should cross into the canonical repository and WordPress, and which must not.

## Status

Everything in this project now lives in the connected GitHub repository. That repo is the bounded design build, not the canonical source. Nothing has been merged into `salty-menu-builder`, and nothing has been published or deployed.

## What to freeze

Freeze the current commit on the connected repo's default branch as the handoff reference. All selection below is judged against that commit only.

## Selection (file-by-file)

RETAIN — port the behaviour and content:
- `src/lib/desk-data.ts` — tools, handoff contracts, boundary rules, glossary, ledger copy. The single content authority for the port.
- `src/lib/desk-pipeline.ts` — six-stage spine, hard-gate state machine, run-package builders.
- `src/lib/desk-triage.ts`, `src/lib/desk-examples.ts` — routing logic and selection-tailored examples.
- `src/lib/search-index.ts`, `src/lib/i18n.ts` — search corpus shape and EN/ES/FR label set.
- `src/hooks/use-pipeline-run.ts`, `use-triage-state.ts`, `use-theme.ts`, `use-locale.ts` — run persistence, triage persistence, four display modes, locale.
- `src/styles.css` — Navy / Pearl / Gold tokens, high-contrast and colour-safe token sets, motion and touch utilities.
- `src/assets/*.jpg` — the three art-directed images.

REWRITE for the destination:
- `src/components/desk/PipelineConsole.tsx` — port the console as a self-contained script/block; do not carry the React component tree.
- `src/components/desk/Triage.tsx`, `HandoffMap.tsx`, `CommandPalette.tsx`, `SearchField.tsx`, `DisplayControls.tsx`, `StatusLedger.tsx`, `ToolCard.tsx`, `CountUp.tsx`, `Reveal.tsx` — reimplement each as the canonical stack's own pattern.
- Route pages `index`, `pipeline`, `handoffs`, `boundary`, `host-path`, `reference`, `tools.$slug` — port as page compositions (section order, typography scale, image placement, copy), not as route files.

REJECT — never merge:
- `src/routes/__root.tsx`, `src/router.tsx`, `src/routeTree.gen.ts`, `src/server.ts`, `src/start.ts`, `vite.config.ts`, `package.json`, lockfile, `components.json`, `tsconfig.json`, ESLint/Prettier config — TanStack/Vite scaffold.
- `src/lib/error-capture.ts`, `error-page.ts`, `lovable-error-reporting.ts` — platform-only.
- `src/hooks/use-mobile.tsx`, `use-reveal.ts`, `use-parallax.ts` — replace with canonical equivalents rather than importing.
- `.lovable/`, `AGENTS.md`, `README.md`, `public/robots.txt`, and any generated workflow.

## WordPress port map (required per retained pattern)

| Pattern | Destination |
| --- | --- |
| Desk front door | Page template with art-directed hero and suite routing |
| Pipeline console | Single block/script with `localStorage` run state, no server calls |
| Triage | Block with persisted answers and live re-ranking |
| Handoff map | Structured content table generated from the ported data file |
| Boundary | Grouped-constraint content template |
| Reference glossary | Filterable term list |
| Display controls | Theme/contrast/colour-safe/locale toggles on the wrapper, tokens in the theme stylesheet |

## Invariants to preserve

- Run state, triage answers, notes and evidence stay first-party and local; no upload, no remote sensitive storage.
- Dietary categories remain planning filters, never allergy guarantees.
- A refused hard gate never travels as an approval.
- Every mode combination stays contrast-accessible; icon+text pairs stay paired.
- Reader-facing pages carry no internal production language.

## Out of scope

No merge to canonical `main`, no publishing, no domains, no backend, auth, analytics, or payments.

## Next step

Name the destination canonical repo and branch and I will produce the concrete per-file diff order against it.
