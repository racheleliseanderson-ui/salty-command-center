import { Contrast, Languages, Palette } from "lucide-react";
import { MODES, useColorSafe, useDisplayMode } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import { LOCALES } from "@/lib/i18n";

/** Palette picker: navy / pearl / black / white. Label + icon, never colour alone. */
export function DisplayControls() {
  const { mode, setMode, cycle } = useDisplayMode();
  const { t } = useLocale();
  const current = MODES.find((m) => m.value === mode)!;

  return (
    <div className="flex items-center gap-2">
      {/* Desktop: the whole set is visible and named. */}
      <div
        role="group"
        aria-label={t("display.label")}
        className="hidden items-center gap-0.5 rounded-sm border border-border p-0.5 lg:flex"
      >
        {MODES.map((m) => {
          const active = m.value === mode;
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              aria-pressed={active}
              title={m.note}
              className={
                active
                  ? "press label-mono rounded-sm bg-brass px-2.5 py-2 text-[0.58rem] text-primary-foreground"
                  : "press label-mono rounded-sm px-2.5 py-2 text-[0.58rem] text-muted-foreground hover:text-brass"
              }
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Mobile: one tap cycles, with the current mode named out loud. */}
      <button
        type="button"
        onClick={cycle}
        aria-label={`${t("display.label")}: ${current.label}. Tap to change.`}
        className="press tap inline-flex items-center justify-center gap-2 rounded-sm border border-brass/35 px-2.5 text-brass lg:hidden"
      >
        <Palette className="h-4 w-4" />
        <span className="label-mono text-[0.58rem] text-brass">{current.label}</span>
      </button>

      <ColorSafeToggle />
      <LanguageSwitcher />
    </div>
  );
}

export function ColorSafeToggle() {
  const { safe, toggle } = useColorSafe();
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={safe}
      aria-label={safe ? t("display.cvdOn") : t("display.cvdOff")}
      title="Colour-vision-safe palette (gold / cyan signal)"
      className={
        safe
          ? "press tap inline-flex items-center justify-center gap-2 rounded-sm border border-brass bg-brass/15 px-2.5 text-brass"
          : "press tap inline-flex items-center justify-center gap-2 rounded-sm border border-border px-2.5 text-muted-foreground hover:border-brass/50 hover:text-brass"
      }
    >
      <Contrast className="h-4 w-4" />
      <span className="label-mono hidden text-[0.58rem] sm:inline">{safe ? "CVD on" : "CVD"}</span>
    </button>
  );
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("lang.label")}</span>
      <Languages
        aria-hidden="true"
        className="pointer-events-none absolute left-2.5 h-4 w-4 text-muted-foreground"
      />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        title={t("lang.note")}
        className="tap label-mono appearance-none rounded-sm border border-border bg-transparent pl-8 pr-2.5 text-[0.58rem] text-muted-foreground transition-colors hover:border-brass/50 hover:text-brass focus-visible:outline focus-visible:outline-1 focus-visible:outline-brass"
      >
        {LOCALES.map((l) => (
          <option key={l.value} value={l.value} className="bg-popover text-popover-foreground">
            {l.short}
          </option>
        ))}
      </select>
    </label>
  );
}
