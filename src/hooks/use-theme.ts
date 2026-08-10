import { useCallback, useEffect, useState } from "react";

/**
 * Four display modes. `navy` and `pearl` are the house palette; the two
 * high-contrast modes strip chroma from grounds for black/white legibility.
 */
export type DisplayMode = "navy" | "pearl" | "hc-dark" | "hc-light";

export const MODE_STORAGE_KEY = "salty-desk-mode";
export const CVD_STORAGE_KEY = "salty-desk-cvd";

export const MODES: { value: DisplayMode; label: string; note: string }[] = [
  { value: "navy", label: "Navy", note: "Deep navy ground, gold signal" },
  { value: "pearl", label: "Pearl", note: "Pearl ground, ink type" },
  { value: "hc-dark", label: "Black", note: "High contrast, black ground" },
  { value: "hc-light", label: "White", note: "High contrast, white ground" },
];

function classesFor(mode: DisplayMode) {
  return {
    light: mode === "pearl" || mode === "hc-light",
    hc: mode === "hc-dark" || mode === "hc-light",
  };
}

function readMode(): DisplayMode {
  if (typeof document === "undefined") return "navy";
  const root = document.documentElement;
  const hc = root.classList.contains("hc");
  const light = root.classList.contains("light");
  if (hc) return light ? "hc-light" : "hc-dark";
  return light ? "pearl" : "navy";
}

function readCvd(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("cvd");
}

export function useDisplayMode() {
  const [mode, setMode] = useState<DisplayMode>("navy");

  useEffect(() => {
    setMode(readMode());
  }, []);

  const apply = useCallback((next: DisplayMode) => {
    setMode(next);
    const root = document.documentElement;
    const { light, hc } = classesFor(next);
    root.classList.add("mode-shift");
    root.classList.toggle("light", light);
    root.classList.toggle("hc", hc);
    window.setTimeout(() => root.classList.remove("mode-shift"), 320);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — mode holds for this session only */
    }
  }, []);

  const cycle = useCallback(() => {
    const order = MODES.map((m) => m.value);
    const i = order.indexOf(readMode());
    apply(order[(i + 1) % order.length]!);
  }, [apply]);

  return { mode, setMode: apply, cycle };
}

/** Colour-vision-safe palette: gold/cyan signal instead of gold/crimson. */
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
