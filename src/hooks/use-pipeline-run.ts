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
        append(current, "note", text ? `Note recorded at ${code} (${text.length} chars).` : `Note cleared at ${code}.`),
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
            `Attached ${file.name} (${formatBytes(file.size)}) at ${code}${gateId ? " · gate-tied" : ""}${
              inline ? "" : " · recorded by reference only"
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
      commit(append(next, "evidence", `Withdrew ${item?.name ?? "attachment"} at ${code}.`));
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
      commit(append(current, "control", `Run package exported as ${format.toUpperCase()}. Local file, no upload.`));
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

