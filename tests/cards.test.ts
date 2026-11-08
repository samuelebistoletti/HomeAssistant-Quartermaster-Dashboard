import { aTimeout, expect, waitUntil } from "@open-wc/testing";

import "../src/quartermaster-dashboard";
import type { QuartermasterCard } from "../src/cards/base";
import type { QuartermasterPhotoCard } from "../src/cards/photo-card";
import itStrings from "../src/translations/it";
import { must, sampleSnapshot, shelfZone, type Stub, stubHass } from "./fixtures";

type Card = QuartermasterCard & {
  setConfig(config: Record<string, unknown>): void;
  updateComplete: Promise<boolean>;
};

const mounted: HTMLElement[] = [];

afterEach(() => {
  mounted.splice(0).forEach((el) => el.remove());
});

async function mount(tag: string, stub: Stub, config: Record<string, unknown> = {}): Promise<Card> {
  const el = document.createElement(tag) as Card;
  el.setConfig({ type: `custom:${tag}`, ...config });
  el.hass = stub.hass;
  document.body.append(el);
  mounted.push(el);
  await waitUntil(() => {
    const content = el.shadowRoot?.querySelector(".content")?.textContent ?? "";
    return content.trim() !== "" && !/Loading…|Caricamento…/.test(content);
  });
  await el.updateComplete;
  return el;
}

const text = (el: Element) => (el.shadowRoot?.textContent ?? "").replace(/\s+/g, " ");
const $ = <T extends Element = HTMLElement>(el: Element, selector: string) =>
  must(must(el.shadowRoot).querySelector<T>(selector), selector);
const $$ = (el: Element, selector: string) => [...must(el.shadowRoot).querySelectorAll(selector)];

async function click(el: Card, selector: string) {
  $(el, selector).click();
  await aTimeout(0);
  await el.updateComplete;
}

function setValue(el: Card, name: string, value: string) {
  const input = $<HTMLInputElement | HTMLSelectElement>(el, `[name="${name}"]`);
  input.value = value;
  input.dispatchEvent(new Event("input"));
  input.dispatchEvent(new Event("change"));
}

const readOnly = () => stubHass({ snapshot: sampleSnapshot({ can_write: false }) });

describe("card registration", () => {
  for (const tag of [
    "quartermaster-suggestions-card",
    "quartermaster-essentials-card",
    "quartermaster-proposals-card",
    "quartermaster-inventory-card",
    "quartermaster-history-card",
    "quartermaster-zone-card",
    "quartermaster-photo-card",
    "quartermaster-zones-card",
  ]) {
    it(`${tag} has a stub config, an editor form and grid options`, () => {
      const Element = customElements.get(tag) as unknown as {
        getStubConfig(): Record<string, unknown>;
        getConfigForm(): { schema: unknown[]; computeLabel: (f: { name: string }) => unknown };
        new (): { getGridOptions(): { columns: number } };
      };
      expect(Element.getStubConfig()).to.be.an("object");
      const form = Element.getConfigForm();
      expect(form.schema.length).to.be.greaterThan(0);
      expect(form.computeLabel({ name: "title" })).to.be.a("string");
      expect(new Element().getGridOptions().columns).to.equal(12);
    });
  }
});

describe("subscription", () => {
  it("shares one subscription and closes it when the last card goes away", async () => {
    const stub = stubHass();
    const a = await mount("quartermaster-suggestions-card", stub);
    const b = await mount("quartermaster-essentials-card", stub);
    expect(stub.calls.subscribed).to.equal(1);
    a.remove();
    await aTimeout(0);
    expect(stub.calls.unsubscribed).to.equal(0);
    b.remove();
    await aTimeout(0);
    expect(stub.calls.unsubscribed).to.equal(1);
  });

  it("follows new snapshots", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-suggestions-card", stub);
    stub.push(sampleSnapshot({ suggestions: [] }));
    await el.updateComplete;
    expect(text(el)).to.contain("Nothing to suggest");
  });

  it("shows a translated error when the integration is not loaded", async () => {
    const stub = stubHass({ language: "it", subscribeError: { code: "not_loaded", message: "x" } });
    const el = await mount("quartermaster-suggestions-card", stub);
    expect(text(el)).to.contain(itStrings.error_not_loaded);
  });
});

