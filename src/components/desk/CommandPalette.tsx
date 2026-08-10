import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, CornerDownLeft, Search, X } from "lucide-react";
import { KIND_LABEL, search, type SearchHit, type SearchKind } from "@/lib/search-index";
import { useLocale } from "@/hooks/use-locale";

const KINDS = Object.keys(KIND_LABEL) as SearchKind[];

/** ⌘K / Ctrl-K command palette; a bottom sheet on touch widths. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [kinds, setKinds] = useState<SearchKind[]>([]);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t } = useLocale();

  const hits = useMemo(() => search(query, kinds).slice(0, 30), [query, kinds]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setCursor(0);
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open]);

  const go = (hit: SearchHit) => {
    setOpen(false);
    if (hit.to === "/tools/$slug" && hit.params) {
      void navigate({ to: "/tools/$slug", params: hit.params });
    } else if (hit.to) {
      void navigate({ to: hit.to });
    } else if (hit.href) {
      window.open(hit.href, "_blank", "noreferrer");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("search.open")}
        className="press tap inline-flex items-center gap-2 rounded-sm border border-border px-2.5 text-muted-foreground transition-colors hover:border-brass/50 hover:text-brass"
      >
        <Search className="h-4 w-4" />
        <span className="label-mono hidden text-[0.58rem] md:inline">{t("search.open")}</span>
        <span className="label-mono hidden rounded-sm border border-border px-1 text-[0.52rem] lg:inline">
          ⌘K
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-start sm:pt-24">
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-deep/80 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("search.open")}
            className="panel sheet-in relative flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-lg sm:max-w-[720px] sm:rounded-lg"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-brass" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setCursor((c) => Math.min(c + 1, hits.length - 1));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setCursor((c) => Math.max(c - 1, 0));
                  }
                  if (e.key === "Enter" && hits[cursor]) go(hits[cursor]!);
                }}
                placeholder={t("search.placeholder")}
                aria-label={t("search.placeholder")}
                className="min-w-0 flex-1 bg-transparent py-2 text-base text-bone outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="press tap inline-flex items-center justify-center text-muted-foreground hover:text-brass"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto border-b border-border px-3 py-2">
              {KINDS.map((k) => {
                const active = kinds.includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setKinds((cur) => (active ? cur.filter((c) => c !== k) : [...cur, k]))
                    }
                    className={
                      active
                        ? "press label-mono min-h-11 shrink-0 rounded-sm border border-brass bg-brass/15 px-3 text-[0.55rem] text-brass"
                        : "press label-mono min-h-11 shrink-0 rounded-sm border border-border px-3 text-[0.55rem] text-muted-foreground hover:border-brass/50 hover:text-brass"
                    }
                  >
                    {KIND_LABEL[k]}
                  </button>
                );
              })}
            </div>

            <ul aria-live="polite" className="min-h-0 flex-1 overflow-y-auto">
              {hits.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                  {t("search.empty")}
                </li>
              ) : (
                hits.map((hit, i) => (
                  <li key={hit.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => go(hit)}
                      className={
                        i === cursor
                          ? "flex w-full items-start gap-3 border-l-2 border-brass bg-brass/10 px-4 py-3 text-left"
                          : "flex w-full items-start gap-3 border-l-2 border-transparent px-4 py-3 text-left hover:bg-surface/60"
                      }
                    >
                      <span className="label-mono mt-1 w-16 shrink-0 text-[0.52rem] text-brass">
                        {hit.kindLabel}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-display text-lg leading-tight text-bone">
                          {hit.title}
                        </span>
                        <span className="mt-1 block text-[0.8rem] leading-relaxed text-muted-foreground">
                          {hit.detail}
                        </span>
                      </span>
                      {hit.href ? (
                        <ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-brass" />
                      ) : null}
                    </button>
                  </li>
                ))
              )}
            </ul>

            <p className="label-mono flex items-center gap-2 border-t border-border px-4 py-2 text-[0.52rem]">
              <CornerDownLeft aria-hidden="true" className="h-3 w-3" />
              {hits.length} {t("search.results")} · {t("search.hint")}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
