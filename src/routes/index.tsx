import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { ToolCard } from "@/components/desk/ToolCard";
import {
  FLEET_STATS,
  FLEET_TOOLS,
  HANDOFFS,
  HOST_PATH,
  PHILOSOPHY,
  SUITES,
  TOOLS,
} from "@/lib/desk-data";
import heroPass from "@/assets/hero-pass.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salty Desk — Host & dine intelligence command center" },
      {
        name: "description",
        content:
          "The front door to Salty & Clever: Kitchen & Bar Intelligence, Occasion Operating System (with Architecture inside), and Restaurant Intelligence. Three equal tools. Explicit handoffs only.",
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
          <p className="label-mono text-brass">Salty & Clever · Three live instruments</p>
          <h1 className="display-xl mt-6 max-w-[18ch] text-bone">
            Commit the kitchen
            <span className="block text-brass">on purpose.</span>
          </h1>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-foreground/85">
            Salty Desk is the orientation surface for three independent tools at equal depth.
            Architecture (five-role menu stress) lives inside Occasion OS — not as a fourth peer.
            The desk names the question you actually have, then routes you there with the handoff
            stated out loud.
          </p>
          <div className="mt-10 flex min-w-0 flex-wrap gap-3">
            <a
              href="#tools"
              className="press tap inline-flex items-center gap-2 bg-brass px-5 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone"
            >
              Find the right tool
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/host-path"
              className="press tap inline-flex items-center gap-2 border border-bone/30 px-5 py-3 text-sm font-medium tracking-wide text-bone transition-colors hover:border-brass hover:text-brass"
            >
              Host Path
            </Link>
            <Link
              to="/intelligence"
              className="press tap inline-flex items-center gap-2 border border-bone/30 px-5 py-3 text-sm font-medium tracking-wide text-bone transition-colors hover:border-brass hover:text-brass"
            >
              Fleet intelligence
            </Link>
          </div>
          <p className="mt-12 max-w-[46ch] border-l border-brass/50 pl-5 font-display text-2xl leading-snug text-bone/90">
            Vanity is allowed. The oven still has to finish on time.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-ink-deep">
        <dl className="mx-auto grid max-w-[1120px] min-w-0 grid-cols-2 gap-px overflow-hidden sm:grid-cols-3 lg:grid-cols-6">
          {FLEET_STATS.map((s) => (
            <div key={s.label} className="min-w-0 bg-ink-deep px-5 py-8">
              <dt className="font-display text-3xl tabular-nums text-brass">{s.value}</dt>
              <dd className="label-mono mt-2 break-words">{s.label}</dd>
              <dd className="mt-1 text-[11px] leading-snug text-muted-foreground">{s.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="tools" className="mx-auto max-w-[1120px] min-w-0 px-5 py-20 sm:px-8">
        <p className="label-mono text-brass">The suite</p>
        <h2 className="mt-3 max-w-[22ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
          Three tools. One question each.
        </h2>
        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
          If two tools seem to overlap, you're holding the wrong question. Read the decision
          line, not the feature list. Menu architecture is a layer inside Occasion OS — not a
          peer card on this desk.
        </p>

        <div className="mt-14 space-y-16">
          {SUITES.map((suite) => {
            const apps = FLEET_TOOLS.filter((t) => t.suite === suite.id);
            if (apps.length === 0) return null;
            return (
              <div key={suite.id} className="space-y-5">
                <div>
                  <p className="label-mono text-brass">{suite.label}</p>
                  <h3 className="mt-2 font-display text-3xl leading-snug text-bone">
                    {suite.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {suite.blurb}
                  </p>
                </div>
                <div
                  className={
                    apps.length === 1
                      ? "grid min-w-0 grid-cols-1 gap-5 lg:max-w-3xl"
                      : "grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2"
                  }
                >
                  {apps.map((tool, i) => (
                    <ToolCard key={tool.id} tool={tool} index={i} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="panel mt-12 rounded-lg p-6 sm:p-8">
          <p className="label-mono text-brass">Architecture · inside Occasion OS</p>
          <h3 className="mt-2 font-display text-2xl text-bone">Not a fourth peer tool</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Five-role menu architecture, stress meters, anchor lock, and hard stops run at{" "}
            <span className="text-bone">occasion.saltnotes.blog/architecture</span> under the same
            host chrome. SC-MB-001 is a layer, not a storefront card.
          </p>
          <a
            href="https://occasion.saltnotes.blog/architecture"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-brass hover:underline"
          >
            Open Architecture
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      <section className="border-t border-border bg-ink-deep">
        <div className="mx-auto max-w-[1120px] min-w-0 px-5 py-20 sm:px-8">
          <div className="flex min-w-0 flex-wrap items-end justify-between gap-4">
            <div className="min-w-0 max-w-xl">
              <p className="label-mono text-brass">Host path</p>
              <h2 className="mt-3 max-w-[22ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
                Plan the night — or dine out.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Occasion OS (Plan + Architecture) first. Restaurant Intelligence when dining wins.
                Kitchen & Bar is optional when the shelf is the question.
              </p>
            </div>
            <Link
              to="/host-path"
              className="press tap inline-flex items-center gap-2 bg-brass px-5 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone"
            >
              Open Host Path
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ol className="mt-10 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            {HOST_PATH.map((step) => {
              const tool = TOOLS.find((t) => t.slug === step.toolSlug);
              return (
                <li key={step.step} className="panel min-w-0 overflow-hidden rounded-lg p-6">
                  <p className="label-mono text-brass">
                    {String(step.step).padStart(2, "0")} · {tool?.id ?? step.appId}
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-snug text-bone">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words">
                    {step.summary}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] min-w-0 px-5 py-20 sm:px-8">
        <p className="label-mono text-brass">Handoffs</p>
        <h2 className="mt-3 font-display text-4xl leading-[1.05] text-bone">
          What moves. What doesn't.
        </h2>
        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
          Nothing travels unless you send it. Each packet is public-safe and versioned.
        </p>
        <ul className="mt-10 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
          {HANDOFFS.filter((h) => h.toId !== "Editorial").map((h) => (
            <li key={h.fromId + h.toId} className="panel min-w-0 overflow-hidden rounded-lg p-6">
              <p className="label-mono">
                {h.tag} · {h.contract}
              </p>
              <p className="mt-3 font-display text-xl leading-snug text-bone break-words">
                {h.from}
                <span className="mx-2 text-brass">→</span>
                {h.to}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words">
                {h.purpose}
              </p>
              <Link
                to="/handoffs"
                className="mt-4 inline-flex items-center gap-2 text-sm text-brass"
              >
                Packet map
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-ink-deep">
        <div className="mx-auto max-w-[1120px] min-w-0 px-5 py-20 sm:px-8">
          <div className="flex min-w-0 flex-wrap items-end justify-between gap-4">
            <div className="min-w-0 max-w-xl">
              <p className="label-mono text-brass">Standing rules</p>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] text-bone">
                The desk will not do these things.
              </h2>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/privacy" className="text-brass">
                Privacy boundary
              </Link>
              <Link to="/boundary" className="text-muted-foreground hover:text-brass">
                Full rules
              </Link>
            </div>
          </div>
          <ul className="mt-10 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PHILOSOPHY.map((item) => (
              <li key={item.k} className="panel min-w-0 overflow-hidden rounded-lg p-5">
                <p className="label-mono text-brass">{item.k}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85 break-words">
                  {item.v}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <DeskFooter />
    </div>
  );
}
