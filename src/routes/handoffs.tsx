import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { HandoffMap } from "@/components/desk/HandoffMap";
import { SearchField } from "@/components/desk/SearchField";

export const Route = createFileRoute("/handoffs")({
  head: () => ({
    meta: [
<<<<<<< Updated upstream
      { title: "What travels — Salty Desk" },
      {
        name: "description",
        content:
          "Exactly what moves between Kitchen & Bar, menu building inside Occasion OS, Occasion Operating System, and Restaurant Intelligence — and what stays behind. You send it; nothing moves silently.",
      },
      { property: "og:title", content: "What travels — Salty Desk" },
      {
        property: "og:description",
        content:
          "Public-safe shares move only when you send them. Nothing is uploaded; nothing is inferred across tools.",
=======
      { title: "What travels between tools — Salty Desk" },
      {
        name: "description",
        content:
          "Exactly what moves between Kitchen & Bar, Architecture (inside Occasion OS), Occasion Operating System and Restaurant Intelligence — and what stays behind. Nothing travels unless you send it.",
      },
      { property: "og:title", content: "What travels between tools — Salty Desk" },
      {
        property: "og:description",
        content:
          "Nothing private travels, and nothing travels at all until you send it. Nothing is uploaded; nothing is guessed at across tools.",
>>>>>>> Stashed changes
      },
    ],
  }),
  component: Handoffs,
});

function Handoffs() {
  const [q, setQ] = useState("");

  return (
    <div className="min-h-dvh bg-ink">
      <DeskHeader />

      <section className="border-b border-border bg-ink-deep">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
<<<<<<< Updated upstream
          <p className="label-mono text-brass">You send it</p>
=======
          <p className="label-mono text-brass">You send it, or it stays put</p>
>>>>>>> Stashed changes
          <h1 className="display-xl mt-6 max-w-[18ch] text-bone">
            Nothing moves
            <span className="block text-brass">until you move it.</span>
          </h1>
          <p className="mt-8 max-w-[58ch] text-base leading-relaxed text-foreground/85 sm:text-lg">
<<<<<<< Updated upstream
            Each tool owns its own state. A share is something you choose to send. Every row below
            states the field, the reason it travels or is withheld, and what the receiving tool can
            and cannot conclude from it.
=======
            Each tool keeps its own information. Sending is something you do on purpose. Every row
            below names what would travel, why it travels or stays behind, and what the receiving
            tool can and cannot conclude from it.
>>>>>>> Stashed changes
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-[720px]">
          <SearchField
            value={q}
            onChange={setQ}
            label="Filter what travels"
<<<<<<< Updated upstream
            placeholder="Filter by field, reason or contract…"
          />
          <p className="label-mono mt-3">
            Filters the three shares below · ⌘K searches the whole desk.
=======
            placeholder="Filter by what moves, or why…"
          />
          <p className="label-mono mt-3">
            Filters every transfer below · ⌘K searches the whole desk.
>>>>>>> Stashed changes
          </p>
        </div>

        <div className="mt-10">
          <HandoffMap query={q} />
        </div>

        <div className="panel mt-10 rounded-lg p-5 sm:p-9">
          <p className="label-mono text-brass">Rules of transfer</p>
          <ul className="mt-5 grid gap-4 text-[0.88rem] leading-relaxed text-foreground/85 md:grid-cols-2">
<<<<<<< Updated upstream
            <li>Handoffs are reader-initiated. There is no background sync.</li>
            <li>What you share is public-safe: no private notes, no guest identities.</li>
            <li>Dietary categories travel as planning filters, never as allergy guarantees.</li>
            <li>A stopped requirement does not travel as an approval.</li>
            <li>A field with no job downstream does not travel, even when it is harmless.</li>
            <li>Reasoning stays with the tool that did it; only conclusions move.</li>
=======
            <li>You start every transfer yourself. Nothing syncs in the background.</li>
            <li>Nothing private travels: no private notes, no guest identities.</li>
            <li>Dietary categories travel as planning filters, never as allergy guarantees.</li>
            <li>A plan that stopped on a real conflict never travels as if it were approved.</li>
            <li>If the receiving tool has no use for something, it stays put — even when it is harmless.</li>
            <li>The working-out stays with the tool that did it. Only the conclusions move.</li>
>>>>>>> Stashed changes
          </ul>
          <Link
            to="/boundary"
            className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm text-brass transition-colors hover:text-bone"
          >
            Read the standing limits
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>


      <DeskFooter />
    </div>
  );
}