describe("suggestions card", () => {
  it("shows reasons as sentences and adds with one tap", async () => {
    const stub = stubHass({ language: "it" });
    const el = await mount("quartermaster-suggestions-card", stub);
    expect(text(el)).to.contain("Suggeriti");
    expect(text(el)).to.contain("Caffè");
    expect(text(el)).to.contain("ne hai 1, di solito ne tieni 4");
    expect(text(el)).to.contain("la zona Frigo non è aggiornata da 9 giorni");
    expect(text(el)).to.contain("l'hai finito il 2 novembre");
    await click(el, "li button");
    expect(stub.calls.services).to.deep.equal([
      {
        domain: "quartermaster",
        service: "add_to_shopping_list",
        data: { product: "2", from_suggestion: true },
      },
    ]);
    expect(text(el)).to.contain("Caffè aggiunto alla lista della spesa.");
  });

  it("shows the action error", async () => {
    const stub = stubHass({ serviceError: { code: "unauthorized", message: "Unauthorized" } });
    const el = await mount("quartermaster-suggestions-card", stub);
    await click(el, "li button");
    expect(text(el)).to.contain("You are not allowed to change the inventory.");
  });

  it("has no add buttons for users who cannot write", async () => {
    const el = await mount("quartermaster-suggestions-card", readOnly());
    expect($$(el, "button")).to.have.length(0);
    expect(text(el)).to.contain("only users allowed to write");
  });
});

describe("essentials card", () => {
  it("lists essentials with present, minimum, target and status", async () => {
    const el = await mount("quartermaster-essentials-card", stubHass());
    const rows = $$(el, "li").map((li) => (li.textContent ?? "").replace(/\s+/g, " "));
    expect(rows).to.have.length(3);
    expect(rows[0]).to.contain("Caffè").and.contain("Low");
    expect(rows[1]).to.contain("Latte").and.contain("1 bottiglia").and.contain("To buy");
    expect(rows[2]).to.contain("Pasta").and.contain("OK");
  });

  it("edits minimum and target", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-essentials-card", stub);
    await click(el, 'li[data-product="1"] button.edit');
    setValue(el, "edit-min", "3");
    setValue(el, "edit-target", "6");
    await click(el, 'li[data-product="1"] button.primary');
    expect(stub.calls.services[0]).to.deep.equal({
      domain: "quartermaster",
      service: "set_essential",
      data: { product: "1", essential: true, min_stock: 3, target_stock: 6 },
    });
  });

  it("refuses a target below the minimum without calling the action", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-essentials-card", stub);
    await click(el, 'li[data-product="1"] button.edit');
    setValue(el, "edit-min", "3");
    setValue(el, "edit-target", "2");
    await click(el, 'li[data-product="1"] button.primary');
    expect(stub.calls.services).to.have.length(0);
    expect(text(el)).to.contain("cannot be below the minimum");
  });

  it("removes and adds essentials", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-essentials-card", stub);
    await click(el, 'li[data-product="4"] button.edit');
    await click(el, 'li[data-product="4"] button.danger');
    expect(stub.calls.services[0].data).to.deep.equal({ product: "4", essential: false });
    await click(el, ".actions button");
    setValue(el, "add-product", "3");
    setValue(el, "add-min", "2");
    await click(el, ".form button.primary");
    expect(stub.calls.services[1].data).to.deep.equal({
      product: "3",
      essential: true,
      min_stock: 2,
    });
  });

  it("is read-only for users who cannot write", async () => {
    const el = await mount("quartermaster-essentials-card", readOnly());
    expect($$(el, "button")).to.have.length(0);
    expect($$(el, "li")).to.have.length(3);
  });
});

