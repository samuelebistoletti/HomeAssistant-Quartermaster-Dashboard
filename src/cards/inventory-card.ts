import { html, nothing } from "lit";
import { state } from "lit/decorators.js";

import type { Product, Snapshot, StockLevel, Zone } from "../types";
import { configForm, defineCard, QuartermasterCard, TITLE_FIELD, ZONE_FIELD } from "./base";

export const INVENTORY_CARD = "quartermaster-inventory-card";

interface Row {
  product: Product;
  level: StockLevel;
}

/**
 * Products by zone with plus and minus, a new-product form and, per row,
 * the quantity and best-before date, the product's details, a move to
 * another zone and archiving. Archived products can be brought back.
 */
export class QuartermasterInventoryCard extends QuartermasterCard {
  protected readonly titleKey = "card_inventory" as const;

  /** `<product_id>@<zone_id>` of the row being edited (`@` alone: no zone). */
  @state() private editing?: string;
  @state() private adding = false;
  /** Product waiting for the second tap that archives it. */
  @state() private archiving?: number;

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

  private number(name: string): number {
    return Number(this.value(name).replace(",", "."));
  }

  private adjust(product: Product, zone: Zone, operation: "purchase" | "consume") {
    return this.action("adjust_stock", {
      product: String(product.product_id),
      operation,
      quantity: 1,
      zone: zone.zone_id,
    });
  }

  private close(): void {
    this.editing = undefined;
    this.archiving = undefined;
  }

  private async setQuantity(row: Row, zone: Zone): Promise<void> {
    const quantity = this.number("set-quantity");
    if (!Number.isFinite(quantity) || quantity < 0) {
      this.showError(this.l.t("error_invalid_quantity", { quantity: this.value("set-quantity") }));
      return;
    }
    const data: Record<string, unknown> = {
      product: String(row.product.product_id),
      quantity,
      zone: zone.zone_id,
    };
    const bestBefore = this.value("set-best-before");
    if (bestBefore && bestBefore !== (row.level.best_before ?? "")) {
      data.best_before = bestBefore;
    }
    if (await this.action("set_stock", data)) {
      this.close();
    }
  }

  /** Send only what changed; an emptied field clears that detail (null). */
  private async saveProduct(product: Product): Promise<void> {
    const text = (name: string) => this.value(name).trim() || null;
    const aliases = this.value("edit-aliases")
      .split(",")
      .map((alias) => alias.trim())
      .filter(Boolean);
    const shelf = this.value("edit-shelf-life").trim();
    const shelfLife = shelf ? Math.round(this.number("edit-shelf-life")) : null;
    if (shelfLife !== null && !(shelfLife >= 1)) {
      this.showError(this.l.t("error_invalid_quantity", { quantity: shelf }));
      return;
    }
    const name = text("edit-name");
    if (!name) {
      this.showError(this.l.t("name_required"));
      return;
    }
    const wanted: Record<string, unknown> = {
      name,
      category: text("edit-category"),
      unit: text("edit-unit"),
      default_zone: text("edit-zone"),
      shelf_life_days: shelfLife,
    };
    const current: Record<string, unknown> = {
      name: product.name,
      category: product.category,
      unit: product.unit,
      default_zone: product.default_zone_id,
      shelf_life_days: product.shelf_life_days ?? null,
    };
    const data: Record<string, unknown> = { product: String(product.product_id) };
    for (const [key, value] of Object.entries(wanted)) {
      if (value !== current[key]) {
        data[key] = value;
      }
    }
    if (aliases.join(",") !== product.aliases.join(",")) {
      data.aliases = aliases;
    }
    if (Object.keys(data).length === 1) {
      this.close();
      return;
    }
    if (await this.action("update_product", data, this.l.t("product_saved", { product: name }))) {
      this.close();
    }
  }

