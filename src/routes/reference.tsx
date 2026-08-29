import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { Reveal } from "@/components/desk/Reveal";
import { SearchField } from "@/components/desk/SearchField";
import { DESK_LOG, GLOSSARY, LEDGER, TOOLS } from "@/lib/desk-data";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Plain words — Salty Desk" },
      {
        name: "description",
        content:
<<<<<<< Updated upstream
          "Plain definitions for the Salty & Clever suite: locked dish, we'll stop rather than guess, stress axis, confirm burden, thin field — plus the current desk log.",
=======
          "Plain definitions for the Salty & Clever suite: anchor, blocking constraint, stress axis, confirm burden, thin field — plus what each tool does right now, and what changed recently.",
>>>>>>> Stashed changes
      },
      { property: "og:title", content: "Plain words — Salty Desk" },
      {
        property: "og:description",
        content:
          "The words the host-and-dine suite uses, defined once, plus what changed and when.",
      },
    ],
  }),
  component: ReferencePage,
});

function ReferencePage() {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();

  const terms = useMemo(
    () =>
      needle
        ? GLOSSARY.filter((g) => `${g.term} ${g.def}`.toLowerCase().includes(needle))
        : GLOSSARY,
    [needle],
  );
  const log = useMemo(
    () =>
      needle
        ? DESK_LOG.filter((l) => `${l.id} ${l.date} ${l.entry}`.toLowerCase().includes(needle))
        : DESK_LOG,
    [needle],
  );

  return (
    <div className="min-h-dvh bg-ink">
      <DeskHeader />

      <section className="border-b border-border bg-ink-deep">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-24">
          <p className="label-mono text-brass">Plain words</p>
          <h1 className="display-xl mt-6 max-w-[18ch] text-bone">
            The words, <span className="text-brass">defined once.</span>
          </h1>
          <p className="mt-7 max-w-[56ch] text-base leading-relaxed text-muted-foreground">
            The suite uses a small, precise vocabulary. If a term reads like jargon, it is doing
            specific work — this page says what.
          </p>

          <div className="mt-9 max-w-[720px]">
            <SearchField
              value={q}
              onChange={setQ}
              label="Filter terms and recent changes"
              placeholder="Filter terms and recent changes…"
              count={terms.length + log.length}
              countLabel="entries shown"
            />
            <p className="label-mono mt-3">
              Press ⌘K to search the whole desk — tools, transfers and limits.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
        {terms.length === 0 ? (
          <p className="label-mono border border-dashed border-border p-6 leading-relaxed">
            No term matches “{q}”. Clear the filter, or search the whole desk with ⌘K.
          </p>
        ) : (
          <dl className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            {terms.map((g, i) => (
              <Reveal key={g.term} delay={(i % 2) * 80} className="bg-ink-deep p-6 sm:p-7">
                <dt className="font-display text-2xl leading-tight text-bone">{g.term}</dt>
                <dd className="mt-3 text-[0.87rem] leading-relaxed text-muted-foreground">
                  {g.def}
                </dd>
              </Reveal>
            ))}
          </dl>
        )}
      </section>

      <section className="border-t border-border bg-ink-deep">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
<<<<<<< Updated upstream
          <p className="label-mono text-brass">What each tool takes right now</p>
          <div className="rule-brass mt-3 w-24" />
          <h2 className="mt-5 font-display text-4xl leading-tight text-bone">
            What each tool takes right now
=======
          <p className="label-mono text-brass">Where each tool stands</p>
          <div className="rule-brass mt-3 w-24" />
          <h2 className="mt-5 font-display text-4xl leading-tight text-bone">
            What each tool takes in, and what it hands on
>>>>>>> Stashed changes
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr>
<<<<<<< Updated upstream
                  {["Tool", "State", "Updated"].map((h) => (
=======
                  {["Tool", "Status", "What it does", "What it hands on", "Last updated"].map((h) => (
>>>>>>> Stashed changes
                    <th key={h} className="label-mono border-b border-border pb-3 pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEDGER.map((row) => (
                  <tr key={row.id} className="border-b border-border/70">
                    <td className="py-4 pr-6">
                      <span className="block font-display text-xl text-bone">{row.name}</span>
                    </td>
                    <td className="py-4 pr-6">
                      <span className="label-mono text-live">{row.state === "Live" ? "Available now" : row.state}</span>
                    </td>
                    <td className="label-mono py-4 pr-6">{row.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
            {LEDGER.map((row) => (
              <div key={row.id} className="bg-ink-deep p-6">
                <p className="label-mono text-brass">{row.name}</p>
                <p className="mt-4 text-[0.83rem] leading-relaxed text-foreground/85">
<<<<<<< Updated upstream
                  <span className="label-mono block">What it takes</span>
                  {row.accepts}
                </p>
                <p className="mt-4 text-[0.83rem] leading-relaxed text-muted-foreground">
                  <span className="label-mono block">What it will not do</span>
=======
                  <span className="label-mono block">Takes in</span>
                  {row.accepts}
                </p>
                <p className="mt-4 text-[0.83rem] leading-relaxed text-muted-foreground">
                  <span className="label-mono block">Will not do</span>
>>>>>>> Stashed changes
                  {row.rejects}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
        <p className="label-mono text-brass">Recent changes</p>
        <div className="rule-brass mt-3 w-24" />
        <h2 className="mt-5 font-display text-4xl leading-tight text-bone">What changed lately</h2>
        <ul className="mt-10 divide-y divide-border border-t border-border">
          {log.map((l) => (
            <li key={l.date + l.id} className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr]">
              <span className="label-mono">{l.date}</span>
<<<<<<< Updated upstream
=======
              <span className="label-mono text-brass">{TOOLS.find((t) => t.id === l.id)?.name ?? "The desk"}</span>
>>>>>>> Stashed changes
              <span className="text-[0.88rem] leading-relaxed text-foreground/85">{l.entry}</span>
            </li>
          ))}
        </ul>

        <Link
          to="/boundary"
          className="mt-12 inline-flex items-center gap-2 text-sm text-brass transition-colors hover:text-bone"
        >
          Read the standing limits
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <DeskFooter />
    </div>
  );
}
