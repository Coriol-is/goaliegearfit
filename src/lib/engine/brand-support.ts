import type { Dataset,Result } from "./types";
export type Decoration=Pick<Result,"display_badge"|"knee_block_verification_required">;
export function gateBrand(dataset:Dataset,brand:string):Result|Decoration {
 const support=dataset.brandSupport[brand];
 if(!support||support.resultStatus||!dataset.rules.some(r=>r.brand===brand)) return {status:"cannot_determine",reason:"no_official_mapping",sizes:[],matchedRuleIds:[]};
 return {...(support.displayBadge?{display_badge:support.displayBadge}:{}),...(support.mandatoryKneeBlockVerification!==undefined?{knee_block_verification_required:support.mandatoryKneeBlockVerification}:{})};
}
