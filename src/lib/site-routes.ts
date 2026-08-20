export const contentPages=[
 {path:"/",lastmod:"2026-08-21"},
 {path:"/calculator/",lastmod:"2026-08-21"},
 {path:"/charts/",lastmod:"2026-08-21"},
 {path:"/charts/bauer/",lastmod:"2026-08-21"},
 {path:"/charts/ccm/",lastmod:"2026-08-21"},
 {path:"/charts/true/",lastmod:"2026-08-21"},
 {path:"/charts/warrior/",lastmod:"2026-08-21"},
 {path:"/charts/brians/",lastmod:"2026-08-21"},
 {path:"/guides/how-to-measure-goalie-pads/",lastmod:"2026-08-21"},
 {path:"/guides/thigh-rise-and-fit-check/",lastmod:"2026-08-21"},
 {path:"/methodology/",lastmod:"2026-08-21"}
] as const;
export const contentRoutes=contentPages.map(page=>page.path);
