import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Lock, TriangleAlert } from "lucide-react";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { Reveal } from "@/components/desk/Reveal";
import { StatusPip } from "@/components/desk/ToolCard";
import { TOOLS, TOOL_DETAILS, type Tool } from "@/lib/desk-data";
import prepMise from "@/assets/prep-mise.jpg";
import heroGarnish from "@/assets/hero-garnish.jpg";
import heroCourses from "@/assets/hero-courses.jpg";
import heroTablescape from "@/assets/hero-tablescape.jpg";
import heroDining from "@/assets/hero-dining.jpg";

const TOOL_FACE: Record<Tool["slug"], { src: string; alt: string }> = {
  "kitchen-bar": {
    src: heroGarnish,
    alt: "Cocktail garnish station with citrus, herbs, and spices",
  },
  "menu-builder": {
    src: heroCourses,
    alt: "Assortment of pasta courses on a dark table",
  },
  "occasion-os": {
    src: heroTablescape,
    alt: "Black plates, gold cutlery, and white roses on a set table",
  },
  "restaurant-intelligence": {
    src: heroDining,
    alt: "Industrial dining room under hanging lights",
  },
};

function findTool(slug: string): Tool {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) throw notFound();
  return tool;
}

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = findTool(params.slug);
    return { name: tool.name, decision: tool.decision, summary: tool.summary };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Tool not found — Salty Desk" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — ${loaderData.decision} | Salty Desk`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.summary.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.summary.slice(0, 155) },
      ],
    };
  },
  notFoundComponent: ToolNotFound,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <p role="alert" className="text-sm text-muted-foreground">
        {error.message}
      </p>
    </div>
  ),
  component: ToolPage,
});

function ToolNotFound() {
  return (
    <div className="min-h-dvh bg-ink">
      <DeskHeader />
      <div className="mx-auto max-w-[1240px] px-5 py-32 sm:px-8">
        <p className="label-mono text-brass">Unknown record</p>
        <h1 className="display-xl mt-5 max-w-[16ch] text-bone">No such tool at this desk.</h1>
        <Link to="/" className="mt-10 inline-flex items-center gap-2 text-sm text-brass">
          Back to the desk <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <DeskFooter />
    </div>
  );
}

function ToolPage() {
  const { slug } = Route.useParams();
  const tool = findTool(slug);
  const detail = TOOL_DETAILS[tool.slug];
  const face = TOOL_FACE[tool.slug] ?? { src: prepMise, alt: "" };

  return (
    <div className="min-h-dvh bg-ink">
      <DeskHeader />

      <section className="relative isolate overflow-hidden border-b border-border">
        <img
          src={face.src}
          alt={face.alt}
          className="media-tone absolute inset-0 h-full w-full object-cover"
        />
        <div className="ink-veil absolute inset-0" />
        <div className="hairline-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-[1240px] px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <StatusPip status={tool.status} note={tool.statusNote} />
          </div>
          <h1 className="rise mt-6 font-display text-5xl leading-[1.02] text-bone sm:text-6xl">
            {tool.name}
          </h1>
          <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-brass">
            {tool.short}
          </p>
          <p className="mt-8 max-w-[46ch] border-l border-brass/50 pl-5 font-display text-2xl leading-snug text-bone/90">
            {tool.decision}
          </p>
          <p className="mt-7 max-w-[58ch] text-base leading-relaxed text-foreground/85">
            {tool.summary}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={tool.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-brass px-5 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-brass-deep"
            >
              Launch {tool.name}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              to="/handoffs"
              className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm tracking-wide text-muted-foreground transition-colors hover:border-brass/50 hover:text-brass"
            >
              See what travels
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <Panel title="Inputs it demands" items={detail.inputs} />
          </Reveal>
          <Reveal delay={90}>
            <Panel title="What it returns" items={detail.returns} tone="brass" />
          </Reveal>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="border border-destructive/40 bg-destructive/10 p-6 sm:p-7">
              <p className="label-mono flex items-center gap-2 text-destructive-foreground/85">
                <TriangleAlert className="h-3.5 w-3.5" /> We'll stop rather than guess
              </p>
              <ul className="mt-4 space-y-3 text-[0.86rem] leading-relaxed text-foreground/85">
                {detail.hardStops.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-destructive" />
                    {h}
                  </li>
                ))}
              </ul>
              <p className="label-mono mt-5">A hard stop is a refusal, not a warning.</p>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="panel rounded-lg p-6 sm:p-7">
              <p className="label-mono flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" /> Refuses outright
              </p>
              <ul className="mt-4 space-y-2 text-[0.86rem] leading-relaxed text-muted-foreground">
                {tool.refusals.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>

              <p className="label-mono mt-7 text-brass">Handoff contract</p>
              <ul className="mt-3 space-y-2 text-[0.84rem] leading-relaxed text-foreground/80">
                {tool.handoffIn ? <li>In ← {tool.handoffIn}</li> : null}
                {tool.handoffOut ? <li>Out → {tool.handoffOut}</li> : null}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <p className="label-mono text-brass">Not this tool</p>
          <div className="rule-brass mt-3 w-24" />
          <div className="mt-6 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            {detail.wrongTool.map((w) => (
              <div key={w.name} className="bg-ink-deep p-6">
                <p className="font-display text-2xl leading-tight text-bone">{w.name}</p>
                <p className="mt-2 text-[0.86rem] leading-relaxed text-muted-foreground">
                  {w.reason}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 flex flex-wrap gap-6">
          {TOOLS.filter((t) => t.slug !== tool.slug).map((t) => (
            <Link
              key={t.id}
              to="/tools/$slug"
              params={{ slug: t.slug }}
              className="inline-flex items-center gap-2 text-sm text-brass transition-colors hover:text-bone"
            >
              {t.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
          <Link
            to="/reference"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brass"
          >
            Suite vocabulary
          </Link>
        </div>
      </section>

      <DeskFooter />
    </div>
  );
}

function Panel({
  title,
  items,
  tone = "plain",
}: {
  title: string;
  items: string[];
  tone?: "plain" | "brass";
}) {
  return (
    <div className={tone === "brass" ? "panel-brass rounded-lg p-6 sm:p-7" : "panel rounded-lg p-6 sm:p-7"}>
      <p className="label-mono text-brass">{title}</p>
      <ul className="mt-4 space-y-3 text-[0.88rem] leading-relaxed text-foreground/85">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2.5 h-px w-4 shrink-0 bg-brass/70" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
