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
 // Original numerical fixtures remain immutable; these three editorial contracts changed explicitly.
 const policyUpdates:Record<string,{before:Record<string,unknown>;after:Record<string,unknown>}>={
  "ccm-below":{before:{status:"conflict",sizes:[]},after:{status:"cannot_determine",reason:"unsupported_height",sizes:[]}},
  "warrior-height-conflict":{before:{status:"conflict",sizes:[]},after:{status:"candidate",sizes:['34"'],height_advisory:{status:"different_anchor",supplied_in:60,row_anchors_in:[70.5]}}},
  "warrior-extension-na":{before:{status:"cannot_determine",reason:"extension_not_available"},after:{status:"candidate",sizes:['36"'],extension_options:[{size:'36"',status:"unavailable"}]}}
 };
 it("retains every policy-updated case in the published inventory",()=>{for(const id of Object.keys(policyUpdates))expect(base.cases.some(c=>c.id===id)).toBe(true)});
 for(const c of base.cases) it(c.id,()=>{const actual=recommend(dataset,c.input as EngineInput),update=policyUpdates[c.id];if(update)expect(c.expected).toEqual(update.before);const expected=update?.after??c.expected;expect(project(actual,expected)).toEqual(expected)});
 for(const c of extra.cases.filter(c=>c.id.startsWith("brians-provisional-"))) it(c.id,()=>{const r=recommend(dataset,c.input as EngineInput);const actual={...r,size:r.sizes.length===1?r.sizes[0]:undefined,public_result_allowed:Boolean(r.display_badge)};expect(project(actual,c.expected)).toEqual(c.expected)});
 for(const c of extra.cases.filter(c=>c.id.startsWith("support-"))) it(c.id,()=>{const support=dataset.brandSupport[c.input.brand];expect(support.status).toBe(c.expected.support_status);if("result_status" in c.expected)expect(recommend(dataset,c.input as EngineInput).status).toBe(c.expected.result_status);if("display_badge" in c.expected){const r=recommend(dataset,{...c.input,ankle_to_knee_in:18,knee_to_thigh_in:12} as EngineInput);expect(project({...r,support_status:support.status,public_result_allowed:Boolean(r.display_badge)},c.expected)).toMatchObject(c.expected)}});
});
