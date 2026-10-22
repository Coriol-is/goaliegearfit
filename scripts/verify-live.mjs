// Verify the deployed commit, indexability and discovery artifacts after CI deploy.
const origin = process.env.SITE_ORIGIN;
const revision = process.env.GITHUB_SHA;
if (!origin || !revision) throw new Error("SITE_ORIGIN and GITHUB_SHA are required");
const paths = ["/", "/calculator/"];
for (const path of paths) {
  let checked = false;
  for (let attempt = 0; attempt < 48; attempt++) {
    const response = await fetch(new URL(path, origin), { headers: { "Cache-Control": "no-cache" } });
    const html = await response.text();
    const deployed = html.match(/<meta name="build-revision" content="([^"]+)"/)?.[1];
    if (response.ok && deployed === revision) {
      if (!html.includes(`rel="canonical" href="${origin}${path}"`)) throw new Error(`Wrong canonical: ${path}`);
      if (/<meta name="robots" content="noindex/.test(html)) throw new Error(`Unexpected noindex: ${path}`);
      checked = true;
      break;
    }
    if (attempt < 47) await new Promise(resolve => setTimeout(resolve, 5000));
  }
  if (!checked) throw new Error(`Deployment revision not live at ${path}`);
  console.log(`Verified ${origin}${path} at ${revision}`);
}
for (const path of ["/robots.txt", "/sitemap.xml"]) {
  const response = await fetch(new URL(path, origin));
  const body = await response.text();
  if (!response.ok || !body.includes(origin)) throw new Error(`Invalid discovery artifact: ${path}`);
  console.log(`Verified ${path}`);
}
