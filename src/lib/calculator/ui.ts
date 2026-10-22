import { recommend } from "../engine/recommend";
import type {
  CannotDetermineReason,
  Dataset,
  EngineInput,
  Result,
} from "../engine/types";
export const brandInputs = {
  Bauer: {
    slug: "bauer",
    method: "floor_to_knee",
    category: true,
    height: false,
    ktt: false,
  },
  CCM: {
    slug: "ccm",
    method: "floor_to_knee",
    category: false,
    height: true,
    ktt: false,
  },
  TRUE: {
    slug: "true",
    method: "floor_to_knee",
    category: true,
    height: false,
    ktt: false,
  },
  Warrior: {
    slug: "warrior",
    method: "floor_to_knee",
    category: false,
    height: true,
    ktt: true,
  },
  "Brian's": {
    slug: "brians",
    method: "ankle_to_knee",
    category: false,
    height: false,
    ktt: true,
  },
  Vaughn: {
    slug: "vaughn",
    method: "ankle_to_knee",
    category: false,
    height: false,
    ktt: false,
  },
} as const;
export type CalculatorBrand = keyof typeof brandInputs;
export const supportedPreset = (v: string | null) =>
  Object.entries(brandInputs).find(
    ([, c]) => c.slug === v?.toLowerCase(),
  )?.[0] as CalculatorBrand | undefined;
export const toInches = (v: number, u: "in" | "cm") =>
  u === "cm" ? v / 2.54 : v;
export const reasonCopy: Record<CannotDetermineReason, string> = {
  missing_category: "Choose the age or level category used by this chart.",
  missing_height: "Add standing height to check this brand's published anchor.",
  missing_floor_to_knee:
    "Add the floor-to-knee measurement required by this chart.",
  source_gap:
    "The reviewed chart has no rule for this measurement. Recheck it or consult a qualified fitter.",
  personal_preference_not_base_size_rule:
    "Thigh-rise preference cannot determine the sourced base pad size.",
  extension_not_available:
    "The reviewed chart marks this extension as unavailable.",
  no_official_mapping:
    "No reviewed official mapping supports a recommendation for this brand.",
};
export const statusHeading = (r: Result) =>
  r.status === "candidate"
    ? "Recommended chart size"
    : r.status === "adjacent_sizes"
      ? "Adjacent chart sizes"
      : r.status === "conflict"
        ? "Measurements conflict"
        : "Cannot determine a size";
const measurementNames = {
  floor_to_knee: "floor-to-knee",
  height: "standing height",
  height_anchor: "optional printed standing-height anchor",
  ankle_to_knee: "ankle-to-knee",
  knee_to_thigh: "knee-to-thigh",
} as const;
const formatNumber = (value: number) =>
  Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
export function resultExplanation(dataset: Dataset, result: Result) {
  const rules = result.matchedRuleIds
    .map((id) => dataset.rules.find((rule) => rule.id === id))
    .filter((rule) => rule !== undefined);
  if (!rules.length) return "";
  return rules
    .map((rule) => {
      const ranges = rule.dimensions.map((d) => {
        const n = d.sourceNative;
        const low = n?.min ?? d.min,
          high = n?.max ?? d.max,
          unit = n?.unit ?? d.unit;
        const range =
          low === high && low !== null
            ? formatNumber(low)
            : `${low === null ? "open" : formatNumber(low)}–${high === null ? "open" : formatNumber(high)}`;
        return `${measurementNames[d.field]} ${range} ${unit}`;
      });
      const category =
        rule.category && rule.category !== "source_not_explicit"
          ? ` (${rule.category})`
          : "";
      return `${rule.brand}${category}: ${ranges.join(" and ")} maps to size ${rule.sizeLabel}.`;
    })
    .join(" ");
}
export function buildInput(
  brand: CalculatorBrand,
  v: { category?: string; primary?: number; height?: number; ktt?: number },
): EngineInput {
  const c = brandInputs[brand];
  return {
    brand,
    ...(c.category && v.category ? { category: v.category } : {}),
    ...(c.method === "floor_to_knee"
      ? { floor_to_knee_in: v.primary }
      : { ankle_to_knee_in: v.primary }),
    ...(c.height && v.height !== undefined ? { height_in: v.height } : {}),
    ...(c.ktt && v.ktt !== undefined ? { knee_to_thigh_in: v.ktt } : {}),
  };
}
export function comparisonResults(
  dataset: Dataset,
  selected: CalculatorBrand,
  v: { category?: string; primary: number; height?: number; ktt?: number },
) {
  return (Object.keys(brandInputs) as CalculatorBrand[])
    .filter((name) => name !== "Vaughn")
    .map((name) => {
      const c = brandInputs[name],
        active = brandInputs[selected];
      if (c.method !== active.method)
        return { brand: name, text: "Different measurement method needed." };
      if (c.category && name !== selected)
        return { brand: name, text: "Brand-specific category needed." };
      if (name === "CCM" && v.height === undefined)
        return { brand: name, text: "Standing height needed." };
      if (name === "Brian's" && v.ktt === undefined)
        return { brand: name, text: "Knee-to-thigh needed." };
      const r = recommend(
        dataset,
        buildInput(name, {
          ...v,
          category: name === selected ? v.category : undefined,
        }),
      );
      return {
        brand: name,
        text: r.sizes.length ? r.sizes.join(" or ") : statusHeading(r),
      };
    });
}
export const comparisonHtml = (
  dataset: Dataset,
  selected: CalculatorBrand,
  v: { category?: string; primary: number; height?: number; ktt?: number },
) =>
  comparisonResults(dataset, selected, v)
    .map(
      (row) =>
        `<div><strong>${row.brand}</strong><span>${row.text}</span></div>`,
    )
    .join("");

