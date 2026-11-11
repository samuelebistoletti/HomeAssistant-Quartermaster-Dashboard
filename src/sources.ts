/**
 * Zone sources as edited by the zone management card: the fields of each
 * source type (from the integration's docs/dashboard-api.md), and the
 * conversion between a source and the text of its form inputs.
 */
import type { SourceType, ZoneSource } from "./types";

export type FieldKind = "entity" | "number" | "text" | "select" | "roi" | "list";

export interface FieldSpec {
  name: string;
  kind: FieldKind;
  /** Entity domains offered as suggestions (entity fields). */
  domains?: string[];
  /** Allowed values (select fields); an empty choice keeps the default. */
  options?: string[];
  min?: number;
  max?: number;
  step?: number | "any";
  integer?: boolean;
  required?: boolean;
}

export const SOURCE_TYPES: SourceType[] = ["camera", "camera_show", "passage", "manual", "ledger"];

/** Sources whose frames can show people: they need the privacy notice. */
export const PRIVACY_SOURCES: ReadonlySet<string> = new Set(["camera_show", "passage"]);

const int = (name: string, min: number, max: number): FieldSpec => ({
  name,
  kind: "number",
  integer: true,
  min,
  max,
  step: 1,
});
const decimal = (name: string, min: number, max: number): FieldSpec => ({
  name,
  kind: "number",
  min,
  max,
  step: "any",
});

const CAMERA_ENTITY: FieldSpec = {
  name: "entity_id",
  kind: "entity",
  domains: ["camera"],
  required: true,
};
const ROI: FieldSpec = { name: "roi", kind: "roi" };

const WATCH: FieldSpec[] = [
  CAMERA_ENTITY,
  { name: "trigger_entity", kind: "entity", domains: ["event", "binary_sensor"], required: true },
  ROI,
  { name: "capture", kind: "select", options: ["auto", "burst", "clip"] },
  decimal("window_seconds", 1, 30),
  decimal("burst_interval_seconds", 0.2, 5),
  int("max_frames_to_model", 1, 8),
  int("cooldown_seconds", 0, 3600),
  int("max_per_day", 1, 500),
  decimal("min_confidence", 0, 1),
  { name: "hours", kind: "text" },
  { name: "announce", kind: "list", domains: ["notify"] },
];

export const SOURCE_FIELDS: Record<SourceType, FieldSpec[]> = {
  camera: [
    CAMERA_ENTITY,
    ROI,
    int("max_age_minutes", 1, 1440),
    int("max_checks_per_day", 1, 96),
    { name: "trigger_entity", kind: "entity", domains: ["binary_sensor"] },
    { name: "trigger_state", kind: "select", options: ["off", "on"] },
    int("trigger_delay_seconds", 0, 120),
    int("min_interval_minutes", 1, 1440),
  ],
  camera_show: [
    ...WATCH,
    { name: "active", kind: "select", options: ["when_armed", "always"] },
    int("arm_minutes", 1, 240),
  ],
  passage: [...WATCH, int("match_window_seconds", 10, 3600)],
  manual: [],
  // Kept by word (a chest freezer): a guided check every check_days, 0 = on request.
  ledger: [int("check_days", 0, 365)],
};

export function fieldsFor(type: string): FieldSpec[] {
  return SOURCE_FIELDS[type as SourceType] ?? [];
}

/** A source being edited: the original object and the text of each input. */
export interface SourceDraft {
  base: ZoneSource;
  text: Record<string, string>;
}

function toText(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.map(String).join(", ");
  }
  return String(value);
}

export function draftSource(source: ZoneSource): SourceDraft {
  const text: Record<string, string> = {};
  for (const field of fieldsFor(source.type)) {
    text[field.name] = toText(source[field.name]);
  }
  return { base: { ...source }, text };
}

/** Split a comma separated list, dropping empty items. */
export function splitList(text: string): string[] {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** Parse "x1, y1, x2, y2" (fractions); `undefined` when not valid. */
export function parseRoi(text: string): number[] | undefined {
  const parts = splitList(text);
  const roi = parts.map((part) => Number(part.replace(/\s/g, "")));
  if (roi.length !== 4 || roi.some((v) => !Number.isFinite(v) || v < 0 || v > 1)) {
    return undefined;
  }
  if (roi[0] >= roi[2] || roi[1] >= roi[3]) {
    return undefined;
  }
  return roi;
}

export function parseNumber(text: string): number | undefined {
  const value = Number(text.trim().replace(",", "."));
  return text.trim() !== "" && Number.isFinite(value) ? value : undefined;
}

export type SourceProblem =
  | { problem: "required"; field: string }
  | { problem: "invalid_number"; field: string }
  | { problem: "invalid_roi"; field: string };

/**
 * Build the source to send to `set_zone`. Fields this editor does not know
 * are kept as they were; an empty input removes the field, so the
 * integration applies its default.
 */
export function buildSource(draft: SourceDraft): ZoneSource | SourceProblem {
  const source: ZoneSource = { ...draft.base };
  const cleared = new Set<string>();
  for (const field of fieldsFor(draft.base.type)) {
    const text = (draft.text[field.name] ?? "").trim();
    if (!text) {
      if (field.required) {
        return { problem: "required", field: field.name };
      }
      cleared.add(field.name);
      continue;
    }
    switch (field.kind) {
      case "number": {
        const value = parseNumber(text);
        if (value === undefined || (field.integer && !Number.isInteger(value))) {
          return { problem: "invalid_number", field: field.name };
        }
        source[field.name] = value;
        break;
      }
      case "roi": {
        const roi = parseRoi(text);
        if (!roi) {
          return { problem: "invalid_roi", field: field.name };
        }
        source[field.name] = roi;
        break;
      }
      case "list":
        source[field.name] = splitList(text);
        break;
      default:
        source[field.name] = text;
    }
  }
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => !cleared.has(key)),
  ) as ZoneSource;
}

export function isProblem(value: ZoneSource | SourceProblem): value is SourceProblem {
  return "problem" in value;
}
