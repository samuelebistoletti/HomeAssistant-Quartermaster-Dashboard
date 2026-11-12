import { html, nothing } from "lit";
import { state } from "lit/decorators.js";

import type { Proposal, ProposalItem, Snapshot } from "../types";
import { configForm, defineCard, QuartermasterCard, TITLE_FIELD } from "./base";

export const PROPOSALS_CARD = "quartermaster-proposals-card";

/** Product select value that creates the item as a new product. */
const NEW_PRODUCT = "new";

interface Choice {
  /** Keys left out of the confirmation. */
  excluded: Set<number>;
  /** Keys with the correction fields open. */
  correcting: Set<number>;
  /** Keys to create as a new product. */
  creating: Set<number>;
}

/** Pending proposals: confirm (all or some), correct items, or reject. */
export class QuartermasterProposalsCard extends QuartermasterCard {
  protected readonly titleKey = "card_proposals" as const;

  @state() private choices = new Map<number, Choice>();

  static getStubConfig() {
    return {};
  }

  static getConfigForm() {
    return configForm([TITLE_FIELD]);
  }

  private choice(proposal: Proposal): Choice {
    let choice = this.choices.get(proposal.proposal_id);
    if (!choice) {
      // A product not seen may only be hidden: it is set to zero only when
      // the user ticks it.
      choice = { excluded: missingKeys(proposal), correcting: new Set(), creating: new Set() };
      this.choices.set(proposal.proposal_id, choice);
    }
    return choice;
  }

  private toggle(set: Set<number>, key: number): void {
    if (!set.delete(key)) {
      set.add(key);
    }
    this.choices = new Map(this.choices);
  }

  private setCreating(choice: Choice, key: number, creating: boolean): void {
    if (creating) {
      choice.creating.add(key);
    } else {
      choice.creating.delete(key);
    }
    this.choices = new Map(this.choices);
  }

