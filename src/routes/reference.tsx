import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { Reveal } from "@/components/desk/Reveal";
import { DESK_LOG, GLOSSARY, LEDGER } from "@/lib/desk-data";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: "Reference — suite vocabulary & desk log | Salty Desk" },
      {
        name: "description",
        content:
          "Plain definitions for the Salty & Clever suite: anchor, hard stop, stress axis, confirm burden, thin field, contract version — plus the current build ledger and desk log.",
      },
      { property: "og:title", content: "Reference — suite vocabulary & desk log" },
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
  return (
    <div className="min-h-screen bg-ink">
      <DeskHeader />

      <section className="border-b border-border bg-ink-deep">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-24">
          <p className="label-mono text-brass">Reference</p>
          <h1 className="display-xl mt-6 max-w-[18ch] text-bone">
            The words, <span className="text-brass">defined once.</span>
          </h1>
          <p className="mt-7 max-w-[56ch] text-base leading-relaxed text-muted-foreground">
            The suite uses a small, precise vocabulary. If a term reads like jargon, it is doing
            specific work — this page says what.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
        <dl className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
          {GLOSSARY.map((g, i) => (
            <Reveal key={g.term} delay={(i % 2) * 80} className="bg-ink-deep p-6 sm:p-7">
              <dt className="font-display text-2xl leading-tight text-bone">{g.term}</dt>
              <dd className="mt-3 text-[0.87rem] leading-relaxed text-muted-foreground">{g.def}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className="border-t border-border bg-ink-deep">
        <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
          <p className="label-mono text-brass">Build ledger</p>
          <div className="rule-brass mt-3 w-24" />
          <h2 className="mt-5 font-display text-4xl leading-tight text-bone">
            What each tool accepts right now
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr>
                  {["Tool", "State", "Build", "Contract", "Updated"].map((h) => (
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
                      <span className="label-mono">{row.id}</span>
                    </td>
                    <td className="py-4 pr-6">
                      <span className="label-mono text-live">{row.state}</span>
                    </td>
                    <td className="py-4 pr-6 text-[0.84rem] text-foreground/80">{row.build}</td>
                    <td className="py-4 pr-6 text-[0.84rem] text-foreground/80">{row.contract}</td>
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
                  <span className="label-mono block">Accepts</span>
                  {row.accepts}
                </p>
                <p className="mt-4 text-[0.83rem] leading-relaxed text-muted-foreground">
                  <span className="label-mono block">Rejects</span>
                  {row.rejects}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
        <p className="label-mono text-brass">Desk log</p>
        <div className="rule-brass mt-3 w-24" />
        <h2 className="mt-5 font-display text-4xl leading-tight text-bone">Recent to the desk</h2>
        <ul className="mt-10 divide-y divide-border border-t border-border">
          {DESK_LOG.map((l) => (
            <li key={l.date + l.id} className="grid gap-2 py-5 sm:grid-cols-[9rem_7rem_1fr]">
              <span className="label-mono">{l.date}</span>
              <span className="label-mono text-brass">{l.id}</span>
              <span className="text-[0.88rem] leading-relaxed text-foreground/85">{l.entry}</span>
            </li>
          ))}
        </ul>

        <Link
          to="/boundary"
          className="mt-12 inline-flex items-center gap-2 text-sm text-brass transition-colors hover:text-bone"
        >
          Read the shared boundary
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <DeskFooter />
    </div>
  );
}
