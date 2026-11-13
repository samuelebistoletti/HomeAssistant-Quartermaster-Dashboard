import type { HomeAssistant, JournalEntry, Snapshot, Zone } from "../src/types";

export const YEAR = new Date().getFullYear();

const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

/** A zone with every field added after API version 1 (camera and camera_show sources). */
export function shelfZone(overrides: Partial<Zone> = {}): Zone {
  return {
    zone_id: "shelf",
    name: "Scaffale",
    aliases: ["mensola"],
    sources: ["camera", "camera_show", "manual"],
    source_details: [
      { type: "camera", entity_id: "camera.garage", roi: [0, 0, 0.5, 1] },
      { type: "camera_show", entity_id: "camera.garage", trigger_entity: "binary_sensor.garage_motion", arm_minutes: 10, future_field: "kept" },
      { type: "manual" },
    ],
    check_schedule: "0 19 * * *",
    reminder_days: null,
    confidence_threshold: 0.7,
    has_image: true,
    updated: daysAgo(1),
    last_check: { ts: daysAgo(1), status: "updated", reason: null, overall_confidence: 0.82 },
    in_error: false,
    show_armed_until: new Date(Date.now() + 600000).toISOString(),
    last_show: { product: "Pasta", action: "consume", quantity: 1, confidence: 0.9, status: "applied", ts: daysAgo(0.1) },
    ...overrides,
  };
}

/** A sample snapshot as returned by `quartermaster/snapshot` (API 1), Italian entity ids. */
export function sampleSnapshot(overrides: Partial<Snapshot> = {}): Snapshot {
  return {
    api_version: 1,
    entry_id: "entry1",
    entities: {
      shopping_list: "todo.quartermaster_lista_della_spesa",
      to_buy: "sensor.quartermaster_da_comprare",
      suggestions: "sensor.quartermaster_suggerimenti_spesa",
      expiring: "sensor.quartermaster_prodotti_in_scadenza",
      pending_proposals: "sensor.quartermaster_proposte_in_attesa",
      analyses_today: "sensor.quartermaster_analisi_del_giorno",
      start_shopping: "button.quartermaster_vado_a_fare_la_spesa",
      undo_last: "button.quartermaster_annulla_ultimo_movimento",
      update_mode: "select.quartermaster_modalita_aggiornamento",
      expiry: "calendar.quartermaster_scadenze",
      photo_requests: "sensor.quartermaster_foto_richieste",
    },
    zones: [
      { zone_id: "fridge", name: "Frigo", aliases: [], sources: ["manual"], updated: daysAgo(9) },
      { zone_id: "pantry", name: "Dispensa", aliases: [], sources: ["camera", "manual"], updated: null },
    ],
    products: [
      {
        product_id: 1,
        name: "Latte",
        aliases: [],
        category: null,
        unit: "bottiglia",
        default_zone_id: "fridge",
        essential: true,
        min_stock: 2,
        target_stock: 4,
        total: 1,
        stock: [{ zone_id: "fridge", quantity: 1, best_before: `${YEAR}-11-20`, updated: daysAgo(9) }],
      },
      {
        product_id: 2,
        name: "Caffè",
        aliases: [],
        category: null,
        unit: null,
        default_zone_id: "pantry",
        essential: true,
        min_stock: 1,
        target_stock: 4,
        total: 1,
        stock: [{ zone_id: "pantry", quantity: 1, best_before: null, updated: daysAgo(1) }],
      },
      {
        product_id: 3,
        name: "Uova",
        aliases: [],
        category: null,
        unit: null,
        default_zone_id: "fridge",
        essential: false,
        min_stock: null,
        target_stock: null,
        total: 0,
        stock: [{ zone_id: "fridge", quantity: 0, best_before: null, updated: daysAgo(6) }],
      },
      {
        product_id: 4,
        name: "Pasta",
        aliases: [],
        category: null,
        unit: null,
        default_zone_id: "pantry",
        essential: true,
        min_stock: 1,
        target_stock: 2,
        total: 3,
        stock: [{ zone_id: "pantry", quantity: 3, best_before: null, updated: daysAgo(2) }],
      },
    ],
    to_buy: [{ product_id: 1, have: 1, quantity: 3 }],
    suggestions: [
      { product_id: 2, have: 1, reason: "below_target", target: 4 },
      { product_id: 4, have: 3, reason: "stale_zone", zone: "Frigo", days: 9 },
      { product_id: 3, have: 0, reason: "finished_recently", date: `${YEAR}-11-02` },
    ],
    expiring: [],
    shopping_list: [],
    proposals: [
      {
        proposal_id: 7,
        zone_id: "fridge",
        channel: "dashboard",
        created: daysAgo(0.01),
        items: [
          {
            key: 0,
            product_id: 1,
            product: "Latte",
            seen_as: "latte intero",
            current: 1,
            proposed: 2,
            unit: "bottiglia",
            confidence: 0.9,
            notes: null,
          },
          {
            key: 1,
            product_id: null,
            product: null,
            seen_as: "yogurt",
            current: null,
            proposed: 3,
            unit: null,
            confidence: 0.6,
            notes: null,
          },
        ],
        not_seen: ["Burro"],
      },
    ],
    photo_requests: [{ request_id: "r1", zone_id: "shelf", reason: "stale", created: daysAgo(0.2) }],
    shopping_mode_until: null,
    analyses_today: 2,
    daily_analysis_limit: 50,
    can_write: true,
    ...overrides,
  };
}

