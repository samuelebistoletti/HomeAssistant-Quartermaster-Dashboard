import { Localizer } from "./localize";
import {
  API_VERSION,
  DOMAIN,
  type EntityKey,
  type HassError,
  type HomeAssistant,
  type Snapshot,
} from "./types";

/** Integration domain whose presence the dashboard requires. */
export const INTEGRATION_DOMAIN = DOMAIN;

/** Strategy type, as used in `strategy: { type: custom:quartermaster }`. */
export const STRATEGY_TYPE = "quartermaster";

/** Custom card element names (without `custom:`). */
export const CARD = {
  suggestions: "quartermaster-suggestions-card",
  essentials: "quartermaster-essentials-card",
  proposals: "quartermaster-proposals-card",
  inventory: "quartermaster-inventory-card",
  history: "quartermaster-history-card",
  zone: "quartermaster-zone-card",
  photo: "quartermaster-photo-card",
  zones: "quartermaster-zones-card",
} as const;

/** The parts of `hass` the strategy reads. */
export type StrategyHass = Pick<HomeAssistant, "language" | "config" | "callWS">;

export interface StrategyConfig {
  title?: string;
}

export type CardConfig = Record<string, unknown> & { type: string };

export interface SectionConfig {
  type: "grid";
  cards: CardConfig[];
}

export interface ViewConfig {
  title: string;
  path: string;
  icon?: string;
  type: "sections";
  sections: SectionConfig[];
}

export interface DashboardConfig {
  title: string;
  views: ViewConfig[];
}

const VIEW_ICONS = {
  overview: "mdi:view-dashboard-outline",
  shopping: "mdi:cart-outline",
  essentials: "mdi:star-outline",
  zones: "mdi:fridge-outline",
  proposals: "mdi:check-decagram-outline",
  inventory: "mdi:package-variant-closed",
  expiry: "mdi:calendar-clock",
  history: "mdi:history",
} as const;

type ViewPath = keyof typeof VIEW_ICONS;

/**
 * Absolute path of a view of this dashboard. Views live at
 * `/<dashboard url>/<view path>`; the dashboard url is not passed to
 * strategies, so it is read from the page address.
 */
export function viewPath(view: ViewPath, pathname: string = window.location.pathname): string {
  const dashboard = pathname.split("/").filter(Boolean)[0] ?? "lovelace";
  return `/${dashboard}/${view}`;
}

function messageDashboard(title: string, view: string, content: string): DashboardConfig {
  return {
    title,
    views: [
      {
        title: view,
        path: "overview",
        type: "sections",
        sections: [{ type: "grid", cards: [{ type: "markdown", content }] }],
      },
    ],
  };
}

const heading = (text: string): CardConfig => ({ type: "heading", heading: text });

export class QuartermasterDashboardStrategy extends HTMLElement {
  static async generate(
    config: StrategyConfig,
    hass: StrategyHass,
  ): Promise<DashboardConfig> {
    const l = new Localizer(hass.language);
    const title = config.title ?? l.t("title");
    if (!hass.config.components.includes(INTEGRATION_DOMAIN)) {
      return messageDashboard(title, l.t("title"), l.t("missing_integration"));
    }
    let snapshot: Snapshot;
    try {
      snapshot = await hass.callWS<Snapshot>({ type: `${DOMAIN}/snapshot` });
    } catch (err) {
      const code = (err as HassError | undefined)?.code;
      const key = code === "unknown_command" ? "too_old" : "not_loaded";
      return messageDashboard(title, l.t("title"), l.t(key));
    }
    if (snapshot.api_version !== API_VERSION) {
      return messageDashboard(
        title,
        l.t("title"),
        l.t("incompatible", { version: String(snapshot.api_version) }),
      );
    }
    return { title, views: buildViews(snapshot, l) };
  }
}

