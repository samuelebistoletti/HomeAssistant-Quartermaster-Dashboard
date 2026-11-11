import { expect } from "@open-wc/testing";

import { buildSource, draftSource, parseRoi, splitList } from "../src/sources";

describe("sources", () => {
  it("parses an area", () => {
    expect(parseRoi("0, 0.1, 1, 0.9")).to.deep.equal([0, 0.1, 1, 0.9]);
    expect(parseRoi("0, 0, 1")).to.equal(undefined);
    expect(parseRoi("0, 0, 1, 2")).to.equal(undefined);
    expect(parseRoi("0.6, 0, 0.5, 1")).to.equal(undefined);
  });

  it("splits lists", () => {
    expect(splitList(" a, ,b ")).to.deep.equal(["a", "b"]);
  });

  it("round-trips a source and drops cleared fields", () => {
    const draft = draftSource({ type: "camera", entity_id: "camera.x", roi: [0, 0, 1, 1], max_age_minutes: 30 });
    expect(draft.text.roi).to.equal("0, 0, 1, 1");
    draft.text.max_age_minutes = "";
    expect(buildSource(draft)).to.deep.equal({ type: "camera", entity_id: "camera.x", roi: [0, 0, 1, 1] });
  });

  it("reports missing and invalid fields", () => {
    expect(buildSource(draftSource({ type: "camera_show" }))).to.deep.equal({
      problem: "required",
      field: "entity_id",
    });
    const draft = draftSource({ type: "camera", entity_id: "camera.x" });
    draft.text.max_checks_per_day = "1.5";
    expect(buildSource(draft)).to.deep.equal({ problem: "invalid_number", field: "max_checks_per_day" });
  });

  it("edits the interval of a zone kept by word", () => {
    const draft = draftSource({ type: "ledger", check_days: 30 });
    expect(draft.text.check_days).to.equal("30");
    draft.text.check_days = "0";
    expect(buildSource(draft)).to.deep.equal({ type: "ledger", check_days: 0 });
    draft.text.check_days = "";
    expect(buildSource(draft)).to.deep.equal({ type: "ledger" });
  });

  it("keeps a manual source as it is", () => {
    expect(buildSource(draftSource({ type: "manual" }))).to.deep.equal({ type: "manual" });
  });
});
