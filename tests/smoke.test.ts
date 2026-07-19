// tests/smoke.test.ts — dataset/fixture count assertions through real imports.
// Gives the CI vitest step a meaningful gate before Plan 03 lands the engine
// suites: a truncated fixture vendor or a mangled dataset import fails here.
import { describe, expect, test } from "vitest";
import dataset from "../src/data/sizing/goalie-leg-pads-us-v0.1.json";
import manifest from "../src/data/sizing/manifest.json";
import base from "../src/data/sizing/fixtures/goalie-leg-pads-us-v1.cases.json";
import extra from "../src/data/sizing/fixtures/goalie-leg-pads-us-v0.1.cases.json";

describe("vendored dataset smoke", () => {
  test("dataset rule count matches manifest.ruleCount", () => {
    expect(dataset.rules.length).toBe(manifest.ruleCount);
    expect(dataset.rules.length).toBe(76);
  });

  test("base + extra fixture cases match manifest.fixtureCount", () => {
    expect(base.cases.length + extra.cases.length).toBe(manifest.fixtureCount);
    expect(base.cases.length + extra.cases.length).toBe(72);
  });

  test("fixture case ids are unique across both files", () => {
    const ids = [...base.cases, ...extra.cases].map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("dataset and manifest identify the same dataset version", () => {
    expect(dataset.datasetId).toBe(manifest.datasetId);
    expect(dataset.version).toBe(manifest.version);
    expect(dataset.version).toBe("0.1.1");
  });
});
