import { useCallback, useEffect, useState } from "react";

import { clearHandoffFromUrl, readHandoffFromLocation } from "@/lib/salty-handoff/codec.ts";
import type { SaltyApp } from "@/lib/salty-handoff/contract.ts";
import {
  IDLE,
  applyImport,
  beginImport,
  dismissImport,
  type ImportSession,
} from "@/lib/salty-handoff/import-session.ts";

/**
 * Read a fragment once, offer it, and never write application state from here.
 * Apply and Ignore are the only ways the offer is consumed.
 *
 * `ready` waits for local state to hydrate so "you already have a decision"
 * is truthful. Until then the hook stays idle.
 */
export function useSaltyImport(
  destination: SaltyApp,
  hasExistingWork: boolean,
  ready = true,
) {
  const [session, setSession] = useState<ImportSession>(IDLE);

  useEffect(() => {
    if (!ready) return;
    const result = readHandoffFromLocation(destination);
    setSession(beginImport(result, hasExistingWork));
  }, [destination, hasExistingWork, ready]);

  const apply = useCallback(() => {
    setSession((current) => applyImport(current));
    clearHandoffFromUrl();
  }, []);

  const ignore = useCallback(() => {
    setSession((current) => dismissImport(current));
    clearHandoffFromUrl();
  }, []);

  return { session, apply, ignore };
}
