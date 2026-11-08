import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";

import type { StringKey } from "../localize";
import {
  buildSource,
  draftSource,
  type FieldSpec,
  fieldsFor,
  isProblem,
  parseNumber,
  PRIVACY_SOURCES,
  SOURCE_FIELDS,
  SOURCE_TYPES,
  type SourceDraft,
  splitList,
} from "../sources";
import type { Snapshot, SourceType, Zone, ZoneSource } from "../types";
import { configForm, defineCard, QuartermasterCard, TITLE_FIELD } from "./base";

export const ZONES_CARD = "quartermaster-zones-card";

/** Text of the zone being edited. */
interface ZoneDraft {
  zoneId: string;
  name: string;
  aliases: string;
  checkSchedule: string;
  reminderDays: string;
  confidenceThreshold: string;
  /** `undefined` with integrations that do not send `source_details`. */
  sources?: SourceDraft[];
}

const text = (value: unknown): string =>
  value === undefined || value === null ? "" : String(value);

/** Create, edit and remove zones and their sources (writers only). */
export class QuartermasterZonesCard extends QuartermasterCard {
  protected readonly titleKey = "card_zones" as const;

  @state() private adding = false;
  @state() private deleting?: string;
  @state() private editing?: ZoneDraft;
  @state() private newSourceType: SourceType = "camera";
  @state() private privacyAck = false;

  static getStubConfig() {
    return {};
  }

  static getConfigForm() {
    return configForm([TITLE_FIELD]);
  }

  private label(prefix: string, value: string): string {
    const key = `${prefix}${value}` as StringKey;
    return key in this.l.strings ? this.l.t(key) : value;
  }

  private input(name: string): string {
    return (
      this.renderRoot.querySelector<HTMLInputElement>(`[name="${name}"]`)?.value ?? ""
    ).trim();
  }

  private async addZone(): Promise<void> {
    const name = this.input("new-zone-name");
    if (!name) {
      this.showError(this.l.t("name_required"));
      return;
    }
    const aliases = splitList(this.input("new-zone-aliases"));
    if (
      await this.action("add_zone", { name, aliases }, this.l.t("zone_added", { zone: name }))
    ) {
      this.adding = false;
    }
  }

  private async removeZone(zone: Zone): Promise<void> {
    if (
      await this.action(
        "remove_zone",
        { zone: zone.zone_id },
        this.l.t("zone_removed", { zone: zone.name }),
      )
    ) {
      this.deleting = undefined;
    }
  }

  private edit(zone: Zone): void {
    this.deleting = undefined;
    this.adding = false;
    this.privacyAck = false;
    this.notice = undefined;
    this.editing = {
      zoneId: zone.zone_id,
      name: zone.name,
      aliases: zone.aliases.join(", "),
      checkSchedule: text(zone.check_schedule),
      reminderDays: text(zone.reminder_days),
      confidenceThreshold: text(zone.confidence_threshold),
      sources: zone.source_details?.map((source) => draftSource(source)),
    };
  }

  private changeSources(change: (sources: SourceDraft[]) => void): void {
    if (!this.editing?.sources) {
      return;
    }
    const sources = [...this.editing.sources];
    change(sources);
    this.editing = { ...this.editing, sources };
  }

  private move(index: number, by: number): void {
    this.changeSources((sources) => {
      const target = index + by;
      if (target < 0 || target >= sources.length) {
        return;
      }
      [sources[index], sources[target]] = [sources[target], sources[index]];
    });
  }

  private addSource(): void {
    const type = this.newSourceType;
    if (PRIVACY_SOURCES.has(type) && !this.privacyAck) {
      return;
    }
    this.changeSources((sources) => sources.push(draftSource({ type })));
    this.privacyAck = false;
  }

  private sourceLabel(index: number, type: string): string {
    return `${index + 1}. ${this.label("source_", type)}`;
  }

