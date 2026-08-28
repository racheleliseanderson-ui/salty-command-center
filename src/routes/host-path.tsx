import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { HOST_PATH, TOOLS } from "@/lib/desk-data";

export const Route = createFileRoute("/host-path")({
  head: () => ({
    meta: [
      { title: "Host Path — Salty Desk" },
      {
        name: "description",
        content:
          "Two steps for hosting at home: architecture and plan inside Occasion OS, or rank a room with Restaurant Intelligence when dining out wins.",
      },
    ],
  }),
  component: HostPathPage,
});

function HostPathPage() {
  return (
    <div className="min-h-dvh min-w-0 overflow-x-hidden bg-ink">
      <DeskHeader />

      <main className="mx-auto max-w-[1120px] min-w-0 px-5 py-16 sm:px-8 sm:py-20">
        <p className="label-mono text-brass">Primary path · hosting at home</p>
        <h1 className="mt-3 max-w-[18ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
          Two steps, in this order.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          The Host Path sequences the decisions that actually gate a night at home. Architecture
          (five-role menu stress) lives inside Occasion OS — not as a separate peer. Nothing moves
          between tools until you send it.
        </p>

        <ol className="mt-12 space-y-6">
          {HOST_PATH.map((step) => {
            const tool = TOOLS.find((t) => t.slug === step.toolSlug);
            return (
              <li key={step.step} className="panel min-w-0 overflow-hidden rounded-lg p-6 sm:p-8">
                <p className="label-mono text-brass">
                  {String(step.step).padStart(2, "0")} · {tool?.name ?? step.appId}
                </p>
                <h2 className="mt-3 font-display text-3xl leading-snug text-bone">{step.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {step.summary}
                </p>
                {tool ? (
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 bg-brass px-5 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone"
                  >
                    Open {tool.name}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </li>
            );
          })}
        </ol>

        <section className="mt-14 panel rounded-lg p-6 sm:p-8">
          <p className="label-mono text-brass">Optional · before you plan</p>
          <h2 className="mt-2 font-display text-2xl text-bone">What&apos;s already on the shelf?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Kitchen & Bar Intelligence is the daily execution layer — not required for Host Path.
            Use it when you are cooking from what you already have, then optionally share
            your shelf with Occasions.
          </p>
          <a
            href="https://kitchen.saltnotes.blog/"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-brass"
          >
            Open Kitchen & Bar
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </section>

        <section className="mt-8 panel rounded-lg p-6 sm:p-8">
          <p className="label-mono text-brass">Architecture inside Occasion OS</p>
          <h2 className="mt-2 font-display text-2xl text-bone">Menu stress is not a fourth tool</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Five-role architecture, stress meters, anchor lock, and hard stops run at{" "}
            <span className="text-bone">occasion.saltnotes.blog/architecture</span> under the same
            host chrome. Menu building is a layer, not a peer on this desk.
          </p>
          <a
            href="https://occasion.saltnotes.blog/architecture"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-brass"
          >
            Open Architecture
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </section>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brass">
            ← Back to desk
          </Link>
          <Link to="/handoffs" className="inline-flex items-center gap-2 text-sm text-brass">
            Handoff map
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>

      <DeskFooter />
    </div>
  );
}
