import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { ToolCard } from "@/components/desk/ToolCard";
import { HandoffMap } from "@/components/desk/HandoffMap";
import { BOUNDARIES, PHILOSOPHY, RESTAURANT_INTELLIGENCE, TOOLS } from "@/lib/desk-data";
import heroPass from "@/assets/hero-pass.jpg";
import diningRoom from "@/assets/dining-room.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salty Desk — Host & dine intelligence command center" },
      {
        name: "description",
        content:
          "The front door to Salty & Clever: Menu Builder, Occasion Operating System, and Restaurant Intelligence. Pick the right tool, see every handoff, commit the kitchen on purpose.",
      },
      { property: "og:title", content: "Salty Desk — Host & dine intelligence command center" },
      {
        property: "og:description",
        content:
          "Three independent tools, one orientation surface. Explicit handoffs only. Vanity is allowed; the oven still has to finish on time.",
      },
    ],
  }),
  component: Desk,
});

function Desk() {
  const hostTools = TOOLS.filter((t) => t.track === "host");
  const dineTools = TOOLS.filter((t) => t.track === "dine");

  return (
    <div className="min-h-screen bg-ink">
      <DeskHeader />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroPass}
          alt="Hands finishing a plate on a dark kitchen pass under brass service light"
          width={1600}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
        />
        <div className="ink-veil absolute inset-0" />
        <div className="hairline-grid absolute inset-0 opacity-40" />

        <div className="relative mx-auto max-w-[1240px] px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-36">
          <p className="label-mono rise text-brass">Salty &amp; Clever · Host &amp; dine suite</p>

          <h1 className="rise display-xl mt-6 max-w-[18ch] text-bone">
            Commit the kitchen
            <span className="block text-brass">on purpose.</span>
          </h1>

          <p className="rise mt-8 max-w-[52ch] text-lg leading-relaxed text-foreground/85">
            Salty Desk is the orientation surface for three independent tools. It tells you which
            one answers the question you actually have — then routes you there with the handoff
            stated out loud.
          </p>

          <div className="rise mt-10 flex flex-wrap gap-3">
            <Link
              to="/host-path"
              className="inline-flex items-center gap-2 bg-brass px-5 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-bone"
            >
              I'm hosting at home
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={RESTAURANT_INTELLIGENCE.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-bone/30 px-5 py-3 text-sm font-medium tracking-wide text-bone transition-colors hover:border-brass hover:text-brass"
            >
              I'm dining out
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              to="/handoffs"
              className="inline-flex items-center gap-2 px-2 py-3 text-sm tracking-wide text-muted-foreground transition-colors hover:text-brass"
            >
              What moves between tools?
            </Link>
          </div>

          <p className="mt-14 max-w-[46ch] border-l border-brass/50 pl-5 font-display text-2xl leading-snug text-bone/90">
            Vanity is allowed. The oven still has to finish on time.
          </p>
        </div>
      </section>

      {/* ── Live status strip ─────────────────────────────────── */}
      <section className="border-y border-border bg-ink-deep">
        <div className="mx-auto grid max-w-[1240px] gap-px bg-border px-0 sm:grid-cols-3">
          {TOOLS.map((t) => (
            <div key={t.id} className="bg-ink-deep px-5 py-6 sm:px-8">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-live" />
                <span className="label-mono text-live">Live</span>
                <span className="label-mono">· {t.id}</span>
              </div>
              <p className="mt-3 font-display text-xl text-bone">{t.name}</p>
              <p className="mt-1 text-[0.8rem] text-muted-foreground">{t.statusNote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Choose your surface ──────────────────────────────── */}
      <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
        <SectionHead
          kicker="Triage"
          title="Three tools. One question each."
          lede="If two tools seem to overlap, you're holding the wrong question. Read the decision line, not the feature list."
        />

        <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {TOOLS.map((t) => (
            <div key={t.id} className="bg-surface p-7">
              <p className="label-mono text-brass">{t.id}</p>
              <h3 className="mt-3 font-display text-2xl leading-tight text-bone">{t.name}</h3>
              <p className="mt-4 font-display text-lg leading-snug text-brass/90">{t.decision}</p>
              <div className="mt-6 space-y-3 text-[0.83rem] leading-relaxed">
                <p className="text-foreground/80">
                  <span className="label-mono block">Use when</span>
                  {t.useWhen}
                </p>
                <p className="text-muted-foreground">
                  <span className="label-mono block">Wrong tool for</span>
                  {t.notFor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Host suite ───────────────────────────────────────── */}
      <section className="relative border-t border-border bg-ink-deep">
        <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
          <SectionHead
            kicker="Host decision suite"
            title="Before you commit the kitchen"
            lede="Two decisions, in order: whether the menu can be finished, then whether the night can be run. Skipping the first makes the second a guess."
          />

          <div className="mt-8 panel-brass rounded-lg p-6 sm:p-8">
            <p className="label-mono text-brass">The commit moment</p>
            <div className="mt-4 grid gap-6 md:grid-cols-3">
              <Commit n="01" q="Can the menu be finished?" a="Menu Builder returns stress scores and hard stops. A hard stop is a refusal, not a warning." />
              <Commit n="02" q="Can the night be run?" a="Occasion OS sequences shop → prep → serve against your real attention and capacity." />
              <Commit n="03" q="Should you host at all?" a="If either answer is no, dining out is the correct outcome — not a failure." />
            </div>
          </div>

          <div className="mt-10 space-y-10">
            {hostTools.map((t, i) => (
              <ToolCard key={t.id} tool={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Dine suite ───────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-t border-border">
        <img
          src={diningRoom}
          alt="Empty candlelit restaurant banquette in a dark green dining room"
          width={1408}
          height={1008}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="ink-veil absolute inset-0" />
        <div className="relative mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
          <SectionHead
            kicker="Dine decision suite"
            title="Before you book the room"
            lede="Rank rooms by occasion fit and operating reality. Unknowns, conflicts, and confirm burden stay in the open."
          />
          <div className="mt-10">
            {dineTools.map((t) => (
              <ToolCard key={t.id} tool={t} index={2} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Host path ────────────────────────────────────────── */}
      <section className="border-t border-border bg-ink-deep">
        <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
          <SectionHead
            kicker="Recommended sequence"
            title="The Host Path"
            lede="Menu Builder → Occasion Operating System. Restaurant Intelligence is the dine-out alternative, not step three."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <PathStep
              n="1"
              id="SC-MB-001"
              title="Architect the menu"
              body="Declare occasion, guests, service style, host attention, and equipment. Lock an anchor if the table needs one. Simplify what will break."
              tone="primary"
            />
            <PathStep
              n="2"
              id="SC-OOS-001"
              title="Run the night"
              body="Carry the Menu Builder packet forward and build the shop → prep → serve route you can actually hold."
              tone="primary"
            />
            <PathStep
              n="Alt"
              id="SC-RI-001"
              title="Or dine out instead"
              body="When hosting doesn't survive the stress test, rank rooms by situation and confirm the hard details live."
              tone="alt"
            />
          </div>

          <Link
            to="/host-path"
            className="mt-10 inline-flex items-center gap-2 border border-brass/50 px-5 py-3 text-sm tracking-wide text-brass transition-colors hover:bg-brass hover:text-primary-foreground"
          >
            Open the full Host Path
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Handoffs ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
        <SectionHead
          kicker="Explicit handoffs only"
          title="What moves — and what stays"
          lede="Tools stay independent. When you choose, a public-safe packet moves downstream. Nothing is uploaded and nothing is inferred across apps without your action."
        />
        <div className="mt-12">
          <HandoffMap />
        </div>
      </section>

      {/* ── Philosophy + boundary ────────────────────────────── */}
      <section className="border-t border-border bg-ink-deep">
        <div className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHead kicker="Standing rules" title="How the desk behaves" />
            <dl className="mt-8 divide-y divide-border">
              {PHILOSOPHY.map((p) => (
                <div key={p.k} className="py-4">
                  <dt className="font-display text-xl text-bone">{p.k}</dt>
                  <dd className="mt-1 text-[0.86rem] leading-relaxed text-muted-foreground">
                    {p.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="panel rounded-lg p-7 sm:p-9">
            <p className="label-mono text-brass">Shared boundary</p>
            <h3 className="mt-3 font-display text-3xl text-bone">Local-first, first-party, no forced account</h3>
            <ul className="mt-7 space-y-4">
              {BOUNDARIES.map((b) => (
                <li key={b} className="flex gap-3 text-[0.86rem] leading-relaxed text-foreground/85">
                  <span className="mt-2.5 h-px w-4 shrink-0 bg-destructive" />
                  {b}
                </li>
              ))}
            </ul>
            <Link
              to="/boundary"
              className="mt-8 inline-flex items-center gap-2 text-sm text-brass transition-colors hover:text-bone"
            >
              Read the boundary in full
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <DeskFooter />
    </div>
  );
}

function SectionHead({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="max-w-[62ch]">
      <p className="label-mono text-brass">{kicker}</p>
      <div className="rule-brass mt-3 w-24" />
      <h2 className="mt-5 font-display text-4xl leading-[1.05] text-bone sm:text-5xl">{title}</h2>
      {lede ? (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{lede}</p>
      ) : null}
    </div>
  );
}

function Commit({ n, q, a }: { n: string; q: string; a: string }) {
  return (
    <div>
      <p className="label-mono text-brass">{n}</p>
      <p className="mt-2 font-display text-2xl leading-snug text-bone">{q}</p>
      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted-foreground">{a}</p>
    </div>
  );
}

function PathStep({
  n,
  id,
  title,
  body,
  tone,
}: {
  n: string;
  id: string;
  title: string;
  body: string;
  tone: "primary" | "alt";
}) {
  return (
    <div
      className={
        tone === "primary"
          ? "panel relative rounded-lg p-7"
          : "relative rounded-lg border border-dashed border-border bg-ink/60 p-7"
      }
    >
      <div className="flex items-baseline justify-between">
        <span
          className={
            tone === "primary"
              ? "font-display text-5xl leading-none text-brass"
              : "font-display text-3xl leading-none text-muted-foreground"
          }
        >
          {n}
        </span>
        <span className="label-mono">{id}</span>
      </div>
      <h3 className="mt-5 font-display text-2xl text-bone">{title}</h3>
      <p className="mt-3 text-[0.86rem] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
