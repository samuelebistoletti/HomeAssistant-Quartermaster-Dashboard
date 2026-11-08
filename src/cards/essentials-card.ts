import { html, nothing } from "lit";
import { state } from "lit/decorators.js";

import type { Product, Snapshot } from "../types";
import { configForm, defineCard, QuartermasterCard, TITLE_FIELD } from "./base";

export const ESSENTIALS_CARD = "quartermaster-essentials-card";

export type EssentialStatus = "to_buy" | "low" | "ok";

/** Status of an essential (spec §6.8): to buy, below target, or fine. */
export function essentialStatus(product: Product, snapshot: Snapshot): EssentialStatus {
  if (snapshot.to_buy.some((item) => item.product_id === product.product_id)) {
    return "to_buy";
  }
  if (product.min_stock !== null && product.total < product.min_stock) {
    return "to_buy";
  }
  if (product.target_stock !== null && product.total < product.target_stock) {
    return "low";
  }
  return "ok";
}

const STATUS_KEY = { to_buy: "status_to_buy", low: "status_low", ok: "status_ok" } as const;

function parseQuantity(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined;
  }
  const number = Number(value.replace(",", "."));
  return Number.isFinite(number) && number >= 0 ? number : Number.NaN;
}

/** Essentials with present, minimum, target and status; edit, add, remove. */
export class QuartermasterEssentialsCard extends QuartermasterCard {
  protected readonly titleKey = "card_essentials" as const;

  @state() private editing?: number;
  @state() private adding = false;

  static getStubConfig() {
    return {};
  }

  static getConfigForm() {
    return configForm([TITLE_FIELD]);
  }

  private field(name: string): string {
    const input = this.renderRoot.querySelector<HTMLInputElement | HTMLSelectElement>(
      `[name="${name}"]`,
    );
    return input?.value ?? "";
  }

  private async save(productRef: string, form: string): Promise<void> {
    const min = parseQuantity(this.field(`${form}-min`));
    const target = parseQuantity(this.field(`${form}-target`));
    if (min === undefined || Number.isNaN(min) || (target !== undefined && Number.isNaN(target))) {
      this.showError(this.l.t("min_required"));
      return;
    }
    if (target !== undefined && target < min) {
      this.showError(this.l.t("target_below_min"));
      return;
    }
    const data: Record<string, unknown> = {
      product: productRef,
      essential: true,
      min_stock: min,
    };
    if (target !== undefined) {
      data.target_stock = target;
    }
    if (await this.action("set_essential", data)) {
      this.editing = undefined;
      this.adding = false;
    }
  }

  private async add(): Promise<void> {
    const product = this.field("add-product");
    if (!product) {
      this.showError(this.l.t("choose_product"));
      return;
    }
    await this.save(product, "add");
  }

  private renderEditor(product: Product) {
    return html`
      <div class="form">
        <label>
          ${this.l.t("min_stock")}
          <input name="edit-min" type="number" inputmode="decimal" min="0" step="any"
            .value=${product.min_stock === null ? "" : String(product.min_stock)} />
        </label>
        <label>
          ${this.l.t("target_stock")}
          <input name="edit-target" type="number" inputmode="decimal" min="0" step="any"
            .value=${product.target_stock === null ? "" : String(product.target_stock)} />
        </label>
        <button class="primary" ?disabled=${this.busy}
          @click=${() => this.save(String(product.product_id), "edit")}>${this.l.t("save")}</button>
        <button ?disabled=${this.busy} @click=${() => (this.editing = undefined)}>
          ${this.l.t("cancel")}
        </button>
        <button class="danger" ?disabled=${this.busy}
          @click=${async () => {
            if (
              await this.action("set_essential", {
                product: String(product.product_id),
                essential: false,
              })
            ) {
              this.editing = undefined;
            }
          }}>${this.l.t("remove_essential")}</button>
      </div>
    `;
  }

  private renderAdd(snapshot: Snapshot) {
    const candidates = snapshot.products
      .filter((p) => !p.essential)
      .sort((a, b) => a.name.localeCompare(b.name, this.l.locale));
    if (!this.adding) {
      return html`<div class="actions">
        <button ?disabled=${!candidates.length} @click=${() => (this.adding = true)}>
          ${this.l.t("add_essential")}
        </button>
      </div>`;
    }
    return html`
      <h3>${this.l.t("add_essential")}</h3>
      <div class="form">
        <label>
          ${this.l.t("product")}
          <select name="add-product">
            <option value="">${this.l.t("choose_product")}</option>
            ${candidates.map((p) => html`<option value=${String(p.product_id)}>${p.name}</option>`)}
          </select>
        </label>
        <label>
          ${this.l.t("min_stock")}
          <input name="add-min" type="number" inputmode="decimal" min="0" step="any" value="1" />
        </label>
        <label>
          ${this.l.t("target_stock")}
          <input name="add-target" type="number" inputmode="decimal" min="0" step="any" />
        </label>
        <button class="primary" ?disabled=${this.busy} @click=${() => this.add()}>
          ${this.l.t("add")}
        </button>
        <button @click=${() => (this.adding = false)}>${this.l.t("cancel")}</button>
      </div>
    `;
  }

  protected renderContent(snapshot: Snapshot) {
    const essentials = snapshot.products
      .filter((p) => p.essential)
      .sort((a, b) => a.name.localeCompare(b.name, this.l.locale));
    return html`
      ${essentials.length
        ? html`<ul class="rows">
            ${essentials.map((product) => {
              const status = essentialStatus(product, snapshot);
              const amounts = [
                `${this.l.t("col_present")} ${this.amount(product.total, product.unit)}`,
                `${this.l.t("col_min")} ${product.min_stock === null ? "–" : this.l.number(product.min_stock)}`,
                `${this.l.t("col_target")} ${product.target_stock === null ? "–" : this.l.number(product.target_stock)}`,
              ];
              return html`
                <li class="wrap" data-product=${product.product_id}>
                  <div class="grow">
                    <div class="name">${product.name}</div>
                    <div class="secondary">${amounts.join(" · ")}</div>
                  </div>
                  <span class="badge ${status}">${this.l.t(STATUS_KEY[status])}</span>
                  ${this.canWrite && this.editing !== product.product_id
                    ? html`<button class="edit" @click=${() => (this.editing = product.product_id)}>
                        ${this.l.t("edit")}
                      </button>`
                    : nothing}
                  ${this.canWrite && this.editing === product.product_id
                    ? html`<div class="full">${this.renderEditor(product)}</div>`
                    : nothing}
                </li>
              `;
            })}
          </ul>`
        : html`<p class="muted">${this.l.t("essentials_empty")}</p>`}
      ${this.canWrite ? this.renderAdd(snapshot) : nothing}
    `;
  }
}

defineCard(
  ESSENTIALS_CARD,
  QuartermasterEssentialsCard,
  "card_essentials",
  "card_essentials_description",
);
