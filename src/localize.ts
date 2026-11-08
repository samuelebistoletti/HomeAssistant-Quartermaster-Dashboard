import en from "./translations/en";
import it from "./translations/it";
import type { HassError, Suggestion } from "./types";

export type Strings = typeof en;
export type StringKey = keyof Strings;
type PluralBase<K> = K extends `${infer B}_other` ? B : never;
export type PluralKey = PluralBase<StringKey>;
export type Params = Record<string, string | number>;

const LANGUAGES: Record<string, Strings> = { en, it };

function baseLanguage(language: string | undefined): string {
  return (language ?? "en").toLowerCase().split("-")[0];
}

/** Return the strings for a BCP 47 language tag, falling back to English. */
export function stringsFor(language: string | undefined): Strings {
  return LANGUAGES[baseLanguage(language)] ?? en;
}

/** Replace `{name}` placeholders. Unknown placeholders are left as they are. */
export function format(template: string, params: Params = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/** Localization helpers bound to one language. */
export class Localizer {
  readonly strings: Strings;
  readonly locale: string;

  constructor(language: string | undefined) {
    this.strings = stringsFor(language);
    // Formatting follows the requested language when its strings exist, so
    // numbers and dates never mix two languages in one sentence.
    this.locale = language && baseLanguage(language) in LANGUAGES ? language : "en";
  }

  t(key: StringKey, params?: Params): string {
    return format(this.strings[key], params);
  }

  /** Plural-aware string: picks `<key>_one` or `<key>_other` for `count`. */
  plural(key: PluralKey, count: number, params: Params = {}): string {
    const rule = new Intl.PluralRules(this.locale).select(count);
    const one = `${key}_one` as StringKey;
    const chosen = rule === "one" && one in this.strings ? one : (`${key}_other` as StringKey);
    return format(this.strings[chosen], { count: this.number(count), ...params });
  }

  number(value: number): string {
    return new Intl.NumberFormat(this.locale, { maximumFractionDigits: 2 }).format(value);
  }

  percent(value: number): string {
    return new Intl.NumberFormat(this.locale, { style: "percent", maximumFractionDigits: 0 }).format(
      value,
    );
  }

  /** A calendar date (`YYYY-MM-DD`) such as "2 novembre" or "November 2". */
  date(isoDate: string): string {
    const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
    if (!year || !month || !day) {
      return isoDate;
    }
    const value = new Date(Date.UTC(year, month - 1, day));
    const thisYear = new Date().getFullYear() === year;
    return new Intl.DateTimeFormat(this.locale, {
      day: "numeric",
      month: "long",
      ...(thisYear ? {} : { year: "numeric" }),
      timeZone: "UTC",
    }).format(value);
  }

  /** A time of day for an ISO date-time, in the browser time zone. */
  time(isoDateTime: string): string {
    const value = new Date(isoDateTime);
    if (Number.isNaN(value.getTime())) {
      return isoDateTime;
    }
    return new Intl.DateTimeFormat(this.locale, { hour: "2-digit", minute: "2-digit" }).format(
      value,
    );
  }

  /** A short date and time for an ISO date-time. */
  dateTime(isoDateTime: string): string {
    const value = new Date(isoDateTime);
    if (Number.isNaN(value.getTime())) {
      return isoDateTime;
    }
    return new Intl.DateTimeFormat(this.locale, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(value);
  }

  /** "3 days ago", "yesterday", "in 2 hours" for an ISO date-time. */
  relative(isoDateTime: string, now: Date = new Date()): string {
    const value = new Date(isoDateTime);
    if (Number.isNaN(value.getTime())) {
      return isoDateTime;
    }
    const seconds = (value.getTime() - now.getTime()) / 1000;
    const units: [Intl.RelativeTimeFormatUnit, number][] = [
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60],
    ];
    const formatter = new Intl.RelativeTimeFormat(this.locale, { numeric: "auto" });
    for (const [unit, size] of units) {
      if (Math.abs(seconds) >= size) {
        return formatter.format(Math.round(seconds / size), unit);
      }
    }
    return formatter.format(0, "minute");
  }

  /** A list such as "milk, eggs and bread". */
  list(items: string[]): string {
    return new Intl.ListFormat(this.locale, { type: "conjunction" }).format(items);
  }

  /** A readable sentence for why a product is suggested (spec §6.8). */
  reason(suggestion: Suggestion): string {
    switch (suggestion.reason) {
      case "below_target":
        return this.t("reason_below_target", {
          have: this.number(suggestion.have),
          target: this.number(suggestion.target ?? 0),
        });
      case "stale_zone": {
        const days = suggestion.days ?? 0;
        return this.plural("reason_stale_zone", days, {
          zone: suggestion.zone ?? "",
          days: this.number(days),
        });
      }
      case "finished_recently":
        return this.t("reason_finished_recently", {
          date: suggestion.date ? this.date(suggestion.date) : "",
        });
      default:
        return this.t("reason_unknown");
    }
  }

  /** A translated message for an error from `callWS` or `callService`. */
  error(err: unknown): string {
    const error = (err ?? {}) as HassError;
    const params = error.translation_placeholders ?? {};
    for (const code of [error.translation_key, error.code]) {
      const key = `error_${code}` as StringKey;
      if (code && key in this.strings) {
        return this.t(key, params);
      }
    }
    const message =
      error.message ?? (err instanceof Error ? err.message : typeof err === "string" ? err : "");
    return this.t("error_generic", { message: message || "?" });
  }
}
