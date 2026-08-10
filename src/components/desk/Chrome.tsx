import { Link } from "@tanstack/react-router";

const NAV = [
  { to: "/", label: "Desk" },
  { to: "/host-path", label: "Host Path" },
  { to: "/handoffs", label: "Handoffs" },
  { to: "/boundary", label: "Boundary" },
] as const;

export function DeskHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-ink-deep/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <Link to="/" className="group flex items-baseline gap-3">
          <span className="font-display text-xl leading-none text-bone">Salty Desk</span>
          <span className="label-mono hidden sm:inline">Salty &amp; Clever</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
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
      </div>
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
