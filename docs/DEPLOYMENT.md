# Production delivery

The live custom domain is served by the existing Cloudflare Pages Git integration, not the legacy Workers deploy job. The Pages project follows `Coriol-is/goaliegearfit`, production branch `main`, build command `npm run build`, output `dist`.

GitHub Actions gates pull requests with dataset, test, type and build checks. Merge only the reviewed green PR tree. Pages then builds the merged commit; the push workflow waits for that same SHA on the custom domain and verifies canonicals, indexability, robots and sitemap. The HTML build marker reads `CF_PAGES_COMMIT_SHA` on Pages and `GITHUB_SHA` on Actions.

No Cloudflare deploy secret is needed in GitHub for this configured integration. Existing duplicate Workers and account secrets are not modified by this change. Preview environments may intentionally remain noindex; production must retain its custom-origin and analytics build variables. A green Pages build does not establish user interaction or Google indexing; those are verified separately.
