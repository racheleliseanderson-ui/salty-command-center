import { createFileRoute, Link } from "@tanstack/react-router";
import { DeskFooter, DeskHeader } from "@/components/desk/Chrome";
import { BOUNDARIES, PHILOSOPHY } from "@/lib/desk-data";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy boundary — Salty Desk" },
      {
        name: "description",
        content:
          "Local-first, first-party, no forced account. What Salty Desk and the suite will not do with your data or your kitchen.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-dvh min-w-0 overflow-x-hidden bg-ink">
      <DeskHeader />
      <main className="mx-auto max-w-[1120px] min-w-0 px-5 py-16 sm:px-8 sm:py-20">
        <Link to="/" className="text-sm text-muted-foreground hover:text-brass">
          ← Back to desk
        </Link>
        <p className="label-mono mt-8 text-brass">Shared privacy boundary</p>
        <h1 className="mt-3 max-w-[20ch] font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
          Local-first. First-party. No forced account.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Core planning runs on device. Handoffs are packets you choose to send. Nothing is
          uploaded to use the desk, and nothing moves between tools until you move it.
        </p>

        <ul className="mt-12 space-y-4">
          {BOUNDARIES.map((b) => (
            <li key={b.id} className="panel rounded-lg p-5 sm:p-6">
              <p className="label-mono text-brass">
                {b.group} · {b.id}
              </p>
              <h2 className="mt-2 font-display text-xl text-bone">{b.limit}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.why}</p>
              <p className="mt-3 border-l border-brass/40 pl-3 text-sm leading-relaxed text-foreground/85">
                <span className="text-brass">Instead:</span> {b.instead}
              </p>
            </li>
          ))}
        </ul>

        <section className="mt-14">
          <p className="label-mono text-brass">Standing philosophy</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {PHILOSOPHY.map((item) => (
              <li key={item.k} className="panel rounded-lg p-5">
                <p className="label-mono text-brass">{item.k}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{item.v}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <Link to="/boundary" className="text-brass">
            Full standing rules →
          </Link>
          <Link to="/handoffs" className="text-muted-foreground hover:text-brass">
            Handoff map
          </Link>
        </div>
      </main>
      <DeskFooter />
    </div>
  );
}
