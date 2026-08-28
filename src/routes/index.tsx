import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { DecisionDesk } from "@/components/desk/DecisionDesk";
import { FLEET_TOOLS } from "@/lib/desk-data";
import heroPass from "@/assets/hero-pass.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salty Desk — Decide what happens next" },
      {
        name: "description",
        content:
          "Start with the decision, keep a working brief, and move into Kitchen & Bar Intelligence, Occasion OS, or Restaurant Intelligence without navigating the same directory twice.",
      },
    ],
  }),
  component: Desk,
});

function Desk() {
  return (
    <div className="min-h-dvh min-w-0 overflow-x-hidden bg-ink">
      <DeskHeader />

      <section className="relative isolate overflow-hidden">
        <img
          src={heroPass}
          alt="Hands finishing a plate on a dark kitchen pass under brass service light"
          width={1600}
          height={1104}
          className="media-tone absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="ink-veil absolute inset-0" />
        <div className="hairline-grid absolute inset-0 opacity-40" />

        <div className="relative mx-auto max-w-[1120px] min-w-0 px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
          <p className="label-mono text-brass">Salty & Clever · Decision desk</p>
          <h1 className="display-xl mt-6 max-w-[18ch] text-bone">
            Start with the decision.
            <span className="block text-brass">Keep the context.</span>
          </h1>
          <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-foreground/85">
            The Desk is no longer another directory for the same three tools. Tell it what you are
            trying to accomplish, build a small working brief, and leave with one useful next move.
          </p>
          <div className="mt-10 flex min-w-0 flex-wrap gap-3">
            <a
              href="#decision-desk"
              className="press tap inline-flex items-center gap-2 bg-brass px-5 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone"
            >
              Start a working brief
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/handoffs"
              className="press tap inline-flex items-center gap-2 border border-bone/30 px-5 py-3 text-sm font-medium tracking-wide text-bone transition-colors hover:border-brass hover:text-brass"
            >
              See what can move between tools
            </Link>
          </div>
          <p className="mt-12 max-w-[46ch] border-l border-brass/50 pl-5 font-display text-2xl leading-snug text-bone/90">
            One question should have one obvious place to start.
          </p>
        </div>
      </section>

      <DecisionDesk />

      <section className="border-y border-border bg-ink-deep">
        <div className="mx-auto max-w-[1120px] min-w-0 px-5 py-16 sm:px-8 sm:py-20">
          <p className="label-mono text-brass">The instruments</p>
          <div className="mt-3 flex min-w-0 flex-wrap items-end justify-between gap-5">
            <div className="min-w-0">
              <h2 className="max-w-[22ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
                Three tools. Three different jobs.
              </h2>
              <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
                The suite navigation gets you there quickly. These cards exist only to explain the
                decision each instrument owns — not to create another layer of navigation.
              </p>
            </div>
          </div>

          <div className="mt-10 grid min-w-0 gap-4 lg:grid-cols-3">
            {FLEET_TOOLS.map((tool) => (
              <article key={tool.id} className="panel flex min-w-0 flex-col rounded-lg p-6">
                <p className="label-mono text-brass">{tool.name}</p>
                <h3 className="mt-3 font-display text-2xl leading-snug text-bone">{tool.decision}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tool.useWhen}
                </p>
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-brass hover:text-bone"
                >
                  Open {tool.name}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1120px] min-w-0 gap-5 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2">
        <article className="panel min-w-0 rounded-lg p-6 sm:p-8">
          <p className="label-mono text-brass">What the Desk owns</p>
          <h2 className="mt-3 font-display text-3xl leading-snug text-bone">
            The decision before the specialist work.
          </h2>
          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/85">
            <li className="border-l border-brass/50 pl-4">
              Establish the job: cook, build the menu, run the night, choose the room, or compare
              hosting with dining out.
            </li>
            <li className="border-l border-brass/50 pl-4">
              Keep party size, timing, and the main constraint in one working brief on this device.
            </li>
            <li className="border-l border-brass/50 pl-4">
              Recommend one starting instrument and state the next handoff instead of showing every
              possible destination at once.
            </li>
          </ul>
        </article>

        <article className="panel min-w-0 rounded-lg p-6 sm:p-8">
          <p className="label-mono text-brass">Continuity between tools</p>
          <h2 className="mt-3 font-display text-3xl leading-snug text-bone">
            Carry the decision, not the whole application.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            A useful handoff is small: confirmed availability, occasion context, or the menu state
            the next tool genuinely needs. Kitchen notes should not follow you to a restaurant
            decision, and restaurant research should not clutter a prep plan.
          </p>
          <Link
            to="/handoffs"
            className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm text-brass hover:text-bone"
          >
            Review the handoff map
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>
      </section>

      <DeskFooter />
    </div>
  );
}