describe("proposals card", () => {
  it("shows items before and after, and what was not seen", async () => {
    const el = await mount("quartermaster-proposals-card", stubHass());
    expect(text(el)).to.contain("Frigo");
    expect(text(el)).to.contain("Latte");
    expect(text(el)).to.contain("1 → 2 bottiglia");
    expect(text(el)).to.contain("Not recognized: yogurt");
    expect(text(el)).to.contain("Choose the product to apply this item.");
    expect(text(el)).to.contain("Not seen: Burro");
  });

  it("confirms all", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-proposals-card", stub);
    await click(el, "button.confirm-all");
    expect(stub.calls.services[0]).to.deep.equal({
      domain: "quartermaster",
      service: "confirm_pending",
      data: { proposal_id: 7, decision: "confirm" },
    });
  });

  it("confirms the selected items with a correction", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-proposals-card", stub);
    $<HTMLInputElement>(el, 'li[data-key="0"] input[type="checkbox"]').click();
    await el.updateComplete;
    await click(el, 'li[data-key="1"] button.correct');
    setValue(el, "p7-k1-product", "3");
    setValue(el, "p7-k1-quantity", "2");
    await click(el, "button.confirm-selected");
    expect(stub.calls.services[0].data).to.deep.equal({
      proposal_id: 7,
      decision: "confirm",
      items: [1],
      corrections: [{ key: 1, product: "3", quantity: 2 }],
    });
  });

  it("rejects", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-proposals-card", stub);
    await click(el, "button.reject");
    expect(stub.calls.services[0].data).to.deep.equal({ proposal_id: 7, decision: "reject" });
  });

  it("is read-only for users who cannot write", async () => {
    const el = await mount("quartermaster-proposals-card", readOnly());
    expect($$(el, "button")).to.have.length(0);
    expect($$(el, "input")).to.have.length(0);
  });

  it("says when nothing is pending", async () => {
    const el = await mount(
      "quartermaster-proposals-card",
      stubHass({ language: "it", snapshot: sampleSnapshot({ proposals: [] }) }),
    );
    expect(text(el)).to.contain(itStrings.proposals_empty);
  });
});

describe("inventory card", () => {
  it("shows the products of its zone with plus and minus", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-inventory-card", stub, { zone: "fridge", title: "Frigo" });
    expect($$(el, "li")).to.have.length(2);
    expect(text(el)).to.contain("Latte").and.contain("Uova").and.not.contain("Pasta");
    expect($<HTMLButtonElement>(el, 'li[data-product="3"] button.minus').disabled).to.equal(true);
    await click(el, 'li[data-product="1"] button.plus');
    await click(el, 'li[data-product="1"] button.minus');
    expect(stub.calls.services.map((c) => c.data)).to.deep.equal([
      { product: "1", operation: "purchase", quantity: 1, zone: "fridge" },
      { product: "1", operation: "consume", quantity: 1, zone: "fridge" },
    ]);
  });

  it("groups by zone without a zone", async () => {
    const el = await mount("quartermaster-inventory-card", stubHass());
    expect($$(el, "h3").map((h) => h.textContent)).to.deep.equal(["Frigo", "Dispensa"]);
  });

  it("sets a quantity", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-inventory-card", stub, { zone: "pantry" });
    await click(el, 'li[data-product="4"] button.edit');
    setValue(el, "set-quantity", "5");
    await click(el, 'li[data-product="4"] .form button.primary');
    expect(stub.calls.services[0]).to.deep.include({ service: "set_stock" });
    expect(stub.calls.services[0].data).to.deep.equal({ product: "4", quantity: 5, zone: "pantry" });
  });

  it("adds a new product with its quantity", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-inventory-card", stub, { zone: "pantry" });
    await click(el, "button.new-product");
    expect($<HTMLSelectElement>(el, '[name="new-zone"]').value).to.equal("pantry");
    setValue(el, "new-name", "Riso");
    setValue(el, "new-quantity", "2");
    await click(el, ".form button.primary");
    await aTimeout(0);
    expect(stub.calls.services.map((c) => [c.service, c.data])).to.deep.equal([
      ["add_product", { name: "Riso", essential: false, default_zone: "pantry" }],
      ["set_stock", { product: "Riso", quantity: 2, zone: "pantry" }],
    ]);
  });

  it("is read-only for users who cannot write", async () => {
    const el = await mount("quartermaster-inventory-card", readOnly(), { zone: "fridge" });
    expect($$(el, "button")).to.have.length(0);
    expect($$(el, "li")).to.have.length(2);
  });
});

