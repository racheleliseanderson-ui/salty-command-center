import { Contrast, Moon, Sun } from "lucide-react";
import { useColorSafe, useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="group inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-sm border border-brass/35 px-2.5 text-brass transition-colors hover:bg-brass hover:text-primary-foreground"
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="label-mono hidden text-[0.6rem] text-brass transition-colors group-hover:text-primary-foreground sm:inline">
        {theme === "light" ? "Light" : "Dark"}
      </span>
    </button>
  );
}

export function ColorSafeToggle() {
  const { safe, toggle } = useColorSafe();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={safe}
      aria-label={
        safe ? "Turn off colour-vision-safe palette" : "Turn on colour-vision-safe palette"
      }
      title="Colour-vision-safe palette (blue/amber signal)"
      className={
        safe
          ? "group inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-sm border border-brass bg-brass/15 px-2.5 text-brass transition-colors"
          : "group inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-sm border border-border px-2.5 text-muted-foreground transition-colors hover:border-brass/50 hover:text-brass"
      }
    >
      <Contrast className="h-4 w-4" />
      <span className="label-mono hidden text-[0.6rem] sm:inline">
        {safe ? "CVD on" : "CVD"}
      </span>
    </button>
  );
}
