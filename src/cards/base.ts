import {
  css,
  type CSSResultGroup,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { property, state } from "lit/decorators.js";

import { fetchImage, subscribeSnapshot } from "../data";
import { Localizer, type StringKey } from "../localize";
import {
  DOMAIN,
  type HassConnection,
  type HomeAssistant,
  type Product,
  type Snapshot,
} from "../types";

export interface QuartermasterCardConfig {
  type: string;
  title?: string;
  zone?: string;
  limit?: number;
}

export interface CustomCardEntry {
  type: string;
  name?: string;
  description?: string;
  preview?: boolean;
  documentationURL?: string;
}

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }
}

export const DOCUMENTATION_URL =
  "https://github.com/samuelebistoletti/HomeAssistant-Quartermaster-Dashboard";

/**
 * Language for strings shown before `hass` exists (card picker, editor
 * labels): the page language, as set by the frontend.
 */
export function pageLocalizer(): Localizer {
  return new Localizer(document.documentElement.lang || navigator.language);
}

/** Register a card element and its entry in the card picker. */
export function defineCard(
  tag: string,
  element: CustomElementConstructor,
  name: StringKey,
  description: StringKey,
): void {
  if (customElements.get(tag)) {
    return;
  }
  customElements.define(tag, element);
  const l = pageLocalizer();
  window.customCards = window.customCards ?? [];
  window.customCards.push({
    type: tag,
    name: `Quartermaster: ${l.t(name)}`,
    description: l.t(description),
    preview: false,
    documentationURL: DOCUMENTATION_URL,
  });
}

/** Editor form fields shared by the cards. */
export const TITLE_FIELD = { name: "title", selector: { text: {} } };
export const ZONE_FIELD = { name: "zone", selector: { text: {} } };

export function configForm(schema: Record<string, unknown>[], requiredZone = false) {
  const labels: Record<string, StringKey> = {
    title: "editor_title",
    zone: "editor_zone",
    limit: "editor_limit",
  };
  return {
    schema: schema.map((field) =>
      field.name === "zone" && requiredZone ? { ...field, required: true } : field,
    ),
    computeLabel: (field: { name: string }) => {
      const key = labels[field.name];
      return key ? pageLocalizer().t(key) : undefined;
    },
    computeHelper: (field: { name: string }) =>
      field.name === "zone" ? pageLocalizer().t("editor_zone_helper") : undefined,
  };
}

interface Notice {
  text: string;
  error: boolean;
}

/**
 * Base for the Quartermaster cards: reads the live snapshot through the
 * shared `quartermaster/subscribe` subscription and writes through the
 * integration's actions.
 */