describe("history card", () => {
  it("loads the journal and undoes an operation", async () => {
    const stub = stubHass({ language: "it" });
    const el = await mount("quartermaster-history-card", stub);
    await waitUntil(() => $$(el, "li").length === 2);
    expect(stub.calls.ws).to.deep.include({ type: "quartermaster/journal", limit: 50 });
    expect(text(el)).to.contain("Consumo").and.contain("Alexa").and.contain("Annullato");
    expect($$(el, "button.undo")).to.have.length(1);
    await click(el, "button.undo");
    expect(stub.calls.services[0]).to.deep.equal({
      domain: "quartermaster",
      service: "undo_last",
      data: { operation_id: "op-b" },
    });
  });

  it("uses the configured limit", async () => {
    const stub = stubHass();
    await mount("quartermaster-history-card", stub, { limit: 10 });
    await waitUntil(() => stub.calls.ws.length > 0);
    expect(stub.calls.ws[0]).to.deep.equal({ type: "quartermaster/journal", limit: 10 });
  });

  it("has no undo for users who cannot write", async () => {
    const el = await mount("quartermaster-history-card", readOnly());
    await waitUntil(() => $$(el, "li").length === 2);
    expect($$(el, "button")).to.have.length(0);
  });
});

describe("zone card", () => {
  it("shows the last update and the products in the zone", async () => {
    const el = await mount("quartermaster-zone-card", stubHass(), { zone: "fridge" });
    expect(text(el)).to.contain("Frigo");
    expect(text(el)).to.contain("Updated 9 days ago");
    expect(text(el)).to.contain("Latte").and.not.contain("Uova");
  });

  it("needs a zone", () => {
    const el = document.createElement("quartermaster-zone-card") as Card;
    expect(() => el.setConfig({ type: "custom:quartermaster-zone-card" })).to.throw();
  });

  it("reports an unknown zone", async () => {
    const el = await mount("quartermaster-zone-card", stubHass(), { zone: "garage" });
    expect(text(el)).to.contain("No zone called garage.");
  });
});

describe("photo card", () => {
  async function pickPhoto(el: Card) {
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1200;
    must(canvas.getContext("2d")).fillRect(0, 0, 1600, 1200);
    const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(must(b)), "image/png"));
    const transfer = new DataTransfer();
    transfer.items.add(new File([blob], "photo.png", { type: "image/png" }));
    const input = $<HTMLInputElement>(el, 'input[type="file"]');
    input.files = transfer.files;
    input.dispatchEvent(new Event("change"));
  }

  it("preselects the configured zone and offers the camera", async () => {
    const el = await mount("quartermaster-photo-card", stubHass(), { zone: "pantry" });
    expect($<HTMLSelectElement>(el, '[name="zone"]').value).to.equal("pantry");
    const input = $<HTMLInputElement>(el, 'input[type="file"]');
    expect(input.accept).to.equal("image/*");
    expect(input.getAttribute("capture")).to.equal("environment");
  });

  it("shows the Android note only on Android", async () => {
    const el = (await mount("quartermaster-photo-card", stubHass({ language: "it" }))) as Card &
      QuartermasterPhotoCard;
    expect($$(el, ".android-note")).to.have.length(0);
    el.android = true;
    el.requestUpdate();
    await el.updateComplete;
    expect(text(el)).to.contain(itStrings.photo_android_note);
  });

  it("uploads a resized JPEG and shows the proposal", async () => {
    const stub = stubHass({
      ws: () => ({
        image_usable: true,
        applied: [],
        proposal_id: 9,
        proposed: [
          { key: 0, product_id: 1, product: "Latte", seen_as: "latte", current: 1, proposed: 2, unit: null, confidence: 0.7 },
        ],
        not_seen: [],
        unknown: [],
      }),
    });
    const el = await mount("quartermaster-photo-card", stub, { zone: "fridge" });
    await pickPhoto(el);
    await waitUntil(() => text(el).includes("to confirm"), undefined, { timeout: 5000 });
    const message = stub.calls.ws[0] as { type: string; zone: string; image: string };
    expect(message.type).to.equal("quartermaster/upload_photo");
    expect(message.zone).to.equal("fridge");
    expect(message.image.startsWith("/9j/")).to.equal(true);
    expect(text(el)).to.contain("1 change to confirm in Proposals.");
    expect(text(el)).to.contain("Latte: 1 → 2");
  });

  it("shows a translated upload error", async () => {
    const stub = stubHass({
      language: "it",
      ws: () => {
        throw {
          code: "daily_limit",
          message: "x",
          translation_key: "daily_limit",
          translation_placeholders: { limit: "20" },
        };
      },
    });
    const el = await mount("quartermaster-photo-card", stub, { zone: "fridge" });
    await pickPhoto(el);
    await waitUntil(() => text(el).includes("limite"), undefined, { timeout: 5000 });
    expect(text(el)).to.contain("Hai raggiunto il limite giornaliero di 20 analisi di immagini.");
  });

  it("has no upload for users who cannot write", async () => {
    const el = await mount("quartermaster-photo-card", readOnly(), { zone: "fridge" });
    expect($$(el, "input")).to.have.length(0);
    expect(text(el)).to.contain("only users allowed to write");
  });
});

