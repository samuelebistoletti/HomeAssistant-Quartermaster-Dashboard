import { html, nothing } from "lit";
import { state } from "lit/decorators.js";

import type { StringKey } from "../localize";
import { DOMAIN, type JournalEntry } from "../types";
import { configForm, defineCard, QuartermasterCard, TITLE_FIELD } from "./base";

export const HISTORY_CARD = "quartermaster-history-card";

const DEFAULT_LIMIT = 50;

/** Latest movements from `quartermaster/journal`, with undo per operation. */
export class QuartermasterHistoryCard extends QuartermasterCard {
  protected readonly titleKey = "card_history" as const;

  @state() private entries?: JournalEntry[];
  private request = 0;

  static getStubConfig() {
    return {};
  }

  static getConfigForm() {
    return configForm([
      TITLE_FIELD,
      { name: "limit", selector: { number: { min: 1, max: 500, mode: "box" } } },
    ]);
  }

  /** The journal changes with the inventory: reload it after each snapshot. */
  protected snapshotChanged(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    if (!this.hass || !this.snapshot) {
      return;
    }
    const request = ++this.request;
    const limit = Math.min(Math.max(Number(this.config.limit) || DEFAULT_LIMIT, 1), 500);
    try {
      const result = await this.hass.callWS<{ entries: JournalEntry[] }>({
        type: `${DOMAIN}/journal`,
        limit,
      });
      if (request === this.request) {
        this.entries = result.entries;
      }
    } catch (err) {
      if (request === this.request) {
        this.showError(this.l.error(err));
      }
    }
  }

  private label(prefix: "kind" | "channel", value: string): string {
    const key = `${prefix}_${value}` as StringKey;
    return key in this.l.strings ? this.l.t(key) : value;
  }

  protected renderContent() {
    if (!this.entries) {
      return html`<p class="muted">${this.l.t("loading")}</p>`;
    }
    if (!this.entries.length) {
      return html`<p class="muted">${this.l.t("history_empty")}</p>`;
    }
    const seen = new Set<string>();
    return html`
      <ul class="rows">
        ${this.entries.map((entry) => {
          const operation = entry.operation_id;
          const first = operation !== null && !seen.has(operation);
          if (operation !== null) {
            seen.add(operation);
          }
          const canUndo = first && !entry.undone && entry.kind !== "undo" && this.canWrite;
          const product = this.product(entry.product_id);
          const delta = `${entry.delta > 0 ? "+" : entry.delta < 0 ? "−" : "±"}${this.l.number(Math.abs(entry.delta))}`;
          const details = [
            this.label("kind", entry.kind),
            `${delta} → ${this.amount(entry.quantity_after, product?.unit)}`,
            entry.zone ?? this.zoneName(entry.zone_id),
            this.label("channel", entry.channel),
          ].filter(Boolean);
          return html`
            <li data-entry=${entry.id}>
              <div class="grow">
                <div class="name">${entry.product ?? product?.name ?? "?"}</div>
                <div class="secondary">${this.l.dateTime(entry.ts)} · ${details.join(" · ")}</div>
              </div>
              ${entry.undone ? html`<span class="badge">${this.l.t("undone")}</span>` : nothing}
              ${canUndo
                ? html`<button class="undo" ?disabled=${this.busy}
                    @click=${() => this.action("undo_last", { operation_id: operation })}>
                    ${this.l.t("undo")}
                  </button>`
                : nothing}
            </li>
          `;
        })}
      </ul>
    `;
  }
}

defineCard(HISTORY_CARD, QuartermasterHistoryCard, "card_history", "card_history_description");
