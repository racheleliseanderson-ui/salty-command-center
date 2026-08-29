import { Link } from "@tanstack/react-router";
import { CommandPalette } from "@/components/desk/CommandPalette";
import { DisplayControls } from "@/components/desk/DisplayControls";

<<<<<<< Updated upstream
/** The suite ribbon is the primary navigation. The Desk should not repeat it with a second tab set. */
=======
const NAV = [
  { to: "/", label: "Desk", exact: true },
  { to: "/host-path", label: "Host Path", exact: false },
  { to: "/handoffs", label: "What travels", exact: false },
  { to: "/intelligence", label: "Intelligence", exact: false },
  { to: "/privacy", label: "Privacy", exact: false },
  { to: "/boundary", label: "Standing rules", exact: false },
] as const;

/** Suite ribbon — three equal tools + this desk. Architecture is inside Occasion OS. */
>>>>>>> Stashed changes
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
                  ? "tap inline-flex shrink-0 items-center rounded-sm bg-brass/15 px-3 text-[0.74rem] tracking-wide text-brass"
                  : "tap inline-flex shrink-0 items-center rounded-sm px-3 text-[0.74rem] tracking-wide text-muted-foreground hover:text-bone"
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
    <footer className="border-t border-border/70 bg-ink-deep">
      <div className="mx-auto grid max-w-[1120px] min-w-0 gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="min-w-0">
          <p className="font-display text-2xl text-bone">Salty Desk</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
<<<<<<< Updated upstream
            Decision intake and continuity for the Salty & Clever host-and-dine suite. The Desk
            keeps the working question visible, recommends the next instrument, and leaves the
            specialized work to the specialized tool.
=======
            Where you decide how the night goes, across the Salty &amp; Clever host-and-dine suite.
            Three independent tools, all built to the same depth. Architecture lives inside Occasion
            OS. The desk points; the tools do the work.
>>>>>>> Stashed changes
          </p>
          <p className="label-mono mt-6">Salty & Clever · host-and-dine decision support</p>
        </div>

        <div className="min-w-0">
          <p className="label-mono">Suite</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {SUITE.filter((s) => s.id !== "desk").map((s) => (
              <li key={s.id}>
                <a href={s.href} className="gold-underline hover:text-brass">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://occasion.saltnotes.blog/architecture"
                className="gold-underline hover:text-brass"
              >
                Menu architecture
              </a>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <p className="label-mono">Desk notes</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
<<<<<<< Updated upstream
            <li>
              <Link to="/handoffs" className="hover:text-brass">
                What can move between tools
              </Link>
            </li>
            <li>
              <Link to="/boundary" className="hover:text-brass">
                Standing rules
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-brass">
                Privacy
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            No allergen safety guarantees. No silent movement between tools. Hard stops stay hard.
          </p>
=======
            <li>Nothing moves between tools unless you send it</li>
            <li>First-hand evidence only</li>
            <li>No allergen safety guarantees</li>
            <li>Real conflicts stop the plan</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link to="/privacy" className="text-brass hover:underline">
              Privacy
            </Link>
            <Link to="/intelligence" className="text-muted-foreground hover:text-brass">
              How the tools compare
            </Link>
          </div>
>>>>>>> Stashed changes
        </div>
      </div>
    </footer>
  );
}
