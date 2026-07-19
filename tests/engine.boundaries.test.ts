import {describe,expect,it} from "vitest";
import datasetJson from "../src/data/sizing/goalie-leg-pads-us-v0.1.json";
import {inchesToCm,inRange} from "../src/lib/engine/match";
import type {Dataset} from "../src/lib/engine/types";
const dataset=datasetJson as Dataset;
describe("boundary matching",()=>{
 it("matches every affected source-native inclusive boundary",()=>{
  const checks=dataset.rules.flatMap(r=>r.dimensions.flatMap(d=>[d.sourceNative?.min!==null&&d.sourceNative?.min!==undefined&&d.min!==null&&Math.abs(inchesToCm(d.sourceNative.min)-d.min)>0?[d,d.sourceNative.min] as const:null,d.sourceNative?.max!==null&&d.sourceNative?.max!==undefined&&d.max!==null&&Math.abs(inchesToCm(d.sourceNative.max)-d.max)>0?[d,d.sourceNative.max] as const:null])).filter(x=>x!==null);
  expect(checks.length).toBeGreaterThanOrEqual(14);
  for(const [d,value] of checks) expect(inRange(inchesToCm(value),d)).toBe(true);
 });
 it("honors exclusive and open ends",()=>{const d=dataset.rules.flatMap(r=>r.dimensions).find(d=>d.min===null)!;expect(inRange(-100,d)).toBe(true);expect(inRange(d.max!,{...d,maxInclusive:false})).toBe(false)});
});
