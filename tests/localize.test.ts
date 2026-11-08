import { expect } from "@open-wc/testing";

import { format, Localizer, stringsFor } from "../src/localize";
import en from "../src/translations/en";
import itStrings from "../src/translations/it";
import { YEAR } from "./fixtures";

describe("translations", () => {
  it("have the same keys and placeholders in every language", () => {
    expect(Object.keys(itStrings).sort()).to.deep.equal(Object.keys(en).sort());
    const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(placeholders(itStrings[key]), key).to.deep.equal(placeholders(en[key]));
      expect(itStrings[key].trim(), key).to.not.equal("");
    }
  });
});

describe("stringsFor", () => {
  it("falls back to English", () => {
    expect(stringsFor("xx-YY")).to.equal(stringsFor("en"));
    expect(stringsFor(undefined)).to.equal(stringsFor("en"));
    expect(stringsFor("it-IT")).to.equal(stringsFor("it"));
  });
});

describe("format", () => {
  it("replaces known placeholders only", () => {
    expect(format("{a} and {b}", { a: 1 })).to.equal("1 and {b}");
  });
});

describe("Localizer", () => {
  it("formats numbers in the user language", () => {
    expect(new Localizer("it").number(0.5)).to.equal("0,5");
    expect(new Localizer("en").number(0.5)).to.equal("0.5");
    expect(new Localizer("xx").number(0.5)).to.equal("0.5");
  });

  it("chooses plural forms", () => {
    const l = new Localizer("it");
    expect(l.plural("photo_proposal", 1)).to.equal("1 variazione da confermare in Proposte.");
    expect(l.plural("photo_proposal", 3)).to.equal("3 variazioni da confermare in Proposte.");
  });

  it("formats calendar dates without shifting the day", () => {
    expect(new Localizer("it").date(`${YEAR}-11-02`)).to.equal("2 novembre");
    expect(new Localizer("en").date(`${YEAR}-11-02`)).to.equal("November 2");
    expect(new Localizer("en").date("2001-11-02")).to.equal("November 2, 2001");
  });

  it("formats relative times", () => {
    const now = new Date("2026-11-10T12:00:00Z");
    expect(new Localizer("en").relative("2026-11-07T12:00:00Z", now)).to.equal("3 days ago");
    expect(new Localizer("it").relative("2026-11-09T12:00:00Z", now)).to.equal("ieri");
  });
});

describe("suggestion reasons", () => {
  const it_ = new Localizer("it");
  const en_ = new Localizer("en");

  it("reads below_target as a sentence", () => {
    const s = { product_id: 1, have: 1, reason: "below_target", target: 4 };
    expect(it_.reason(s)).to.equal("ne hai 1, di solito ne tieni 4");
    expect(en_.reason(s)).to.equal("you have 1, you usually keep 4");
  });

  it("reads stale_zone as a sentence", () => {
    const s = { product_id: 1, have: 2, reason: "stale_zone", zone: "Frigo", days: 9 };
    expect(it_.reason(s)).to.equal("la zona Frigo non è aggiornata da 9 giorni");
    expect(en_.reason({ ...s, zone: "Fridge" })).to.equal("Fridge has not been updated for 9 days");
    expect(en_.reason({ ...s, zone: "Fridge", days: 1 })).to.equal(
      "Fridge has not been updated for 1 day",
    );
  });

  it("reads finished_recently with a localized date", () => {
    const s = { product_id: 1, have: 0, reason: "finished_recently", date: `${YEAR}-11-02` };
    expect(it_.reason(s)).to.equal("l'hai finito il 2 novembre");
    expect(en_.reason(s)).to.equal("you finished it on November 2");
  });

  it("does not fail on a reason it does not know", () => {
    expect(en_.reason({ product_id: 1, have: 0, reason: "new_reason" })).to.equal("suggested");
  });
});

describe("error messages", () => {
  const l = new Localizer("it");

  it("translates known integration errors with their placeholders", () => {
    expect(
      l.error({
        code: "zone_not_found",
        translation_key: "zone_not_found",
        translation_placeholders: { zone: "Garage" },
      }),
    ).to.equal("Nessuna zona chiamata Garage.");
    expect(l.error({ code: "unauthorized", message: "Unauthorized" })).to.equal(
      itStrings.error_unauthorized,
    );
  });

  it("falls back to the message", () => {
    expect(l.error({ code: "other", message: "Boom" })).to.equal("Qualcosa è andato storto: Boom");
    expect(l.error(new Error("Bang"))).to.equal("Qualcosa è andato storto: Bang");
  });
});
