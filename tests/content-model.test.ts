import {describe,expect,it} from "vitest";
import dataset from "../src/data/sizing/goalie-leg-pads-us-v0.1.json";
import {brandSlugs,getBrandCharts} from "../src/lib/content/brand-charts";

describe("brand chart content model",()=>{
 const charts=getBrandCharts();
 it("emits exactly five supported slugs",()=>{expect(charts.map(c=>c.slug)).toEqual([...brandSlugs]);expect(charts).toHaveLength(5)});
 it("represents all rules exactly once in dataset order",()=>{const ids=charts.flatMap(c=>c.rules.map(r=>r.id));expect(ids).toHaveLength(76);expect(new Set(ids).size).toBe(76);expect(ids).toEqual(dataset.rules.map(r=>r.id))});
 it("preserves provenance and groups categories",()=>{for(const chart of charts){expect(chart.version).toBe("0.1.1");expect(chart.support).toEqual(dataset.brandSupport[chart.brand as keyof typeof dataset.brandSupport]);expect(chart.categories.flatMap(c=>c.rules)).toEqual(chart.rules);for(const rule of chart.rules){expect(rule.sourceRef).toBeTruthy();expect(rule.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)}}});
});
