import datasetJson from "../../data/sizing/goalie-leg-pads-us-v0.1.json";

export const brandSlugs = ["bauer", "ccm", "true", "warrior", "brians"] as const;
export type BrandSlug = (typeof brandSlugs)[number];
const names: Record<BrandSlug, string> = { bauer: "Bauer", ccm: "CCM", true: "TRUE", warrior: "Warrior", brians: "Brian's" };
const vendorSources: Record<BrandSlug, { websiteUrl: string; sizingUrl: string; logoPath: string }> = {
  bauer: { websiteUrl: "https://www.bauer.com/", sizingUrl: "https://www.bauer.com/pages/size-guide-goalie-pads", logoPath: "/brand-logos/bauer.png" },
  ccm: { websiteUrl: "https://us.ccmhockey.com/homepage.html", sizingUrl: "https://us.ccmhockey.com/Goalie/Explore/Protective-Accessories/KPXF-SR.html", logoPath: "/brand-logos/ccm.svg" },
  true: { websiteUrl: "https://www.true-sports.com/en-ca/", sizingUrl: "https://customizer.truetempergoalie.com/storage/IzCEzVuCHNb0grhMr13qhou2hSxc6v95VbeOy6AQ.pdf", logoPath: "/brand-logos/true.png" },
  warrior: { websiteUrl: "https://www.warrior.com/en/products/hockey", sizingUrl: "https://warriorsupport.zendesk.com/hc/en-us/articles/42271631661203-24-25-Goalie-Leg-Pad-Sizing-Chart", logoPath: "/brand-logos/warrior.svg" },
  brians: { websiteUrl: "https://www.goalies-only.com/", sizingUrl: "https://www.goalies-only.com/custom-fitting-pads/", logoPath: "/brand-logos/brians.png" },
};

type RawRule = (typeof datasetJson.rules)[number];
export interface BrandChart {
  slug: BrandSlug; brand: string; datasetId: string; version: string; market: string; reviewedAt: string;
  vendor: (typeof vendorSources)[BrandSlug];
  support: (typeof datasetJson.brandSupport)[keyof typeof datasetJson.brandSupport];
  rules: RawRule[]; categories: Array<{ name: string; rules: RawRule[] }>;
}

export function getBrandCharts(): BrandChart[] {
  return brandSlugs.map((slug) => {
    const brand = names[slug];
    const rules = datasetJson.rules.filter((rule) => rule.brand === brand);
    const categories = [...new Set(rules.map((rule) => rule.category))].map((name) => ({ name, rules: rules.filter((rule) => rule.category === name) }));
    return { slug, brand, datasetId: datasetJson.datasetId, version: datasetJson.version, market: datasetJson.market, reviewedAt: datasetJson.reviewedAt, vendor: vendorSources[slug], support: datasetJson.brandSupport[brand as keyof typeof datasetJson.brandSupport], rules, categories };
  });
}

export function getBrandChart(slug: BrandSlug): BrandChart { return getBrandCharts().find((chart) => chart.slug === slug)!; }
