import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { BOUNDARIES, PHILOSOPHY } from "@/lib/desk-data";

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

function Boundary() {
  return (
    <div className="min-h-screen bg-ink">
      <DeskHeader />

      <section className="border-b border-border bg-ink-deep">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
          <p className="label-mono text-brass">Shared boundary</p>
          <h1 className="display-xl mt-6 max-w-[18ch] text-bone">
            What the desk
            <span className="block text-brass">will not do.</span>
          </h1>
          <p className="mt-8 max-w-[56ch] text-lg leading-relaxed text-foreground/85">
            Every tool in the suite holds the same limits. They are design decisions, not gaps
            waiting to be filled.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="panel rounded-lg p-7 sm:p-9">
          <p className="label-mono text-brass">Hard limits</p>
          <ul className="mt-6 space-y-5">
            {BOUNDARIES.map((b) => (
              <li key={b} className="flex gap-4 text-[0.92rem] leading-relaxed text-foreground/85">
                <span className="mt-3 h-px w-5 shrink-0 bg-destructive" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-mono text-brass">Standing rules</p>
          <dl className="mt-6 divide-y divide-border">
            {PHILOSOPHY.map((p) => (
              <div key={p.k} className="py-4">
                <dt className="font-display text-xl text-bone">{p.k}</dt>
                <dd className="mt-1 text-[0.86rem] leading-relaxed text-muted-foreground">{p.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-[52ch] text-[0.86rem] leading-relaxed text-muted-foreground">
            Educational planning only — not professional kitchen, medical, or legal advice. Sold and
            supported by Northern Lantern House LLC when purchases are enabled.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 text-sm text-brass transition-colors hover:text-bone"
          >
            Back to the desk
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <DeskFooter />
    </div>
  );
}