  private async move(row: Row, zone: Zone): Promise<void> {
    const target = this.value("move-zone");
    const quantity = this.number("move-quantity");
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > row.level.quantity) {
      this.showError(this.l.t("error_invalid_quantity", { quantity: this.value("move-quantity") }));
      return;
    }
    const data: Record<string, unknown> = {
      product: String(row.product.product_id),
      from_zone: zone.zone_id,
      to_zone: target,
    };
    if (quantity < row.level.quantity) {
      data.quantity = quantity;
    }
    if (await this.action("move_stock", data, this.l.t("moved", { product: row.product.name }))) {
      this.close();
    }
  }

  private async archive(product: Product): Promise<void> {
    if (
      await this.action(
        "archive_product",
        { product: String(product.product_id) },
        this.l.t("archived_done", { product: product.name }),
      )
    ) {
      this.close();
    }
  }

  private bringBack(productId: number, name: string) {
    return this.action(
      "archive_product",
      { product: String(productId), archived: false },
      this.l.t("brought_back", { product: name }),
    );
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

  private renderQuantityForm(row: Row, zone: Zone) {
    return html`<div class="form full quantity-form">
      <label>
        ${this.l.t("quantity")}
        <input name="set-quantity" type="number" inputmode="decimal" min="0" step="any"
          .value=${String(row.level.quantity)} />
      </label>
      <label>
        ${this.l.t("best_before_label")}
        <input name="set-best-before" type="date" .value=${row.level.best_before ?? ""} />
      </label>
      <button class="primary" ?disabled=${this.busy}
        @click=${() => this.setQuantity(row, zone)}>${this.l.t("save")}</button>
      <button @click=${() => this.close()}>${this.l.t("cancel")}</button>
    </div>`;
  }

  private renderProductForm(product: Product, snapshot: Snapshot) {
    return html`<div class="form full product-form">
      <h4>${this.l.t("edit_product")}</h4>
      <label>${this.l.t("name")}
        <input name="edit-name" type="text" autocomplete="off" .value=${product.name} /></label>
      <label>${this.l.t("aliases")}
        <input name="edit-aliases" type="text" autocomplete="off"
          .value=${product.aliases.join(", ")} /></label>
      <label>${this.l.t("category")}
        <input name="edit-category" type="text" autocomplete="off"
          .value=${product.category ?? ""} /></label>
      <label>${this.l.t("unit")}
        <input name="edit-unit" type="text" autocomplete="off" .value=${product.unit ?? ""} /></label>
      <label>
        ${this.l.t("default_zone")}
        <select name="edit-zone">
          <option value="">–</option>
          ${snapshot.zones.map(
            (z) => html`<option value=${z.zone_id}
              ?selected=${z.zone_id === product.default_zone_id}>${z.name}</option>`,
          )}
        </select>
      </label>
      <label>${this.l.t("shelf_life")}
        <input name="edit-shelf-life" type="number" inputmode="numeric" min="1" step="1"
          .value=${product.shelf_life_days ? String(product.shelf_life_days) : ""} /></label>
      <button class="primary save-product" ?disabled=${this.busy}
        @click=${() => this.saveProduct(product)}>${this.l.t("save")}</button>
    </div>`;
  }

  private renderMoveForm(row: Row, zone: Zone, snapshot: Snapshot) {
    const others = snapshot.zones.filter((z) => z.zone_id !== zone.zone_id);
    if (row.level.quantity <= 0 || !others.length) {
      return nothing;
    }
    return html`<div class="form full move-form">
      <label>
        ${this.l.t("move_to")}
        <select name="move-zone">
          ${others.map((z) => html`<option value=${z.zone_id}>${z.name}</option>`)}
        </select>
      </label>
      <label>
        ${this.l.t("quantity")}
        <input name="move-quantity" type="number" inputmode="decimal" min="0" step="any"
          .value=${String(row.level.quantity)} />
      </label>
      <button class="move" ?disabled=${this.busy}
        @click=${() => this.move(row, zone)}>${this.l.t("move")}</button>
    </div>`;
  }

  private renderArchive(product: Product) {
    if (this.archiving !== product.product_id) {
      return html`<div class="actions full">
        <button class="danger archive" @click=${() => (this.archiving = product.product_id)}>
          ${this.l.t("archive")}
        </button>
      </div>`;
    }
    return html`<div class="actions full">
      <p class="secondary">${this.l.t("archive_confirm", { product: product.name })}</p>
      <button class="danger archive-confirm" ?disabled=${this.busy}
        @click=${() => this.archive(product)}>${this.l.t("confirm_archive")}</button>
      <button @click=${() => (this.archiving = undefined)}>${this.l.t("cancel")}</button>
    </div>`;
  }

  private renderRow(row: Row, zone: Zone | null, snapshot: Snapshot) {
    const { product, level } = row;
    const id = `${product.product_id}@${zone?.zone_id ?? ""}`;
    const details = [this.amount(level.quantity, product.unit)];
    if (level.best_before) {
      details.push(this.l.t("best_before", { date: this.l.date(level.best_before) }));
    }
    const editing = this.editing === id && this.canWrite;
    return html`
      <li class="wrap" data-product=${product.product_id}>
        <div class="grow">
          <div class="name">${product.name}</div>
          <div class="secondary">${details.join(" · ")}</div>
        </div>
        ${this.canWrite
          ? html`
              ${zone
                ? html`
                    <button class="icon minus" aria-label=${this.l.t("decrease", { product: product.name })}
                      ?disabled=${this.busy || level.quantity <= 0}
                      @click=${() => this.adjust(product, zone, "consume")}>−</button>
                    <button class="icon plus" aria-label=${this.l.t("increase", { product: product.name })}
                      ?disabled=${this.busy} @click=${() => this.adjust(product, zone, "purchase")}>+</button>
                  `
                : nothing}
              <button class="icon edit" aria-label=${`${this.l.t("edit_product")}: ${product.name}`}
                title=${this.l.t("edit_product")}
                @click=${() => {
                  this.archiving = undefined;
                  this.editing = this.editing === id ? undefined : id;
                }}>✎</button>
            `
          : nothing}
        ${editing
          ? html`
              ${zone ? this.renderQuantityForm(row, zone) : nothing}
              ${this.renderProductForm(product, snapshot)}
              ${zone ? this.renderMoveForm(row, zone, snapshot) : nothing}
              ${this.renderArchive(product)}
            `
          : nothing}
      </li>
    `;
  }

  /** Rows of a zone: its stock, and products with no stock at all whose default zone it is. */
  private rows(zoneId: string | null, snapshot: Snapshot): Row[] {
    const known = new Set(snapshot.zones.map((z) => z.zone_id));
    return snapshot.products
      .flatMap((product): Row[] => {
        const levels = product.stock.filter((level) => level.zone_id === zoneId);
        if (levels.length) {
          return levels.map((level) => ({ product, level }));
        }
        const home = product.default_zone_id && known.has(product.default_zone_id)
          ? product.default_zone_id
          : null;
        return !product.stock.length && home === zoneId
          ? [{ product, level: { zone_id: zoneId ?? "", quantity: 0, best_before: null, updated: null } }]
          : [];
      })
      .sort((a, b) => a.product.name.localeCompare(b.product.name, this.l.locale));
  }

  private renderZone(zone: Zone, snapshot: Snapshot, showHeading: boolean) {
    const rows = this.rows(zone.zone_id, snapshot);
    return html`
      ${showHeading ? html`<h3>${zone.name}</h3>` : nothing}
      ${rows.length
        ? html`<ul class="rows">${rows.map((row) => this.renderRow(row, zone, snapshot))}</ul>`
        : html`<p class="muted">${this.l.t("inventory_empty")}</p>`}
    `;
  }

  private renderWithoutZone(snapshot: Snapshot) {
    const rows = this.rows(null, snapshot);
    if (!rows.length) {
      return nothing;
    }
    return html`
      <h3>${this.l.t("no_zone")}</h3>
      <ul class="rows">${rows.map((row) => this.renderRow(row, null, snapshot))}</ul>
    `;
  }

  private renderArchived(snapshot: Snapshot) {
    const archived = snapshot.archived_products ?? [];
    if (!archived.length || !this.canWrite) {
      return nothing;
    }
    return html`
      <h3>${this.l.t("archived_products")}</h3>
      <ul class="rows archived">
        ${archived.map(
          (p) => html`<li data-archived=${p.product_id}>
            <div class="grow name">${p.name}</div>
            <button class="bring-back" ?disabled=${this.busy}
              @click=${() => this.bringBack(p.product_id, p.name)}>${this.l.t("bring_back")}</button>
          </li>`,
        )}
      </ul>
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
      ${this.config.zone ? nothing : this.renderWithoutZone(snapshot)}
      ${this.canWrite ? this.renderAdd(snapshot) : nothing}
      ${this.config.zone ? nothing : this.renderArchived(snapshot)}
    `;
  }
}

defineCard(
  INVENTORY_CARD,
  QuartermasterInventoryCard,
  "card_inventory",
  "card_inventory_description",
);
