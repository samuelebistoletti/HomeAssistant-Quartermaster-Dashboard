import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";

import { ImageTooLargeError, ImageUnreadableError, prepareImage } from "../image";
import {
  DOMAIN,
  type PhotoResult,
  type ProposalItem,
  type ReceiptResult,
  type Snapshot,
} from "../types";
import { configForm, defineCard, QuartermasterCard, TITLE_FIELD, ZONE_FIELD } from "./base";

export const PHOTO_CARD = "quartermaster-photo-card";

/** The Android app opens only the gallery from a file field (home-assistant/android#6055). */
export function isAndroid(userAgent: string = navigator.userAgent): boolean {
  return /android/i.test(userAgent);
}

type Phase = "idle" | "preparing" | "analyzing";
type Kind = "zone" | "receipt";

/**
 * Photo of a zone or of a receipt, resized in the browser and sent to the
 * integration.
 */
export class QuartermasterPhotoCard extends QuartermasterCard {
  protected readonly titleKey = "card_photo" as const;

  @state() private zone?: string;
  @state() private phase: Phase = "idle";
  @state() private kind: Kind = "zone";
  @state() private result?: PhotoResult;
  @state() private receipt?: ReceiptResult;

  /** Overridable for tests. */
  android = isAndroid();

  static getStubConfig() {
    return {};
  }

  static getConfigForm() {
    return configForm([TITLE_FIELD, ZONE_FIELD]);
  }

  private selectedZone(snapshot: Snapshot): string | undefined {
    const zones = snapshot.zones.map((z) => z.zone_id);
    for (const candidate of [this.zone, this.config.zone]) {
      if (candidate && zones.includes(candidate)) {
        return candidate;
      }
    }
    return zones[0];
  }

