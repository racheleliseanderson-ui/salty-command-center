import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { HandoffMap } from "@/components/desk/HandoffMap";

export const Route = createFileRoute("/handoffs")({
  head: () => ({
    meta: [
      { title: "Handoff map — Salty Desk" },
      {
        name: "description",
        content:
          "Exactly what moves between Menu Builder, Occasion Operating System, and Restaurant Intelligence — and what stays behind. Explicit handoffs only.",
      },
      { property: "og:title", content: "Handoff map — Salty Desk" },
      {
        property: "og:description",
        content:
          "Public-safe packets move only when you send them. Nothing is uploaded; nothing is inferred across tools.",
      },
    ],
  }),
  component: Handoffs,
});

function Handoffs() {
  return (
    <div className="min-h-screen bg-ink">
      <DeskHeader />

      <section className="border-b border-border bg-ink-deep">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
          <p className="label-mono text-brass">Explicit handoffs only</p>
          <h1 className="display-xl mt-6 max-w-[18ch] text-bone">
            Nothing moves
            <span className="block text-brass">until you move it.</span>
          </h1>
          <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-foreground/85">
            Each tool owns its own state. A handoff is a packet you choose to send — read the two
            columns before you send one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
        <HandoffMap />

        <div className="panel mt-10 rounded-lg p-7 sm:p-9">
          <p className="label-mono text-brass">Rules of transfer</p>
          <ul className="mt-5 grid gap-4 text-[0.88rem] leading-relaxed text-foreground/85 md:grid-cols-2">
            <li>Handoffs are reader-initiated. There is no background sync.</li>
            <li>Packets are public-safe: no private notes, no guest identities.</li>
            <li>Dietary categories travel as planning filters, never as allergy guarantees.</li>
            <li>A refused hard stop does not travel as an approval.</li>
          </ul>
          <Link
            to="/boundary"
            className="mt-7 inline-flex items-center gap-2 text-sm text-brass transition-colors hover:text-bone"
          >
            Read the shared boundary
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <DeskFooter />
    </div>
  );
}