  private value(name: string): string {
    return (
      this.renderRoot.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)
        ?.value ?? ""
    );
  }

  /** Confirm the ticked rows, or with `seenOnly` every row that was seen. */
  private async confirm(proposal: Proposal, seenOnly = false): Promise<void> {
    const choice = this.choice(proposal);
    const keys = proposal.items
      .filter((item) => (seenOnly ? !item.missing : !choice.excluded.has(item.key)))
      .map((item) => item.key);
    const corrections = [...choice.correcting]
      .filter((key) => keys.includes(key))
      .map((key) => {
        const correction: Record<string, unknown> = { key };
        const prefix = `p${proposal.proposal_id}-k${key}`;
        const product = this.value(`${prefix}-product`);
        const quantity = Number(this.value(`${prefix}-quantity`).replace(",", "."));
        if (choice.creating.has(key)) {
          // Named as read unless the user typed another name; a purchase
          // also needs the zone it goes to.
          correction.new_product = true;
          const name = this.value(`${prefix}-name`).trim();
          const zone = this.value(`${prefix}-zone`);
          if (name) {
            correction.name = name;
          }
          if (zone) {
            correction.zone = zone;
          }
        } else if (product) {
          correction.product = product;
        }
        if (Number.isFinite(quantity) && quantity >= 0) {
          correction.quantity = quantity;
        }
        return correction;
      });
    const data: Record<string, unknown> = {
      proposal_id: proposal.proposal_id,
      decision: "confirm",
    };
    // Without items the integration confirms everything but the rows not
    // seen, so a selection that includes one must name its keys.
    if (keys.length !== proposal.items.length || proposal.items.some((item) => item.missing)) {
      data.items = keys;
    }
    if (corrections.length) {
      data.corrections = corrections;
    }
    if (await this.action("confirm_pending", data)) {
      this.choices.delete(proposal.proposal_id);
    }
  }

  private async reject(proposal: Proposal): Promise<void> {
    if (
      await this.action("confirm_pending", {
        proposal_id: proposal.proposal_id,
        decision: "reject",
      })
    ) {
      this.choices.delete(proposal.proposal_id);
    }
  }

  private renderItem(proposal: Proposal, item: ProposalItem, snapshot: Snapshot) {
    const choice = this.choice(proposal);
    const included = !choice.excluded.has(item.key);
    const correcting = choice.correcting.has(item.key);
    const creating = correcting && choice.creating.has(item.key);
    const name = item.product ?? this.l.t("unknown_product", { seen: item.seen_as });
    const purchase = proposal.kind === "purchase";
    const before = item.current === null ? "–" : this.l.number(item.current);
    const prefix = `p${proposal.proposal_id}-k${item.key}`;
    const products = [...snapshot.products].sort((a, b) =>
      a.name.localeCompare(b.name, this.l.locale),
    );
    return html`
      <li class="wrap" data-key=${item.key}>
        ${this.canWrite
          ? html`<input type="checkbox" .checked=${included} aria-label=${name}
              @change=${() => this.toggle(choice.excluded, item.key)} />`
          : nothing}
        <div class="grow">
          <div class="name">${name}</div>
          <div class="secondary">
            ${purchase
              ? this.l.t("bought", { amount: this.amount(item.proposed, item.unit) })
              : `${before} → ${this.amount(item.proposed, item.unit)}`}
            · ${item.missing
              ? this.l.t("not_seen_item")
              : this.l.t("confidence", { percent: this.l.percent(item.confidence) })}
            ${item.product && item.seen_as && item.seen_as !== item.product
              ? html`· ${this.l.t("seen_as", { seen: item.seen_as })}`
              : nothing}
          </div>
          ${item.product_id === null && included && !correcting && this.canWrite
            ? html`<div class="secondary error">${this.l.t("needs_product")}</div>`
            : nothing}
        </div>
        ${this.canWrite
          ? html`<button class="correct" @click=${() => this.toggle(choice.correcting, item.key)}>
              ${correcting ? this.l.t("cancel") : this.l.t("correct")}
            </button>`
          : nothing}
        ${correcting
          ? html`<div class="form full">
              <label>
                ${this.l.t("product")}
                <select name=${`${prefix}-product`}
                  @change=${(event: Event) =>
                    this.setCreating(
                      choice,
                      item.key,
                      (event.target as HTMLSelectElement).value === NEW_PRODUCT,
                    )}>
                  <option value="">${item.product ?? this.l.t("choose_product")}</option>
                  <option value=${NEW_PRODUCT} ?selected=${creating}>
                    ➕ ${this.l.t("new_product")}
                  </option>
                  ${products.map(
                    (p) => html`<option value=${String(p.product_id)}>${p.name}</option>`,
                  )}
                </select>
              </label>
              ${creating
                ? html`<label>
                    ${this.l.t("name")}
                    <input name=${`${prefix}-name`} type="text" autocomplete="off"
                      .value=${item.seen_as} />
                  </label>`
                : nothing}
              ${creating && purchase
                ? html`<label>
                    ${this.l.t("default_zone")}
                    <select name=${`${prefix}-zone`}>
                      <option value="">–</option>
                      ${snapshot.zones.map(
                        (z) => html`<option value=${z.zone_id}>${z.name}</option>`,
                      )}
                    </select>
                  </label>`
                : nothing}
              <label>
                ${this.l.t("quantity")}
                <input name=${`${prefix}-quantity`} type="number" inputmode="decimal" min="0"
                  step="any" .value=${String(item.proposed)} />
              </label>
            </div>`
          : nothing}
      </li>
    `;
  }

  protected renderContent(snapshot: Snapshot) {
    if (!snapshot.proposals.length) {
      return html`<p class="muted">${this.l.t("proposals_empty")}</p>`;
    }
    return html`${snapshot.proposals.map((proposal) => {
      const time = this.l.relative(proposal.created);
      const zone = proposal.zone_id
        ? this.zoneName(proposal.zone_id)
        : this.l.t("proposal_unknown_zone");
      const title =
        proposal.kind === "purchase"
          ? this.l.t("proposal_purchase", { time })
          : this.l.t("proposal_from", { zone, time });
      const image = proposal.has_image
        ? this.image({ proposal_id: proposal.proposal_id }, "")
        : undefined;
      const choice = this.choice(proposal);
      const selected = proposal.items.length - choice.excluded.size;
      const changed = !sameSet(choice.excluded, missingKeys(proposal));
      const seen = proposal.items.some((item) => !item.missing);
      return html`
        <section data-proposal=${proposal.proposal_id}>
          <h3>${title}</h3>
          ${image
            ? html`<img class="crop" src=${image} alt=${this.l.t("proposal_image_alt")} />`
            : nothing}
          <ul class="rows">
            ${proposal.items.map((item) => this.renderItem(proposal, item, snapshot))}
          </ul>
          ${proposal.not_seen.length
            ? html`<p class="secondary">
                ${this.l.t("not_seen", { products: this.l.list(proposal.not_seen) })}
              </p>`
            : nothing}
          ${this.canWrite
            ? html`<div class="actions">
                ${seen
                  ? html`<button class="primary confirm-all" ?disabled=${this.busy}
                      @click=${() => this.confirm(proposal, true)}>
                      ${this.l.t(hasMissing(proposal) ? "confirm_seen" : "confirm_all")}
                    </button>`
                  : nothing}
                ${changed
                  ? html`<button class="confirm-selected" ?disabled=${this.busy || !selected}
                      @click=${() => this.confirm(proposal)}>
                      ${this.l.t("confirm_selected")}
                    </button>`
                  : nothing}
                <button class="danger reject" ?disabled=${this.busy}
                  @click=${() => this.reject(proposal)}>${this.l.t("reject")}</button>
              </div>`
            : nothing}
        </section>
      `;
    })}`;
  }
}

function missingKeys(proposal: Proposal): Set<number> {
  return new Set(proposal.items.filter((item) => item.missing).map((item) => item.key));
}

function hasMissing(proposal: Proposal): boolean {
  return proposal.items.some((item) => item.missing);
}

function sameSet(a: Set<number>, b: Set<number>): boolean {
  return a.size === b.size && [...a].every((key) => b.has(key));
}

defineCard(
  PROPOSALS_CARD,
  QuartermasterProposalsCard,
  "card_proposals",
  "card_proposals_description",
);
