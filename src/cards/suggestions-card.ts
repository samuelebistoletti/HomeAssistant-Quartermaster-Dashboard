import { html } from "lit";

import type { Snapshot } from "../types";
import { configForm, defineCard, QuartermasterCard, TITLE_FIELD } from "./base";

export const SUGGESTIONS_CARD = "quartermaster-suggestions-card";

/** Suggested purchases with their reason; one tap adds one to the list. */
export class QuartermasterSuggestionsCard extends QuartermasterCard {
  protected readonly titleKey = "card_suggestions" as const;

  static getStubConfig() {
    return {};
  }

  static getConfigForm() {
    return configForm([TITLE_FIELD]);
  }

  protected renderContent(snapshot: Snapshot) {
    if (!snapshot.suggestions.length) {
      return html`<p class="muted">${this.l.t("suggestions_empty")}</p>`;
    }
    return html`
      <ul class="rows">
        ${snapshot.suggestions.map((suggestion) => {
          const product = this.product(suggestion.product_id);
          const name = product?.name ?? String(suggestion.product_id);
          return html`
            <li>
              <div class="grow">
                <div class="name">${name}</div>
                <div class="secondary reason">${this.l.reason(suggestion)}</div>
              </div>
              ${this.canWrite
                ? html`<button
                    class="icon primary"
                    aria-label=${`${this.l.t("add")}: ${name}`}
                    title=${this.l.t("add")}
                    ?disabled=${this.busy}
                    @click=${() =>
                      this.action(
                        "add_to_shopping_list",
                        { product: String(suggestion.product_id), from_suggestion: true },
                        this.l.t("suggestion_added", { product: name }),
                      )}
                  >
                    +
                  </button>`
                : ""}
            </li>
          `;
        })}
      </ul>
    `;
  }
}

defineCard(
  SUGGESTIONS_CARD,
  QuartermasterSuggestionsCard,
  "card_suggestions",
  "card_suggestions_description",
);
