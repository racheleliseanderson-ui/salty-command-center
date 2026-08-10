import { Search, X } from "lucide-react";

/** Inline filter field for on-page lists. Touch-sized, labelled, clearable. */
export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  count,
  countLabel = "showing",
}: {
  value: string;
  onChange: (next: string) => void;
  label: string;
  placeholder: string;
  count?: number;
  countLabel?: string;
}) {
  return (
    <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <label className="relative flex min-w-0 flex-1 items-center sm:max-w-[420px]">
        <span className="sr-only">{label}</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 h-4 w-4 text-brass" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="tap w-full rounded-sm border border-border bg-transparent pl-10 pr-10 text-[0.9rem] text-bone outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-brass"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear filter"
            className="press absolute right-2 inline-flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-brass"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </label>
      {typeof count === "number" ? (
        <p aria-live="polite" className="label-mono shrink-0">
          {count} {countLabel}
        </p>
      ) : null}
    </div>
  );
}