export abstract class QuartermasterCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() protected config: QuartermasterCardConfig = { type: "" };
  @state() protected snapshot?: Snapshot;
  @state() protected loadError?: unknown;
  @state() protected notice?: Notice;
  @state() protected busy = false;

  private unsubscribe?: () => void;
  private connection?: HassConnection;
  private localizer?: Localizer;
  private localizerLanguage?: string;
  /** Crops by target and version; `null` while loading or when there is none. */
  private images = new Map<string, string | null>();

  /** Translation key of the default title. */
  protected abstract readonly titleKey: StringKey;

  setConfig(config: QuartermasterCardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this.config = { ...config };
  }

  getCardSize(): number {
    return 4;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  protected get l(): Localizer {
    const language = this.hass?.language;
    if (!this.localizer || this.localizerLanguage !== language) {
      this.localizer = new Localizer(language);
      this.localizerLanguage = language;
    }
    return this.localizer;
  }

  /** Whether the current user may change data (from the integration). */
  protected get canWrite(): boolean {
    return this.snapshot?.can_write === true;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.connection = undefined;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("hass")) {
      this.subscribe();
    }
  }

  private subscribe(): void {
    const connection = this.hass?.connection;
    if (!connection || !this.isConnected || connection === this.connection) {
      return;
    }
    this.unsubscribe?.();
    this.connection = connection;
    this.unsubscribe = subscribeSnapshot(connection, (snapshot, error) => {
      this.snapshot = snapshot;
      this.loadError = error;
      this.snapshotChanged();
    });
  }

  /** Called after each snapshot; cards that fetch more data override it. */
  protected snapshotChanged(): void {}

  /** Call a quartermaster action; shows the translated error on failure. */
  protected async action(
    service: string,
    data: Record<string, unknown>,
    success?: string,
  ): Promise<boolean> {
    if (!this.hass) {
      return false;
    }
    this.busy = true;
    this.notice = undefined;
    try {
      await this.hass.callService(DOMAIN, service, data);
      if (success) {
        this.notice = { text: success, error: false };
      }
      return true;
    } catch (err) {
      this.notice = { text: this.l.error(err), error: true };
      return false;
    } finally {
      this.busy = false;
    }
  }

  /**
   * The stored crop of a zone or proposal as a data URL, fetched once per
   * `version` (for example the time of the last check); `undefined` until
   * it is loaded or when there is none.
   */
  protected image(
    target: { zone_id: string } | { proposal_id: number },
    version: string,
  ): string | undefined {
    const key = `${JSON.stringify(target)}@${version}`;
    if (!this.images.has(key) && this.hass) {
      this.images.set(key, null);
      void fetchImage(this.hass, target).then((url) => {
        this.images.set(key, url ?? null);
        this.requestUpdate();
      });
    }
    return this.images.get(key) ?? undefined;
  }

  protected showError(text: string): void {
    this.notice = { text, error: true };
  }

  protected product(id: number | null | undefined): Product | undefined {
    return this.snapshot?.products.find((p) => p.product_id === id);
  }

  protected zoneName(id: string | null | undefined): string {
    return this.snapshot?.zones.find((z) => z.zone_id === id)?.name ?? id ?? "";
  }

  /** Quantity with its unit, such as "2 bottle"; "–" when unknown. */
  protected amount(quantity: number | null, unit: string | null | undefined): string {
    if (quantity === null) {
      return "–";
    }
    const number = this.l.number(quantity);
    return unit ? `${number} ${unit}` : number;
  }

  protected abstract renderContent(snapshot: Snapshot): TemplateResult | typeof nothing;

  protected cardTitle(): string {
    return this.config.title ?? this.l.t(this.titleKey);
  }

  protected render(): TemplateResult {
    let body: TemplateResult | typeof nothing;
    if (this.loadError) {
      body = html`<p class="error" role="alert">${this.l.error(this.loadError)}</p>`;
    } else if (!this.snapshot) {
      body = html`<p class="muted">${this.l.t("loading")}</p>`;
    } else {
      body = this.renderContent(this.snapshot);
    }
    return html`
      <ha-card>
        <div class="header">${this.cardTitle()}</div>
        <div class="content">
          ${body}
          ${this.snapshot && !this.canWrite && this.hasWriteControls()
            ? html`<p class="muted read-only">${this.l.t("read_only")}</p>`
            : nothing}
          <div class="notice" aria-live="polite">
            ${this.notice
              ? html`<p class=${this.notice.error ? "error" : "success"} role=${this.notice.error ? "alert" : "status"}>
                  ${this.notice.text}
                </p>`
              : nothing}
          </div>
        </div>
      </ha-card>
    `;
  }

  /** Whether the card has controls that need write permission. */
  protected hasWriteControls(): boolean {
    return true;
  }

  static styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    ha-card {
      display: block;
      height: 100%;
      overflow: hidden;
    }
    .header {
      font-size: var(--ha-card-header-font-size, 1.25rem);
      font-weight: 500;
      color: var(--ha-card-header-color, var(--primary-text-color));
      padding-block: 16px 8px;
      padding-inline: 16px;
    }
    .content {
      padding-block: 0 16px;
      padding-inline: 16px;
      color: var(--primary-text-color);
    }
    p {
      margin-block: 8px;
    }
    .muted {
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    .success {
      color: var(--success-color, var(--primary-color));
    }
    ul.rows {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    ul.rows > li {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding-block: 6px;
      border-block-end: 1px solid var(--divider-color);
    }
    ul.rows > li:last-child {
      border-block-end: none;
    }
    ul.rows > li.wrap {
      flex-wrap: wrap;
    }
    .full {
      flex-basis: 100%;
    }
    .grow {
      flex: 1 1 0;
      min-width: 0;
    }
    .name {
      overflow-wrap: anywhere;
    }
    .secondary {
      color: var(--secondary-text-color);
      font-size: 0.875rem;
    }
    button {
      font: inherit;
      min-height: 44px;
      min-width: 44px;
      padding-block: 0;
      padding-inline: 16px;
      border-radius: 22px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-color);
      cursor: pointer;
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-color: var(--primary-color);
    }
    button.icon {
      padding: 0;
      width: 44px;
      font-size: 1.4rem;
      line-height: 1;
    }
    button.danger {
      color: var(--error-color);
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    button:focus-visible,
    input:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    input,
    select {
      font: inherit;
      min-height: 44px;
      box-sizing: border-box;
      padding-inline: 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    input[type="number"] {
      width: 6em;
    }
    input[type="checkbox"] {
      min-height: 24px;
      width: 24px;
      height: 24px;
      accent-color: var(--primary-color);
    }
    label {
      display: inline-flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.875rem;
      color: var(--secondary-text-color);
    }
    label.inline {
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }
    .form {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 8px;
      padding-block: 8px;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding-block: 8px;
    }
    .badge {
      display: inline-block;
      padding-block: 2px;
      padding-inline: 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      border: 1px solid currentColor;
      white-space: nowrap;
    }
    .badge.to_buy {
      color: var(--error-color);
    }
    .badge.low {
      color: var(--warning-color);
    }
    .badge.ok {
      color: var(--success-color, var(--secondary-text-color));
    }
    img.crop {
      display: block;
      max-width: 100%;
      max-height: 240px;
      object-fit: contain;
      border-radius: 8px;
      margin-block: 8px;
      background: var(--secondary-background-color);
    }
    h3 {
      font-size: 1rem;
      font-weight: 500;
      margin-block: 16px 4px;
    }
  `;
}
