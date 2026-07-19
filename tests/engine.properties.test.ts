import {describe,expect,it} from "vitest";
import fc from "fast-check";
import datasetJson from "../src/data/sizing/goalie-leg-pads-us-v0.1.json";
import {recommend} from "../src/lib/engine/recommend";
import type {Dataset,EngineInput} from "../src/lib/engine/types";
const dataset=datasetJson as Dataset;
const arb=fc.record({brand:fc.constantFrom("Bauer","CCM","TRUE","Warrior","Brian's","Vaughn","Nobrand"),category:fc.option(fc.constantFrom("YOUTH","JUNIOR","INTERMEDIATE","SENIOR","JR","INT","SR"),{nil:undefined}),floor_to_knee_in:fc.option(fc.double({min:0,max:100,noNaN:true}),{nil:undefined}),height_in:fc.option(fc.double({min:0,max:100,noNaN:true}),{nil:undefined}),ankle_to_knee_in:fc.option(fc.double({min:0,max:100,noNaN:true}),{nil:undefined}),knee_to_thigh_in:fc.option(fc.double({min:0,max:100,noNaN:true}),{nil:undefined})});
describe("fail closed properties",()=>{
 it("never throws and is deterministic",()=>fc.assert(fc.property(arb,input=>{expect(recommend(dataset,input as EngineInput)).toEqual(recommend(dataset,input as EngineInput))})));
 it("Vaughn never gets a size",()=>fc.assert(fc.property(arb,input=>{expect(recommend(dataset,{...input,brand:"Vaughn"} as EngineInput).status).toBe("cannot_determine")})));
 it("every emitted size is rule backed",()=>fc.assert(fc.property(arb,input=>{const r=recommend(dataset,input as EngineInput);if(r.status==="candidate"||r.status==="adjacent_sizes"){expect(r.sizes.length).toBeGreaterThan(0);expect(r.matchedRuleIds.length).toBeGreaterThan(0)}})));
});
