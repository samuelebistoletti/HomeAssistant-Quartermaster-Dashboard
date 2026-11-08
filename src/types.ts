/**
 * Types for the documented parts of `hass` and for the integration's
 * dashboard API (version 1, see docs/dashboard-api.md in the integration).
 */

/** Integration domain whose actions and websocket commands are used. */
export const DOMAIN = "quartermaster";

/** Dashboard API version this frontend understands. */
export const API_VERSION = 1;

export type Unsubscribe = () => Promise<void> | void;

export interface HassConnection {
  subscribeMessage<T>(
    callback: (message: T) => void,
    message: { type: string } & Record<string, unknown>,
  ): Promise<Unsubscribe>;
}

/** The documented members of the `hass` object this code reads. */
export interface HomeAssistant {
  language: string;
  config: { components: string[] };
  user?: { name?: string; is_admin?: boolean };
  /** States of all entities, keyed by entity id (used for entity suggestions). */
  states?: Record<string, HassEntity>;
  callWS<T>(message: { type: string } & Record<string, unknown>): Promise<T>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<unknown>;
  connection: HassConnection;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: { friendly_name?: string } & Record<string, unknown>;
}

export type EntityKey =
  | "shopping_list"
  | "to_buy"
  | "suggestions"
  | "expiring"
  | "pending_proposals"
  | "analyses_today"
  | "start_shopping"
  | "undo_last"
  | "update_mode"
  | "expiry"
  | "photo_requests";

/** Source types a zone can have. */
export type SourceType = "camera" | "camera_show" | "passage" | "manual";

/** One zone source with every field `set_zone` accepts. */
export type ZoneSource = { type: SourceType | string } & Record<string, unknown>;

export interface ZoneCheck {
  ts: string;
  status: "updated" | "photo_requested" | "failed" | string;
  reason?: string | null;
  overall_confidence?: number | null;
}

export interface LastShow {
  product: string | null;
  action?: string | null;
  quantity?: number | null;
  confidence?: number | null;
  status?: string | null;
  ts: string;
}

/**
 * A zone. Everything after `updated` was added after version 1 and may be
 * missing with older integrations.
 */
export interface Zone {
  zone_id: string;
  name: string;
  aliases: string[];
  sources: string[];
  updated: string | null;
  source_details?: ZoneSource[];
  check_schedule?: string | null;
  reminder_days?: number | null;
  confidence_threshold?: number | null;
  has_image?: boolean;
  last_check?: ZoneCheck | null;
  in_error?: boolean;
  show_armed_until?: string | null;
  last_show?: LastShow | null;
}

export interface PhotoRequest {
  request_id: string | number;
  zone_id: string;
  reason?: string | null;
  created: string;
}

export interface StockLevel {
  zone_id: string;
  quantity: number;
  best_before: string | null;
  updated: string | null;
}

export interface Product {
  product_id: number;
  name: string;
  aliases: string[];
  category: string | null;
  unit: string | null;
  default_zone_id: string | null;
  essential: boolean;
  min_stock: number | null;
  target_stock: number | null;
  total: number;
  stock: StockLevel[];
}

export interface ToBuy {
  product_id: number;
  have: number;
  quantity: number;
}

export type SuggestionReason =
  | "below_target"
  | "stale_zone"
  | "finished_recently"
  | "running_out";

export interface Suggestion {
  product_id: number;
  have: number;
  reason: SuggestionReason | string;
  target?: number;
  zone?: string;
  days?: number;
  date?: string;
  days_left?: number;
  per_day?: number;
}

export interface Expiring {
  product_id: number;
  zone_id: string;
  quantity: number;
  best_before: string;
  days_left: number;
}

export interface ShoppingItem {
  item_id: number;
  text: string;
  product_id: number | null;
  quantity: number | null;
  origin: "auto" | "suggestion" | "manual";
  done: boolean;
}

export interface ProposalItem {
  key: number;
  product_id: number | null;
  product: string | null;
  seen_as: string;
  current: number | null;
  proposed: number;
  unit: string | null;
  confidence: number;
  notes?: string | null;
}

export interface Proposal {
  proposal_id: number;
  /** `count` (photos, cameras) or `purchase` (receipts); missing means count. */
  kind?: "count" | "purchase" | string;
  zone_id: string | null;
  channel: string;
  created: string;
  has_image?: boolean;
  items: ProposalItem[];
  not_seen: string[];
}

export interface Snapshot {
  api_version: number;
  entry_id: string;
  entities: Partial<Record<EntityKey, string | null>>;
  zones: Zone[];
  photo_requests?: PhotoRequest[];
  products: Product[];
  to_buy: ToBuy[];
  suggestions: Suggestion[];
  expiring: Expiring[];
  shopping_list: ShoppingItem[];
  proposals: Proposal[];
  shopping_mode_until: string | null;
  analyses_today: number;
  daily_analysis_limit?: number;
  can_write: boolean;
}

export interface JournalEntry {
  id: number;
  operation_id: string | null;
  ts: string;
  product_id: number | null;
  product: string | null;
  zone_id: string | null;
  zone: string | null;
  kind: string;
  delta: number;
  quantity_after: number;
  channel: string;
  undone: boolean;
}

export interface PhotoResult {
  reused_previous?: boolean;
  image_usable: boolean;
  overall_confidence?: number;
  image_issues?: string[];
  applied: ProposalItem[];
  proposal_id: number | null;
  proposed: ProposalItem[];
  not_seen: string[];
  unknown: string[];
}

/** Result of a receipt upload (`kind: "receipt"`). */
export interface ReceiptResult {
  proposal_id: number | null;
  items: ProposalItem[];
  unknown: string[];
}

/** Result of `quartermaster/image`. */
export interface ImageData {
  content_type: string;
  data: string;
}

/** Error shape of a rejected `callWS` or `callService`. */
export interface HassError {
  code?: string;
  message?: string;
  translation_key?: string;
  translation_placeholders?: Record<string, string>;
}
