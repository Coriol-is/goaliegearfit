// scripts/verify-dataset.ts — dataset integrity gate (ENG-04).
// Runs under plain `node` (erasable-syntax TypeScript, Node >=22.18 type stripping).
// Invoked as `npm run verify-dataset` and via the `prebuild` hook, and as the
// first CI gate: any throw is a build/CI failure (fail-closed).
//
// Checks, in order (semantics ported from the planning repo's publish gate,
// hockey-goalie-gear/data/sizing/validate_and_publish.py):
//   1. sha256 of raw file bytes for every manifest.files[] entry
//   2. JSON Schema validation of the dataset (draft 2020-12 → Ajv 2020 build + ajv-formats)
//   3. fixture integrity: base + extra case count === manifest.fixtureCount, ids unique
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const DIR = "src/data/sizing";

interface ManifestFile {
  path: string;
  sha256: string;
}

interface Manifest {
  datasetId: string;
  version: string;
  files: ManifestFile[];
  ruleCount: number;
  fixtureCount: number;
}

interface FixtureFile {
  cases: Array<{ id: string }>;
}

const manifest: Manifest = JSON.parse(readFileSync(`${DIR}/manifest.json`, "utf8"));

// 1. sha256 raw-byte check of every manifest-listed file (never re-serialize).
for (const f of manifest.files) {
  const path = `${DIR}/${f.path}`;
  const digest = createHash("sha256").update(readFileSync(path)).digest("hex");
  if (digest !== f.sha256) {
    throw new Error(
      `sha256 mismatch for ${path}: computed ${digest}, manifest lists ${f.sha256}`,
    );
  }
}

// 2. JSON Schema validation (schema is draft 2020-12 and uses format: "date" —
// the default Ajv export targets draft-07 and would reject it).
const schema = JSON.parse(readFileSync(`${DIR}/sizing-rules.schema.json`, "utf8"));
const dataset = JSON.parse(readFileSync(`${DIR}/goalie-leg-pads-us-v0.1.json`, "utf8"));
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
if (!ajv.validate(schema, dataset)) {
  throw new Error(
    `schema validation failed for ${DIR}/goalie-leg-pads-us-v0.1.json: ${ajv.errorsText()}`,
  );
}

// 3. Fixture integrity: the manifest's files[] covers only dataset + schema, so
// the count/uniqueness check is the fixtures' compensating integrity guard.
const basePath = `${DIR}/fixtures/goalie-leg-pads-us-v1.cases.json`;
const extraPath = `${DIR}/fixtures/goalie-leg-pads-us-v0.1.cases.json`;
const base: FixtureFile = JSON.parse(readFileSync(basePath, "utf8"));
const extra: FixtureFile = JSON.parse(readFileSync(extraPath, "utf8"));
const total = base.cases.length + extra.cases.length;
if (total !== manifest.fixtureCount) {
  throw new Error(
    `fixture count mismatch: ${base.cases.length} base (${basePath}) + ` +
      `${extra.cases.length} extra (${extraPath}) = ${total}, ` +
      `manifest.fixtureCount is ${manifest.fixtureCount}`,
  );
}
const ids = [...base.cases, ...extra.cases].map((c) => c.id);
const unique = new Set(ids);
if (unique.size !== ids.length) {
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  throw new Error(`duplicate fixture case ids across ${basePath} + ${extraPath}: ${dupes.join(", ")}`);
}

console.log(
  `dataset integrity OK: ${manifest.datasetId} v${manifest.version}, ` +
    `${manifest.ruleCount} rules, ${total} fixtures`,
);
