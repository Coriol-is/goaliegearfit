# Data review — 2026-10-22

Published v0.1.2: 77 rows, including 23 CCM exact height columns (previously 22). Other four brand paths remain unreviewed in this pass. Global review date remains July 17 and next review October 15; dataset freshness is stale. Only CCM rows advance review date to October 22.

The existing official knee-guard product page does embed a shared goalie-pad chart: https://us.ccmhockey.com/Goalie/Explore/Protective-Accessories/KPXF-SR.html#goalieLegPad . HTML locator: `div#goalieLegPad .js-sizetable-in table`, first three rows (height, FTK, pad size). Fragment identifies the tab; direct browser opening need not activate the modal. Open the page sizing dialog and Goalie Leg Pads tab if needed.

Corrected native inch-column transcription: restored height54 / size24 / FTK15–15.5; corrected height56 / size26 to FTK15.5–16; split each repeated-size pair into its own FTK range instead of broadening both columns. For example height68 supports18.5–19 and height69 supports19–19.5, both size32. Exact endpoint13 plus height46 yields size20 only.

Source limitations preserved: height58 is absent, FTK14.5–15 absent, no interpolation, no model-generation applicability established. Source inch and rounded cm tables contain discrepancies; runtime deterministically converts the inch-native evidence. Bare foot, knee slightly bent, measure vertically floor to middle of kneecap; height is a separate exact chart anchor. Thigh-rise table was not promoted or newly reviewed.

Reproduction: upstream `hockey-goalie-gear/data/sizing/raw/ccm-goalie-fit-us-current/review-2026-10-22.json` preserves retrieved HTML hash, locator, all23 independent native columns and limitations; no copyrighted page snapshot. Publisher verifies all23 generated FTK/height/size tuples against that evidence. Updated `ccm-exact-13` fixture removes old all-FTK expectation. Exact generated dataset/schema/manifest and fixtures vendored here.

Remaining: revalidate Bauer CSVs, TRUE catalog, Warrior24–25 scope and Brian's public tool tuples; do not claim all models are current. Current-year applicability and physical fit remain unverified.