  /** Build the `set_zone` data; shows the problem and returns undefined when invalid. */
  private zoneData(zone: Zone, draft: ZoneDraft): Record<string, unknown> | undefined {
    const name = draft.name.trim();
    if (!name) {
      this.showError(this.l.t("name_required"));
      return undefined;
    }
    const data: Record<string, unknown> = {
      zone: zone.zone_id,
      name,
      aliases: splitList(draft.aliases),
    };
    if (draft.sources) {
      const sources: ZoneSource[] = [];
      for (const [index, source] of draft.sources.entries()) {
        const built = buildSource(source);
        if (isProblem(built)) {
          const params = {
            source: this.sourceLabel(index, source.base.type),
            field: this.label("field_", built.problem === "invalid_roi" ? "roi" : built.field),
          };
          this.showError(this.l.t(`source_${built.problem}`, params));
          return undefined;
        }
        sources.push(built);
      }
      data.sources = sources;
    }
    // Optional settings are sent only when the integration reports them.
    if ("check_schedule" in zone) {
      data.check_schedule = draft.checkSchedule.trim() || null;
    }
    const numbers: [keyof Zone, string, StringKey][] = [
      ["reminder_days", draft.reminderDays, "reminder_days"],
      ["confidence_threshold", draft.confidenceThreshold, "confidence_threshold"],
    ];
    for (const [key, value, label] of numbers) {
      if (!(key in zone)) {
        continue;
      }
      if (!value.trim()) {
        data[key] = null;
        continue;
      }
      const number = parseNumber(value);
      if (number === undefined || (key === "reminder_days" && !Number.isInteger(number))) {
        this.showError(this.l.t("zone_invalid_number", { field: this.l.t(label) }));
        return undefined;
      }
      data[key] = number;
    }
    return data;
  }

  private async save(zone: Zone): Promise<void> {
    if (!this.editing) {
      return;
    }
    const data = this.zoneData(zone, this.editing);
    if (
      data &&
      (await this.action("set_zone", data, this.l.t("zone_saved", { zone: String(data.name) })))
    ) {
      this.editing = undefined;
    }
  }

  private datalistId(domains: string[]): string {
    return `entities-${domains.join("-")}`;
  }

  /** Entity suggestions from `hass.states` for the entity fields. */
  private renderDatalists() {
    const groups = new Set<string>();
    for (const fields of Object.values(SOURCE_FIELDS)) {
      for (const field of fields) {
        if (field.domains) {
          groups.add(field.domains.join(","));
        }
      }
    }
    const ids = Object.keys(this.hass?.states ?? {}).sort();
    return [...groups].map((group) => {
      const domains = group.split(",");
      return html`<datalist id=${this.datalistId(domains)}>
        ${ids
          .filter((id) => domains.includes(id.split(".")[0]))
          .map(
            (id) =>
              html`<option value=${id}>${this.hass?.states?.[id]?.attributes.friendly_name ?? ""}</option>`,
          )}
      </datalist>`;
    });
  }

  private renderField(draft: SourceDraft, index: number, field: FieldSpec) {
    const name = `s${index}-${field.name}`;
    const value = draft.text[field.name] ?? "";
    const set = (e: Event) => {
      draft.text[field.name] = (e.target as HTMLInputElement | HTMLSelectElement).value;
    };
    const label = this.label("field_", field.name);
    let control;
    switch (field.kind) {
      case "select":
        control = html`<select name=${name} @change=${set}>
          <option value="" ?selected=${!value}>${this.l.t("default_option")}</option>
          ${(field.options ?? []).map(
            (option) => html`<option value=${option} ?selected=${value === option}>
              ${this.label("option_", option)}
            </option>`,
          )}
        </select>`;
        break;
      case "number":
        control = html`<input name=${name} type="number" inputmode="decimal"
          min=${field.min ?? ""} max=${field.max ?? ""} step=${field.step ?? "any"}
          .value=${value} @input=${set} />`;
        break;
      case "entity":
      case "list":
        control = html`<input name=${name} type="text" autocomplete="off"
          list=${field.domains ? this.datalistId(field.domains) : ""}
          ?required=${field.required === true} .value=${value} @input=${set} />`;
        break;
      default:
        control = html`<input name=${name} type="text" autocomplete="off"
          inputmode=${field.kind === "roi" ? "decimal" : "text"}
          placeholder=${field.kind === "roi" ? "0, 0, 1, 1" : field.name === "hours" ? "07:00-23:00" : ""}
          .value=${value} @input=${set} />`;
    }
    return html`<label class="field">${label}${field.required ? " *" : ""}${control}</label>`;
  }

