import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Tool } from "@/lib/desk-data";
import heroGarnish from "@/assets/hero-garnish.jpg";
import heroCourses from "@/assets/hero-courses.jpg";
import heroTablescape from "@/assets/hero-tablescape.jpg";
import heroDining from "@/assets/hero-dining.jpg";

const FACE: Record<Tool["slug"], { src: string; alt: string }> = {
  "kitchen-bar": {
    src: heroGarnish,
    alt: "Cocktail garnish station with citrus, herbs, and spices ready for the pour",
  },
  "menu-builder": {
    src: heroCourses,
    alt: "Assortment of pasta courses on a dark table — a menu the kitchen can finish",
  },
  "occasion-os": {
    src: heroTablescape,
    alt: "Black plates, gold cutlery, and white roses on a formally set table",
  },
  "restaurant-intelligence": {
    src: heroDining,
    alt: "Industrial dining room under hanging lights, empty tables waiting for service",
  },
};

export function StatusPip({ status, note }: { status: Tool["status"]; note?: string }) {
  const label = status === "live" ? "Available now" : status === "beta" ? "In preview" : "Coming later";
  return (
    <span className="inline-flex min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-live/60" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-live" />
      </span>
      <span className="label-mono text-live">{label}</span>
      {note ? <span className="label-mono min-w-0 break-words">· {note}</span> : null}
    </span>
  );
}

export function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const face = FACE[tool.slug];
  return (
    <article className="panel grain lift group relative flex h-full min-w-0 flex-col overflow-hidden rounded-lg">
      <div className="absolute inset-x-0 top-0 z-10 rule-brass opacity-60" />
      <div className="relative h-40 overflow-hidden sm:h-48">
        <img
          src={face.src}
          alt={face.alt}
          className="media-tone h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 sm:p-8">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <StatusPip status={tool.status} note={tool.statusNote} />
          <span className="label-mono shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="font-display text-3xl leading-[1.05] text-bone">{tool.name}</h3>
          <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-brass">
            {tool.short}
          </p>
        </div>

        <div className="min-w-0 space-y-4 border-l border-brass/30 pl-4">
          <Field label="Decision it serves" value={tool.decision} strong />
          <Field label="Use it when" value={tool.useWhen} />
          <Field label="Not this tool" value={tool.notFor} />
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground break-words">{tool.summary}</p>

        <dl className="grid min-w-0 grid-cols-2 gap-px overflow-hidden border border-border bg-border">
          {tool.metrics.map((m) => (
            <div key={m.label} className="min-w-0 bg-ink-deep px-3 py-3 text-center">
              <dt className="font-display text-xl text-brass break-words">{m.value}</dt>
              <dd className="label-mono mt-1 break-words tracking-[0.12em]">{m.label}</dd>
            </div>
          ))}
        </dl>

        <div className="min-w-0">
          <p className="label-mono">Does</p>
          <ul className="mt-3 space-y-2">
            {tool.capabilities.map((c) => (
              <li key={c} className="flex gap-3 text-[0.83rem] leading-relaxed text-foreground/85">
                <span className="mt-2 h-px w-3 shrink-0 bg-brass/70" />
                <span className="min-w-0 break-words">{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 overflow-hidden border border-destructive/35 bg-destructive/10 p-4">
          <p className="label-mono text-destructive-foreground/80">Does not</p>
          <ul className="mt-2 space-y-1.5 text-[0.8rem] leading-relaxed text-foreground/75">
            {tool.refusals.map((r) => (
              <li key={r} className="break-words">
                {r}
              </li>
            ))}
          </ul>
        </div>

        {(tool.handoffIn || tool.handoffOut) && (
          <div className="min-w-0 space-y-2">
            {tool.handoffIn ? <HandoffLine dir="in" text={tool.handoffIn} /> : null}
            {tool.handoffOut ? <HandoffLine dir="out" text={tool.handoffOut} /> : null}
          </div>
        )}

        <div className="mt-auto flex min-w-0 flex-wrap gap-2">
          <a
            href={tool.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 border border-brass/50 bg-brass/10 px-4 text-[0.8rem] font-medium tracking-wide text-brass transition-colors hover:bg-brass hover:text-primary-foreground"
          >
            <span className="truncate">Launch {tool.name}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </a>
          <Link
            to="/tools/$slug"
            params={{ slug: tool.slug }}
            className="inline-flex min-h-11 items-center justify-center px-4 text-[0.8rem] text-muted-foreground hover:text-brass"
          >
            Full record
          </Link>
        </div>
      </div>
    </article>
  );
}

function Field({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="label-mono">{label}</p>
      <p
        className={
          strong
            ? "mt-1 font-display text-xl leading-snug text-bone break-words"
            : "mt-1 text-[0.86rem] leading-relaxed text-foreground/80 break-words"
        }
      >
        {value}
      </p>
    </div>
  );
}

function HandoffLine({ dir, text }: { dir: "in" | "out"; text: string }) {
  return (
    <p className="flex min-w-0 items-start gap-2 text-[0.78rem] leading-relaxed text-muted-foreground">
      <span className="label-mono shrink-0 text-brass/80">{dir === "in" ? "In ←" : "Out →"}</span>
      <span className="min-w-0 break-words">{text}</span>
    </p>
  );
}
