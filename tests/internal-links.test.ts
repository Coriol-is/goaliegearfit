import {describe,expect,it} from "vitest";import {contentRoutes} from "../src/lib/site-routes";
const links=["/","/charts/","/charts/bauer","/guides/how-to-measure-goalie-pads","/guides/thigh-rise-and-fit-check","/methodology"];
describe("known internal links",()=>it("target registered static content",()=>{for(const link of links)expect(contentRoutes).toContain(link)}));