export type Measurements = { primary?: number; height?: number; ktt?: number };
/** Canonical inches survive display-unit round trips without accumulating rounding. */
export function displayMeasurement(
  value: number | undefined,
  unit: "in" | "cm",
) {
  return value === undefined
    ? ""
    : String(Number((unit === "cm" ? value * 2.54 : value).toFixed(8)));
}
export function transitionMeasurements(
  previous: CalculatorBrand,
  next: CalculatorBrand,
  v: Measurements,
): Measurements {
  const before = brandInputs[previous],
    after = brandInputs[next];
  return {
    primary: before.method === after.method ? v.primary : undefined,
    height: after.height && before.height ? v.height : undefined,
    ktt: after.ktt && before.ktt ? v.ktt : undefined,
  };
}
export function validateMeasurements(
  brand: CalculatorBrand,
  v: Measurements,
  category?: string,
): string | undefined {
  if (brand === "Vaughn")
    return "No reviewed official mapping supports Vaughn. Choose another brand or consult its official fitting support.";
  if (!v.primary || !Number.isFinite(v.primary) || v.primary <= 0)
    return "Enter a measurement greater than zero.";
  if (brandInputs[brand].category && !category)
    return "Choose the product chart category; it describes the pad range, not playing skill.";
  for (const [key, value] of Object.entries(v)) {
    if (value !== undefined && (!Number.isFinite(value) || value <= 0))
      return `Enter a valid positive ${key === "ktt" ? "knee-to-thigh" : key} measurement.`;
  }
  if (brand === "CCM" && v.height === undefined)
    return "CCM requires standing height as well as floor-to-knee.";
  if (brand === "Brian's" && v.ktt === undefined)
    return "Brian's requires both ankle-to-knee and knee-to-thigh.";
}
export const coverageCopy: Record<CalculatorBrand, string> = {
  Bauer:
    "Choose the product category printed on your pad chart, not your playing skill. Only reviewed chart ranges are supported.",
  CCM: "Requires FTK and an exact published standing-height anchor. Unlisted heights are unsupported; we do not interpolate.",
  TRUE: "Choose JR, INT or SR from the product chart, not your playing skill.",
  Warrior:
    "Reviewed Ritual 2024–25 chart. Standing height is optional advisory input; knee-to-thigh optionally checks a published extension.",
  "Brian's":
    "Limited verified-tool coverage: only 14 exact ATK + knee-to-thigh pairs. Model/category scope is unconfirmed. For other measurements use the official tool or a dealer.",
  Vaughn:
    "Unsupported: no reviewed official sizing mapping. Consult Vaughn or an experienced dealer before measuring for this calculator.",
};
export function resultMetadataHtml(out: Result) {
  const provenance = `${out.display_badge ? `<p><strong>${out.display_badge}</strong></p>` : ""}${out.knee_block_verification_required ? "<p><strong>Mandatory knee-block verification:</strong> this provisional chart match needs a physical knee-block fit check.</p>" : ""}`;
  const extensions = out.extension_options?.length
    ? `<p>Thigh-rise check for each base chart size:</p><ul>${out.extension_options.map((option) => `<li>Base size ${option.size}: ${option.status === "available" ? `published extension <strong>+${option.extension_in} in</strong>` : option.status === "unavailable" ? "extension unavailable (source marks N/A)" : "base size only; extension not verified for this knee-to-thigh measurement"}.</li>`).join("")}</ul><p>Extension is separate from the base size. An unavailable or unverified extension is not an available pad configuration.</p>`
    : out.extension_in !== undefined
      ? `<p>Published thigh-rise extension: <strong>+${out.extension_in} in</strong>. This is separate from the base size.</p>`
      : "";
  return provenance + extensions;
}
