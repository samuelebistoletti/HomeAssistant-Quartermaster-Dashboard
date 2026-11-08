import { html, nothing } from "lit";
import { state } from "lit/decorators.js";

import type { Proposal, ProposalItem, Snapshot } from "../types";
import { configForm, defineCard, QuartermasterCard, TITLE_FIELD } from "./base";

export const PROPOSALS_CARD = "quartermaster-proposals-card";

interface Choice {
  /** Keys left out of the confirmation. */
  excluded: Set<number>;
  /** Keys with the correction fields open. */
  correcting: Set<number>;
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

  private choice(id: number): Choice {
    let choice = this.choices.get(id);
    if (!choice) {
      choice = { excluded: new Set(), correcting: new Set() };
      this.choices.set(id, choice);
    }
    return choice;
  }

  private toggle(set: Set<number>, key: number): void {
    if (!set.delete(key)) {
      set.add(key);
    }
    this.choices = new Map(this.choices);
  }

  private value(name: string): string {
    return (
      this.renderRoot.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`)
        ?.value ?? ""
    );
  }

  private async confirm(proposal: Proposal, all: boolean): Promise<void> {
    const choice = this.choice(proposal.proposal_id);
    const keys = proposal.items
      .map((item) => item.key)
      .filter((key) => all || !choice.excluded.has(key));
    const corrections = [...choice.correcting]
      .filter((key) => keys.includes(key))
      .map((key) => {
        const correction: Record<string, unknown> = { key };
        const product = this.value(`p${proposal.proposal_id}-k${key}-product`);
        const quantity = Number(
          this.value(`p${proposal.proposal_id}-k${key}-quantity`).replace(",", "."),
        );
        if (product) {
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
    if (keys.length !== proposal.items.length) {
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
    const choice = this.choice(proposal.proposal_id);
    const included = !choice.excluded.has(item.key);
    const correcting = choice.correcting.has(item.key);
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
            · ${this.l.t("confidence", { percent: this.l.percent(item.confidence) })}
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
                <select name=${`${prefix}-product`}>
                  <option value="">${item.product ?? this.l.t("choose_product")}</option>
                  ${products.map(
                    (p) => html`<option value=${String(p.product_id)}>${p.name}</option>`,
                  )}
                </select>
              </label>
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
      const choice = this.choice(proposal.proposal_id);
      const selected = proposal.items.length - choice.excluded.size;
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
                <button class="primary confirm-all" ?disabled=${this.busy}
                  @click=${() => this.confirm(proposal, true)}>${this.l.t("confirm_all")}</button>
                ${choice.excluded.size
                  ? html`<button class="confirm-selected" ?disabled=${this.busy || !selected}
                      @click=${() => this.confirm(proposal, false)}>
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

defineCard(
  PROPOSALS_CARD,
  QuartermasterProposalsCard,
  "card_proposals",
  "card_proposals_description",
);
