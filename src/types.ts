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
  callWS<T>(message: { type: string } & Record<string, unknown>): Promise<T>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<unknown>;
  connection: HassConnection;
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
  | "expiry";

export interface Zone {
  zone_id: string;
  name: string;
  aliases: string[];
  sources: string[];
  updated: string | null;
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

export type SuggestionReason = "below_target" | "stale_zone" | "finished_recently";

export interface Suggestion {
  product_id: number;
  have: number;
  reason: SuggestionReason | string;
  target?: number;
  zone?: string;
  days?: number;
  date?: string;
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
  zone_id: string | null;
  channel: string;
  created: string;
  items: ProposalItem[];
  not_seen: string[];
}

export interface Snapshot {
  api_version: number;
  entry_id: string;
  entities: Partial<Record<EntityKey, string | null>>;
  zones: Zone[];
  products: Product[];
  to_buy: ToBuy[];
  suggestions: Suggestion[];
  expiring: Expiring[];
  shopping_list: ShoppingItem[];
  proposals: Proposal[];
  shopping_mode_until: string | null;
  analyses_today: number;
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

/** Error shape of a rejected `callWS` or `callService`. */
export interface HassError {
  code?: string;
  message?: string;
  translation_key?: string;
  translation_placeholders?: Record<string, string>;
}
