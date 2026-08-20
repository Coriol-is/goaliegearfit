// Static output is Astro's default; no adapter — assets-only Workers deploy (D-08).
// No Tailwind this phase (deferred to Phase 2, recorded in SKELETON.md).
import { defineConfig } from "astro/config";

// trailingSlash "always": canonical URLs, sitemap entries and internal links all
// use the slash form Cloudflare actually serves (bare paths 308-redirect), so
// Google never sees a canonical that points into a redirect.
export default defineConfig({ trailingSlash: "always" });