const IMAGE = { content_type: "image/jpeg", data: "AAAA" };

/** A stub that answers `quartermaster/image` with a crop and everything else with `result`. */
function imageStub(snapshot = sampleSnapshot(), result: unknown = {}, language = "en") {
  return stubHass({
    language,
    snapshot,
    ws: (message) => {
      if (message.type === "quartermaster/image") {
        return IMAGE;
      }
      return result;
    },
  });
}

describe("zone card: checks, crop and show mode", () => {
  const withShelf = (zone = shelfZone(), extra = {}) =>
    sampleSnapshot({ zones: [...sampleSnapshot().zones, zone], ...extra });

  it("shows the last check, the crop, show mode and the photo request", async () => {
    const stub = imageStub(withShelf());
    const el = await mount("quartermaster-zone-card", stub, { zone: "shelf" });
    await waitUntil(() => $$(el, "img.crop").length === 1);
    expect(stub.calls.ws).to.deep.include({ type: "quartermaster/image", zone_id: "shelf" });
    expect($<HTMLImageElement>(el, "img.crop").src).to.equal("data:image/jpeg;base64,AAAA");
    expect(text(el)).to.contain("Last check").and.contain("updated").and.contain("82% sure");
    expect(text(el)).to.contain("Show mode on until");
    expect(text(el)).to.contain("Last shown: Pasta").and.contain("Consumed 1");
    expect(text(el)).to.contain("A photo of this zone was requested");
    expect(text(el)).to.contain("Camera, Show to camera, Manual");
  });

  it("checks now and arms show mode", async () => {
    const stub = imageStub(withShelf());
    const el = await mount("quartermaster-zone-card", stub, { zone: "shelf" });
    await click(el, "button.check");
    await click(el, "button.arm");
    expect(stub.calls.services).to.deep.equal([
      { domain: "quartermaster", service: "check_zone", data: { zone: "shelf" } },
      { domain: "quartermaster", service: "arm_show_mode", data: { zone: "shelf" } },
    ]);
    expect(text(el)).to.contain("Show mode on for Scaffale");
  });

  it("shows a failed check, an error and show mode off in Italian", async () => {
    const zone = shelfZone({
      last_check: { ts: new Date().toISOString(), status: "failed", overall_confidence: null },
      in_error: true,
      has_image: false,
      show_armed_until: new Date(Date.now() - 60000).toISOString(),
      last_show: null,
    });
    const stub = imageStub(withShelf(zone, { photo_requests: [] }), {}, "it");
    const el = await mount("quartermaster-zone-card", stub, { zone: "shelf" });
    expect(text(el)).to.contain("non riuscito").and.contain(itStrings.zone_in_error);
    expect(text(el)).to.contain(itStrings.show_off);
    expect(text(el)).to.not.contain("Ultimo prodotto mostrato");
    expect($$(el, "img")).to.have.length(0);
    expect(stub.calls.ws).to.have.length(0);
  });

  it("degrades with an older integration: no check data, no show mode", async () => {
    const stub = imageStub();
    const el = await mount("quartermaster-zone-card", stub, { zone: "fridge" });
    expect(text(el)).to.not.contain("Last check").and.not.contain("Show mode");
    expect($$(el, "button.check")).to.have.length(1);
    expect($$(el, "button.arm")).to.have.length(0);
    expect(stub.calls.ws).to.have.length(0);
  });

  it("says when a zone was never checked", async () => {
    const el = await mount("quartermaster-zone-card", imageStub(withShelf(shelfZone({ last_check: null }))), {
      zone: "shelf",
    });
    expect(text(el)).to.contain("Never checked");
  });

  it("has no actions for users who cannot write", async () => {
    const el = await mount("quartermaster-zone-card", imageStub(withShelf(undefined, { can_write: false })), {
      zone: "shelf",
    });
    expect($$(el, "button")).to.have.length(0);
  });
});

