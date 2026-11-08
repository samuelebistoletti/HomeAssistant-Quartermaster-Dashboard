import { expect } from "@open-wc/testing";

import { stringsFor } from "../src/localize";
import {
  type CardConfig,
  type DashboardConfig,
  QuartermasterDashboardStrategy,
  viewPath,
} from "../src/strategy";
import type { Snapshot } from "../src/types";
import { must, sampleSnapshot } from "./fixtures";

const hass = (
  language: string,
  components: string[],
  callWS: (msg: { type: string }) => Promise<unknown> = async () => sampleSnapshot(),
) => ({
  language,
  config: { components },
  callWS: callWS as <T>(msg: { type: string }) => Promise<T>,
});

const generate = (snapshot: Snapshot, language = "en") =>
  QuartermasterDashboardStrategy.generate({}, hass(language, ["quartermaster"], async () => snapshot));

const cards = (config: DashboardConfig, path: string): CardConfig[] =>
  must(config.views.find((v) => v.path === path)).sections.flatMap((s) => s.cards);

describe("QuartermasterDashboardStrategy", () => {
  it("warns when the integration is missing, without calling the API", async () => {
    let called = false;
    const config = await QuartermasterDashboardStrategy.generate(
      {},
      hass("en", [], async () => {
        called = true;
        return {};
      }),
    );
    expect(called).to.equal(false);
    expect(config.views).to.have.length(1);
    expect(config.views[0].sections[0].cards[0].content).to.equal(
      stringsFor("en").missing_integration,
    );
  });

  it("explains when the integration is not loaded", async () => {
    const config = await QuartermasterDashboardStrategy.generate(
      {},
      hass("it", ["quartermaster"], async () => {
        throw { code: "not_loaded", message: "Quartermaster is not loaded" };
      }),
    );
    expect(config.views[0].sections[0].cards[0].content).to.equal(stringsFor("it").not_loaded);
  });

  it("explains when the integration is too old", async () => {
    const config = await QuartermasterDashboardStrategy.generate(
      {},
      hass("en", ["quartermaster"], async () => {
        throw { code: "unknown_command", message: "Unknown command." };
      }),
    );
    expect(config.views[0].sections[0].cards[0].content).to.equal(stringsFor("en").too_old);
  });

  it("refuses an unknown API version", async () => {
    const config = await generate(sampleSnapshot({ api_version: 2 }));
    expect(String(config.views[0].sections[0].cards[0].content)).to.contain("2");
    expect(config.views).to.have.length(1);
  });

  it("asks the integration for a snapshot", async () => {
    const messages: unknown[] = [];
    await QuartermasterDashboardStrategy.generate(
      {},
      hass("en", ["quartermaster"], async (msg) => {
        messages.push(msg);
        return sampleSnapshot();
      }),
    );
    expect(messages).to.deep.equal([{ type: "quartermaster/snapshot" }]);
  });

  it("builds every view in the user language", async () => {
    const config = await generate(sampleSnapshot(), "it");
    expect(config.views.map((v) => v.path)).to.deep.equal([
      "overview",
      "shopping",
      "essentials",
      "zones",
      "proposals",
      "inventory",
      "expiry",
      "history",
    ]);
    expect(config.views.map((v) => v.title)).to.include("Lista della spesa");
    expect(config.views.every((v) => v.type === "sections")).to.equal(true);
    expect(config.title).to.equal("Quartermaster");
  });

  it("takes entity ids from snapshot.entities", async () => {
    const snapshot = sampleSnapshot();
    const config = await generate(snapshot, "it");
    const overview = cards(config, "overview");
    const tiles = overview.filter((c) => c.type === "tile").map((c) => c.entity);
    expect(tiles).to.deep.equal([
      snapshot.entities.to_buy,
      snapshot.entities.suggestions,
      snapshot.entities.expiring,
      snapshot.entities.pending_proposals,
    ]);
    const button = must(overview.find((c) => c.type === "button"));
    expect(button.entity).to.equal(snapshot.entities.start_shopping);
    expect(button.name).to.equal("Vado a fare la spesa");
    expect(cards(config, "shopping")[1]).to.deep.equal({
      type: "todo-list",
      entity: snapshot.entities.shopping_list,
    });
    expect(cards(config, "expiry")[0].entities).to.deep.equal([snapshot.entities.expiry]);
  });

  it("links the overview tiles to their views", async () => {
    const config = await generate(sampleSnapshot());
    const tile = must(cards(config, "overview").find((c) => c.type === "tile"));
    const action = tile.tap_action as { action: string; navigation_path: string };
    expect(action.action).to.equal("navigate");
    expect(action.navigation_path).to.equal(viewPath("shopping"));
  });

  it("skips entities that are missing", async () => {
    const config = await generate(
      sampleSnapshot({ entities: { to_buy: "sensor.to_buy", expiry: null } }),
    );
    expect(cards(config, "overview").filter((c) => c.type === "tile")).to.have.length(1);
    expect(cards(config, "overview").some((c) => c.type === "button")).to.equal(false);
    expect(cards(config, "expiry")).to.have.length(0);
    expect(cards(config, "shopping").map((c) => c.type)).to.deep.equal([
      "custom:quartermaster-suggestions-card",
    ]);
  });

  it("makes one section per zone, with the photo card for writers", async () => {
    const config = await generate(sampleSnapshot());
    const zones = must(config.views.find((v) => v.path === "zones")).sections;
    expect(zones).to.have.length(2);
    expect(zones[0].cards).to.deep.equal([
      { type: "custom:quartermaster-zone-card", zone: "fridge" },
      { type: "custom:quartermaster-photo-card", zone: "fridge" },
    ]);
    const inventory = must(config.views.find((v) => v.path === "inventory")).sections;
    expect(inventory.map((s) => s.cards[0].zone)).to.deep.equal(["fridge", "pantry"]);
  });

  it("leaves out write-only cards for users who cannot write", async () => {
    const config = await generate(sampleSnapshot({ can_write: false }));
    expect(cards(config, "overview").some((c) => c.type === "button")).to.equal(false);
    expect(cards(config, "zones").some((c) => c.type === "custom:quartermaster-photo-card")).to.equal(
      false,
    );
  });

  it("explains how to add the first zone", async () => {
    const config = await generate(sampleSnapshot({ zones: [] }));
    expect(cards(config, "zones")[0].content).to.equal(stringsFor("en").no_zones);
    expect(cards(config, "inventory")).to.deep.equal([{ type: "custom:quartermaster-inventory-card" }]);
  });

  it("keeps a title set in the dashboard config", async () => {
    const config = await QuartermasterDashboardStrategy.generate(
      { title: "Pantry" },
      hass("en", ["quartermaster"]),
    );
    expect(config.title).to.equal("Pantry");
  });
});

describe("viewPath", () => {
  it("stays inside the current dashboard", () => {
    expect(viewPath("history", "/dashboard-pantry/overview")).to.equal("/dashboard-pantry/history");
    expect(viewPath("history", "/")).to.equal("/lovelace/history");
  });
});

describe("registration", () => {
  it("registers the strategy, the cards and the picker entries", async () => {
    await import("../src/quartermaster-dashboard");
    expect(customElements.get("ll-strategy-dashboard-quartermaster")).to.not.equal(undefined);
    const entry = window.customStrategies?.find((s) => s.type === "quartermaster");
    expect(entry?.strategyType).to.equal("dashboard");
    const config = await generate(sampleSnapshot());
    const used = new Set(
      config.views
        .flatMap((v) => v.sections.flatMap((s) => s.cards))
        .map((c) => c.type)
        .filter((t) => t.startsWith("custom:"))
        .map((t) => t.slice("custom:".length)),
    );
    for (const tag of used) {
      expect(customElements.get(tag), tag).to.not.equal(undefined);
      expect(window.customCards?.some((c) => c.type === tag), tag).to.equal(true);
    }
    expect(used.size).to.equal(7);
  });
});
