import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LEDGER, SUITE_COUNTERS, TOOLS } from "@/lib/desk-data";
import { CountUp } from "@/components/desk/CountUp";
import { Reveal } from "@/components/desk/Reveal";

export function SuiteCounters() {
  return (
    <dl className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
      {SUITE_COUNTERS.map((c, i) => (
        <Reveal key={c.label} delay={i * 70} className="bg-ink-deep px-5 py-7">
          <dt className="font-display text-4xl leading-none text-brass">
            <CountUp value={c.value} suffix={c.suffix ?? ""} />
          </dt>
          <dd className="mt-3">
            <span className="label-mono block text-bone">{c.label}</span>
            <span className="mt-1 block text-[0.76rem] leading-snug text-muted-foreground">
              {c.note}
            </span>
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}

export function StatusLedger() {
  return (
    <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
      {LEDGER.map((row, i) => {
        const tool = TOOLS.find((t) => t.id === row.id);
        return (
          <Reveal key={row.id} delay={i * 80} className="bg-ink-deep p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-live/60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-live" />
                </span>
                <span className="label-mono text-live">{row.state === "Live" ? "Available now" : row.state === "Beta" ? "In preview" : "Coming later"}</span>
              </span>
            </div>

            <p className="mt-4 font-display text-2xl leading-tight text-bone">{row.name}</p>

            <dl className="mt-5 space-y-2 border-l border-brass/30 pl-4 text-[0.8rem]">
              <Row k="Updated" v={row.updated} />
            </dl>

            <p className="mt-5 text-[0.8rem] leading-relaxed text-foreground/80">
              <span className="label-mono block">What it takes</span>
              {row.accepts}
            </p>
            <p className="mt-3 text-[0.8rem] leading-relaxed text-muted-foreground">
              <span className="label-mono block">What it will not do</span>
              {row.rejects}
            </p>

            {tool ? (
              <Link
                to="/tools/$slug"
                params={{ slug: tool.slug }}
                className="mt-6 inline-flex items-center gap-2 text-[0.8rem] text-brass transition-colors hover:text-bone"
              >
                Full record
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </Reveal>
        );
      })}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <dt className="label-mono">{k}</dt>
      <dd className="text-foreground/80">{v}</dd>
    </div>
  );
}
