import type {APIRoute} from "astro";import {resolveSiteConfig} from "../lib/site-config";
export const GET:APIRoute=()=>{const site=resolveSiteConfig(import.meta.env.PUBLIC_SITE_ORIGIN);const body=site.launchReady?`User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`:`User-agent: *\nDisallow: /\n`;return new Response(body,{headers:{"Content-Type":"text/plain"}})};
