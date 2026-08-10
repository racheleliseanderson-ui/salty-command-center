import { Link } from "@tanstack/react-router";
import { CommandPalette } from "@/components/desk/CommandPalette";
import { DisplayControls } from "@/components/desk/DisplayControls";
import { useLocale } from "@/hooks/use-locale";
import type { MessageKey } from "@/lib/i18n";

const NAV: { to: string; key: MessageKey }[] = [
  { to: "/", key: "nav.desk" },
  { to: "/host-path", key: "nav.hostPath" },
  { to: "/handoffs", key: "nav.handoffs" },
  { to: "/reference", key: "nav.reference" },
  { to: "/boundary", key: "nav.boundary" },
];

export function DeskHeader() {
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-ink-deep/90 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-2.5 sm:px-8">
        <Link to="/" className="group flex min-w-0 items-baseline gap-3">
          <span className="whitespace-nowrap font-display text-xl leading-none text-bone">Salty Desk</span>
          <span className="label-mono hidden whitespace-nowrap 2xl:inline">Salty &amp; Clever</span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-0.5 xl:flex xl:gap-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="gold-underline rounded-sm px-2.5 py-1.5 text-[0.78rem] tracking-wide text-muted-foreground transition-colors hover:text-bone data-[status=active]:text-brass"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <CommandPalette />
          <DisplayControls />
        </div>
      </div>

      {/* Narrow widths: the nav becomes its own scrollable rail with real tap targets. */}
      <nav
        aria-label={t("nav.sections")}
        className="flex gap-1 overflow-x-auto border-t border-border/60 px-3 pb-1.5 pt-1 xl:hidden"
      >
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="press tap inline-flex shrink-0 items-center whitespace-nowrap rounded-sm border border-transparent px-3 text-[0.78rem] tracking-wide text-muted-foreground transition-colors data-[status=active]:border-brass/40 data-[status=active]:text-brass"
          >
            {t(item.key)}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function DeskFooter() {
  const { t } = useLocale();

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
          <p className="label-mono mt-3 leading-relaxed">{t("lang.note")}</p>
        </div>

        <div>
          <p className="label-mono">{t("footer.suite")}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/host-path" className="gold-underline transition-colors hover:text-brass">
                {t("nav.hostPath")}
              </Link>
            </li>
            <li>
              <Link to="/handoffs" className="gold-underline transition-colors hover:text-brass">
                {t("nav.handoffs")}
              </Link>
            </li>
            <li>
              <Link to="/reference" className="gold-underline transition-colors hover:text-brass">
                {t("nav.reference")}
              </Link>
            </li>
            <li>
              <Link to="/boundary" className="gold-underline transition-colors hover:text-brass">
                {t("nav.boundary")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="label-mono">{t("footer.constraints")}</p>
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
