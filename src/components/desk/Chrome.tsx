import { Link } from "@tanstack/react-router";
import { CommandPalette } from "@/components/desk/CommandPalette";
import { DisplayControls } from "@/components/desk/DisplayControls";

const NAV = [
  { to: "/", label: "Desk", exact: true },
  { to: "/host-path", label: "Host Path", exact: false },
  { to: "/handoffs", label: "Handoffs", exact: false },
  { to: "/intelligence", label: "Intelligence", exact: false },
  { to: "/privacy", label: "Privacy", exact: false },
  { to: "/boundary", label: "Standing rules", exact: false },
] as const;

/** Peer suite ribbon — three equal tools + this desk. Architecture is inside Occasion OS. */
const SUITE = [
  { href: "https://salty.saltnotes.blog/", label: "Desk", short: "Desk", id: "desk" },
  { href: "https://kitchen.saltnotes.blog/", label: "Kitchen & Bar", short: "Kitchen", id: "kitchen" },
  { href: "https://occasion.saltnotes.blog/", label: "Occasion OS", short: "Occasion", id: "occasion" },
  {
    href: "https://deepdish.saltnotes.blog/",
    label: "Restaurant Intelligence",
    short: "RI",
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
          <span className="label-mono hidden truncate 2xl:inline">Salty & Clever</span>
        </Link>

        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className="gold-underline rounded-sm px-2.5 py-1.5 text-[0.78rem] tracking-wide text-muted-foreground transition-colors hover:text-bone data-[status=active]:text-brass"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <CommandPalette />
          <DisplayControls />
        </div>
      </div>

      <nav
        aria-label="Sections"
        className="flex gap-1 overflow-x-auto border-t border-border/60 px-3 pb-1.5 pt-1 xl:hidden"
      >
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            className="press tap inline-flex shrink-0 items-center whitespace-nowrap rounded-sm border border-transparent px-3 text-[0.78rem] tracking-wide text-muted-foreground transition-colors data-[status=active]:border-brass/40 data-[status=active]:text-brass"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <SuiteRibbon current="desk" />
    </header>
  );
}

export function SuiteRibbon({ current }: { current: (typeof SUITE)[number]["id"] }) {
  return (
    <div className="border-t border-border/50 bg-ink/80">
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
                  ? "tap inline-flex shrink-0 items-center rounded-sm bg-brass/15 px-2.5 text-[0.72rem] tracking-wide text-brass"
                  : "tap inline-flex shrink-0 items-center rounded-sm px-2.5 text-[0.72rem] tracking-wide text-muted-foreground hover:text-bone"
              }
            >
              {item.short}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function DeskFooter() {
  return (
    <footer className="border-t border-border/70 bg-ink-deep">
      <div className="mx-auto grid max-w-[1120px] min-w-0 gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="min-w-0">
          <p className="font-display text-2xl text-bone">Salty Desk</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Orientation and routing for the Salty & Clever host-and-dine intelligence suite.
            Three independent tools at equal depth. Architecture lives inside Occasion OS. The
            desk points; the tools do the work.
          </p>
          <p className="label-mono mt-6">Education only · Vanity or Vice</p>
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
                Architecture (inside Occasion OS)
              </a>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <p className="label-mono">Constraints</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Explicit handoffs only</li>
            <li>First-party evidence</li>
            <li>No allergen safety guarantees</li>
            <li>Fail closed on hard stops</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link to="/privacy" className="text-brass hover:underline">
              Privacy
            </Link>
            <Link to="/intelligence" className="text-muted-foreground hover:text-brass">
              Intelligence
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
