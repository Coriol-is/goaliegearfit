export interface SiteConfig { origin?:string; launchReady:boolean; robots:"noindex"|"index,follow" }
export function resolveSiteConfig(rawOrigin?:string):SiteConfig {
 const origin=rawOrigin?.trim().replace(/\/$/,"");
 const valid=Boolean(origin&&origin.startsWith("https://")&&!origin.includes("pages.dev"));
 return {origin:valid?origin:undefined,launchReady:valid,robots:valid?"index,follow":"noindex"};
}
