# Analytics setup and verification

The site is prepared for Plausible but intentionally sends nothing until a Plausible site exists and Cloudflare Pages receives the exact site-specific script URL.

## Production setup

1. Create the production site in Plausible after the custom domain is attached.
2. Copy the complete script `src` shown under **Site Settings → General → Site Installation**.
3. Set `PUBLIC_PLAUSIBLE_SCRIPT_SRC` in the Cloudflare Pages production environment to that exact HTTPS URL and redeploy.
4. Create these exact custom-event goals in Plausible:
   - `Calculator Brand Selected`
   - `Calculator Completed`
   - `Calculator Fail Closed`
5. On the production custom domain, select a brand, complete a normal calculation, and exercise a cannot-determine result. Confirm POST requests to Plausible's event endpoint and confirm all three goals appear in the dashboard.

Do not enable localhost capture. Do not put account credentials or API keys in the repository; the script URL is public configuration.

## Privacy contract

Events contain only bounded categorical values: brand, result status, and fail-closed reason. Measurements, free text, query strings, rule IDs, and other user-entered data are forbidden. If the script is absent or blocked, analytics silently no-ops and the calculator remains fully functional.

