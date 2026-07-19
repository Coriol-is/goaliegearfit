// scripts/scan-dist.ts — build-output allowlist scan (DEPL-02).
// Runs under plain `node` (erasable-syntax TypeScript). Walks dist/ recursively
// and fails the build on any file whose extension is outside the allowlist or
// whose path matches raw/snapshot naming. The structural guarantee (no raw/
// trees are ever vendored, D-06) is primary; this scan is belt-and-suspenders.
import { readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const ALLOWED = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".xml",
  ".txt",
  ".svg",
  ".ico",
  ".png",
  ".webp",
  ".woff2",
  ".webmanifest",
]);
const FORBIDDEN_PATH = /raw|snapshot/i;

const failures: string[] = [];

function walk(dir: string): void {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (FORBIDDEN_PATH.test(p)) failures.push(`${p}/ (forbidden directory name)`);
      walk(p);
      continue;
    }
    if (!ALLOWED.has(extname(name).toLowerCase())) {
      failures.push(`${p} (extension not in allowlist)`);
    } else if (FORBIDDEN_PATH.test(p)) {
      failures.push(`${p} (path matches raw/snapshot pattern)`);
    }
  }
}

walk("dist");

if (failures.length > 0) {
  throw new Error(`forbidden files in dist/:\n${failures.join("\n")}`);
}
console.log("dist/ clean: no snapshot/raw artifacts, all extensions allowlisted");