  private async upload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const receipt = this.kind === "receipt";
    const zone = this.snapshot ? this.selectedZone(this.snapshot) : undefined;
    if (!file || (!zone && !receipt) || !this.hass) {
      return;
    }
    this.notice = undefined;
    this.result = undefined;
    this.receipt = undefined;
    this.phase = "preparing";
    try {
      const image = await prepareImage(file);
      this.phase = "analyzing";
      if (receipt) {
        this.receipt = await this.hass.callWS<ReceiptResult>({
          type: `${DOMAIN}/upload_photo`,
          kind: "receipt",
          image: image.base64,
        });
      } else {
        this.result = await this.hass.callWS<PhotoResult>({
          type: `${DOMAIN}/upload_photo`,
          zone,
          image: image.base64,
        });
      }
    } catch (err) {
      if (err instanceof ImageTooLargeError) {
        this.showError(this.l.t("photo_too_large"));
      } else if (err instanceof ImageUnreadableError) {
        this.showError(this.l.t("photo_unreadable"));
      } else {
        this.showError(this.l.error(err));
      }
    } finally {
      this.phase = "idle";
      input.value = "";
    }
  }

  private itemText(item: ProposalItem): string {
    const name = item.product ?? this.l.t("unknown_product", { seen: item.seen_as });
    const before = item.current === null ? "–" : this.l.number(item.current);
    return `${name}: ${before} → ${this.amount(item.proposed, item.unit)}`;
  }

  private renderReceipt(result: ReceiptResult) {
    const items = result.items ?? [];
    const unknown = result.unknown ?? [];
    return html`<div class="result">
      ${result.proposal_id !== null && items.length
        ? html`<p>${this.l.plural("receipt_proposal", items.length)}</p>
            <ul class="rows">
              ${items.map(
                (item) => html`<li>
                  ${item.product ?? this.l.t("unknown_product", { seen: item.seen_as })}:
                  ${this.amount(item.proposed, item.unit)}
                </li>`,
              )}
            </ul>`
        : html`<p>${this.l.t("receipt_no_items")}</p>`}
      ${unknown.length
        ? html`<p class="secondary">${this.l.t("photo_unknown", { products: this.l.list(unknown) })}</p>`
        : nothing}
    </div>`;
  }

  private renderResult(result: PhotoResult) {
    const lines = [];
    if (!result.image_usable) {
      lines.push(
        html`<p class="error">
          ${this.l.t("photo_unusable", { issues: this.l.list(result.image_issues ?? []) })}
        </p>`,
      );
    }
    if (result.applied.length) {
      lines.push(html`<p class="success">${this.l.plural("photo_applied", result.applied.length)}</p>`);
    }
    if (result.proposal_id !== null && result.proposed.length) {
      lines.push(
        html`<p>${this.l.plural("photo_proposal", result.proposed.length)}</p>
          <ul class="rows">
            ${result.proposed.map((item) => html`<li>${this.itemText(item)}</li>`)}
          </ul>`,
      );
    }
    if (result.image_usable && !result.applied.length && !result.proposed.length) {
      lines.push(html`<p>${this.l.t("photo_no_changes")}</p>`);
    }
    if (result.not_seen.length) {
      lines.push(
        html`<p class="secondary">${this.l.t("photo_not_seen", { products: this.l.list(result.not_seen) })}</p>`,
      );
    }
    if (result.unknown.length) {
      lines.push(
        html`<p class="secondary">${this.l.t("photo_unknown", { products: this.l.list(result.unknown) })}</p>`,
      );
    }
    return html`<div class="result">${lines}</div>`;
  }

  protected renderContent(snapshot: Snapshot) {
    if (!this.canWrite) {
      return nothing;
    }
    const zone = this.selectedZone(snapshot);
    const working = this.phase !== "idle";
    const receipt = this.kind === "receipt";
    const kindSelect = html`<label>
      ${this.l.t("photo_kind")}
      <select name="kind" ?disabled=${working}
        @change=${(e: Event) => {
          this.kind = (e.target as HTMLSelectElement).value as Kind;
          this.result = undefined;
          this.receipt = undefined;
        }}>
        <option value="zone" ?selected=${!receipt}>${this.l.t("photo_kind_zone")}</option>
        <option value="receipt" ?selected=${receipt}>${this.l.t("photo_kind_receipt")}</option>
      </select>
    </label>`;
    if (!snapshot.zones.length && !receipt) {
      return html`<div class="form">${kindSelect}</div>
        <p class="muted">${this.l.t("no_zones")}</p>`;
    }
    return html`
      <div class="form">
        ${kindSelect}
        ${receipt
          ? nothing
          : html`<label>
              ${this.l.t("photo_zone")}
              <select name="zone" ?disabled=${working}
                @change=${(e: Event) => (this.zone = (e.target as HTMLSelectElement).value)}>
                ${snapshot.zones.map(
                  (z) => html`<option value=${z.zone_id} ?selected=${z.zone_id === zone}>${z.name}</option>`,
                )}
              </select>
            </label>`}
        <label class="pick ${working ? "disabled" : ""}">
          <span>${this.l.t("photo_choose")}</span>
          <input type="file" accept="image/*" capture="environment" ?disabled=${working}
            @change=${(e: Event) => this.upload(e)} />
        </label>
      </div>
      ${this.android ? html`<p class="secondary android-note">${this.l.t("photo_android_note")}</p>` : nothing}
      ${working
        ? html`<p class="muted" role="status">
            ${this.l.t(this.phase === "preparing" ? "photo_preparing" : "photo_analyzing")}
          </p>`
        : nothing}
      ${this.result && !working ? this.renderResult(this.result) : nothing}
      ${this.receipt && !working ? this.renderReceipt(this.receipt) : nothing}
    `;
  }

  static styles = [
    QuartermasterCard.styles,
    css`
      label.pick {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding-inline: 20px;
        border-radius: 24px;
        background: var(--primary-color);
        color: var(--text-primary-color);
        font-size: 1rem;
        cursor: pointer;
      }
      label.pick:focus-within {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      label.pick.disabled {
        opacity: 0.4;
        cursor: default;
      }
      label.pick input {
        position: absolute;
        inset: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: inherit;
      }
    `,
  ];
}

defineCard(PHOTO_CARD, QuartermasterPhotoCard, "card_photo", "card_photo_description");
