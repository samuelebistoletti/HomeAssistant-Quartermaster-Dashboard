import en from "./translations/en";
import it from "./translations/it";

export type Strings = typeof en;
export type StringKey = keyof Strings;

const LANGUAGES: Record<string, Strings> = { en, it };

/** Return the strings for a BCP 47 language tag, falling back to English. */
export function stringsFor(language: string | undefined): Strings {
  const base = (language ?? "en").toLowerCase().split("-")[0];
  return LANGUAGES[base] ?? en;
}
