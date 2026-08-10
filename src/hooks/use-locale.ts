import { useCallback, useEffect, useState } from "react";
import { LOCALE_STORAGE_KEY, translate, type Locale, type MessageKey } from "@/lib/i18n";

const EVENT = "salty-desk-locale-change";

function read(): Locale {
  if (typeof document === "undefined") return "en";
  const attr = document.documentElement.getAttribute("lang");
  return attr === "es" || attr === "fr" ? attr : "en";
}

/** Locale for interface labels. Persisted locally; no network, no account. */
export function useLocale() {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    setLocale(read());
    const sync = () => setLocale(read());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const apply = useCallback((next: Locale) => {
    setLocale(next);
    document.documentElement.setAttribute("lang", next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — locale holds for this session only */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const t = useCallback((key: MessageKey) => translate(locale, key), [locale]);

  return { locale, setLocale: apply, t };
}
