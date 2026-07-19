import { describe, expect, it, vi } from "vitest";
import { analyticsEvents, failClosedReason, resolvePlausibleScriptSrc, sendAnalytics } from "../src/lib/analytics";

describe("privacy-safe analytics adapter", () => {
  it("is a no-op when no production transport exists", () => {
    expect(sendAnalytics({ name: analyticsEvents.brandSelected, props: { brand: "Bauer" } })).toBe(false);
  });

  it("forwards only the typed categorical event payload", () => {
    const transport = vi.fn();
    expect(sendAnalytics({ name: analyticsEvents.completed, props: { brand: "CCM", status: "size" } }, transport)).toBe(true);
    expect(transport).toHaveBeenCalledWith("Calculator Completed", { props: { brand: "CCM", status: "size" } });
  });

  it("normalizes fail-closed reasons to bounded categories", () => {
    expect(failClosedReason("conflict")).toBe("conflicting_measurements");
    expect(failClosedReason("extension_not_available")).toBe("extension_not_available");
    expect(failClosedReason("cannot_determine", "missing_required_input")).toBe("missing_required_input");
  });

  it("accepts only an HTTPS Plausible script path", () => {
    expect(resolvePlausibleScriptSrc("https://plausible.io/js/pa-example.js")).toBe("https://plausible.io/js/pa-example.js");
    expect(resolvePlausibleScriptSrc("javascript:alert(1)")).toBeUndefined();
    expect(resolvePlausibleScriptSrc("https://example.com/js/tracker.js")).toBeUndefined();
  });
});
