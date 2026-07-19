# Demand gate runbook

The niche begins at **Conditional Go**: the reviewed keyword cluster is approximately 1,400–2,000 relevant US searches per month, above the 1,000 Conditional Go threshold and below the 3,000 unconditional Go threshold. Production evidence must decide promotion; the threshold is not lowered for high AOV.

## Clock-start prerequisite

The 8–12 week (60–90 day) observation window starts only when all of these are recorded:

- the chosen custom domain is attached and canonical;
- `noindex` is removed and the production pages are crawlable;
- the sitemap is submitted in Google Search Console;
- Search Console reports the test pages indexed, establishing the baseline date;
- Plausible pageviews and the three calculator goals are verified on that same production domain.

A Pages fallback deployment or an unindexed new domain does not start the clock.

## Weekly evidence log

Record weekly Search Console relevant impressions, clicks, unique relevant queries, pages receiving impressions, median/representative positions, impression trend, CTR, and buyer-intent share. Record Plausible calculator completions, brand selections, fail-closed hits, completion rate, and useful outbound engagement if added later. Keep the providers separate and never infer missing values.

## Decision at weeks 8–12

| Verdict | Evidence |
| --- | --- |
| Go | At least 10,000 relevant impressions, at least 200 unique relevant queries, multiple pages gaining visibility, and some commercial/tool engagement |
| Conditional Go | 3,000–10,000 relevant impressions with a sustained upward trend |
| Test | Under 3,000 impressions but improving positions or one unexpectedly strong subcluster |
| No-go | Minimal relevant impressions, irrelevant query mix, and no improving trend, after indexing health and new-domain authority are ruled out as false-negative causes |

Before any No-go, document indexing coverage, crawl issues, observation dates, query exclusions, and whether the domain's lack of authority invalidated the experiment. Compare results with the source evidence in `hockey-goalie-gear/DEMAND-VALIDATION.md` and the workspace `DEMAND-VALIDATION-PROTOCOL.md`.
