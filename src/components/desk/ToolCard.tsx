import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/desk-data";

export function StatusPip({ status, note }: { status: Tool["status"]; note?: string }) {
  const label = status === "live" ? "Live" : status === "beta" ? "Beta" : "Planned";
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-live/60" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-live" />
      </span>
      <span className="label-mono text-live">{label}</span>
      {note ? <span className="label-mono">· {note}</span> : null}
    </span>
  );
}

export function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <article className="panel grain rise lift group relative overflow-hidden rounded-lg">
      <div className="absolute inset-x-0 top-0 rule-brass opacity-60" />

      <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StatusPip status={tool.status} note={tool.statusNote} />
            <span className="label-mono">
              {String(index + 1).padStart(2, "0")} · {tool.id}
            </span>
          </div>

          <h3 className="mt-5 font-display text-3xl leading-[1.05] text-bone sm:text-[2.6rem]">
            {tool.name}
          </h3>
          <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-brass">
            {tool.short}
          </p>

          <div className="mt-6 space-y-4 border-l border-brass/30 pl-4">
            <Field label="Decision it serves" value={tool.decision} strong />
            <Field label="Use it when" value={tool.useWhen} />
            <Field label="Not this tool" value={tool.notFor} />
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{tool.summary}</p>

          <a
            href={tool.href}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 border border-brass/50 bg-brass/10 px-4 py-2.5 text-[0.8rem] font-medium tracking-wide text-brass transition-colors hover:bg-brass hover:text-primary-foreground"
          >
            Launch {tool.name}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="space-y-6">
          <dl className="grid grid-cols-4 gap-px overflow-hidden border border-border bg-border">
            {tool.metrics.map((m) => (
              <div key={m.label} className="bg-ink-deep px-2 py-3 text-center">
                <dt className="font-display text-xl text-brass">{m.value}</dt>
                <dd className="label-mono mt-1 text-[0.55rem] tracking-[0.12em]">{m.label}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="label-mono">Does</p>
            <ul className="mt-3 space-y-2">
              {tool.capabilities.map((c) => (
                <li key={c} className="flex gap-3 text-[0.83rem] leading-relaxed text-foreground/85">
                  <span className="mt-2 h-px w-3 shrink-0 bg-brass/70" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-destructive/35 bg-destructive/10 p-4">
            <p className="label-mono text-destructive-foreground/80">Refuses</p>
            <ul className="mt-2 space-y-1.5 text-[0.8rem] leading-relaxed text-foreground/75">
              {tool.refusals.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          {(tool.handoffIn || tool.handoffOut) && (
            <div className="space-y-2">
              {tool.handoffIn ? <HandoffLine dir="in" text={tool.handoffIn} /> : null}
              {tool.handoffOut ? <HandoffLine dir="out" text={tool.handoffOut} /> : null}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Field({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <p className="label-mono">{label}</p>
      <p
        className={
          strong
            ? "mt-1 font-display text-xl leading-snug text-bone"
            : "mt-1 text-[0.86rem] leading-relaxed text-foreground/80"
        }
      >
        {value}
      </p>
    </div>
  );
}

function HandoffLine({ dir, text }: { dir: "in" | "out"; text: string }) {
  return (
    <p className="flex items-start gap-2 text-[0.78rem] leading-relaxed text-muted-foreground">
      <span className="label-mono shrink-0 text-brass/80">{dir === "in" ? "In ←" : "Out →"}</span>
      {text}
    </p>
  );
}
