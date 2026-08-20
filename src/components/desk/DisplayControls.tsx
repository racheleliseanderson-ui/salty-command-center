import { Contrast, Palette } from "lucide-react";
import { MODES, useColorSafe, useDisplayMode } from "@/hooks/use-theme";

/** Palette picker: navy / pearl. Label + icon, never colour alone. */
export function DisplayControls() {
  const { mode, setMode, cycle } = useDisplayMode();
  const current = MODES.find((m) => m.value === mode)!;

  return (
    <div className="flex items-center gap-2">
      {/* Desktop: the whole set is visible and named. */}
      <div
        role="group"
        aria-label="Display mode"
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
        aria-label={`Display mode: ${current.label}. Tap to change.`}
        className="press tap inline-flex items-center justify-center gap-2 rounded-sm border border-brass/35 px-2.5 text-brass lg:hidden"
      >
        <Palette className="h-4 w-4" />
        <span className="label-mono text-[0.58rem] text-brass">{current.label}</span>
      </button>

      <ColorSafeToggle />
    </div>
  );
}

export function ColorSafeToggle() {
  const { safe, toggle } = useColorSafe();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={safe}
      aria-label={safe ? "CVD on" : "CVD off"}
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
