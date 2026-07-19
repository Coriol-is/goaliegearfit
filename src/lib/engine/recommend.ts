import {gateBrand} from "./brand-support";
import {inRange,inchesToCm} from "./match";
import type {Dataset,DimensionField,EngineInput,Result,Rule} from "./types";
const inputFor=(i:EngineInput,f:DimensionField)=>({floor_to_knee:i.floor_to_knee_in,height:i.height_in,height_anchor:i.height_in,ankle_to_knee:i.ankle_to_knee_in,knee_to_thigh:i.knee_to_thigh_in})[f];
function matchesDimension(r:Rule,f:DimensionField,i:EngineInput){const d=r.dimensions.find(x=>x.field===f),v=inputFor(i,f);if(!d||v===undefined)return false;if((f==="ankle_to_knee"||f==="knee_to_thigh")&&d.sourceNative)return v===d.sourceNative.min&&v===d.sourceNative.max;return inRange(inchesToCm(v),d)}
const result=(rules:Rule[],dec:object):Result=>{const unique=rules.filter((rule,index)=>rules.findIndex(other=>other.sizeLabel===rule.sizeLabel)===index);return {status:unique.length===1?"candidate":"adjacent_sizes",sizes:unique.map(r=>r.sizeLabel),matchedRuleIds:rules.map(r=>r.id),...dec}};
export function recommend(dataset:Dataset,input:EngineInput):Result {
 const gate=gateBrand(dataset,input.brand);if("status" in gate)return gate;
 const rules=dataset.rules.filter(r=>r.brand===input.brand),categorized=rules.some(r=>r.category&&r.category!=="source_not_explicit");
 if(categorized&&!input.category)return {status:"cannot_determine",reason:"missing_category",sizes:[],matchedRuleIds:[],...gate};
 if(input.requested_thigh_rise!==undefined)return {status:"cannot_determine",reason:"personal_preference_not_base_size_rule",sizes:[],matchedRuleIds:[],...gate};
 const scoped=categorized?rules.filter(r=>r.category===input.category):rules,fields=new Set(scoped.flatMap(r=>r.dimensions.map(d=>d.field)));
 if(fields.has("floor_to_knee")&&input.floor_to_knee_in===undefined)return {status:"cannot_determine",reason:"missing_floor_to_knee",sizes:[],matchedRuleIds:[],...gate};
 if(fields.has("height")&&input.height_in===undefined)return {status:"cannot_determine",reason:"missing_height",sizes:[],matchedRuleIds:[],...gate};
 if(fields.has("ankle_to_knee")&&input.ankle_to_knee_in===undefined||fields.has("knee_to_thigh")&&input.knee_to_thigh_in===undefined)return {status:"cannot_determine",reason:"source_gap",sizes:[],matchedRuleIds:[],...gate};
 let found:Rule[];
 if(fields.has("height")){const a=scoped.filter(r=>matchesDimension(r,"floor_to_knee",input)),b=scoped.filter(r=>matchesDimension(r,"height",input));if(!a.length&&!b.length)found=[];else if(!a.length||!b.length||!a.some(r=>b.includes(r)))return {status:"conflict",sizes:[],matchedRuleIds:[],...gate};else found=a}
 else if(fields.has("height_anchor")){const a=scoped.filter(r=>matchesDimension(r,"floor_to_knee",input)),b=input.height_in===undefined?[]:scoped.filter(r=>matchesDimension(r,"height_anchor",input));if(!a.length)return {status:"cannot_determine",reason:"source_gap",sizes:[],matchedRuleIds:[],...gate};if(b.length&&!a.some(r=>b.includes(r)))return {status:"conflict",sizes:[],matchedRuleIds:[],...gate};found=a}
 else found=scoped.filter(r=>r.dimensions.every(d=>matchesDimension(r,d.field,input)));
 if(!found.length)return {status:"cannot_determine",reason:"source_gap",sizes:[],matchedRuleIds:[],...gate};
 if(input.knee_to_thigh_in!==undefined&&found.some(r=>r.thighRiseMapping)){const e=found.flatMap(r=>r.thighRiseMapping??[]).find(x=>x.knee_to_thigh_in===input.knee_to_thigh_in);if(!e||e.status==="N/A")return {status:"cannot_determine",reason:"extension_not_available",sizes:[],matchedRuleIds:[],...gate};return {...result(found,gate),extension_in:e.extension_in}}
 return result(found,gate);
}
