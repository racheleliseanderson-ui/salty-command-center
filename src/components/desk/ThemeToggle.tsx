import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="group inline-flex h-8 items-center gap-2 rounded-sm border border-brass/35 px-2.5 text-brass transition-colors hover:bg-brass hover:text-primary-foreground"
    >
      {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      <span className="label-mono hidden text-[0.6rem] text-brass transition-colors group-hover:text-primary-foreground sm:inline">
        {theme === "light" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
