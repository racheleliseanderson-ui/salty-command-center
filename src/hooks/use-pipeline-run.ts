import { useCallback, useEffect, useState } from "react";
import {
  EMPTY_RUN,
  EVIDENCE_INLINE_LIMIT,
  STAGES,
  blockingGates,
  buildRunPackage,
  formatBytes,
  runPackageMarkdown,
  type Evidence,
  type RunState,
} from "@/lib/desk-pipeline";

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
    return {
      ...EMPTY_RUN,
      ...parsed,
      gates: parsed.gates ?? {},
      log: parsed.log ?? [],
      notes: parsed.notes ?? {},
      evidence: parsed.evidence ?? {},
    };
  } catch {
    return EMPTY_RUN;
  }
}

function download(name: string, mime: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function readAsDataUrl(file: File) {
  return new Promise<string | null>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}


/**
 * Plan state is local and persistent: it follows the reader between pages and
 * survives a reload. Nothing is uploaded, and deleting it is one control.
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
      /* storage unavailable — the plan holds for this session only */
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
<<<<<<< Updated upstream
    commit(append(base, "control", "Plan started at guests & constraints. Constraints declared, nothing inferred."));
=======
    commit(append(base, "control", "Plan started at Step 1. Everything comes from what you declare — nothing is assumed."));
>>>>>>> Stashed changes
  }, [append, commit]);

  const toggleGate = useCallback(
    (id: string, label: string) => {
      const current = read();
      const next = { ...current, gates: { ...current.gates, [id]: !current.gates[id] } };
      commit(
        append(next, "gate", `${next.gates[id] ? "Confirmed" : "Un-ticked"} · ${label}`),
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
<<<<<<< Updated upstream
          `More information needed at ${stage.name} — ${blocking.length} required item${blocking.length > 1 ? "s" : ""} not confirmed yet.`,
=======
          `Stayed on ${stage.code} · ${stage.name} — ${blocking.length} required check${blocking.length > 1 ? "s" : ""} still to confirm.`,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          ? `${stage.name} signed off. Plan ready.`
          : `${stage.name} signed off → ${STAGES[current.stage + 1]!.name}.`,
=======
          ? `${stage.code} · ${stage.name} done. The plan is finished.`
          : `${stage.code} · ${stage.name} done → ${STAGES[current.stage + 1]!.code} · ${STAGES[current.stage + 1]!.name}.`,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        `Reopened ${stage.name}. Later sign-offs stand until withdrawn.`,
=======
        `Back on ${stage.code} · ${stage.name}. Later checks stay ticked until you un-tick them.`,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        held ? "Pause released. Plan resumed." : "Plan paused. Nothing advances until released.",
=======
        held ? "Resumed." : "Paused. Nothing advances until you resume.",
>>>>>>> Stashed changes
      ),
    );
  }, [append, commit]);

  const abort = useCallback(() => {
    const current = read();
    commit(
      append(
        { ...current, status: "aborted" },
        "stop",
<<<<<<< Updated upstream
        "Plan stood down. Hosting stopped — dine out instead of improvising.",
=======
        "Decided not to host this one. Dining out beats improvising the night.",
>>>>>>> Stashed changes
      ),
    );
  }, [append, commit]);

  const reset = useCallback(() => commit(EMPTY_RUN), [commit]);

  /** Per-stage note. Saved silently; only logged when the field is committed. */
  const setNote = useCallback(
    (stageId: string, text: string) => {
      const current = read();
      commit({ ...current, notes: { ...current.notes, [stageId]: text } });
    },
    [commit],
  );

  const logNote = useCallback(
    (stageId: string, code: string) => {
      const current = read();
      const text = (current.notes[stageId] ?? "").trim();
      commit(
        append(current, "note", text ? `Note saved on ${code} (${text.length} characters).` : `Note cleared on ${code}.`),
      );
    },
    [append, commit],
  );

  const addEvidence = useCallback(
    async (stageId: string, code: string, gateId: string | null, files: FileList | File[]) => {
      for (const file of Array.from(files)) {
        const inline = file.size <= EVIDENCE_INLINE_LIMIT ? await readAsDataUrl(file) : null;
        const item: Evidence = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          stageId,
          gateId,
          name: file.name,
          size: file.size,
          type: file.type,
          addedAt: stamp(),
          dataUrl: inline,
        };
        const current = read();
        const next: RunState = {
          ...current,
          evidence: { ...current.evidence, [stageId]: [item, ...(current.evidence[stageId] ?? [])] },
        };
        commit(
          append(
            next,
            "evidence",
<<<<<<< Updated upstream
            `Attached ${file.name} (${formatBytes(file.size)}) at ${code}${gateId ? " · tied to a requirement" : ""}${
=======
            `Added ${file.name} (${formatBytes(file.size)}) to ${code}${gateId ? " · tied to a check" : ""}${
>>>>>>> Stashed changes
              inline ? "" : " · listed by name only"
            }.`,
          ),
        );
      }
    },
    [append, commit],
  );

  const removeEvidence = useCallback(
    (stageId: string, id: string, code: string) => {
      const current = read();
      const item = (current.evidence[stageId] ?? []).find((e) => e.id === id);
      const next: RunState = {
        ...current,
        evidence: {
          ...current.evidence,
          [stageId]: (current.evidence[stageId] ?? []).filter((e) => e.id !== id),
        },
      };
      commit(append(next, "evidence", `Removed ${item?.name ?? "attachment"} from ${code}.`));
    },
    [append, commit],
  );

  const exportPackage = useCallback(
    (format: "json" | "markdown") => {
      const current = read();
      const slug = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
      if (format === "json") {
        download(
          `salty-desk-run-${slug}.json`,
          "application/json",
          JSON.stringify(buildRunPackage(current), null, 2),
        );
      } else {
        download(`salty-desk-run-${slug}.md`, "text/markdown", runPackageMarkdown(current));
      }
<<<<<<< Updated upstream
      commit(append(current, "control", `Plan downloaded as ${format.toUpperCase()}. Local file, no upload.`));
=======
      commit(append(current, "control", `Plan downloaded as ${format.toUpperCase()}. A file on your device — nothing uploaded.`));
>>>>>>> Stashed changes
    },
    [append, commit],
  );

  return {
    run,
    hydrated,
    start,
    advance,
    rewind,
    hold,
    abort,
    reset,
    toggleGate,
    setNote,
    logNote,
    addEvidence,
    removeEvidence,
    exportPackage,
  };
}