/** Build every view from a snapshot. Exported for tests. */
export function buildViews(snapshot: Snapshot, l: Localizer): ViewConfig[] {
  const entity = (key: EntityKey): string | undefined => snapshot.entities[key] ?? undefined;
  const view = (path: ViewPath, title: string, sections: SectionConfig[]): ViewConfig => ({
    title,
    path,
    icon: VIEW_ICONS[path],
    type: "sections",
    sections,
  });
  const custom = (card: string, extra: Record<string, unknown> = {}): CardConfig => ({
    type: `custom:${card}`,
    ...extra,
  });
  const zones = snapshot.zones;
  const noZones: SectionConfig = {
    type: "grid",
    cards: [{ type: "markdown", content: l.t("no_zones") }],
  };

  // Overview: counts as native tiles, a tap opens the matching view.
  const tile = (
    key: "to_buy" | "suggestions" | "expiring" | "pending_proposals" | "photo_requests",
    target: ViewPath,
  ): CardConfig[] => {
    const id = entity(key);
    return id
      ? [
          {
            type: "tile",
            entity: id,
            name: l.t(`tile_${key}`),
            tap_action: { action: "navigate", navigation_path: viewPath(target) },
            grid_options: { columns: 6 },
          },
        ]
      : [];
  };
  const overviewCards: CardConfig[] = [
    heading(l.t("overview_heading")),
    ...tile("to_buy", "shopping"),
    ...tile("suggestions", "shopping"),
    ...tile("expiring", "expiry"),
    ...tile("photo_requests", "zones"),
    ...tile("pending_proposals", "proposals"),
  ];
  // AI usage: analyses (the integration has no cost data), with the daily limit.
  const analyses = entity("analyses_today");
  if (analyses) {
    const limit = snapshot.daily_analysis_limit;
    overviewCards.push({
      type: "tile",
      entity: analyses,
      name:
        typeof limit === "number"
          ? l.t("tile_analyses_limit", { limit: l.number(limit) })
          : l.t("tile_analyses"),
      icon: "mdi:image-search-outline",
      grid_options: { columns: 6 },
    });
  }
  const startShopping = entity("start_shopping");
  if (startShopping && snapshot.can_write) {
    overviewCards.push({
      type: "button",
      entity: startShopping,
      name: l.t("go_shopping"),
      icon: "mdi:cart-arrow-right",
      show_state: false,
      tap_action: {
        action: "perform-action",
        perform_action: "button.press",
        target: { entity_id: startShopping },
      },
    });
  }

  const shoppingList = entity("shopping_list");
  const shoppingSections: SectionConfig[] = [];
  if (shoppingList) {
    shoppingSections.push({
      type: "grid",
      cards: [heading(l.t("view_shopping")), { type: "todo-list", entity: shoppingList }],
    });
  }
  shoppingSections.push({ type: "grid", cards: [custom(CARD.suggestions)] });

  const zoneSections: SectionConfig[] = zones.map((zone) => ({
    type: "grid",
    cards: [
      custom(CARD.zone, { zone: zone.zone_id }),
      ...(snapshot.can_write ? [custom(CARD.photo, { zone: zone.zone_id })] : []),
    ],
  }));
  // Zones are created, edited and removed from the dashboard by writers.
  const zoneManagement: SectionConfig[] = snapshot.can_write
    ? [{ type: "grid", cards: [custom(CARD.zones)] }]
    : [];

  const inventorySections: SectionConfig[] = zones.length
    ? zones.map((zone) => ({
        type: "grid",
        cards: [custom(CARD.inventory, { zone: zone.zone_id, title: zone.name })],
      }))
    : [{ type: "grid", cards: [custom(CARD.inventory)] }];

  const expiry = entity("expiry");
  const expirySections: SectionConfig[] = expiry
    ? [
        {
          type: "grid",
          cards: [{ type: "calendar", entities: [expiry], initial_view: "listWeek" }],
        },
      ]
    : [];

  return [
    view("overview", l.t("view_overview"), [{ type: "grid", cards: overviewCards }]),
    view("shopping", l.t("view_shopping"), shoppingSections),
    view("essentials", l.t("view_essentials"), [
      { type: "grid", cards: [custom(CARD.essentials)] },
    ]),
    view("zones", l.t("view_zones"), [
      ...(zones.length ? zoneSections : [noZones]),
      ...zoneManagement,
    ]),
    view("proposals", l.t("view_proposals"), [{ type: "grid", cards: [custom(CARD.proposals)] }]),
    view("inventory", l.t("view_inventory"), inventorySections),
    view("expiry", l.t("view_expiry"), expirySections),
    view("history", l.t("view_history"), [{ type: "grid", cards: [custom(CARD.history)] }]),
  ];
}