describe("proposals card: purchases and crops", () => {
  const purchase = {
    proposal_id: 8,
    kind: "purchase",
    zone_id: null,
    channel: "dashboard",
    created: new Date().toISOString(),
    has_image: true,
    items: [
      { key: 0, product_id: 1, product: "Latte", seen_as: "LATTE PS", current: null, proposed: 2, unit: "bottiglia", confidence: 0.95 },
    ],
    not_seen: [],
  };

  it("shows a purchase with the quantity bought and its crop", async () => {
    const stub = imageStub(sampleSnapshot({ proposals: [purchase] }));
    const el = await mount("quartermaster-proposals-card", stub);
    await waitUntil(() => $$(el, "img.crop").length === 1);
    expect(stub.calls.ws).to.deep.include({ type: "quartermaster/image", proposal_id: 8 });
    expect(text(el)).to.contain("Purchase,").and.contain("bought: 2 bottiglia");
    expect(text(el)).to.not.contain("→").and.not.contain("Unknown zone");
  });

  it("confirms and corrects a purchase like a count", async () => {
    const stub = imageStub(sampleSnapshot({ proposals: [purchase] }));
    const el = await mount("quartermaster-proposals-card", stub);
    await click(el, 'li[data-key="0"] button.correct');
    setValue(el, "p8-k0-quantity", "3");
    await click(el, "button.confirm-all");
    expect(stub.calls.services[0].data).to.deep.equal({
      proposal_id: 8,
      decision: "confirm",
      corrections: [{ key: 0, quantity: 3 }],
    });
  });

  it("does not ask for a crop without has_image", async () => {
    const stub = imageStub();
    const el = await mount("quartermaster-proposals-card", stub);
    expect($$(el, "img")).to.have.length(0);
    expect(stub.calls.ws).to.have.length(0);
  });
});

describe("photo card: receipts", () => {
  async function pickFile(el: Card) {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 800;
    must(canvas.getContext("2d")).fillRect(0, 0, 400, 800);
    const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(must(b)), "image/png"));
    const transfer = new DataTransfer();
    transfer.items.add(new File([blob], "receipt.png", { type: "image/png" }));
    const input = $<HTMLInputElement>(el, 'input[type="file"]');
    input.files = transfer.files;
    input.dispatchEvent(new Event("change"));
  }

  it("sends a receipt without a zone and shows the purchase proposal", async () => {
    const stub = stubHass({
      language: "it",
      ws: () => ({
        proposal_id: 12,
        items: [
          { key: 0, product_id: 1, product: "Latte", seen_as: "LATTE", current: null, proposed: 2, unit: null, confidence: 0.9 },
          { key: 1, product_id: null, product: null, seen_as: "BISCOTTI", current: null, proposed: 1, unit: null, confidence: 0.6 },
        ],
        unknown: ["BISCOTTI"],
      }),
    });
    const el = await mount("quartermaster-photo-card", stub, { zone: "fridge" });
    setValue(el, "kind", "receipt");
    await el.updateComplete;
    expect($$(el, '[name="zone"]')).to.have.length(0);
    await pickFile(el);
    await waitUntil(() => text(el).includes("Proposte"), undefined, { timeout: 5000 });
    const message = stub.calls.ws[0] as Record<string, string>;
    expect(message.type).to.equal("quartermaster/upload_photo");
    expect(message.kind).to.equal("receipt");
    expect(message).to.not.have.property("zone");
    expect(text(el)).to.contain("2 acquisti da confermare in Proposte.");
    expect(text(el)).to.contain("Latte: 2").and.contain("Non riconosciuto: BISCOTTI");
  });

  it("offers receipts even without zones", async () => {
    const el = await mount("quartermaster-photo-card", stubHass({ snapshot: sampleSnapshot({ zones: [] }) }));
    expect(text(el)).to.contain("No zones yet");
    setValue(el, "kind", "receipt");
    await el.updateComplete;
    expect($$(el, 'input[type="file"]')).to.have.length(1);
  });
});

