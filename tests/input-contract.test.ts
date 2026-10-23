import { describe, expect, it } from "vitest";
import raw from "../src/data/sizing/goalie-leg-pads-us-v0.1.json";
import type { Dataset } from "../src/lib/engine/types";
import { recommend } from "../src/lib/engine/recommend";
import {
  comparisonResults,
  transitionMeasurements,
  resultExplanation,
  resultMetadataHtml,
  validateMeasurements,
  measurementHelp,
} from "../src/lib/calculator/ui";
const data = raw as Dataset;
describe("measurement input contracts", () => {
  it("preserves FTK base size regardless of advisory height anchor membership", () => {
    for (const height_in of [undefined, 64, 64.1, 70.5]) {
      const out = recommend(data, {
        brand: "Warrior",
        floor_to_knee_in: 20,
        height_in,
      });
      expect(out.sizes).toEqual(['34"']);
      expect(out.status).toBe("candidate");
      expect(out.height_advisory?.status).toBe(
        height_in === undefined
          ? "not_supplied"
          : height_in === 64
            ? "different_anchor"
            : height_in === 70.5
              ? "matches_anchor"
              : "unlisted",
      );
      expect(resultExplanation(data, out)).not.toContain("height");
      if (height_in !== undefined)
        expect(resultMetadataHtml(out)).toContain(`${height_in} in supplied`);
    }
  });
  it("preserves base and height assessment when requested extension is unavailable", () => {
    const out = recommend(data, {
      brand: "Warrior",
      floor_to_knee_in: 21,
      height_in: 73.5,
      knee_to_thigh_in: 8.5,
    });
    expect(out.sizes).toEqual(['36"']);
    expect(out.extension_options).toEqual([
      { size: '36"', status: "unavailable" },
    ]);
    expect(out.height_advisory?.status).toBe("matches_anchor");
  });
  it("retains base size and discloses an unreviewed extension", () => {
    const out = recommend(data, {
      brand: "Warrior",
      floor_to_knee_in: 18.5,
      knee_to_thigh_in: 123,
    });
    expect(out.sizes).toEqual(['31"']);
    expect(resultMetadataHtml(out)).toContain("extension not verified");
  });
  it("separates CCM unsupported anchors from disjoint supported rows", () => {
    for (const cm of [170, 175, 180])
      expect(
        recommend(data, {
          brand: "CCM",
          floor_to_knee_in: 18.5,
          height_in: cm / 2.54,
        }),
      ).toMatchObject({
        status: "cannot_determine",
        reason: "unsupported_height",
      });
    expect(
      recommend(data, { brand: "CCM", floor_to_knee_in: 18.5, height_in: 68 })
        .sizes,
    ).toEqual(["32"]);
    expect(
      recommend(data, { brand: "CCM", floor_to_knee_in: 18.5, height_in: 69 })
        .status,
    ).toBe("conflict");
  });
  it("requires remeasurement when changing between standing and seated FTK", () => {
    for (const brand of ["Bauer", "CCM", "TRUE"] as const) {
      expect(
        transitionMeasurements(brand, "Warrior", { primary: 19 }).primary,
      ).toBeUndefined();
      expect(
        transitionMeasurements("Warrior", brand, { primary: 19 }).primary,
      ).toBeUndefined();
      expect(
        comparisonResults(data, brand, {
          primary: 19,
          category: brand === "Bauer" ? "SENIOR" : "SR",
          height: 68,
        }).find((r) => r.brand === "Warrior")?.text,
      ).toMatch(/Remeasure/);
    }
    expect(
      transitionMeasurements("Bauer", "TRUE", { primary: 19 }).primary,
    ).toBe(19);
  });
  it("keeps Vaughn unsupported and gives anatomical rather than preference hints", () => {
    expect(validateMeasurements("Vaughn", {})).toMatch(/No reviewed/);
    expect(measurementHelp["Brian's"].ktt).toMatch(/mid-knee to mid-thigh/);
  });
});

it("does not reuse KTT across Brian and Warrior protocols", () => {
  expect(
    transitionMeasurements("Brian's", "Warrior", { primary: 18, ktt: 12 }).ktt,
  ).toBeUndefined();
  expect(
    transitionMeasurements("Warrior", "Brian's", { primary: 19, ktt: 9 }).ktt,
  ).toBeUndefined();
});
