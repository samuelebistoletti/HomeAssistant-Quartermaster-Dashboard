import { expect } from "@open-wc/testing";

import { stringsFor } from "../src/localize";
import { QuartermasterDashboardStrategy } from "../src/strategy";

const hass = (language: string, components: string[]) => ({
  language,
  config: { components },
});

describe("QuartermasterDashboardStrategy", () => {
  it("warns when the integration is missing", async () => {
    const config = await QuartermasterDashboardStrategy.generate({}, hass("en", []));
    const card = config.views[0].sections[0].cards[0];
    expect(card.content).to.equal(stringsFor("en").missing_integration);
  });

  it("uses the user language", async () => {
    const config = await QuartermasterDashboardStrategy.generate(
      {},
      hass("it", ["quartermaster"]),
    );
    const card = config.views[0].sections[0].cards[0];
    expect(card.content).to.equal(stringsFor("it").under_development);
  });

  it("keeps a title set in the dashboard config", async () => {
    const config = await QuartermasterDashboardStrategy.generate(
      { title: "Pantry" },
      hass("en", ["quartermaster"]),
    );
    expect(config.title).to.equal("Pantry");
  });
});

describe("stringsFor", () => {
  it("falls back to English", () => {
    expect(stringsFor("xx-YY")).to.equal(stringsFor("en"));
    expect(stringsFor("it-IT")).to.equal(stringsFor("it"));
  });
});

describe("registration", () => {
  it("registers the strategy element and the dialog entry", async () => {
    await import("../src/quartermaster-dashboard");
    expect(customElements.get("ll-strategy-dashboard-quartermaster")).to.not.equal(undefined);
    const entry = window.customStrategies?.find((s) => s.type === "quartermaster");
    expect(entry?.strategyType).to.equal("dashboard");
  });
});
