import {readFileSync} from "node:fs";
import {describe,expect,it} from "vitest";
import {brandCopy} from "../src/content/brand-copy";
import {brandSlugs,getBrandCharts} from "../src/lib/content/brand-charts";
describe("brand page contracts",()=>{
 it("has substantive unique editorial copy for all five routes",()=>{expect(Object.keys(brandCopy)).toEqual([...brandSlugs]);const markers=Object.values(brandCopy).map(c=>c.marker);expect(new Set(markers).size).toBe(5);for(const copy of Object.values(brandCopy)){expect(copy.intro.length).toBeGreaterThan(100);expect(copy.howToRead).toHaveLength(3);expect(copy.warning.length).toBeGreaterThan(70)}});
 it("covers each required semantic",()=>{expect(brandCopy.bauer.marker).toMatch(/category overlap/);expect(brandCopy.ccm.marker).toMatch(/exact height.*unsupported 24/);expect(brandCopy.true.marker).toMatch(/source gaps.*no nearest/);expect(brandCopy.warrior.marker).toMatch(/advisory height.*blank versus N\/A/);expect(brandCopy.brians.marker).toMatch(/provisional.*knee-block/)});
 it("never generates Vaughn",()=>{expect(getBrandCharts().map(c=>c.slug)).toEqual(["bauer","ccm","true","warrior","brians"]);expect(getBrandCharts().some(c=>c.brand==="Vaughn")).toBe(false)});
 it("translates internal category values for users",()=>{const component=readFileSync("src/components/content/SizeChart.astro","utf8");expect(component).toContain('category==="source_not_explicit"');expect(component).toContain("Not specified by manufacturer")});
 it("shows official vendor sources instead of dataset jargon",()=>{const charts=getBrandCharts();for(const chart of charts){expect(chart.vendor.websiteUrl).toMatch(/^https:\/\//);expect(chart.vendor.sizingUrl).toMatch(/^https:\/\//);expect(chart.vendor.logoPath).toMatch(/^\/brand-logos\//)}const component=readFileSync("src/components/content/SourceCitation.astro","utf8");expect(component).toContain("Manufacturer sizing source");expect(component).not.toContain("datasetId");expect(component).not.toContain("version")});
 it("gives the white TRUE logo a dark contrast surface",()=>{expect(getBrandCharts().find(chart=>chart.slug==="true")?.vendor.inverseLogo).toBe(true);expect(readFileSync("src/styles/brand.css","utf8")).toContain(".brand-logo--inverse{background:#132126")});
});
