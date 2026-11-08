import { html, nothing } from "lit";
import { state } from "lit/decorators.js";

import type { Product, Snapshot, StockLevel, Zone } from "../types";
import { configForm, defineCard, QuartermasterCard, TITLE_FIELD, ZONE_FIELD } from "./base";

export const INVENTORY_CARD = "quartermaster-inventory-card";

/** Products by zone with plus and minus, set quantity and a new-product form. */
export class QuartermasterInventoryCard extends QuartermasterCard {
  protected readonly titleKey = "card_inventory" as const;

  /** `<product_id>@<zone_id>` of the row whose quantity is being set. */
  @state() private editing?: string;
  @state() private adding = false;

  static getStubConfig() {
    return {};
  }

  static getConfigForm() {
    return configForm([TITLE_FIELD, ZONE_FIELD]);
  }

  private value(name: string): string {
    return (
      this.renderRoot.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)
        ?.value ?? ""
    );
  }

  private checked(name: string): boolean {
    return this.renderRoot.querySelector<HTMLInputElement>(`[name="${name}"]`)?.checked ?? false;
  }

  private adjust(product: Product, zone: Zone, operation: "purchase" | "consume") {
    return this.action("adjust_stock", {
      product: String(product.product_id),
      operation,
      quantity: 1,
      zone: zone.zone_id,
    });
  }

  private async setQuantity(product: Product, zone: Zone): Promise<void> {
    const quantity = Number(this.value("set-quantity").replace(",", "."));
    if (!Number.isFinite(quantity) || quantity < 0) {
      this.showError(this.l.t("error_invalid_quantity", { quantity: this.value("set-quantity") }));
      return;
    }
    if (
      await this.action("set_stock", {
        product: String(product.product_id),
        quantity,
        zone: zone.zone_id,
      })
    ) {
      this.editing = undefined;
    }
  }

  private async addProduct(): Promise<void> {
    const name = this.value("new-name").trim();
    if (!name) {
      this.showError(this.l.t("name_required"));
      return;
    }
    const zone = this.value("new-zone");
    const unit = this.value("new-unit").trim();
    const quantity = Number(this.value("new-quantity").replace(",", ".") || "0");
    const essential = this.checked("new-essential");
    const min = Number(this.value("new-min").replace(",", ".") || "1");
    const data: Record<string, unknown> = { name, essential };
    if (zone) {
      data.default_zone = zone;
    }
    if (unit) {
      data.unit = unit;
    }
    if (essential) {
      data.min_stock = Number.isFinite(min) ? min : 1;
    }
    if (!(await this.action("add_product", data, this.l.t("product_added", { product: name })))) {
      return;
    }
    if (zone && Number.isFinite(quantity) && quantity > 0) {
      await this.action(
        "set_stock",
        { product: name, quantity, zone },
        this.l.t("product_added", { product: name }),
      );
    }
    this.adding = false;
  }

  private renderRow(product: Product, level: StockLevel, zone: Zone) {
    const id = `${product.product_id}@${zone.zone_id}`;
    const details = [this.amount(level.quantity, product.unit)];
    if (level.best_before) {
      details.push(this.l.t("best_before", { date: this.l.date(level.best_before) }));
    }
    return html`
      <li class="wrap" data-product=${product.product_id}>
        <div class="grow">
          <div class="name">${product.name}</div>
          <div class="secondary">${details.join(" · ")}</div>
        </div>
        ${this.canWrite
          ? html`
              <button class="icon minus" aria-label=${this.l.t("decrease", { product: product.name })}
                ?disabled=${this.busy || level.quantity <= 0}
                @click=${() => this.adjust(product, zone, "consume")}>−</button>
              <button class="icon plus" aria-label=${this.l.t("increase", { product: product.name })}
                ?disabled=${this.busy} @click=${() => this.adjust(product, zone, "purchase")}>+</button>
              <button class="icon edit" aria-label=${`${this.l.t("set_quantity")}: ${product.name}`}
                title=${this.l.t("set_quantity")}
                @click=${() => (this.editing = this.editing === id ? undefined : id)}>✎</button>
            `
          : nothing}
        ${this.editing === id && this.canWrite
          ? html`<div class="form full">
              <label>
                ${this.l.t("quantity")}
                <input name="set-quantity" type="number" inputmode="decimal" min="0" step="any"
                  .value=${String(level.quantity)} />
              </label>
              <button class="primary" ?disabled=${this.busy}
                @click=${() => this.setQuantity(product, zone)}>${this.l.t("save")}</button>
              <button @click=${() => (this.editing = undefined)}>${this.l.t("cancel")}</button>
            </div>`
          : nothing}
      </li>
    `;
  }

  private renderZone(zone: Zone, snapshot: Snapshot, showHeading: boolean) {
    const rows = snapshot.products
      .flatMap((product) =>
        product.stock
          .filter((level) => level.zone_id === zone.zone_id)
          .map((level) => ({ product, level })),
      )
      .sort((a, b) => a.product.name.localeCompare(b.product.name, this.l.locale));
    return html`
      ${showHeading ? html`<h3>${zone.name}</h3>` : nothing}
      ${rows.length
        ? html`<ul class="rows">${rows.map(({ product, level }) => this.renderRow(product, level, zone))}</ul>`
        : html`<p class="muted">${this.l.t("inventory_empty")}</p>`}
    `;
  }

  private renderAdd(snapshot: Snapshot) {
    if (!this.adding) {
      return html`<div class="actions">
        <button class="new-product" @click=${() => (this.adding = true)}>${this.l.t("new_product")}</button>
      </div>`;
    }
    const zone = this.config.zone;
    return html`
      <h3>${this.l.t("new_product")}</h3>
      <div class="form">
        <label>${this.l.t("name")}<input name="new-name" type="text" autocomplete="off" /></label>
        <label>
          ${this.l.t("default_zone")}
          <select name="new-zone">
            <option value="">–</option>
            ${snapshot.zones.map(
              (z) => html`<option value=${z.zone_id} ?selected=${z.zone_id === zone}>${z.name}</option>`,
            )}
          </select>
        </label>
        <label>${this.l.t("unit")}<input name="new-unit" type="text" autocomplete="off" /></label>
        <label>
          ${this.l.t("initial_quantity")}
          <input name="new-quantity" type="number" inputmode="decimal" min="0" step="any" value="0" />
        </label>
        <label class="inline"><input name="new-essential" type="checkbox" />${this.l.t("essential")}</label>
        <label>
          ${this.l.t("min_stock")}
          <input name="new-min" type="number" inputmode="decimal" min="0" step="any" value="1" />
        </label>
        <button class="primary" ?disabled=${this.busy} @click=${() => this.addProduct()}>
          ${this.l.t("add")}
        </button>
        <button @click=${() => (this.adding = false)}>${this.l.t("cancel")}</button>
      </div>
    `;
  }

  protected renderContent(snapshot: Snapshot) {
    const zones = this.config.zone
      ? snapshot.zones.filter((zone) => zone.zone_id === this.config.zone)
      : snapshot.zones;
    if (this.config.zone && !zones.length) {
      return html`<p class="error">${this.l.t("error_zone_not_found", { zone: this.config.zone })}</p>`;
    }
    return html`
      ${zones.map((zone) => this.renderZone(zone, snapshot, !this.config.zone))}
      ${this.canWrite ? this.renderAdd(snapshot) : nothing}
    `;
  }
}

defineCard(
  INVENTORY_CARD,
  QuartermasterInventoryCard,
  "card_inventory",
  "card_inventory_description",
);
