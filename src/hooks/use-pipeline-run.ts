import { useCallback, useEffect, useState } from "react";
import { EMPTY_RUN, STAGES, blockingGates, type RunState } from "@/lib/desk-pipeline";

export const RUN_STORAGE_KEY = "salty-desk-run";
const EVENT = "salty-desk-run-change";

function stamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function read(): RunState {
  if (typeof window === "undefined") return EMPTY_RUN;
  try {
    const raw = localStorage.getItem(RUN_STORAGE_KEY);
    if (!raw) return EMPTY_RUN;
    const parsed = JSON.parse(raw) as RunState;
    if (!parsed || typeof parsed !== "object") return EMPTY_RUN;
    return { ...EMPTY_RUN, ...parsed, gates: parsed.gates ?? {}, log: parsed.log ?? [] };
  } catch {
    return EMPTY_RUN;
  }
}

/**
 * Run state is local and persistent: the run follows the reader between pages
 * and survives a reload. Nothing is uploaded, and clearing it is one control.
 */
export function usePipelineRun() {
  const [run, setRun] = useState<RunState>(EMPTY_RUN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRun(read());
    setHydrated(true);
    const sync = () => setRun(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const commit = useCallback((next: RunState) => {
    setRun(next);
    try {
      localStorage.setItem(RUN_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — the run holds for this session only */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const append = useCallback(
    (state: RunState, kind: RunState["log"][number]["kind"], text: string): RunState => ({
      ...state,
      log: [{ at: stamp(), kind, text }, ...state.log].slice(0, 40),
    }),
    [],
  );

  const start = useCallback(() => {
    const base: RunState = {
      ...EMPTY_RUN,
      status: "running",
      startedAt: stamp(),
    };
    commit(append(base, "control", "Run opened at Intake. Constraints declared, nothing inferred."));
  }, [append, commit]);

  const toggleGate = useCallback(
    (id: string, label: string) => {
      const current = read();
      const next = { ...current, gates: { ...current.gates, [id]: !current.gates[id] } };
      commit(
        append(next, "gate", `${next.gates[id] ? "Signed" : "Withdrawn"} · ${label}`),
      );
    },
    [append, commit],
  );

  const advance = useCallback(() => {
    const current = read();
    const stage = STAGES[current.stage];
    if (!stage) return;
    const blocking = blockingGates(stage, current.gates);
    if (blocking.length > 0) {
      commit(
        append(
          current,
          "stop",
          `Refused at ${stage.code} ${stage.name} — ${blocking.length} hard gate${blocking.length > 1 ? "s" : ""} unsigned.`,
        ),
      );
      return;
    }
    const last = current.stage >= STAGES.length - 1;
    const next: RunState = last
      ? { ...current, status: "complete", stage: STAGES.length - 1 }
      : { ...current, stage: current.stage + 1, status: "running" };
    commit(
      append(
        next,
        "stage",
        last
          ? `${stage.code} ${stage.name} signed off. Run closed.`
          : `${stage.code} ${stage.name} signed off → ${STAGES[current.stage + 1]!.code} ${STAGES[current.stage + 1]!.name}.`,
      ),
    );
  }, [append, commit]);

  const rewind = useCallback(() => {
    const current = read();
    if (current.stage === 0 && current.status !== "complete") return;
    const target = current.status === "complete" ? current.stage : current.stage - 1;
    const stage = STAGES[target]!;
    commit(
      append(
        { ...current, stage: target, status: "running" },
        "stage",
        `Reopened ${stage.code} ${stage.name}. Later sign-offs stand until withdrawn.`,
      ),
    );
  }, [append, commit]);

  const hold = useCallback(() => {
    const current = read();
    const held = current.status === "held";
    commit(
      append(
        { ...current, status: held ? "running" : "held" },
        "control",
        held ? "Hold released. Run resumed." : "Run held. Nothing advances until released.",
      ),
    );
  }, [append, commit]);

  const abort = useCallback(() => {
    const current = read();
    commit(
      append(
        { ...current, status: "aborted" },
        "stop",
        "Run stood down. Hosting refused — dine out instead of improvising.",
      ),
    );
  }, [append, commit]);

  const reset = useCallback(() => commit(EMPTY_RUN), [commit]);

  return { run, hydrated, start, advance, rewind, hold, abort, reset, toggleGate };
}
