import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { MENU_BUILDER, OCCASION_OS, RESTAURANT_INTELLIGENCE } from "@/lib/desk-data";
import prepMise from "@/assets/prep-mise.jpg";

export const Route = createFileRoute("/host-path")({
  head: () => ({
    meta: [
      { title: "Host Path — Salty Desk" },
      {
        name: "description",
        content:
          "The recommended sequence for hosting at home: Menu Builder, then Occasion Operating System — with Restaurant Intelligence as the dine-out alternative.",
      },
      { property: "og:title", content: "Host Path — Salty Desk" },
      {
        property: "og:description",
        content:
          "Architect the menu, stress-test service, then run the night from one host plan. Handoffs stay explicit.",
      },
    ],
  }),
  component: HostPath,
});

const STEPS = [
  {
    n: "01",
    id: "SC-MB-001",
    title: "Architect the menu",
    decision: "Can this kitchen finish this menu on time?",
    does: [
      "Declare occasion, guest count, service style, host attention, equipment",
      "Assign five roles and pick a pairing mode",
      "Lock an anchor dish and re-score around it",
      "Apply bounded simplification where stress is highest",
    ],
    exit: "A stress summary with hard stops resolved — or an honest refusal.",
    tool: MENU_BUILDER,
  },
  {
    n: "02",
    id: "SC-OOS-001",
    title: "Run the night",
    decision: "What happens, in what order, and who is holding it?",
    does: [
      "Carry the Menu Builder packet forward (your choice, contract 1.1.0)",
      "Set conditions: guests, service style, attention budget, capacity",
      "Build the shop → prep → serve route",
      "Keep dietary categories as planning filters only",
    ],
    exit: "One host plan you can work from, with the food-safety boundary in view.",
    tool: OCCASION_OS,
  },
] as const;

function HostPath() {
  const ri = RESTAURANT_INTELLIGENCE;

  return (
    <div className="min-h-dvh bg-ink">
      <DeskHeader />

      <section className="relative isolate overflow-hidden border-b border-border">
        <img
          src={prepMise}
          alt="Overhead mise en place in steel bowls on a dark slate surface"
          width={1200}
          height={1504}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="ink-veil absolute inset-0" />
        <div className="relative mx-auto max-w-[1240px] px-5 pb-20 pt-24 sm:px-8">
          <p className="label-mono text-brass">Primary path · hosting at home</p>
          <h1 className="display-xl mt-6 max-w-[16ch] text-bone">
            Two steps,
            <span className="block text-brass">in this order.</span>
          </h1>
          <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-foreground/85">
            The Host Path sequences the two decisions that actually gate a night at home. Nothing
            moves between the tools until you send it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] space-y-8 px-5 py-20 sm:px-8">
        {STEPS.map((s) => (
          <article key={s.id} className="panel rounded-lg p-7 sm:p-10">
            <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-6xl leading-none text-brass">{s.n}</span>
                  <span className="label-mono">{s.id}</span>
                </div>
                <h2 className="mt-6 font-display text-4xl leading-tight text-bone">{s.title}</h2>
                <p className="mt-4 border-l border-brass/40 pl-4 font-display text-xl leading-snug text-brass/90">
                  {s.decision}
                </p>
                <a
                  href={s.tool.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 border border-brass/50 bg-brass/10 px-4 py-2.5 text-[0.8rem] tracking-wide text-brass transition-colors hover:bg-brass hover:text-primary-foreground"
                >
                  Open {s.tool.name}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              <div>
                <p className="label-mono">In this step</p>
                <ul className="mt-4 space-y-2.5">
                  {s.does.map((d) => (
                    <li
                      key={d}
                      className="flex gap-3 text-[0.86rem] leading-relaxed text-foreground/85"
                    >
                      <span className="mt-2.5 h-px w-4 shrink-0 bg-brass/70" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 border border-border bg-ink-deep p-5">
                  <p className="label-mono text-brass">You leave with</p>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-bone/90">{s.exit}</p>
                </div>
              </div>
            </div>
          </article>
        ))}

        <article className="rounded-lg border border-dashed border-border bg-ink-deep p-7 sm:p-10">
          <p className="label-mono">Alternative · dine out</p>
          <h2 className="mt-4 font-display text-4xl text-bone">When hosting doesn't survive</h2>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
            A hard stop in step one is a real answer. {ri.name} ranks rooms by occasion fit and
            operating reality — unknowns, conflicts, and confirm burden left visible.
          </p>
          <a
            href={ri.href}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 border border-bone/30 px-4 py-2.5 text-[0.8rem] tracking-wide text-bone transition-colors hover:border-brass hover:text-brass"
          >
            Open {ri.name}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </article>

        <Link
          to="/handoffs"
          className="inline-flex items-center gap-2 text-sm text-brass transition-colors hover:text-bone"
        >
          See exactly what moves between the tools
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <DeskFooter />
    </div>
  );
}
