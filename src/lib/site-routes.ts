export const contentPages=[
 {path:"/",lastmod:"2026-10-22"},
 {path:"/calculator/",lastmod:"2026-10-22"},
 {path:"/charts/",lastmod:"2026-10-22"},
 {path:"/charts/bauer/",lastmod:"2026-10-22"},
 {path:"/charts/ccm/",lastmod:"2026-10-22"},
 {path:"/charts/true/",lastmod:"2026-10-22"},
 {path:"/charts/warrior/",lastmod:"2026-10-22"},
 {path:"/charts/brians/",lastmod:"2026-10-22"},
 {path:"/guides/how-to-measure-goalie-pads/",lastmod:"2026-10-22"},
 {path:"/guides/thigh-rise-and-fit-check/",lastmod:"2026-10-22"},
 {path:"/methodology/",lastmod:"2026-10-22"},
 {path:"/about/",lastmod:"2026-10-22"}
] as const;
export const contentRoutes=contentPages.map(page=>page.path);
