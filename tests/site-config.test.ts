import {describe,expect,it} from "vitest";
import {resolveSiteConfig} from "../src/lib/site-config";
describe("launch indexing boundary",()=>{
 it.each([undefined,"","https://goaliegearfit.pages.dev","http://goaliegearfit.com"])("fails closed for %s",origin=>expect(resolveSiteConfig(origin)).toEqual({origin:undefined,launchReady:false,robots:"noindex"}));
 it("allows only an attached HTTPS custom origin",()=>expect(resolveSiteConfig("https://goaliegearfit.com/")).toEqual({origin:"https://goaliegearfit.com",launchReady:true,robots:"index,follow"}));
});
