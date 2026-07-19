import { describe, expect, it, vi } from "vitest";
import { analyticsEvents, failClosedReason, googleEventName, resolveAnalyticsConfig, sendAnalytics } from "../src/lib/analytics";

describe("provider-neutral privacy-safe analytics", () => {
  it("defaults invalid or incomplete configuration to provider-off", () => {
    expect(resolveAnalyticsConfig()).toEqual({ provider: "none" });
    expect(resolveAnalyticsConfig("plausible", "javascript:alert(1)")).toEqual({ provider: "none" });
    expect(resolveAnalyticsConfig("ga", undefined, "UA-OLD")).toEqual({ provider: "none" });
  });

  it("selects exactly one validated provider", () => {
    expect(resolveAnalyticsConfig("plausible", "https://plausible.io/js/pa-example.js", "G-IGNORED")).toEqual({ provider: "plausible", scriptSrc: "https://plausible.io/js/pa-example.js" });
    expect(resolveAnalyticsConfig("ga", "https://plausible.io/js/pa-ignored.js", "g-abc123")).toEqual({ provider: "ga", measurementId: "G-ABC123", scriptSrc: "https://www.googletagmanager.com/gtag/js?id=G-ABC123" });
  });

  it("forwards only the typed semantic payload", () => {
    const transport = vi.fn();
    const event = { name: analyticsEvents.completed, props: { brand: "CCM", status: "candidate" } } as const;
    expect(sendAnalytics(event, transport)).toBe(true);
    expect(transport).toHaveBeenCalledWith(event);
  });

  it("maps the shared event contract to stable GA4 names", () => {
    expect(googleEventName(analyticsEvents.brandSelected)).toBe("calculator_brand_selected");
    expect(googleEventName(analyticsEvents.comparisonUsed)).toBe("calculator_comparison_used");
  });

  it("normalizes fail-closed reasons to bounded categories", () => {
    expect(failClosedReason("conflict")).toBe("conflicting_measurements");
    expect(failClosedReason("extension_not_available")).toBe("extension_not_available");
    expect(failClosedReason("cannot_determine", "missing_required_input")).toBe("missing_required_input");
  });
});
