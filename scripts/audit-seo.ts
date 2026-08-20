import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { contentPages } from "../src/lib/site-routes.ts";

const dist = "dist";
const failures: string[] = [];
const titles = new Map<string, string>();
const descriptions = new Map<string, string>();

function capture(html: string, pattern: RegExp): string | undefined {
  return html.match(pattern)?.[1]?.trim();
}

function pageFile(path: string): string {
  return path === "/" ? join(dist, "index.html") : join(dist, path, "index.html");
}

function requireUnique(value: string | undefined, route: string, label: string, seen: Map<string, string>): void {
  if (!value) {
    failures.push(`${route}: missing ${label}`);
    return;
  }
  const previous = seen.get(value);
  if (previous) failures.push(`${route}: duplicate ${label} also used by ${previous}`);
  seen.set(value, route);
}

for (const page of contentPages) {
  const file = pageFile(page.path);
  if (!existsSync(file)) {
    failures.push(`${page.path}: missing rendered page`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const title = capture(html, /<title>([^<]+)<\/title>/i);
  const description = capture(html, /<meta name="description" content="([^"]+)"/i);
  const canonical = capture(html, /<link rel="canonical" href="([^"]+)"/i);
  const robots = capture(html, /<meta name="robots" content="([^"]+)"/i);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;

  requireUnique(title, page.path, "title", titles);
  requireUnique(description, page.path, "meta description", descriptions);
  if (!canonical?.startsWith("https://")) failures.push(`${page.path}: canonical is missing or not HTTPS`);
  if (!canonical?.endsWith(page.path)) failures.push(`${page.path}: canonical path does not match route`);
  if (!robots?.startsWith("index,follow")) failures.push(`${page.path}: page is not indexable`);
  if (h1Count !== 1) failures.push(`${page.path}: expected one h1, found ${h1Count}`);
  if (!html.includes('property="og:url"')) failures.push(`${page.path}: missing og:url`);
  if (!html.includes('name="twitter:card"')) failures.push(`${page.path}: missing Twitter card metadata`);

  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch { failures.push(`${page.path}: invalid JSON-LD`); }
  }
}

const notFound = readFileSync(join(dist, "404.html"), "utf8");
if (!notFound.includes('content="noindex,nofollow"')) failures.push("/404: missing noindex,nofollow");

const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
for (const page of contentPages) {
  if (!sitemap.includes(`<lastmod>${page.lastmod}</lastmod>`)) failures.push(`${page.path}: missing sitemap lastmod`);
  if (!sitemap.includes(`>${page.path === "/" ? "https://goaliegearfit.com/" : `https://goaliegearfit.com${page.path}`}<`)) failures.push(`${page.path}: missing from sitemap`);
}
if (sitemap.includes("/404/")) failures.push("/404: must not appear in sitemap");

if (failures.length) throw new Error(`SEO audit failed:\n${failures.join("\n")}`);
console.log(`SEO audit passed: ${contentPages.length} indexable pages, unique metadata, valid canonicals, JSON-LD, sitemap, and noindexed 404`);
