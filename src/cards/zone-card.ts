import { html, nothing } from "lit";

import type { StringKey } from "../localize";
import type { Snapshot } from "../types";
import {
  configForm,
  defineCard,
  pageLocalizer,
  QuartermasterCard,
  type QuartermasterCardConfig,
  ZONE_FIELD,
} from "./base";

export const ZONE_CARD = "quartermaster-zone-card";

/** One zone: last update, sources and the products it holds. */
export class QuartermasterZoneCard extends QuartermasterCard {
  protected readonly titleKey = "card_zone" as const;

  static getStubConfig() {
    return { zone: "" };
  }

  static getConfigForm() {
    return configForm([ZONE_FIELD], true);
  }

  setConfig(config: QuartermasterCardConfig): void {
    if (!config?.zone) {
      throw new Error(pageLocalizer().t("zone_required"));
    }
    super.setConfig(config);
  }

  getGridOptions() {
    return { columns: 12, min_columns: 3, rows: "auto" };
  }

  protected hasWriteControls(): boolean {
    return false;
  }

  protected cardTitle(): string {
    if (this.config.title) {
      return this.config.title;
    }
    return this.snapshot ? this.zoneName(this.config.zone) : this.l.t(this.titleKey);
  }

  protected renderContent(snapshot: Snapshot) {
    const zone = snapshot.zones.find((z) => z.zone_id === this.config.zone);
    if (!zone) {
      return html`<p class="error">${this.l.t("error_zone_not_found", { zone: this.config.zone ?? "" })}</p>`;
    }
    const sources = zone.sources.map((source) => {
      const key = `source_${source}` as StringKey;
      return key in this.l.strings ? this.l.t(key) : source;
    });
    const rows = snapshot.products
      .flatMap((product) =>
        product.stock
          .filter((level) => level.zone_id === zone.zone_id && level.quantity > 0)
          .map((level) => ({ product, level })),
      )
      .sort((a, b) => a.product.name.localeCompare(b.product.name, this.l.locale));
    return html`
      <p class="secondary updated">
        ${zone.updated
          ? this.l.t("zone_updated", { time: this.l.relative(zone.updated) })
          : this.l.t("zone_never_updated")}
        ${sources.length ? html` · ${sources.join(", ")}` : nothing}
      </p>
      ${rows.length
        ? html`<ul class="rows">
            ${rows.map(
              ({ product, level }) => html`<li>
                <span class="grow name">${product.name}</span>
                <span class="secondary">${this.amount(level.quantity, product.unit)}</span>
              </li>`,
            )}
          </ul>`
        : html`<p class="muted">${this.l.t("inventory_empty")}</p>`}
    `;
  }
}

defineCard(ZONE_CARD, QuartermasterZoneCard, "card_zone", "card_zone_description");