export const sampleJournal: JournalEntry[] = [
  {
    id: 12,
    operation_id: "op-b",
    ts: daysAgo(0.1),
    product_id: 1,
    product: "Latte",
    zone_id: "fridge",
    zone: "Frigo",
    kind: "consume",
    delta: -1,
    quantity_after: 1,
    channel: "alexa",
    undone: false,
  },
  {
    id: 11,
    operation_id: "op-a",
    ts: daysAgo(1),
    product_id: 4,
    product: "Pasta",
    zone_id: "pantry",
    zone: "Dispensa",
    kind: "purchase",
    delta: 2,
    quantity_after: 3,
    channel: "dashboard",
    undone: true,
  },
];

export interface StubCalls {
  /** Action calls; their `channel` is kept apart, in `channels`. */
  services: { domain: string; service: string; data: Record<string, unknown> }[];
  /** The `channel` of each action call, in the same order (`undefined` when not sent). */
  channels: unknown[];
  ws: Record<string, unknown>[];
  subscribed: number;
  unsubscribed: number;
}

export interface Stub {
  hass: HomeAssistant;
  calls: StubCalls;
  /** Push a new snapshot to the subscribers. */
  push(snapshot: Snapshot): void;
}

/** A stub `hass` with callWS, callService and connection.subscribeMessage mocks. */
export function stubHass(
  options: {
    language?: string;
    snapshot?: Snapshot;
    subscribeError?: unknown;
    serviceError?: unknown;
    ws?: (message: Record<string, unknown>) => unknown;
  } = {},
): Stub {
  const calls: StubCalls = { services: [], channels: [], ws: [], subscribed: 0, unsubscribed: 0 };
  const callbacks = new Set<(snapshot: Snapshot) => void>();
  const snapshot = options.snapshot ?? sampleSnapshot();
  const hass = {
    language: options.language ?? "en",
    config: { components: ["quartermaster"] },
    user: { name: "Test", is_admin: snapshot.can_write },
    states: Object.fromEntries(
      ["camera.garage", "binary_sensor.garage_motion", "event.doorbell", "notify.phone", "light.ceiling"].map(
        (entity_id) => [entity_id, { entity_id, state: "on", attributes: { friendly_name: entity_id } }],
      ),
    ),
    async callWS<T>(message: Record<string, unknown>): Promise<T> {
      calls.ws.push(message);
      if (options.ws) {
        return (await options.ws(message)) as T;
      }
      if (message.type === "quartermaster/journal") {
        return { entries: sampleJournal } as T;
      }
      return snapshot as T;
    },
    async callService(domain: string, service: string, data: Record<string, unknown> = {}) {
      const { channel, ...rest } = data;
      calls.services.push({ domain, service, data: rest });
      calls.channels.push(channel);
      if (options.serviceError) {
        throw options.serviceError;
      }
      return undefined;
    },
    connection: {
      async subscribeMessage<T>(callback: (message: T) => void) {
        calls.subscribed += 1;
        if (options.subscribeError) {
          throw options.subscribeError;
        }
        const cb = callback as unknown as (s: Snapshot) => void;
        callbacks.add(cb);
        setTimeout(() => cb(snapshot), 0);
        return () => {
          calls.unsubscribed += 1;
          callbacks.delete(cb);
        };
      },
    },
  } as unknown as HomeAssistant;
  return { hass, calls, push: (s) => callbacks.forEach((cb) => cb(s)) };
}

/** Return a value that the test expects to exist, failing clearly otherwise. */
export function must<T>(value: T | null | undefined, what = "value"): T {
  if (value === null || value === undefined) {
    throw new Error(`Missing ${what}`);
  }
  return value;
}
