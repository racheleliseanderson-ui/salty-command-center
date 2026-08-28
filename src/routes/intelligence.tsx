import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { FLEET_STATS, FLEET_TOOLS, RI_COVERAGE } from "@/lib/desk-data";

export const Route = createFileRoute("/intelligence")({
  head: () => ({
    meta: [
      { title: "Fleet intelligence — Salty Desk" },
      {
        name: "description",
        content:
          "Same altitude on every tool. Real decisions, case-file counts, and we'll stop rather than guess for Kitchen & Bar, Occasion OS, and Restaurant Intelligence.",
      },
    ],
  }),
  component: IntelligencePage,
});

function IntelligencePage() {
  return (
    <div className="min-h-dvh min-w-0 overflow-x-hidden bg-ink">
      <DeskHeader />
      <main className="mx-auto max-w-[1120px] min-w-0 px-5 py-16 sm:px-8 sm:py-20">
        <Link to="/" className="text-sm text-muted-foreground hover:text-brass">
          ← Back to desk
        </Link>
        <p className="label-mono mt-8 text-brass">Fleet intelligence</p>
        <h1 className="mt-3 max-w-[20ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
          Same altitude. Full population.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Every app on this desk is first-class: real decisions, real case-file counts, real
          stops when a requirement is not met. No thin marketing shells. Menu building is a layer inside Occasion OS — not a
          fourth peer.
        </p>

        <div className="mt-10 grid min-w-0 grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
          {FLEET_STATS.map((s) => (
            <div key={s.label} className="min-w-0 bg-ink-deep px-4 py-5">
              <p className="font-display text-2xl tabular-nums text-brass">{s.value}</p>
              <p className="label-mono mt-1 break-words">{s.label}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 space-y-6">
          {FLEET_TOOLS.map((tool) => {
            return (
              <article key={tool.id} className="panel min-w-0 overflow-hidden rounded-lg p-6 sm:p-8">
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                  <span className="label-mono text-live">Available now</span>
                  {tool.handoffOut ? (
                    <span className="label-mono text-brass">{tool.handoffOut}</span>
                  ) : null}
                </div>
                <div className="mt-4 flex min-w-0 flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-display text-3xl leading-snug text-bone">{tool.name}</h2>
                    <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-brass">
                      {tool.short}
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {tool.summary}
                    </p>
                  </div>
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 bg-brass px-4 py-2.5 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone"
                  >
                    Launch
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-2">
                  <div className="min-w-0">
                    <p className="label-mono text-brass">Does</p>
                    <ul className="mt-3 space-y-2">
                      {tool.capabilities.map((line) => (
                        <li
                          key={line}
                          className="flex gap-3 text-sm leading-relaxed text-foreground/85"
                        >
                          <span className="mt-2 h-px w-3 shrink-0 bg-brass/70" />
                          <span className="min-w-0 break-words">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="min-w-0">
                    <p className="label-mono text-brass">Population</p>
                    <dl className="mt-3 grid min-w-0 grid-cols-2 gap-2">
                      {tool.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="min-w-0 border border-border bg-ink-deep/60 px-3 py-2.5"
                        >
                          <dt className="font-display text-lg text-brass break-words">{m.value}</dt>
                          <dd className="label-mono mt-0.5 break-words">{m.label}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                      <span className="text-foreground/80">Will not: </span>
                      {tool.refusals.join(" · ")}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="panel mt-10 rounded-lg p-6 sm:p-8">
          <p className="label-mono text-brass">Architecture · inside Occasion OS</p>
          <h2 className="mt-2 font-display text-2xl text-bone">Menu building is a layer</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Five-role menu building, stress meters, and we'll stop rather than guess at{" "}
            <span className="text-bone">occasion.saltnotes.blog/architecture</span>. Not a peer card on this desk.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            RI coverage: {RI_COVERAGE.caseFiles} case files · {RI_COVERAGE.enriched} with a first-party page read ·{" "}
            {RI_COVERAGE.regionNote}
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <Link to="/privacy" className="text-brass">
            Privacy boundary →
          </Link>
          <Link to="/handoffs" className="text-muted-foreground hover:text-brass">
            Handoff map
          </Link>
        </div>
      </main>
      <DeskFooter />
    </div>
  );
}
