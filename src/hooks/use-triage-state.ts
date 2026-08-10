import { useCallback, useEffect, useState } from "react";
import type { Answers } from "@/lib/desk-triage";

export const TRIAGE_STORAGE_KEY = "salty-desk-triage";
const EVENT = "salty-desk-triage-change";

function read(): Answers {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(TRIAGE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Answers;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Triage answers persist locally so every page can tailor itself to the
 * reader's declared case. Nothing is uploaded; clearing is one click.
 */
export function useTriageState() {
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAnswers(read());
    setHydrated(true);
    const sync = () => setAnswers(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const commit = useCallback((next: Answers) => {
    setAnswers(next);
    try {
      localStorage.setItem(TRIAGE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — answers hold for this session only */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const setAnswer = useCallback(
    <K extends keyof Answers>(key: K, value: Answers[K] | undefined) => {
      const next = { ...read(), [key]: value } as Answers;
      if (value === undefined) delete next[key];
      commit(next);
    },
    [commit],
  );

  const reset = useCallback(() => commit({}), [commit]);

  return { answers, setAnswer, reset, hydrated };
}
