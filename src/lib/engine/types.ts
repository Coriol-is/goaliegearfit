export type DimensionField = "floor_to_knee" | "height" | "height_anchor" | "ankle_to_knee" | "knee_to_thigh";
export interface Dimension { field: DimensionField; min: number|null; max: number|null; unit:"cm"; minInclusive:boolean; maxInclusive:boolean; sourceNative?:{min:number|null;max:number|null;unit:string;printed_metric?:string} }
export interface Rule { id:string; brand:string; category?:string; sizeLabel:string; dimensions:Dimension[]; thighRiseMapping?:Array<{knee_to_thigh_in:number;extension_in?:number;status?:"N/A"}> }
export interface BrandSupport { status:string; authority:string; heightSemantics?:string; unsupportedSizes?:string[]; displayBadge?:string; mandatoryKneeBlockVerification?:boolean; resultStatus?:"cannot_determine" }
export interface Dataset { version:string; rules:Rule[]; brandSupport:Record<string,BrandSupport> }
export interface EngineInput { brand:string; category?:string; floor_to_knee_in?:number; height_in?:number; ankle_to_knee_in?:number; knee_to_thigh_in?:number; requested_thigh_rise?:string; design_level?:string }
export type CannotDetermineReason = "missing_category"|"missing_height"|"missing_floor_to_knee"|"source_gap"|"personal_preference_not_base_size_rule"|"extension_not_available"|"no_official_mapping";
type Meta={sizes:string[];matchedRuleIds:string[];extension_in?:number;display_badge?:string;knee_block_verification_required?:boolean};
export type Result=({status:"candidate"|"adjacent_sizes"}&Meta)|({status:"conflict"}&Meta)|({status:"cannot_determine";reason:CannotDetermineReason}&Meta);
