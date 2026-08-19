import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { ToolCard } from "@/components/desk/ToolCard";
import { Triage } from "@/components/desk/Triage";
import { HANDOFFS, PHILOSOPHY, TOOLS } from "@/lib/desk-data";
import heroPass from "@/assets/hero-pass.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salty Desk — Host & dine intelligence command center" },
      {
        name: "description",
        content:
          "The front door to Salty & Clever: Kitchen & Bar Intelligence, Menu Builder, Occasion Operating System, and Restaurant Intelligence. Pick the right tool, see every handoff, commit the kitchen on purpose.",
      },
    ],
  }),
  component: Desk,
});

const STATS = [
  { value: "4", label: "Live tools" },
  { value: "225", label: "Case files" },
  { value: "15", label: "Regions" },
  { value: "1.0", label: "Kitchen packet" },
] as const;

const PATH = [
  {
    n: "01",
    id: "SC-KBI-001",
    title: "What's on the shelf?",
    body: "Kitchen & Bar reads the pantry and bar, ranks a pour, and packs what is actually available.",
  },
  {
    n: "02",
    id: "SC-MB-001",
    title: "Can the menu finish?",
    body: "Menu Builder returns stress scores and hard stops before you commit the kitchen.",
  },
  {
    n: "03",
    id: "SC-OOS-001",
    title: "Can the night run?",
    body: "Occasion OS sequences shop → prep → serve against your real attention and capacity.",
  },
  {
    n: "04",
    id: "SC-RI-001",
    title: "Or dine out.",
    body: "If either answer is no, ranking a room is the correct outcome — not a failure.",
  },
] as const;

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
          <p className="label-mono text-brass">Salty & Clever · Four live instruments</p>
          <h1 className="display-xl mt-6 max-w-[18ch] text-bone">
            Commit the kitchen
            <span className="block text-brass">on purpose.</span>
          </h1>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-foreground/85">
            Salty Desk is the orientation surface for four independent tools. It names the one that
            answers the question you actually have — then routes you there with the handoff stated
            out loud.
          </p>
          <div className="mt-10 flex min-w-0 flex-wrap gap-3">
            <a
              href="#triage"
              className="press tap inline-flex items-center gap-2 bg-brass px-5 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone"
            >
              Find the right tool
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#tools"
              className="press tap inline-flex items-center gap-2 border border-bone/30 px-5 py-3 text-sm font-medium tracking-wide text-bone transition-colors hover:border-brass hover:text-brass"
            >
              See the suite
            </a>
          </div>
          <p className="mt-12 max-w-[46ch] border-l border-brass/50 pl-5 font-display text-2xl leading-snug text-bone/90">
            Vanity is allowed. The oven still has to finish on time.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-ink-deep">
        <dl className="mx-auto grid max-w-[1120px] min-w-0 grid-cols-2 gap-px overflow-hidden sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="min-w-0 bg-ink-deep px-5 py-8">
              <dt className="font-display text-3xl tabular-nums text-brass">{s.value}</dt>
              <dd className="label-mono mt-2 break-words">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="tools" className="mx-auto max-w-[1120px] min-w-0 px-5 py-20 sm:px-8">
        <p className="label-mono text-brass">The suite</p>
        <h2 className="mt-3 max-w-[20ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
          Four tools. One question each.
        </h2>
        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
          If two tools seem to overlap, you're holding the wrong question. Read the decision
          line, not the feature list.
        </p>
        <div className="mt-12 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </section>

      <section id="triage" className="mx-auto max-w-[1120px] min-w-0 px-5 pb-20 sm:px-8">
        <p className="label-mono text-brass">Routing intelligence</p>
        <h2 className="mt-3 max-w-[22ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
          Answer four constraints. Get one entry point.
        </h2>
        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
          The desk does not sell you all four tools. It names the one that answers your question —
          and the ones that do not.
        </p>
        <div className="mt-12 min-w-0">
          <Triage />
        </div>
      </section>

      <section className="border-t border-border bg-ink-deep">
        <div className="mx-auto max-w-[1120px] min-w-0 px-5 py-20 sm:px-8">
          <p className="label-mono text-brass">Host path</p>
          <h2 className="mt-3 max-w-[22ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
            Pantry, then menu, then the night — or dine out.
          </h2>
          <ol className="mt-10 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            {PATH.map((step) => (
              <li key={step.n} className="panel min-w-0 overflow-hidden rounded-lg p-6">
                <p className="label-mono text-brass">
                  {step.n} · {step.id}
                </p>
                <h3 className="mt-3 font-display text-2xl leading-snug text-bone">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words">
                  {step.body}
                </p>
              </li>
            ))}
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
            <Link to="/boundary" className="text-sm text-brass">
              Full boundary
            </Link>
          </div>
          <ul className="mt-10 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PHILOSOPHY.map((item) => (
              <li key={item.k} className="panel min-w-0 overflow-hidden rounded-lg p-5">
                <p className="label-mono text-brass">{item.k}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85 break-words">{item.v}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <DeskFooter />
    </div>
  );
}
