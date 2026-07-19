# Analytics configuration and verification

Analytics defaults to `none`. A production build loads exactly one selected provider; incomplete or invalid configuration also resolves to `none`.

## Provider selection

Set `PUBLIC_ANALYTICS_PROVIDER` in the Cloudflare Pages production environment:

- `none` — no analytics script or events (default).
- `plausible` — also set `PUBLIC_PLAUSIBLE_SCRIPT_SRC` to the exact HTTPS script URL from **Plausible Site Settings → General → Site Installation**. Create goals matching the semantic names below.
- `ga` — also set `PUBLIC_GA_MEASUREMENT_ID` to the GA4 web stream's `G-...` Measurement ID. The build uses Google's official `gtag.js` loader and `config` command.

Never select both. The provider switch emits one script only.

## Shared semantic events

| Meaning | Plausible name | GA4 custom-event name | Properties |
| --- | --- | --- | --- |
| Brand choice | `Calculator Brand Selected` | `calculator_brand_selected` | `brand` |
| Valid submission | `Calculator Completed` | `calculator_completed` | `brand`, `status` |
| Honest stop | `Calculator Fail Closed` | `calculator_fail_closed` | `brand`, `status`, `reason` |
| Comparison rendered | `Calculator Comparison Used` | `calculator_comparison_used` | `brand`, `status` |

Only bounded categorical values are allowed. Measurements, recommended sizes tied to an interaction, free text, query strings, rule IDs, and PII are forbidden. If the provider script is missing or blocked, events no-op and the calculator remains functional.

## Privacy and consent

Plausible's standard hosted product is cookieless and designed for aggregate traffic without persistent identifiers. That provider is the Phase 4 choice for the consent-free requirement, subject to local legal review.

Google Analytics is not equivalent: GA4 normally stores a client ID in the first-party `_ga` cookie. Do not set provider `ga` until the site's privacy disclosure and jurisdiction-appropriate consent mechanism are approved. Google Consent Mode communicates consent state but does not provide a banner; a basic implementation can block the Google tag until consent is granted. This repository does not invent that legal/product decision.

## Production verification

After deployment, inspect the HTML to confirm only the selected provider script exists. Exercise all four interactions on the production custom domain, verify network requests, then verify events in Plausible goals or GA4 Realtime/DebugView. Until that account-side check is recorded, analytics is implemented but not claimed live.