  private renderSources(draft: ZoneDraft) {
    const sources = draft.sources;
    if (!sources) {
      return nothing;
    }
    const needsAck = PRIVACY_SOURCES.has(this.newSourceType);
    return html`
      <h3>${this.l.t("sources")}</h3>
      ${sources.length ? nothing : html`<p class="muted">${this.l.t("no_sources")}</p>`}
      <ol class="sources">
        ${sources.map((source, index) => {
          const label = this.sourceLabel(index, source.base.type);
          return html`<li class="source" data-index=${index}>
            <div class="source-head">
              <span class="grow name">${label}</span>
              <button class="icon up" ?disabled=${index === 0}
                aria-label=${this.l.t("move_up", { source: label })}
                title=${this.l.t("move_up", { source: label })}
                @click=${() => this.move(index, -1)}>↑</button>
              <button class="icon down" ?disabled=${index === sources.length - 1}
                aria-label=${this.l.t("move_down", { source: label })}
                title=${this.l.t("move_down", { source: label })}
                @click=${() => this.move(index, 1)}>↓</button>
              <button class="icon danger remove-source"
                aria-label=${this.l.t("remove_source", { source: label })}
                title=${this.l.t("remove_source", { source: label })}
                @click=${() => this.changeSources((list) => list.splice(index, 1))}>×</button>
            </div>
            <div class="form fields">
              ${fieldsFor(source.base.type).map((field) => this.renderField(source, index, field))}
            </div>
          </li>`;
        })}
      </ol>
      <div class="form add-source">
        <label class="field">
          ${this.l.t("source_type")}
          <select name="new-source-type"
            @change=${(e: Event) => {
              this.newSourceType = (e.target as HTMLSelectElement).value as SourceType;
              this.privacyAck = false;
            }}>
            ${SOURCE_TYPES.map(
              (type) => html`<option value=${type} ?selected=${type === this.newSourceType}>
                ${this.label("source_", type)}
              </option>`,
            )}
          </select>
        </label>
        ${needsAck
          ? html`<div class="privacy full" role="note">
              <p>${this.l.t("privacy_notice")}</p>
              <label class="inline">
                <input type="checkbox" name="privacy-ack" .checked=${this.privacyAck}
                  @change=${(e: Event) => (this.privacyAck = (e.target as HTMLInputElement).checked)} />
                ${this.l.t("privacy_ack")}
              </label>
            </div>`
          : nothing}
        <button class="add-source-button" ?disabled=${needsAck && !this.privacyAck}
          @click=${() => this.addSource()}>${this.l.t("add_source")}</button>
      </div>
    `;
  }

  private renderEditor(zone: Zone, draft: ZoneDraft) {
    const field = (key: keyof ZoneDraft, label: StringKey, attrs: { number?: boolean; step?: string; placeholder?: string } = {}) =>
      html`<label class="field">
        ${this.l.t(label)}
        <input name=${`zone-${key}`} type=${attrs.number ? "number" : "text"}
          inputmode=${attrs.number ? "decimal" : "text"} step=${attrs.step ?? "any"}
          placeholder=${attrs.placeholder ?? ""} .value=${String(draft[key] ?? "")}
          @input=${(e: Event) => {
            (draft as unknown as Record<string, string>)[key] = (e.target as HTMLInputElement).value;
          }} />
      </label>`;
    return html`<div class="editor full">
      ${this.renderDatalists()}
      <div class="form fields">
        ${field("name", "name")}
        ${field("aliases", "aliases")}
        ${"check_schedule" in zone
          ? field("checkSchedule", "check_schedule", { placeholder: "0 19 * * *" })
          : nothing}
        ${"reminder_days" in zone
          ? field("reminderDays", "reminder_days", { number: true, step: "1" })
          : nothing}
        ${"confidence_threshold" in zone
          ? field("confidenceThreshold", "confidence_threshold", { number: true, step: "0.05" })
          : nothing}
      </div>
      ${this.renderSources(draft)}
      <div class="actions">
        <button class="primary save" ?disabled=${this.busy} @click=${() => this.save(zone)}>
          ${this.l.t("save")}
        </button>
        <button class="cancel" @click=${() => (this.editing = undefined)}>${this.l.t("cancel")}</button>
      </div>
    </div>`;
  }

