import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "salty-desk-theme";
export const CVD_STORAGE_KEY = "salty-desk-cvd";

function readStored(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function readCvd(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("cvd");
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readStored());
  }, []);

  const apply = useCallback((next: Theme) => {
    setTheme(next);
    const root = document.documentElement;
    root.classList.toggle("light", next === "light");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme stays for this session only */
    }
  }, []);

  const toggle = useCallback(() => {
    apply(readStored() === "light" ? "dark" : "light");
  }, [apply]);

  return { theme, setTheme: apply, toggle };
}

/** Colour-vision-safe palette: blue/amber signal instead of brass/oxblood. */
export function useColorSafe() {
  const [safe, setSafe] = useState(false);

  useEffect(() => {
    setSafe(readCvd());
  }, []);

  const toggle = useCallback(() => {
    const next = !readCvd();
    setSafe(next);
    document.documentElement.classList.toggle("cvd", next);
    try {
      localStorage.setItem(CVD_STORAGE_KEY, next ? "on" : "off");
    } catch {
      /* storage unavailable — setting holds for this session only */
    }
  }, []);

  return { safe, toggle };
}
