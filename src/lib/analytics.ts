export const analyticsEvents = {
  brandSelected: "Calculator Brand Selected",
  completed: "Calculator Completed",
  failClosed: "Calculator Fail Closed",
  comparisonUsed: "Calculator Comparison Used",
} as const;

export type AnalyticsEvent =
  | { name: typeof analyticsEvents.brandSelected; props: { brand: string } }
  | { name: typeof analyticsEvents.completed; props: { brand: string; status: string } }
  | { name: typeof analyticsEvents.failClosed; props: { brand: string; status: string; reason: string } }
  | { name: typeof analyticsEvents.comparisonUsed; props: { brand: string; status: string } };

export type AnalyticsTransport = (event: AnalyticsEvent) => void;
export type AnalyticsProvider = "none" | "plausible" | "ga";
export type AnalyticsConfig =
  | { provider: "none" }
  | { provider: "plausible"; scriptSrc: string }
  | { provider: "ga"; measurementId: string; scriptSrc: string };

declare global {
  interface Window {
    analyticsTrack?: AnalyticsTransport;
    plausible?: (name: string, options: { props: Record<string, string> }) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function resolveAnalyticsConfig(providerValue?: string, plausibleValue?: string, gaValue?: string): AnalyticsConfig {
  const provider = providerValue?.trim().toLowerCase() as AnalyticsProvider | undefined;
  if (provider === "plausible") {
    const scriptSrc = resolvePlausibleScriptSrc(plausibleValue);
    return scriptSrc ? { provider, scriptSrc } : { provider: "none" };
  }
  if (provider === "ga") {
    const measurementId = gaValue?.trim().toUpperCase();
    return measurementId && /^G-[A-Z0-9]+$/.test(measurementId)
      ? { provider, measurementId, scriptSrc: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}` }
      : { provider: "none" };
  }
  return { provider: "none" };
}

export function resolvePlausibleScriptSrc(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.hostname !== "plausible.io" || !url.pathname.startsWith("/js/")) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function googleEventName(name: AnalyticsEvent["name"]): string {
  return ({
    [analyticsEvents.brandSelected]: "calculator_brand_selected",
    [analyticsEvents.completed]: "calculator_completed",
    [analyticsEvents.failClosed]: "calculator_fail_closed",
    [analyticsEvents.comparisonUsed]: "calculator_comparison_used",
  } as const)[name];
}

export function sendAnalytics(event: AnalyticsEvent, transport?: AnalyticsTransport): boolean {
  const target = transport ?? (typeof window === "undefined" ? undefined : window.analyticsTrack);
  if (!target) return false;
  target(event);
  return true;
}

export function failClosedReason(status: string, reason?: string): string {
  if (status === "cannot_determine") return reason ?? "unspecified";
  if (status === "extension_not_available") return "extension_not_available";
  if (status === "conflict") return "conflicting_measurements";
  return "unspecified";
}