  private renderZone(zone: Zone) {
    const sources = zone.sources.map((source) => this.label("source_", source));
    const editing = this.editing?.zoneId === zone.zone_id ? this.editing : undefined;
    return html`<li class="wrap" data-zone=${zone.zone_id}>
      <div class="grow">
        <div class="name">${zone.name}</div>
        <div class="secondary">${[zone.zone_id, ...sources].join(" · ")}</div>
      </div>
      ${this.canWrite && !editing
        ? html`<button class="edit" @click=${() => this.edit(zone)}>${this.l.t("edit")}</button>
            <button class="danger delete"
              @click=${() => {
                this.editing = undefined;
                this.deleting = zone.zone_id;
              }}>${this.l.t("delete")}</button>`
        : nothing}
      ${this.deleting === zone.zone_id
        ? html`<div class="full confirm" role="alert">
            <p>${this.l.t("delete_zone_confirm", { zone: zone.name })}</p>
            <div class="actions">
              <button class="primary danger-fill confirm-delete" ?disabled=${this.busy}
                @click=${() => this.removeZone(zone)}>${this.l.t("delete")}</button>
              <button class="cancel" @click=${() => (this.deleting = undefined)}>
                ${this.l.t("cancel")}
              </button>
            </div>
          </div>`
        : nothing}
      ${editing ? this.renderEditor(zone, editing) : nothing}
    </li>`;
  }

  protected renderContent(snapshot: Snapshot) {
    return html`
      ${snapshot.zones.length
        ? html`<ul class="rows">${snapshot.zones.map((zone) => this.renderZone(zone))}</ul>`
        : html`<p class="muted">${this.l.t("zones_empty")}</p>`}
      ${this.canWrite
        ? this.adding
          ? html`<div class="form new-zone-form">
              <label class="field">${this.l.t("name")}
                <input name="new-zone-name" type="text" autocomplete="off" />
              </label>
              <label class="field">${this.l.t("aliases")}
                <input name="new-zone-aliases" type="text" autocomplete="off" />
              </label>
              <div class="actions full">
                <button class="primary add-zone" ?disabled=${this.busy}
                  @click=${() => this.addZone()}>${this.l.t("add")}</button>
                <button class="cancel" @click=${() => (this.adding = false)}>
                  ${this.l.t("cancel")}
                </button>
              </div>
            </div>`
          : html`<div class="actions">
              <button class="new-zone"
                @click=${() => {
                  this.adding = true;
                  this.editing = undefined;
                  this.deleting = undefined;
                }}>${this.l.t("new_zone")}</button>
            </div>`
        : nothing}
    `;
  }

  static styles = [
    QuartermasterCard.styles,
    css`
      label.field {
        flex: 1 1 220px;
        min-width: 0;
      }
      label.field input,
      label.field select {
        width: 100%;
      }
      .editor {
        padding-block: 8px;
      }
      ol.sources {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li.source {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        padding: 8px;
        margin-block: 8px;
      }
      .source-head {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .privacy {
        border-inline-start: 4px solid var(--warning-color);
        padding-inline: 12px;
      }
      button.danger-fill {
        background: var(--error-color);
        border-color: var(--error-color);
        color: var(--text-primary-color);
      }
    `,
  ];
}

defineCard(ZONES_CARD, QuartermasterZonesCard, "card_zones", "card_zones_description");
