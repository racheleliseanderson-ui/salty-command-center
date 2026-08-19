import { Link } from "@tanstack/react-router";
import { CommandPalette } from "@/components/desk/CommandPalette";
import { DisplayControls } from "@/components/desk/DisplayControls";

const NAV = [
  { to: "/", label: "Desk", exact: true },
  { to: "/handoffs", label: "Handoffs", exact: false },
  { to: "/boundary", label: "Standing rules", exact: false },
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
          <nav className="hidden items-center gap-1 lg:flex">
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
        className="flex gap-1 overflow-x-auto border-t border-border/60 px-3 pb-1.5 pt-1 lg:hidden"
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
    </header>
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
            Four independent tools. The desk points; the tools do the work.
          </p>
          <p className="label-mono mt-6">Education only · Vanity or Vice</p>
        </div>

        <div className="min-w-0">
          <p className="label-mono">Suite</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="https://kitchen.saltnotes.blog/" className="gold-underline hover:text-brass">
                Kitchen & Bar
              </a>
            </li>
            <li>
              <a
                href="https://occasion.saltnotes.blog/architecture"
                className="gold-underline hover:text-brass"
              >
                Menu Builder
              </a>
            </li>
            <li>
              <a href="https://occasion.saltnotes.blog/" className="gold-underline hover:text-brass">
                Occasion OS
              </a>
            </li>
            <li>
              <a href="https://deepdish.saltnotes.blog/" className="gold-underline hover:text-brass">
                Restaurant Intelligence
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
        </div>
      </div>
    </footer>
  );
}
