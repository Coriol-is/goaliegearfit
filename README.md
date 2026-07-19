# goaliegearfit

Deterministic hockey goalie leg-pad sizing calculator plus per-brand size-chart
pages for the US market. Static Astro site deployed through Cloudflare Pages
(assets-only); all sizing logic is a pure function of the vendored, published
dataset — no hardcoded size rules, fail-closed when the data cannot support an
answer.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install (deterministic; the only install mode after the first lockfile) |
| `npm run verify-dataset` | Dataset integrity gate: sha256 vs manifest, JSON Schema (2020-12), fixture count/id uniqueness |
| `npm run check` | Astro/TypeScript typecheck |
| `npm test` | Vitest suites |
| `npm run build` | `verify-dataset` (prebuild hook) then `astro build` → `dist/` |
| `npm run scan-dist` | Build-output allowlist scan: no raw/snapshot artifacts ship |

## CI/CD

`.github/workflows/ci.yml` runs the full gate chain (`verify-dataset` →
`astro check` → `vitest` → `build` → `scan-dist`) on every PR and push to
`main`. Cloudflare Pages Git integration is the production deployment source and
builds each pushed main commit after GitHub's gates complete. The dormant
token-gated Workers deploy job remains a harmless fallback and skips when its
secrets are absent.

Pages uses the Node version pinned in `.nvmrc`. The repository's assets-only
`wrangler.jsonc` is retained for the fallback Workers job; Pages may warn that it
does not consume this file, which is benign because Pages serves the Astro
`dist/` output configured in the dashboard.

The deploy job runs only on push to `main`, only after the gates job
succeeds (`needs: gates`), and only when the `CLOUDFLARE_API_TOKEN` /
`CLOUDFLARE_ACCOUNT_ID` repo secrets are present — it skips cleanly while
Cloudflare credentials are deferred. Red gates structurally cannot deploy.

Branch protection is deferred (solo repo): the deploy job re-runs the gates on
every push to `main`, so red gates cannot deploy even on a direct push.

## Dataset updates

The dataset under `src/data/sizing/` is a **read-only vendored copy** of the
published artifacts from the planning repo
(`sizing-calculators/hockey-goalie-gear/data/sizing/`). It is never edited in
place. To update it (D-07 manual re-vendor flow):

1. Re-publish upstream first: run `validate_and_publish.py` in the planning
   repo so `published/` carries the new version with script-generated sha256
   hashes in `manifest.json`. Hashes are never hand-edited.
2. Copy with `cp` — never re-serialize (re-serialization breaks the sha256
   check). Vendor **only** from `published/` and `fixtures/`:
   - `published/goalie-leg-pads-us-v0.1.json` → `src/data/sizing/`
   - `published/sizing-rules.schema.json` → `src/data/sizing/`
   - `published/manifest.json` → `src/data/sizing/`
   - `fixtures/goalie-leg-pads-us-v1.cases.json` → `src/data/sizing/fixtures/`
   - `fixtures/goalie-leg-pads-us-v0.1.cases.json` → `src/data/sizing/fixtures/`

   Never vendor anything from `raw/`, `normalized/`, `drafts/`, `secondary/`,
   or `verification/` — those trees are audit trail (and may contain
   copyrighted manufacturer chart snapshots that must not ship).
3. Open a PR with the copied files. CI re-runs all gates: the sha256 check
   proves the copy is byte-identical to what the publish script emitted, the
   schema validates, and the fixture count/id gate catches a truncated vendor.
4. A human reviews the dataset PR before it ships. The deploy job only runs
   after the merged gates pass on `main`.
