import datasetJson from "../../data/sizing/goalie-leg-pads-us-v0.1.json";

export const brandSlugs = ["bauer", "ccm", "true", "warrior", "brians"] as const;
export type BrandSlug = (typeof brandSlugs)[number];
const names: Record<BrandSlug, string> = { bauer: "Bauer", ccm: "CCM", true: "TRUE", warrior: "Warrior", brians: "Brian's" };

type RawRule = (typeof datasetJson.rules)[number];
export interface BrandChart {
  slug: BrandSlug; brand: string; datasetId: string; version: string; market: string; reviewedAt: string;
  support: (typeof datasetJson.brandSupport)[keyof typeof datasetJson.brandSupport];
  rules: RawRule[]; categories: Array<{ name: string; rules: RawRule[] }>;
}

export function getBrandCharts(): BrandChart[] {
  return brandSlugs.map((slug) => {
    const brand = names[slug];
    const rules = datasetJson.rules.filter((rule) => rule.brand === brand);
    const categories = [...new Set(rules.map((rule) => rule.category))].map((name) => ({ name, rules: rules.filter((rule) => rule.category === name) }));
    return { slug, brand, datasetId: datasetJson.datasetId, version: datasetJson.version, market: datasetJson.market, reviewedAt: datasetJson.reviewedAt, support: datasetJson.brandSupport[brand as keyof typeof datasetJson.brandSupport], rules, categories };
  });
}

export function getBrandChart(slug: BrandSlug): BrandChart { return getBrandCharts().find((chart) => chart.slug === slug)!; }
