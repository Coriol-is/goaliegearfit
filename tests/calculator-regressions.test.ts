import { describe, it, expect } from "vitest";
import raw from "../src/data/sizing/goalie-leg-pads-us-v0.1.json";
import type { Dataset } from "../src/lib/engine/types";
import { inRange } from "../src/lib/engine/match";
import { recommend } from "../src/lib/engine/recommend";
import {
  buildInput,
  comparisonResults,
  displayMeasurement,
  transitionMeasurements,
  validateMeasurements,
  resultMetadataHtml,
} from "../src/lib/calculator/ui";
const data = raw as Dataset;
describe("audited calculator regressions", () => {
  it("intersects CCM FTK and mandatory height rows", () => {
    const r = recommend(data, {
      brand: "CCM",
      floor_to_knee_in: 18.5,
      height_in: 68,
    });
    expect(r.sizes).toEqual(["32"]);
    expect(r.matchedRuleIds).toHaveLength(1);
    expect(r.matchedRuleIds[0]).toMatch(/h68/);
  });
  it("returns the exact CCM intersection for every FTK endpoint and height anchor pair", () => {
    const rows = data.rules.filter((r) => r.brand === "CCM");
    const endpoints = [
      ...new Set(
        rows.flatMap((r) => {
          const f = r.dimensions.find((d) => d.field === "floor_to_knee")!;
          return [f.min, f.max];
        }),
      ),
    ].filter((x): x is number => x !== null);
    const heights = [
      ...new Set(
        rows.map((r) => r.dimensions.find((d) => d.field === "height")!.min!),
      ),
    ];
    for (const ftk of endpoints)
      for (const height of heights) {
        const out = recommend(data, {
          brand: "CCM",
          floor_to_knee_in: ftk / 2.54,
          height_in: height / 2.54,
        });
        const expected = rows
          .filter((r) =>
            r.dimensions.every((d) =>
              inRange(d.field === "height" ? height : ftk, d),
            ),
          )
          .map((r) => r.id);
        expect(out.matchedRuleIds).toEqual(expected);
      }
  });
  it("accepts all exact Brian tuples after cm conversion but rejects nearby measurements", () => {
    for (const row of data.rules.filter((r) => r.brand === "Brian's")) {
      const a = row.dimensions.find((d) => d.field === "ankle_to_knee")!
          .sourceNative!.min!,
        k = row.dimensions.find((d) => d.field === "knee_to_thigh")!
          .sourceNative!.min!;
      for (const atk of [a, (a * 2.54) / 2.54])
        expect(
          recommend(data, {
            brand: "Brian's",
            ankle_to_knee_in: atk,
            knee_to_thigh_in: (k * 2.54) / 2.54,
          }).matchedRuleIds,
        ).toContain(row.id);
      expect(
        recommend(data, {
          brand: "Brian's",
          ankle_to_knee_in: a + 0.001,
          knee_to_thigh_in: k,
        }).sizes,
      ).toEqual([]);
    }
  });
  it("keeps Warrior optional inputs optional in comparison", () => {
    const out = recommend(data, { brand: "Warrior", floor_to_knee_in: 19.75 });
    expect(
      comparisonResults(data, "Warrior", { primary: 19.75 }).find(
        (r) => r.brand === "Warrior",
      )?.text,
    ).toBe(out.sizes.join(" or "));
  });
  it("ignores irrelevant values in submitted input", () =>
    expect(
      buildInput("Bauer", {
        primary: 20,
        category: "SENIOR",
        height: 68,
        ktt: 12,
      }),
    ).toEqual({ brand: "Bauer", category: "SENIOR", floor_to_knee_in: 20 }));
  it("clears incompatible measurements across brand and method changes", () => {
    const b = transitionMeasurements("CCM", "Bauer", {
      primary: 18.5,
      height: 68,
    });
    expect(b).toEqual({ primary: 18.5, height: undefined, ktt: undefined });
    expect(
      transitionMeasurements("Bauer", "Brian's", b).primary,
    ).toBeUndefined();
  });
  it("preserves canonical inches across repeated display-unit switches", () => {
    const canonical = 19.75;
    for (let i = 0; i < 20; i++) {
      expect(displayMeasurement(canonical, "cm")).toBe("50.165");
      expect(displayMeasurement(canonical, "in")).toBe("19.75");
    }
  });
  it("validates required and invalid optional values", () => {
    expect(validateMeasurements("CCM", { primary: 18.5 })).toMatch(
      /standing height/,
    );
    expect(
      validateMeasurements("Warrior", { primary: 19.75, ktt: -1 }),
    ).toMatch(/positive/);
    expect(validateMeasurements("Warrior", { primary: 19.75 })).toBeUndefined();
  });
  it("renders provisional provenance and separate extension", () => {
    expect(
      resultMetadataHtml({
        status: "candidate",
        sizes: ["32"],
        matchedRuleIds: [],
        display_badge: "Tool verified",
        knee_block_verification_required: true,
        extension_in: 1,
      }),
    ).toMatch(/Tool verified.*Mandatory knee-block.*separate from the base/s);
  });
});

describe("Warrior extension rendering", () => {
  it("shows the sourced extension separately from base size", () => {
    const out = recommend(data, {
      brand: "Warrior",
      floor_to_knee_in: 19.5,
      knee_to_thigh_in: 9,
    });
    expect(out.extension_in).toBe(1);
    expect(resultMetadataHtml(out)).toContain("+1 in");
  });
  it("does not fabricate an unavailable extension", () => {
    const out = recommend(data, {
      brand: "Warrior",
      floor_to_knee_in: 20.5,
      knee_to_thigh_in: 8,
    });
    expect(out).toMatchObject({
      status: "cannot_determine",
      reason: "extension_not_available",
    });
    expect(resultMetadataHtml(out)).not.toContain(
      "Published thigh-rise extension",
    );
  });
});
