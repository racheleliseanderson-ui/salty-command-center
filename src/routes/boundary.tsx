import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { BOUNDARIES, PHILOSOPHY, type BoundaryGroup } from "@/lib/desk-data";

export const Route = createFileRoute("/boundary")({
  head: () => ({
    meta: [
      { title: "Shared boundary — Salty Desk" },
      {
        name: "description",
        content:
          "The standing limits of the Salty & Clever suite: local-first storage, first-party evidence, no allergen safety guarantees, fail-closed hard stops.",
      },
      { property: "og:title", content: "Shared boundary — Salty Desk" },
      {
        property: "og:description",
        content:
          "Educational planning only. Dietary tags are filters, not safety controls. Hard constraints fail closed.",
      },
    ],
  }),
  component: Boundary,
});

const GROUPS: BoundaryGroup[] = ["Safety", "Data movement", "Evidence", "Scope"];

function Boundary() {
  return (
    <div className="min-h-dvh bg-ink">
      <DeskHeader />

      <section className="border-b border-border bg-ink-deep">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="label-mono text-brass">Shared boundary</p>
          <h1 className="display-xl mt-6 max-w-[18ch] text-bone">
            What the desk
            <span className="block text-brass">will not do.</span>
          </h1>
          <p className="mt-8 max-w-[56ch] text-base leading-relaxed text-foreground/85 sm:text-lg">
            Every tool in the suite holds the same limits. Each one below states the limit, why it
            exists, and what happens instead. They are design decisions, not gaps waiting to be
            filled.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="label-mono text-brass">Hard limits, grouped</p>
        <div className="mt-8 space-y-12">
          {GROUPS.map((g) => {
            const rows = BOUNDARIES.filter((b) => b.group === g);
            if (!rows.length) return null;
            return (
              <div key={g}>
                <h2 className="font-display text-3xl leading-tight text-bone">{g}</h2>
                <div className="mt-6 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
                  {rows.map((b) => (
                    <article key={b.id} className="bg-ink-deep p-5 sm:p-6">
                      <p className="flex gap-3 font-display text-xl leading-snug text-bone">
                        <TriangleAlert className="mt-1.5 h-4 w-4 shrink-0 text-destructive-foreground" />
                        {b.limit}
                      </p>
                      <p className="mt-4 text-[0.85rem] leading-relaxed text-foreground/85">
                        <span className="label-mono block text-[0.58rem]">Why</span>
                        {b.why}
                      </p>
                      <p className="mt-4 text-[0.85rem] leading-relaxed text-muted-foreground">
                        <span className="label-mono block text-[0.58rem] text-brass">Instead</span>
                        {b.instead}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="label-mono text-brass">Standing rules</p>
            <dl className="mt-6 divide-y divide-border">
              {PHILOSOPHY.map((p) => (
                <div key={p.k} className="py-4">
                  <dt className="font-display text-xl text-bone">{p.k}</dt>
                  <dd className="mt-1 text-[0.86rem] leading-relaxed text-muted-foreground">
                    {p.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="max-w-[52ch] text-[0.86rem] leading-relaxed text-muted-foreground">
              Educational planning only — not professional kitchen, medical, or legal advice. Sold and
              supported by Northern Lantern House LLC when purchases are enabled.
            </p>
            <Link
              to="/handoffs"
              className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-brass transition-colors hover:text-bone"
            >
              See what moves between tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <DeskFooter />
    </div>
  );
}

