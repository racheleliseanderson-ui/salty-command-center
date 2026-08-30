import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { PipelineConsole } from "@/components/desk/PipelineConsole";
import { Reveal } from "@/components/desk/Reveal";
import { STAGES } from "@/lib/desk-pipeline";
import { useParallax } from "@/hooks/use-parallax";
import prepMise from "@/assets/prep-mise.jpg";

export const Route = createFileRoute("/pipeline")({
  head: () => ({
    meta: [
      { title: "Plan the night — Salty Desk" },
      {
        name: "description",
        content:
          "Start planning and take six steps in order: guests & constraints, menu, stress-test the night, share with Occasions, then the service window. We'll stop rather than guess.",
      },
      { property: "og:title", content: "Plan the night — Salty Desk" },
      {
        property: "og:description",
        content:
          "Guests and constraints, menu, stress-test the night, share with Occasions, then the service window.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PipelinePage,
});

function PipelinePage() {
  const heroRef = useParallax<HTMLImageElement>(0.12);

  return (
    <div className="min-h-dvh bg-ink">
      <DeskHeader />

      <section className="relative isolate overflow-hidden border-b border-border">
        <img
          ref={heroRef}
          src={prepMise}
          alt="Overhead mise en place on a dark steel counter under directional light"
          width={1600}
          height={1100}
          className="media-tone-soft absolute inset-0 h-full w-full object-cover will-change-transform"
        />
        <div className="ink-veil absolute inset-0" />
        <div className="hairline-grid absolute inset-0 opacity-40" />

        <div className="relative mx-auto max-w-[1240px] px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
          <p className="label-mono rise text-brass">Guests · menu · stress-test · share · service</p>
          <h1 className="rise display-xl mt-6 max-w-[20ch] text-bone">
            The plan
            <span className="block text-brass">holds or it doesn't.</span>
          </h1>
          <p className="rise mt-8 max-w-[56ch] text-lg leading-relaxed text-foreground/85">
            One path from declared constraints to the service window. Every step names its
            decision, its owner, and what must be true before anything advances.
          </p>

          <dl className="rise mt-12 grid max-w-3xl grid-cols-3 gap-px overflow-hidden border border-border bg-border">
            {[
              { k: "Steps", v: String(STAGES.length) },
              { k: "We'll stop rather than guess", v: String(STAGES.flatMap((s) => s.gates).filter((g) => g.hard).length) },
              { k: "Uploads", v: "0" },
            ].map((s) => (
              <div key={s.k} className="bg-ink-deep px-4 py-6 sm:px-5">
                <dt className="font-display text-3xl leading-none text-brass sm:text-4xl">{s.v}</dt>
                <dd className="label-mono mt-3">{s.k}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <PipelineConsole />
        </Reveal>
      </section>

      <section className="border-t border-border bg-ink-deep">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="label-mono text-brass">How the console behaves</p>
            <h2 className="mt-3 font-display text-4xl leading-[0.98] text-bone">
              Controls that refuse, not controls that nag.
            </h2>
            <ul className="mt-8 divide-y divide-border border-t border-border">
              {[
                ["Confirm & continue", "Moves the plan forward only when every required item on the open step is signed. Otherwise it records that more information is needed."],
                ["Reopen previous", "Steps back. Existing sign-offs stand until you withdraw them by hand."],
                ["Hold", "A deliberate pause. Nothing advances while paused, and the log says when it started."],
                ["Stand down", "Ends the plan as stopped. Dining out is the correct outcome, not a failure state."],
                ["Clear", "Deletes the plan and its log from this device. No copy exists anywhere else."],
              ].map(([k, v]) => (
                <li key={k} className="py-4">
                  <p className="font-display text-xl text-bone">{k}</p>
                  <p className="mt-1 text-[0.86rem] leading-relaxed text-muted-foreground">{v}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel-brass rounded-lg p-6 sm:p-9">
            <p className="label-mono text-brass">Where the plan sits</p>
            <h3 className="mt-3 font-display text-3xl leading-tight text-bone">
              The desk sequences the night. The tools do the work.
            </h3>
            <p className="mt-5 text-[0.9rem] leading-relaxed text-foreground/85">
              Menu and stress-test belong to menu building inside Occasion OS; the route and service
              window belong to Occasion OS. The desk owns guests & constraints and share with
              Occasions — the two points where an unstated assumption would otherwise travel.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                to="/handoffs"
                className="press tap inline-flex items-center justify-center gap-2 border border-brass/50 px-4 text-[0.8rem] tracking-wide text-brass transition-colors hover:bg-brass hover:text-primary-foreground"
              >
                What moves when you share
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/boundary"
                className="press tap inline-flex items-center justify-center gap-2 px-2 text-[0.8rem] tracking-wide text-muted-foreground transition-colors hover:text-brass"
              >
                Standing limits on every stage
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DeskFooter />
    </div>
  );
}
