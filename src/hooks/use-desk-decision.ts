import { useCallback, useEffect, useState } from "react";

import {
  DECISION_EVENT,
  createDecision,
  pathFromAnswers,
  readDecision,
  updateDecision,
  writeDecision,
  type DeskDecision,
} from "@/lib/desk-decision";
import type { Answers } from "@/lib/desk-triage";

/**
 * The decision record, held on this device only.
 *
 * It shadows the triage answers rather than replacing them: the reader's
 * declared answers stay the source of truth for what they said, and this adds
 * the memory of what happened next. Clearing is one action and it is complete.
 */
export function useDeskDecision() {
  const [decision, setDecision] = useState<DeskDecision | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDecision(readDecision());
    setHydrated(true);
    const sync = () => setDecision(readDecision());
    window.addEventListener(DECISION_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(DECISION_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const commit = useCallback((next: DeskDecision | null) => {
    setDecision(next);
    writeDecision(next);
  }, []);

  /** Keep the record in step with the brief as the reader answers it. */
  const syncAnswers = useCallback((answers: Answers) => {
    const current = readDecision();
    const path = pathFromAnswers(answers);
    if (!current) {
      const fresh = createDecision(answers);
      setDecision(fresh);
      writeDecision(fresh);
      return;
    }
    const same =
      JSON.stringify(current.answers) === JSON.stringify(answers) && current.path === path;
    if (same) return;
    const next = updateDecision(current, { answers, path });
    setDecision(next);
    writeDecision(next);
  }, []);

  const patch = useCallback(
    (changes: Partial<Omit<DeskDecision, "id" | "createdAt" | "switches">>) => {
      const current = readDecision() ?? createDecision();
      const next = updateDecision(current, changes);
      setDecision(next);
      writeDecision(next);
      return next;
    },
    [],
  );

  const startFresh = useCallback(() => {
    const fresh = createDecision();
    setDecision(fresh);
    writeDecision(fresh);
    return fresh;
  }, []);

  const clear = useCallback(() => commit(null), [commit]);

  return { decision, hydrated, syncAnswers, patch, startFresh, clear };
}
