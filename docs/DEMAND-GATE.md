# Demand gate runbook

The niche begins at **Conditional Go**: the reviewed keyword cluster is approximately 1,400–2,000 relevant US searches per month, above the 1,000 Conditional Go threshold and below the 3,000 unconditional Go threshold. Production evidence must decide promotion; the threshold is not lowered for high AOV.

## Clock-start prerequisite

The 8–12 week (60–90 day) observation window starts only when all of these are recorded:

- the chosen custom domain is attached and canonical;
- `noindex` is removed and the production pages are crawlable;
- the sitemap is submitted in Google Search Console;
- Search Console reports the test pages indexed, establishing the baseline date;
- production analytics pageviews and calculator events are verified on that same production domain.

A Pages fallback deployment or an unindexed new domain does not start the clock.

## Active observation window

- **Status:** Active
- **Week 0 baseline:** July 19, 2026
- **Week 8 review:** September 13, 2026
- **Week 12 decision deadline:** October 11, 2026

The owner confirmed the Google Search Console property and sitemap submission, production GA4 pageview and calculator-event receipt, and the start of the observation window on July 19, 2026. GA4 is the selected production analytics provider for this experiment.

## Weekly evidence log

Record weekly Search Console relevant impressions, clicks, unique relevant queries, pages receiving impressions, median/representative positions, impression trend, CTR, and buyer-intent share. Record GA4 calculator completions, brand selections, fail-closed hits, comparison usage, and completion rate. Keep the providers separate and never infer missing values.

| Checkpoint | Date | GSC impressions | Relevant queries | Indexed pages | GA4 completions | Fail-closed hits | Notes |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Week 0 | 2026-07-19 | — | — | — | — | — | Observation window started; GSC sitemap and GA4 event receipt confirmed by owner. |
| Week 1 | 2026-07-26 | | | | | | |
| Week 2 | 2026-08-02 | | | | | | |
| Week 3 | 2026-08-09 | | | | | | |
| Week 4 | 2026-08-16 | | | | | | |
| Week 5 | 2026-08-23 | | | | | | |
| Week 6 | 2026-08-30 | | | | | | |
| Week 7 | 2026-09-06 | | | | | | |
| Week 8 | 2026-09-13 | | | | | | First formal demand review. |
| Week 9 | 2026-09-20 | | | | | | |
| Week 10 | 2026-09-27 | | | | | | |
| Week 11 | 2026-10-04 | | | | | | |
| Week 12 | 2026-10-11 | | | | | | Final decision deadline. |

## Decision at weeks 8–12

| Verdict | Evidence |
| --- | --- |
| Go | At least 10,000 relevant impressions, at least 200 unique relevant queries, multiple pages gaining visibility, and some commercial/tool engagement |
| Conditional Go | 3,000–10,000 relevant impressions with a sustained upward trend |
| Test | Under 3,000 impressions but improving positions or one unexpectedly strong subcluster |
| No-go | Minimal relevant impressions, irrelevant query mix, and no improving trend, after indexing health and new-domain authority are ruled out as false-negative causes |

Before any No-go, document indexing coverage, crawl issues, observation dates, query exclusions, and whether the domain's lack of authority invalidated the experiment. Compare results with the source evidence in `hockey-goalie-gear/DEMAND-VALIDATION.md` and the workspace `DEMAND-VALIDATION-PROTOCOL.md`.
