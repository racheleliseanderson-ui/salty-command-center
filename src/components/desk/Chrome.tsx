import { Link } from "@tanstack/react-router";
import { ColorSafeToggle, ThemeToggle } from "@/components/desk/ThemeToggle";

const NAV = [
  { to: "/", label: "Desk" },
  { to: "/host-path", label: "Host Path" },
  { to: "/handoffs", label: "Handoffs" },
  { to: "/reference", label: "Reference" },
  { to: "/boundary", label: "Boundary" },
] as const;

export function DeskHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-ink-deep/90 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-2.5 sm:px-8">
        <Link to="/" className="group flex min-w-0 items-baseline gap-3">
          <span className="truncate font-display text-xl leading-none text-bone">Salty Desk</span>
          <span className="label-mono hidden sm:inline">Salty &amp; Clever</span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-0.5 md:flex md:gap-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-sm px-2.5 py-1.5 text-[0.78rem] tracking-wide text-muted-foreground transition-colors hover:text-bone data-[status=active]:text-brass"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ColorSafeToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile: the nav becomes its own scrollable rail with real tap targets. */}
      <nav
        aria-label="Desk sections"
        className="flex gap-1 overflow-x-auto border-t border-border/60 px-3 pb-1.5 pt-1 md:hidden"
      >
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-sm border border-transparent px-3 text-[0.78rem] tracking-wide text-muted-foreground transition-colors data-[status=active]:border-brass/40 data-[status=active]:text-brass"
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
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl text-bone">Salty Desk</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Orientation and routing for the Salty &amp; Clever host-and-dine intelligence suite. The
            desk points; the tools do the work.
          </p>
          <p className="label-mono mt-6">Education only · Vanity or Vice</p>
        </div>

        <div>
          <p className="label-mono">Suite</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/host-path" className="transition-colors hover:text-brass">
                Host Path
              </Link>
            </li>
            <li>
              <Link to="/handoffs" className="transition-colors hover:text-brass">
                Handoff map
              </Link>
            </li>
            <li>
              <Link to="/reference" className="transition-colors hover:text-brass">
                Reference &amp; desk log
              </Link>
            </li>
            <li>
              <Link to="/boundary" className="transition-colors hover:text-brass">
                Privacy boundary
              </Link>
            </li>
          </ul>
        </div>


        <div>
          <p className="label-mono">Standing constraints</p>
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
