import {describe,expect,it} from "vitest";
import datasetJson from "../src/data/sizing/goalie-leg-pads-us-v0.1.json";
import base from "../src/data/sizing/fixtures/goalie-leg-pads-us-v1.cases.json";
import extra from "../src/data/sizing/fixtures/goalie-leg-pads-us-v0.1.cases.json";
import {recommend} from "../src/lib/engine/recommend";
import type {Dataset,EngineInput} from "../src/lib/engine/types";
const dataset=datasetJson as Dataset;
const project=(value:Record<string,unknown>,expected:Record<string,unknown>)=>Object.fromEntries(Object.keys(expected).map(k=>[k,value[k]]));
describe("published fixtures",()=>{
 it("contains 52 base and 20 supporting cases",()=>{expect(base.cases).toHaveLength(52);expect(extra.cases).toHaveLength(20);expect(base.cases.length+extra.cases.length).toBe(72)});
 for(const c of base.cases) it(c.id,()=>{const actual=recommend(dataset,c.input as EngineInput);expect(project(actual,c.expected)).toEqual(c.expected)});
 for(const c of extra.cases.filter(c=>c.id.startsWith("brians-provisional-"))) it(c.id,()=>{const r=recommend(dataset,c.input as EngineInput);const actual={...r,size:r.sizes.length===1?r.sizes[0]:undefined,public_result_allowed:Boolean(r.display_badge)};expect(project(actual,c.expected)).toEqual(c.expected)});
 for(const c of extra.cases.filter(c=>c.id.startsWith("support-"))) it(c.id,()=>{const support=dataset.brandSupport[c.input.brand];expect(support.status).toBe(c.expected.support_status);if("result_status" in c.expected)expect(recommend(dataset,c.input as EngineInput).status).toBe(c.expected.result_status);if("display_badge" in c.expected){const r=recommend(dataset,{...c.input,ankle_to_knee_in:18,knee_to_thigh_in:12} as EngineInput);expect(project({...r,support_status:support.status,public_result_allowed:Boolean(r.display_badge)},c.expected)).toMatchObject(c.expected)}});
});