describe("zones card", () => {
  const snapshot = () => sampleSnapshot({ zones: [...sampleSnapshot().zones, shelfZone()] });

  it("lists the zones with their sources", async () => {
    const el = await mount("quartermaster-zones-card", stubHass({ snapshot: snapshot() }));
    expect($$(el, "ul.rows > li")).to.have.length(3);
    expect(text(el)).to.contain("Zone management").and.contain("shelf · Camera · Show to camera · Manual");
  });

  it("adds a zone", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-zones-card", stub);
    await click(el, "button.new-zone");
    setValue(el, "new-zone-name", "Garage");
    setValue(el, "new-zone-aliases", "box, rimessa ,");
    await click(el, "button.add-zone");
    expect(stub.calls.services).to.deep.equal([
      { domain: "quartermaster", service: "add_zone", data: { name: "Garage", aliases: ["box", "rimessa"] } },
    ]);
    expect(text(el)).to.contain("Zone Garage added.");
  });

  it("needs a name for a new zone", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-zones-card", stub);
    await click(el, "button.new-zone");
    await click(el, "button.add-zone");
    expect(stub.calls.services).to.have.length(0);
    expect(text(el)).to.contain("Enter a name.");
  });

  it("deletes a zone only after confirmation", async () => {
    const stub = stubHass({ language: "it" });
    const el = await mount("quartermaster-zones-card", stub);
    await click(el, 'li[data-zone="pantry"] button.delete');
    expect(text(el)).to.contain("Eliminare la zona Dispensa?");
    await click(el, 'li[data-zone="pantry"] .confirm button.cancel');
    expect(stub.calls.services).to.have.length(0);
    await click(el, 'li[data-zone="pantry"] button.delete');
    await click(el, "button.confirm-delete");
    expect(stub.calls.services).to.deep.equal([
      { domain: "quartermaster", service: "remove_zone", data: { zone: "pantry" } },
    ]);
  });

  it("edits a zone and sends it back whole, sources in order", async () => {
    const stub = stubHass({ snapshot: snapshot() });
    const el = await mount("quartermaster-zones-card", stub);
    await click(el, 'li[data-zone="shelf"] button.edit');
    expect($<HTMLInputElement>(el, '[name="zone-checkSchedule"]').value).to.equal("0 19 * * *");
    expect($<HTMLInputElement>(el, '[name="s0-roi"]').value).to.equal("0, 0, 0.5, 1");
    setValue(el, "zone-name", "Scaffale garage");
    setValue(el, "zone-reminderDays", "7");
    setValue(el, "zone-confidenceThreshold", "");
    setValue(el, "s0-max_checks_per_day", "2");
    setValue(el, "s0-roi", "0, 0, 1, 1");
    // Manual first, then remove the camera_show source.
    await click(el, 'li.source[data-index="2"] button.up');
    await click(el, 'li.source[data-index="1"] button.up');
    await click(el, 'li.source[data-index="2"] button.remove-source');
    await click(el, "button.save");
    expect(stub.calls.services).to.have.length(1);
    expect(stub.calls.services[0].service).to.equal("set_zone");
    expect(stub.calls.services[0].data).to.deep.equal({
      zone: "shelf",
      name: "Scaffale garage",
      aliases: ["mensola"],
      sources: [
        { type: "manual" },
        { type: "camera", entity_id: "camera.garage", roi: [0, 0, 1, 1], max_age_minutes: 30, max_checks_per_day: 2 },
      ],
      check_schedule: "0 19 * * *",
      reminder_days: 7,
      confidence_threshold: null,
    });
    expect(text(el)).to.contain("Zone Scaffale garage saved.");
  });

  it("keeps fields it does not know", async () => {
    const stub = stubHass({ snapshot: snapshot() });
    const el = await mount("quartermaster-zones-card", stub);
    await click(el, 'li[data-zone="shelf"] button.edit');
    await click(el, "button.save");
    const sources = stub.calls.services[0].data.sources as Record<string, unknown>[];
    expect(sources[1]).to.deep.equal({
      type: "camera_show",
      entity_id: "camera.garage",
      trigger_entity: "binary_sensor.garage_motion",
      arm_minutes: 10,
      future_field: "kept",
    });
  });

  it("asks for the privacy notice before adding a show to camera source", async () => {
    const stub = stubHass({ snapshot: snapshot() });
    const el = await mount("quartermaster-zones-card", stub);
    await click(el, 'li[data-zone="shelf"] button.edit');
    expect($$(el, ".privacy")).to.have.length(0);
    setValue(el, "new-source-type", "passage");
    await el.updateComplete;
    expect(text(el)).to.contain("Frames from this camera can show people");
    expect($<HTMLButtonElement>(el, "button.add-source-button").disabled).to.equal(true);
    $<HTMLInputElement>(el, '[name="privacy-ack"]').click();
    await el.updateComplete;
    await click(el, "button.add-source-button");
    expect($$(el, "li.source")).to.have.length(4);
    expect($<HTMLInputElement>(el, '[name="s3-entity_id"]').getAttribute("list")).to.equal("entities-camera");
    await click(el, "button.save");
    expect(stub.calls.services).to.have.length(0);
    expect(text(el)).to.contain("4. Passage camera: fill in Camera.");
    setValue(el, "s3-entity_id", "camera.garage");
    setValue(el, "s3-trigger_entity", "event.doorbell");
    setValue(el, "s3-capture", "burst");
    setValue(el, "s3-announce", "notify.phone");
    await click(el, "button.save");
    const sources = stub.calls.services[0].data.sources as Record<string, unknown>[];
    expect(sources[3]).to.deep.equal({
      type: "passage",
      entity_id: "camera.garage",
      trigger_entity: "event.doorbell",
      capture: "burst",
      announce: ["notify.phone"],
    });
  });

  it("suggests entities of the right domain", async () => {
    const el = await mount("quartermaster-zones-card", stubHass({ snapshot: snapshot() }));
    await click(el, 'li[data-zone="shelf"] button.edit');
    const options = $$(el, "datalist#entities-camera option").map((o) => (o as HTMLOptionElement).value);
    expect(options).to.deep.equal(["camera.garage"]);
    const triggers = $$(el, "datalist#entities-event-binary_sensor option").map(
      (o) => (o as HTMLOptionElement).value,
    );
    expect(triggers).to.deep.equal(["binary_sensor.garage_motion", "event.doorbell"]);
  });

  it("refuses an invalid area", async () => {
    const stub = stubHass({ snapshot: snapshot(), language: "it" });
    const el = await mount("quartermaster-zones-card", stub);
    await click(el, 'li[data-zone="shelf"] button.edit');
    setValue(el, "s0-roi", "0.5, 0, 0.2, 1");
    await click(el, "button.save");
    expect(stub.calls.services).to.have.length(0);
    expect(text(el)).to.contain("1. Telecamera: l'area deve essere");
  });

  it("edits only name and aliases with an older integration", async () => {
    const stub = stubHass();
    const el = await mount("quartermaster-zones-card", stub);
    await click(el, 'li[data-zone="fridge"] button.edit');
    expect($$(el, '[name="zone-checkSchedule"]')).to.have.length(0);
    expect($$(el, "li.source")).to.have.length(0);
    expect($$(el, '[name="new-source-type"]')).to.have.length(0);
    setValue(el, "zone-aliases", "frigo");
    await click(el, "button.save");
    expect(stub.calls.services[0].data).to.deep.equal({ zone: "fridge", name: "Frigo", aliases: ["frigo"] });
  });

  it("is read-only for users who cannot write", async () => {
    const el = await mount("quartermaster-zones-card", readOnly());
    expect($$(el, "button")).to.have.length(0);
    expect($$(el, "ul.rows > li")).to.have.length(2);
  });
});
