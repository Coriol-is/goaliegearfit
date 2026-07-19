export const analyticsEvents = {
  brandSelected: "Calculator Brand Selected",
  completed: "Calculator Completed",
  failClosed: "Calculator Fail Closed",
} as const;

export type AnalyticsEvent =
  | { name: typeof analyticsEvents.brandSelected; props: { brand: string } }
  | { name: typeof analyticsEvents.completed; props: { brand: string; status: string } }
  | { name: typeof analyticsEvents.failClosed; props: { brand: string; status: string; reason: string } };

export type AnalyticsTransport = (name: string, options: { props: Record<string, string> }) => void;

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

declare global {
  interface Window {
    plausible?: AnalyticsTransport;
  }
}

export function sendAnalytics(event: AnalyticsEvent, transport?: AnalyticsTransport): boolean {
  const target = transport ?? (typeof window === "undefined" ? undefined : window.plausible);
  if (!target) return false;
  target(event.name, { props: event.props });
  return true;
}

export function failClosedReason(status: string, reason?: string): string {
  if (status === "cannot_determine") return reason ?? "unspecified";
  if (status === "extension_not_available") return "extension_not_available";
  if (status === "conflict") return "conflicting_measurements";
  return "unspecified";
}
