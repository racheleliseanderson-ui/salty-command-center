import { useCallback } from "react";
import { translate, type Locale, type MessageKey } from "@/lib/i18n";

/** Interface copy is English only. Locale storage is ignored. */
export function useLocale() {
  const t = useCallback((key: MessageKey) => translate("en", key), []);
  return { locale: "en" as Locale, setLocale: (_next: Locale) => {}, t };
}
