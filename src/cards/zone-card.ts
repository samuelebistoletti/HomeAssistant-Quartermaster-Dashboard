import { html, nothing } from "lit";

import type { StringKey } from "../localize";
import type { Snapshot, Zone } from "../types";
import {
  configForm,
  defineCard,
  pageLocalizer,
  QuartermasterCard,
  type QuartermasterCardConfig,
  ZONE_FIELD,
} from "./base";

export const ZONE_CARD = "quartermaster-zone-card";

/**
 * One zone: last check with its status and confidence, the last crop,
 * show mode, the products it holds, and Check now / Arm show mode.
 */
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

  protected cardTitle(): string {
    if (this.config.title) {
      return this.config.title;
    }
    return this.snapshot ? this.zoneName(this.config.zone) : this.l.t(this.titleKey);
  }

  private translated(prefix: string, value: string): string {
    const key = `${prefix}${value}` as StringKey;
    return key in this.l.strings ? this.l.t(key) : value;
  }

  private renderCheck(zone: Zone) {
    const check = zone.last_check;
    if (zone.last_check === undefined) {
      return nothing;
    }
    if (!check) {
      return html`<p class="secondary last-check">${this.l.t("zone_never_checked")}</p>`;
    }
    const status = this.translated("check_status_", check.status);
    const confidence =
      typeof check.overall_confidence === "number"
        ? this.l.t("confidence", { percent: this.l.percent(check.overall_confidence) })
        : "";
    return html`<p class="secondary last-check">
      ${this.l.t("zone_last_check", { time: this.l.relative(check.ts), status })}
      ${confidence ? html` · ${confidence}` : nothing}
    </p>`;
  }

  private renderShow(zone: Zone) {
    if (!zone.sources.includes("camera_show")) {
      return nothing;
    }
    const until = zone.show_armed_until;
    const armed = until && new Date(until).getTime() > Date.now();
    const last = zone.last_show;
    return html`<p class="secondary show-state">
      ${armed ? this.l.t("show_armed_until", { time: this.l.time(until) }) : this.l.t("show_off")}
      ${last?.product
        ? html`<br />${this.l.t("last_show", {
              product: last.product,
              time: this.l.relative(last.ts),
            })}${last.action
              ? html` · ${this.translated("kind_", last.action)}${typeof last.quantity === "number"
                  ? ` ${this.l.number(last.quantity)}`
                  : ""}`
              : nothing}`
        : nothing}
    </p>`;
  }

  protected renderContent(snapshot: Snapshot) {
    const zone = snapshot.zones.find((z) => z.zone_id === this.config.zone);
    if (!zone) {
      return html`<p class="error">${this.l.t("error_zone_not_found", { zone: this.config.zone ?? "" })}</p>`;
    }
    const sources = zone.sources.map((source) => this.translated("source_", source));
    const request = snapshot.photo_requests?.find((r) => r.zone_id === zone.zone_id);
    const image = zone.has_image
      ? this.image({ zone_id: zone.zone_id }, zone.last_check?.ts ?? zone.updated ?? "")
      : undefined;
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
      ${this.renderCheck(zone)}
      ${zone.in_error ? html`<p class="error in-error">${this.l.t("zone_in_error")}</p>` : nothing}
      ${request
        ? html`<p class="photo-request">
            ${this.l.t("zone_photo_requested", { time: this.l.relative(request.created) })}
          </p>`
        : nothing}
      ${image
        ? html`<img class="crop" src=${image} alt=${this.l.t("zone_image_alt", { zone: zone.name })} />`
        : nothing}
      ${this.renderShow(zone)}
      ${this.canWrite
        ? html`<div class="actions">
            <button class="check" ?disabled=${this.busy}
              @click=${() =>
                this.action(
                  "check_zone",
                  { zone: zone.zone_id },
                  this.l.t("check_started", { zone: zone.name }),
                )}>${this.l.t("check_now")}</button>
            ${zone.sources.includes("camera_show")
              ? html`<button class="arm" ?disabled=${this.busy}
                  @click=${() =>
                    this.action(
                      "arm_show_mode",
                      { zone: zone.zone_id },
                      this.l.t("show_armed", { zone: zone.name }),
                    )}>${this.l.t("arm_show")}</button>`
              : nothing}
          </div>`
        : nothing}
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
