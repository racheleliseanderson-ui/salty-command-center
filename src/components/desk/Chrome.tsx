import { Link } from "@tanstack/react-router";
import { CommandPalette } from "@/components/desk/CommandPalette";
import { DisplayControls } from "@/components/desk/DisplayControls";

/** The suite ribbon is the primary navigation. The Desk should not repeat it with a second tab set. */
const SUITE = [
  { href: "https://salty.saltnotes.blog/", label: "Decision Desk", short: "Desk", id: "desk" },
  { href: "https://kitchen.saltnotes.blog/", label: "Kitchen & Bar", short: "Kitchen", id: "kitchen" },
  { href: "https://occasion.saltnotes.blog/", label: "Occasion OS", short: "Occasion", id: "occasion" },
  {
    href: "https://deepdish.saltnotes.blog/",
    label: "Restaurant Intelligence",
    short: "Restaurant",
    id: "ri",
  },
] as const;

export function DeskHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-ink-deep/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1120px] min-w-0 items-center gap-3 px-5 py-2.5 sm:px-8">
        <Link to="/" className="group flex min-w-0 items-baseline gap-3">
          <span className="whitespace-nowrap font-display text-xl leading-none text-bone">
            Salty Desk
          </span>
          <span className="label-mono hidden truncate lg:inline">Decide · carry context · continue</span>
        </Link>

        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <CommandPalette />
          <DisplayControls />
        </div>
      </div>

      <SuiteRibbon current="desk" />
    </header>
  );
}

export function SuiteRibbon({ current }: { current: (typeof SUITE)[number]["id"] }) {
  return (
    <nav aria-label="Salty & Clever tools" className="border-t border-border/50 bg-ink/80">
      <div className="mx-auto flex max-w-[1120px] min-w-0 items-center gap-1 overflow-x-auto px-3 py-1.5 sm:px-8">
        <span className="label-mono mr-2 hidden shrink-0 text-brass sm:inline">Suite</span>
        {SUITE.map((item) => {
          const active = item.id === current;
          return (
            <a
              key={item.id}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "tap inline-flex min-h-11 shrink-0 items-center rounded-sm bg-brass/15 px-3 text-[0.74rem] tracking-wide text-brass"
                  : "tap inline-flex min-h-11 shrink-0 items-center rounded-sm px-3 text-[0.74rem] tracking-wide text-muted-foreground hover:text-bone"
              }
            >
              <span className="sm:hidden">{item.short}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export function DeskFooter() {
  return (
    <footer className="bg-ink-deep">
      <div aria-hidden className="h-px w-full bg-brass/70" />
      <div className="mx-auto grid max-w-[1120px] min-w-0 gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <p className="label-mono text-brass">Northern Lantern House Labs</p>
          <p className="mt-3 font-display text-2xl text-bone">Salty Desk</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Decision intake and continuity for the Salty & Clever host-and-dine suite. The Desk
            keeps the working question visible, recommends the next instrument, and leaves the
            specialized work to the specialized tool.
          </p>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            No allergen safety guarantees. No silent movement between tools. Hard stops stay hard.
          </p>
        </div>

        <div className="min-w-0">
          <p className="label-mono">In this site</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-brass">Desk</Link></li>
            <li><Link to="/host-path" className="hover:text-brass">Host Path</Link></li>
            <li><Link to="/handoffs" className="hover:text-brass">What can move between tools</Link></li>
            <li><Link to="/intelligence" className="hover:text-brass">Intelligence</Link></li>
            <li><Link to="/pipeline" className="hover:text-brass">Plan the night</Link></li>
            <li><Link to="/reference" className="hover:text-brass">Plain words</Link></li>
            <li><Link to="/boundary" className="hover:text-brass">Standing rules</Link></li>
            <li><Link to="/privacy" className="hover:text-brass">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-[1120px] border-t border-border/60 px-5 py-6 text-xs text-muted-foreground sm:px-8">
        © 2026 Salty & Clever
      </p>
    </footer>
  );
}
