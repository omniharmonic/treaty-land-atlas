# Living Law, Living Land — animated field notes

Three silent, captioned 1920 × 1080 H.264 MP4s, rendered procedurally at 24 fps. All educational information is on screen; no soundtrack or spoken narration is required. The graphics use the site's original contour mark, oat, sage and clay palette, and Albers projection. No stock imagery or generative imagery is used.

## Films and visual transcripts

**01 — Land changes. The record remains. (34 seconds)**

- 0–4s: A neutral locator of the lower 48 introduces the year 1784.
- 4–24s: Shapes enter in clay as their researched transfer year is reached, through 1894. Only published areas marked `ceded` or `taken` with a researched `ceded_year` are animated. Areas marked `kept` or `unchecked` are excluded. The current export includes 436 shapes.
- 24–34s: The transfer layer dissolves into the Census inventory of present-day Native land areas, shown in moss. The caption explains that this inventory is not the full extent of Indigenous homelands or rights. Viewers are invited to explore the history and connect with the people doing the work.

This is a partial record of transfers, not an original-homeland reconstruction, a title map, an acreage calculation, or a claim that everything outside the highlighted shapes was lost. Shapes can overlap. The animation uses researched years, not a continuous simulation of borders.

**02 — A treaty is more than a date. (40 seconds)**

- 0–8s: The Fort Laramie treaty of 1868 set apart the Great Sioux Reservation, promised closure of Bozeman Trail forts, and required three-fourths consent to cessions.
- 8–16s: February 16, 1869 is shown separately as Senate consent. Signing and Senate consent are different legal steps.
- 16–24s: The violation record spans 1874–1877. Its published headline says Congress took the Black Hills in 1877 without three-fourths consent.
- 24–32s: The 1980 Supreme Court ruling held that the 1877 Act took the Black Hills, requiring compensation with interest.
- 32–40s: The remedy was compensation. Viewers are directed to the full treaty record and its evidence at `https://landback.land/treaties/tla-t-369/`.

The timeline is a schematic sequence, not proportional elapsed time. The locator highlights linked Royce records and does not animate changing treaty boundaries. Text comes from published overlays; sources are the treaty text at Oklahoma State University and the Supreme Court opinion in U.S. Reports. The public-record account has not received tribal review. Source-specific cautions and full URLs accompany the export in `sources.json`.

**03 — From a place to participation. (36 seconds)**

- 0–12s: Royce area 261 around Lake Superior is highlighted. A dashed line leads to a card for the Treaty of La Pointe (1842), labeled as a suggested atlas link. The caption explains that these associations do not establish legal boundaries or representation.
- 12–27s: Three organizations enter in sequence: Honor the Earth (sovereignty, energy justice, pipeline resistance); Great Lakes Indian Fish and Wildlife Commission (Ojibwe treaty rights and natural resource stewardship); White Earth Land Recovery Project (land recovery and food sovereignty).
- 27–36s: Viewers are invited to learn about each organization, follow its priorities, and support the work it asks people to support. The closing URL is `https://landback.land/organizations/`.

These examples come from the published Ojibwe support index. Their missions differ; the list is not exhaustive and does not suggest that each organization represents every treaty signatory. Full organization and contribution links are in `sources.json`. Current priorities should be checked on the organizations' own sites.

## Sources and credits

Boundary data: *Tribal Lands Ceded to the United States*, USDA Forest Service (Geospatial Service and Technology Center; Office of Tribal Relations), based on C. C. Royce, *Indian Land Cessions in the United States* (1899). Modified by Benjamin Life (@omniharmonic): reprojected, simplified, dates and legal types derived. CC BY 4.0 per Data.gov. Not a legal document; do not use to determine title, ownership, boundaries or jurisdiction. Royce source: Library of Congress, Law Library of Congress.

Present-day boundaries: U.S. Census Bureau, Cartographic Boundary Files (American Indian/Alaska Native/Native Hawaiian Areas). Statistical boundaries, not legal land descriptions. The films use lower-48 geometry only and do not use Native Land Digital territory data.

Text and atlas data: Benjamin Life (@omniharmonic), *Living Law, Living Land*, https://landback.land, CC BY 4.0. Generator code: MIT. Existing data license and review statuses are retained; this remains an early release. See the repository's `NOTICE.md` and `data/licenses/registry.yaml`. `sources.json` preserves the published evidence, cautions, exact suggested edge, organization links, and input hashes.

## Reproduce

From the project root after `npm ci` and `npm run data:build`:

```sh
node --import tsx scripts/videos/prepare.ts /tmp/living-law-video-data.json
python3 scripts/videos/render.py --data /tmp/living-law-video-data.json --out /tmp/living-law-films
```

Requires Pillow and ffmpeg. On macOS the default fonts are Georgia and Arial; on other systems set `VIDEO_SERIF_FONT` and `VIDEO_SANS_FONT` to installed TTF files. No fonts are redistributed. `--stills-only` renders review contact sheets and posters; `--film 2` renders one film; `--fps 24` controls frame rate. The preparation stage uses the site's own graph publication filters, treaty projection and SVG geometry code. MP4s remain outside the repository; source scripts are versioned. Re-render and review the transcripts when the underlying research changes.
