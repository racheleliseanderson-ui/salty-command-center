/**
 * UI dictionary. Small, hand-curated, and deliberately limited to chrome and
 * interaction labels — the operational content stays in one authored language
 * so a translation can never soften a constraint.
 */
export type Locale = "en" | "es" | "fr";

export const LOCALES: { value: Locale; label: string; short: string }[] = [
  { value: "en", label: "English", short: "EN" },
  { value: "es", label: "Español", short: "ES" },
  { value: "fr", label: "Français", short: "FR" },
];

export const LOCALE_STORAGE_KEY = "salty-desk-locale";

const DICT = {
  en: {
    "nav.desk": "Desk",
    "nav.hostPath": "Host Path",
    "nav.handoffs": "What travels",
    "nav.reference": "Plain words",
    "nav.pipeline": "Plan the night",
    "nav.boundary": "Limits",
    "nav.sections": "Desk sections",
    "search.open": "Search the desk",
    "search.placeholder": "Search tools, transfers, limits, terms…",
    "search.empty": "Nothing matches that. Try a tool name or a term.",
    "search.hint": "Enter to open · Esc to close",
    "search.results": "results",
    "search.filter": "Filter",
    "display.label": "Display mode",
    "display.cvdOn": "Colour-safe palette on",
    "display.cvdOff": "Colour-safe palette off",
    "lang.label": "Language",
    "lang.note": "Interface labels only — operational text stays in English.",
    "footer.suite": "Suite",
    "footer.constraints": "Standing limits",
  },
  es: {
    "nav.desk": "Mesa",
    "nav.hostPath": "Ruta anfitrión",
    "nav.handoffs": "Qué se envía",
    "nav.reference": "Palabras claras",
    "nav.pipeline": "Planear la noche",
    "nav.boundary": "Límites",
    "nav.sections": "Secciones de la mesa",
    "search.open": "Buscar en la mesa",
    "search.placeholder": "Busca herramientas, envíos, límites, términos…",
    "search.empty": "Nada coincide. Prueba con el nombre de una herramienta.",
    "search.hint": "Enter para abrir · Esc para cerrar",
    "search.results": "resultados",
    "search.filter": "Filtrar",
    "display.label": "Modo de pantalla",
    "display.cvdOn": "Paleta accesible activada",
    "display.cvdOff": "Paleta accesible desactivada",
    "lang.label": "Idioma",
    "lang.note": "Solo etiquetas de interfaz — el texto operativo sigue en inglés.",
    "footer.suite": "Conjunto",
    "footer.constraints": "Restricciones permanentes",
  },
  fr: {
    "nav.desk": "Bureau",
    "nav.hostPath": "Parcours hôte",
    "nav.handoffs": "Ce qui circule",
    "nav.reference": "Mots simples",
    "nav.pipeline": "Planifier la soirée",
    "nav.boundary": "Limites",
    "nav.sections": "Sections du bureau",
    "search.open": "Rechercher",
    "search.placeholder": "Outils, envois, limites, termes…",
    "search.empty": "Aucun résultat. Essayez le nom d'un outil.",
    "search.hint": "Entrée pour ouvrir · Échap pour fermer",
    "search.results": "résultats",
    "search.filter": "Filtrer",
    "display.label": "Mode d'affichage",
    "display.cvdOn": "Palette accessible activée",
    "display.cvdOff": "Palette accessible désactivée",
    "lang.label": "Langue",
    "lang.note": "Libellés d'interface uniquement — le texte opérationnel reste en anglais.",
    "footer.suite": "Suite",
    "footer.constraints": "Contraintes permanentes",
  },
} as const;

export type MessageKey = keyof (typeof DICT)["en"];

export function translate(locale: Locale, key: MessageKey): string {
  return DICT[locale][key] ?? DICT.en[key];
}
