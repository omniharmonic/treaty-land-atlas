---
title: V3 Verification Report - Donations, Campaign Figures, and Licensing
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# V3 Verification Report: Donations, Campaign Figures, and Licensing

Verification Agent V3, independent of the producing agents. All checks were made on 2026-10-16 with WebFetch against direct URLs. Nothing in `seed-data/` or `docs/` was edited. Proposed changes are in `V3-corrections.csv` (33 rows). This report does not give legal advice.

## 0. Summary

| Group | Items | confirmed | corrected | could-not-verify | red-flag |
|---|---|---|---|---|---|
| 1A. Donation URLs (21 rows with `donation_url`) | 21 | 17 | 0 | 2 | 2 |
| 1B. EIN / legal-name checks (35 EINs + 4 "no EIN" rows) | 39 | 30 | 4 | 5 | 0 |
| 1C. Agent F red flags and look-alike pairs | 6 | 2 | 0 | 0 | 4 |
| 2. Campaign figures (11 requested returns) | 11 | 5 | 5 | 1 (Mechoopda date) | 0 |
| 3. Licensing statements | 8 | 6 | 1 | 1 | 0 |
| **Total** | **85** | **60** | **10** | **9** | **6** |

Items to remove or hold before publication:

1. **ILTF donation link (hold).** The ILTF homepage and `/get-involved/contribute/` both contain an injected Turkish-language gambling link (`thesweetsensations.com`). The organization is real; its donation form could not be loaded.
2. **Seeding Sovereignty donation URL (remove).** The Givebutter page says "This campaign is not currently accepting donations."
3. **wsdp.org and indiancanyon.org (never link).** Both domains now serve unrelated content.
4. **kaipoma.org (do not link as a website).** It is a "coming soon" placeholder. `build/nodes.json` currently creates a URL node for `www.kaipoma.org`.
5. **Friends of the Cheyenne River Youth Project (EIN 27-1877273): never list.** It is a look-alike of CRYP, with no financial data on ProPublica.

Tool limits. `curl` was refused by the sandbox, and ProPublica search pages, the Wayback Machine, cryp.org, nativeamericanlandconservancy.org, cultural-conservancy.org, sixnationsmuseum.org and the Forest Service Research Data Archive search were blocked or returned no usable page. WebFetch returns a model-written summary, not raw HTML. Statements such as "no spam found" and "payee not named" are therefore summaries, and a human should open each donation page in a browser before launch.

## 1A. Donation URLs

Status key: confirmed = the page loaded, names the organization, and is a donation page. "Caveat" notes what was not read.

| ID | Claimed | Found | URL | Status |
|---|---|---|---|---|
| org-ndn-collective | NDN Collective donate page | Loads; NDN Collective, 408 Knollwood Dr, Rapid City SD; card/Venmo/PayPal/bank/check. The page states no 501(c)(3) wording; the EIN appears only in a Charity Navigator link. Footer links to a WP Engine staging domain and `ndnstore.xyz`; unrendered cookie-banner placeholders. No spam. | https://ndncollective.org/donate/ | confirmed |
| org-iltf | GiveSmart form | ILTF's own pages (homepage, contribute page) link to this exact URL, but the form failed to load in two attempts. **Both ILTF pages contain the injected link** `[bedava bonus veren bahis siteleri](https://thesweetsensations.com/)`. EIN 41-2014273 is stated on ILTF's contribute page. | https://fundraise.givesmart.com/form/sMSlkQ?vid=1nnoxd | red-flag |
| org-narf | NARF online giving | Page body came back empty to the fetcher (likely script-rendered). `narf.org/donate/` returns a 302 to it; `narf.org/about` links to it. | https://secure.narf.org/giveNARF | could-not-verify (strong indirect evidence) |
| org-sogorea-te | Donate page | Loads; names The Sogorea Te' Land Trust, PO Box 6758 Oakland, 501(c)(3) statement. The homepage donate buttons point to `/donate-update-draft/` (draft-style slug); contact emails use `rematriatetheland.org`. No spam. | https://sogoreate-landtrust.org/donate/ | confirmed |
| org-native-land-conservancy | Donate page | Loads; Native Land Conservancy, Mashpee MA, "Tax ID Number: 46-3944868"; checks payable to the Conservancy; online giving goes to an external `secure.lglforms.com` form (not inspected). | https://www.nativelandconservancy.org/donate | confirmed |
| org-amah-mutsun-land-trust | Donate page | Loads; names only the Amah Mutsun Land Trust as the cause; PayPal and Donorbox buttons (not inspected). No EIN or tax-deductibility text. The Humunya Foundation is not named as a recipient on this page, which partly answers the seed's concern. | https://amahmutsun.org/donate | confirmed |
| org-esselen-tribe | Donate page | Page text shows "EIN 82-5246660", PO Box 95 Carmel Valley, check or PayPal. No spam. | https://esselentribe.org/donate | confirmed |
| org-duwamish-tribal-services | Real Rent Duwamish on Network for Good | Loads; payee Duwamish Tribal Services, "a 501(c)(3) organization registered with the State of Washington and the IRS". Low-weight oddity: supporter counter shows "538810" with every visible entry dated within minutes. | https://duwamishtribe.networkforgood.com/projects/35157-real-rent-duwamish | confirmed |
| org-lplp-sacred-defense-fund | Action page | Loads; footer "EIN: 99-2707481" (matches Sacred Defense Fund). The page names no payee and says gifts support the "transition to full Indigenous leadership under the Sacred Defense Fund". | https://action.lakotalaw.org/action/donate | confirmed |
| org-honor-the-earth | Donorbox | Loads; payee Honor the Earth, PO Box 1531 Lame Deer MT, EIN 45-4714238 stated. Page shows $7,690 of $25,000 raised. | https://donorbox.org/honor-the-earth-donation | confirmed |
| org-ien | Ways to give | Loads; "IEN's tax identification number is 38-3653476"; checks payable to "Indigenous Environmental Network", PO Box 485 Bemidji MN. | https://www.ienearth.org/ways-to-give/ | confirmed |
| org-fndi | Donate | Loads; First Nations Development Institute; the form did not render in text; EIN only in Candid and Charity Navigator links. | https://www.firstnations.org/fndi_donate | confirmed |
| org-welrp | PayPal button | This is the "Donate Now" link on welrp.org. The PayPal page showed only "Please wait"; the recipient name appears only in page metadata. | https://www.paypal.com/donate/?hosted_button_id=B6RSM7BC8XXDS | confirmed (caveat: form did not render) |
| org-rematriation | Donate | Loads (Squarespace); describes Rematriation as a 501(c)(3); no EIN or payee named; Candid seal. | https://www.rematriation.org/donate | confirmed (caveat: no EIN or payee) |
| org-save-california-salmon | Square short link | It is the only DONATE link on californiasalmon.org and redirects to a Square checkout titled "DONATION - Save California Salmon". The checkout shows no business name, address or EIN and has a `noindex` tag. | https://square.link/u/AmBbizYo | could-not-verify (payee) |
| org-seeding-sovereignty | Givebutter campaign | Loads but says **"This campaign is not currently accepting donations."** It is a time-boxed campaign ("Stand with Frontline Indigenous Climate Defenders", $3,284 of $20,000), not a general fund. Footer of seedingsovereignty.org confirms the fiscal sponsor (Center for Nuleadership for Urban Solutions). | https://givebutter.com/eyesinthesky | red-flag (dead/closed; remove) |
| org-nhlc | Donate | Loads; payee Native Hawaiian Legal Corporation, 1164 Bishop St, Honolulu; "501(c)(3) charity"; EIN 99-0161861 stated. Online form is external (`secure.lglforms.com`). | https://nativehawaiianlegalcorp.org/donate-now/ | confirmed |
| org-kua-hawaii | go.kuahawaii.org | 302 to a PayPal hosted button; the PayPal page showed only "Please wait" with the name "Donate to Kua'aina Ulu 'Auamo" in metadata. kuahawaii.org links to `go.kuahawaii.org/donate` and a second ClickandPledge button. No EIN on the page. | https://go.kuahawaii.org/donate | confirmed (caveat: form did not render) |
| org-hawaii-land-trust | Donate | Loads; "Fed ID 99-0353223"; 501(c)(3). Template artifacts only. The page does not mention a former name. | https://www.hilt.org/donate | confirmed |
| org-western-rivers-conservancy | Donate | Loads; states "tax identification number 93-1326405"; amount selector did not render; processor mentioned as GoFundMe. | https://secure.westernrivers.org/campaign/718972/donate | confirmed |
| org-right-relationship-boulder | Donate | Loads; checks to Mediators Foundation (fiscal sponsor), 2525 Arapahoe Ave E-4 #509 Boulder; memo-line fund options include "Land Group Projects". Unrelated promotional "VOTE Here!" link to a Colorado Lottery poll. | https://rightrelationshipboulder.org/donate | confirmed |

## 1B. EIN and legal-name checks

Source: ProPublica Nonprofit Explorer `/organizations/<EIN>` for every row, plus Charity Navigator `/ein/<EIN>` where the seed cites a rating. "Name" is the name ProPublica shows. Revenue figures match the seed within rounding wherever the seed gave one.

### Confirmed (EIN resolves to the named organization)

| ID | EIN | ProPublica name and location | Notes |
|---|---|---|---|
| org-ndn-collective | 82-3776329 | Ndn Collective Inc, Rapid City SD; exempt June 2018; FY2024 revenue $12,635,459 | Charity Navigator 4/4. Context: revenue fell from $70.8M (2022) to $12.6M (2024), and net assets from $100.7M to $34.4M. |
| org-iltf | 41-2014273 | Indian Land Tenure Foundation, Little Canada MN; exempt Oct 2001; FY2024 $21.5M | CN 4/4, no alert. EIN also on ILTF's contribute page. Site is compromised (see 1C). |
| org-narf | 84-0611876 | Native American Rights Fund, Boulder CO; exempt July 1971; FY2025 $24.7M | CN 4/4. |
| org-sogorea-te | 82-4415931 | Sogorea Te Land Trust, Oakland CA; exempt Dec 2019; FY2024 $12.5M | CN 4/4. |
| org-native-land-conservancy | 46-3944868 | Native Land Conservancy Inc, Mashpee MA; exempt June 2014; FY2024 $6.47M | CN 4/4. Distinct from the Banning CA organization (see 1C). |
| org-native-american-land-conservancy | 33-0832220 | Native American Land Conservancy, Banning CA; exempt Aug 1999; FY2024 $1.63M | CN 4/4. Website blocked, so mission, leadership and donation path remain unverified. |
| org-amah-mutsun-land-trust | 32-0447436 | Amah Mutsun Land Trust, Santa Cruz CA; exempt June 2018; FY2024 $2.95M | CN 4/4. |
| org-esselen-tribe | 82-5246660 | Esselen Tribe Of Monterey County, Carmel Valley CA; exempt June 2019; FY2025 $9.19M | EIN stated on donate page. |
| org-duwamish-tribal-services | 91-1122115 | Duwamish Tribal Services, Seattle WA; exempt Apr 1981; FY2025 $5.14M | CN 3/4 (seed: not checked). |
| org-cryp | 46-0423106 | Cheyenne River Youth Project Inc, Eagle Butte SD; exempt Oct 2012; FY2025 $3.20M | CN 3/4. |
| org-lplp-sacred-defense-fund | 99-2707481 | Sacred Defense Fund, Santa Fe NM; exempt June 2024; FY2024 $741,748 | EIN in donate-page footer. CN profile, no rating shown. |
| org-honor-the-earth | 45-4714238 | Honor The Earth, Lame Deer MT; exempt Aug 2015; FY2025 $2.52M | CN 2/4 confirmed. |
| org-fndi | 54-1254491 | First Nations Development Institute, Longmont CO; exempt Aug 1984; FY2025 $56.4M | CN 4/4. |
| org-welrp | 41-1673625 | White Earth Land Recovery Project, Callaway MN; "tax-exempt since Nov. 2021"; FY2024 $1.01M | CN 3/4. The Nov 2021 date next to older filings is a ProPublica oddity, as the seed noted. |
| org-save-california-salmon | 88-1650309 | Save California Salmon, Orleans CA; exempt July 2022; FY2024 $1.10M | CN profile exists; no rating shown. |
| org-six-nations-iroquois-cultural-center | 85-4015917 | Six Nations Iroquois Cultural Center Inc, Onchiota NY; exempt Aug 2021; FY2024 $95,281 | Website blocked. |
| org-kai-poma | 88-0548030 | Kai Poma, Willits CA; exempt Mar 2022; FY2023 $117,000 | Site is a placeholder. |
| org-apache-stronghold | 47-4032813 | Apache Stronghold, San Carlos AZ; exempt Dec 2020; FY2024 $291,775 | Existence only. |
| org-dine-care | 86-0670809 | Dine Citizens Against Ruining Our Environment, Window Rock AZ; exempt May 1995; FY2024 $433,559 | Existence only. |
| org-nhlc | 99-0161861 | Native Hawaiian Legal Corporation, Honolulu; exempt June 1993; FY2025 $3.09M | EIN also on donate page. |
| org-kua-hawaii | 45-4509939 | Kuaaina Ulu Auamo, Kaneohe HI; exempt Apr 2013; FY2024 $3.66M | |
| org-hawaii-land-trust | 99-0353223 | Hawaiian Islands Land Trust, Honolulu; exempt Mar 2001; FY2024 $5.65M | EIN on hilt.org as "Fed ID". The "formerly" claim is not stated on the page (see CSV). |
| org-western-rivers-conservancy | 93-1326405 | Western Rivers Conservancy, Portland OR; exempt Feb 2002; FY2025 $11.4M | CN 4/4. EIN on donate page. |
| org-tpl | 23-7222333 | Trust For Public Land, San Francisco; exempt Feb 1978; FY2025 $301M | |
| org-tnc | 53-0242652 | Nature Conservancy, Arlington VA; exempt Mar 1954; FY2025 $1.75B | Listed under "Nature Conservancy"; identification with The Nature Conservancy rests on name and Arlington VA. |
| org-pacific-forest-trust | 68-0292509 | The Pacific Forest Trust Incorporated, San Francisco; exempt Sept 1993; FY2024 $21.7M | |
| org-mckenzie-river-trust | 93-1029808 | Mckenzie River Trust, Eugene OR; exempt Sept 1995; FY2024 $7.95M | |
| org-save-the-redwoods-league | 94-0843915 | Save The Redwoods League, San Francisco; exempt Dec 1921; FY ending Mar 2025 $68.1M | |
| org-right-relationship-boulder (sponsor) | 04-3002588 | Mediators Foundation Inc, Boulder CO; exempt Feb 1988; FY2024 $3.52M | Fiscal sponsor, as seeded. |
| org-seeding-sovereignty (sponsor) | 45-4968344 | Center For Nuleadership On Urban Solutions Inc, Brooklyn NY; exempt Sept 2019; FY2024 $2.03M | Same EIN shown on the Givebutter page beside the sponsor line. Seeding Sovereignty has no EIN of its own. |
| org-cryp look-alike | 27-1877273 | Friends Of The Cheyenne River Youth Project, Lincoln NE; exempt Mar 2010 | Different entity. See 1C. |

### Corrected

| ID | Claimed | Found | Status |
|---|---|---|---|
| org-conservation-fund | EIN "Not found" | EIN **52-1388917** is printed in the footer of conservationfund.org ("Federal tax ID"). ProPublica: "The Conservation Fund A Nonprofit Corporation", Arlington VA, exempt July 1985, FY2025 revenue $329.4M. | corrected |
| org-ien | EIN 38-3653476, name "Indigenous Environmental Network" | EIN is real and stated by IEN, but ProPublica and Charity Navigator both list it as **"Indigenous Educational Network Of Turtle Island"** (Bemidji MN, exempt July 2014, FY2025 $5.74M). CN 3/4 stars, no alert. No source read reconciles the names. | corrected (name difference; add CN rating) |
| org-cultural-conservancy | EIN 94-3003900, "The Cultural Conservancy" | ProPublica and CN name is **"Cultural Conservancy Sacred Land Foundation"**, San Francisco, exempt June 1986, FY2024 $3.05M, CN 4/4. Website blocked, so the site-to-EIN link is unconfirmed. | corrected (legal name) |
| org-shared-spaces-foundation | "Probable EIN 86-1742244" | Entity exists: Shared Spaces Foundation, Tukwila WA, exempt Aug 2022, FY2025 $443,842. No source read ties this entity to the Duwamish Heron's Nest partner beyond the name, so "probable" stays. | corrected (details added) |

### Could-not-verify

| ID | Claimed | Found | Status |
|---|---|---|---|
| org-rematriation | "Probable" EIN 85-1101586 (Rematriation Inc, Syracuse NY) | Entity exists (ProPublica, exempt June 2020, FY2025 $530,450; CN 3/4). rematriation.org shows no EIN or address, so the tie to the website is still an inference. The other ProPublica entry, **Rematriation Society Inc** (EIN 42-2270644, Hawthorne CA), has tax exemption issued June 2026 and no 990 data: a very new look-alike. | could-not-verify |
| org-wsdp | No EIN found | ProPublica search is blocked by robots; the "no match" result could not be reproduced. | could-not-verify |
| org-indian-canyon | No EIN verified | 934596851 loads as "Indian Canyon Land Charitable Organization", Glendale CA, exempt Dec 2023, FY2025 revenue $3,000. Nothing ties it to the band. | could-not-verify |
| org-first-light-maine | EIN not found | Search blocked; not rechecked. | could-not-verify |
| org-wabanaki-commission | EIN not verified | Search blocked; not rechecked. | could-not-verify |

Out of scope and not checked: the 28 tribal-government rows (no EIN claimed; federal recognition not verified) and the government-agency rows (DHHL, OHA, CNRA, DOI). The seed's note that Federal Register recognition status was not checked still applies.

## 1C. Agent F red flags and look-alike pairs

| Item | Claimed | Found | URL | Status |
|---|---|---|---|---|
| wsdp.org | Serves unrelated Japanese blog | **Confirmed.** A personal Japanese-language blog about nursing job hunting in Ishikawa, with a "PR" affiliate link to `kango-oshigoto.jp`. Nothing about the Western Shoshone Defense Project. Wayback was blocked, so any past ownership of the domain by the project is not independently confirmed. | https://wsdp.org/ | red-flag |
| indiancanyon.org | Serves unrelated content | **Confirmed.** An SEO-style article, "Why Australia's Urban Planners Need Reliable Internet Solutions", with product links to `skymesh.net.au`, an inconsistent Melbourne/South Australia address, and no donation page. | https://www.indiancanyon.org/ | red-flag |
| iltf.org | Injected gambling spam | **Confirmed on two pages.** Markup: `[bedava bonus veren bahis siteleri](https://thesweetsensations.com/ "bedava bonus veren bahis siteleri")` sits after the phone number 651-766-8999. The org itself is real (EIN, CN 4/4 and no alert). | https://www.iltf.org/ ; https://iltf.org/get-involved/contribute/ | red-flag (site compromise; hold donation link) |
| kaipoma.org | Placeholder, no donation channel | **Confirmed.** A WordPress "Coming Soon" plugin page ("Our new website is coming soon"); no donation channel. | https://www.kaipoma.org/ | confirmed (placeholder; do not link) |
| Native Land Conservancy vs Native American Land Conservancy | Two distinct entities | **Confirmed distinct.** NLC: EIN 46-3944868, Mashpee MA, exempt 2014, site nativelandconservancy.org. NALC: EIN 33-0832220, Banning CA, exempt 1999, site blocked. Both CN 4/4. The NLC site calls itself "Native-led" and names no leaders. | ProPublica 463944868 / 330832220 | confirmed |
| Cheyenne River Youth Project vs Friends of CRYP | Look-alike entities | **Confirmed look-alike.** CRYP: EIN 46-0423106, Eagle Butte SD, FY2025 $3.2M. Friends: EIN 27-1877273, Lincoln NE, exempt Mar 2010, ProPublica says "No Financial Data Available" and that it is not in the IRS most recent list. cryp.org is robots-blocked, so no CRYP donation URL was verified. | ProPublica 460423106 / 271877273 | red-flag (payee-confusion risk; never list the Friends EIN) |

## 2. Campaign figures

| ID | Claimed | Found | Source | Status |
|---|---|---|---|---|
| camp-tuluwat-2019 | ~200 acres; Oct 21, 2019; Seaman and Hernandez signed; 1.5 acres bought in 2000 (>$100K); 40 acres in 2004 | All match. The same article also says "roughly 202 acres" for the island, so 200 is rounded. | North Coast Journal | confirmed |
| camp-bison-range-2020 | 18,800 acres; Pub. L. 116-260 signed Dec 27, 2020; Secretary signed Jan 15, 2021; DOI release June 23, 2021 ("confirm") | DOI release is dated June 23, 2021 and says "approximately 18,800.22 acres" transferred from FWS to BIA in trust for CSKT under the Consolidated Appropriations Act, 2021 (P.L. 116-260); it gives no signing date. Daines (Jan 15, 2021) says Bernhardt signed the transfer papers, "18,800-acre", omnibus signed Dec 27, 2020. The two dates are two separate announcements, and no source read reconciles them. | DOI; Sen. Daines | confirmed (the "confirm" flag is resolved; wording clarified in CSV) |
| camp-esselen-adler-2020 | 1,199 acres; WRC purchased and transferred; $4.5M CNRA grant; July 27, 2020 | 1,199 acres, July 27, 2020 and $4.5M confirmed. Mechanism differs: the WRC release says the **tribe purchased the ranch from the Conservancy** with the $4.5M grant, finalized "on Friday" (about July 24, inferred). | WRC press release | corrected (mechanism) |
| camp-blue-creek-yurok-2025 | 47,097 acres; final phase 14,968 acres, May 30, 2025; $56M, $8M public; 23 years; HCN rounds to 47,100 / 14,000 | All confirmed (Native News Online, June 5, 2025; HCN 47,100 and 14,000). WRC's Green Diamond acquisition "2009-2017" is not in either article and could not be checked (westernrivers.org/blue-creek failed to load). | Native News Online; HCN | confirmed (Green Diamond dates could-not-verify) |
| camp-pesla-2012 | 1,942 acres; $9M; Nov 30, 2012; $900K from ILTF affiliate | All confirmed (returned Nov 30, 2012, 2:00 p.m. MST, Rapid City; Indian Land Capital Company is ILTF's affiliate lender). Rosebud Sioux Tribe's lead role and the 2025-26 mining controversy were not in this source and stay unverified. | UCLA AISC | confirmed |
| camp-tule-river-2025 | 17,030 acres; Oct 29, 2025; CNRA, WCB, philanthropy; Conservation Fund facilitated; seller unnamed | All confirmed. | Governor's release | confirmed |
| camp-washoe-welmelti-2026 | 10,274 acres; article Feb 10, 2026; Waší·šiw Land Trust; partners; price undisclosed; "largest tribal land return in the range" | Acreage, trust, partners confirmed. Article says "announced Wednesday" (likely Feb 11) and gives no completion date. Superlative is narrower than the seed implies: **largest ever in the Sierra Nevada and third largest in California**. The article does not say which state the land is in; it places it northeast of Lake Tahoe, about 20 miles north of Reno. | Native News Online; HCN | corrected (scope of superlative) |
| camp-mikmaq-bridgewater-2026 | "More than 3,400" acres; $1.9M; Conservation Fund; sixth completed; confidence high | Maine Public's lede says "over 3,400", its photo caption "nearly 3,400". $1.9M is the amount the Conservation Fund still needed to raise to complete the purchase, not stated as the price. Bought in 2025 from a local forester. Sixth of 11 projects confirmed. | Maine Public, June 26, 2026 | corrected (acreage inconsistency; confidence to medium) |
| camp-mechoopda-2026 | 450 acres; two properties; date inferred June 2026 | 450 acres, two properties next to Big Chico Creek Ecological Reserve, Chairman Dennis Ramirez, statewide 40,574.94 acres and "over $100 million" all confirmed. The release's "Published Date" field is blank, so the 2026 date remains an inference. | CNRA release | acreage confirmed; date could-not-verify |
| camp-monument-mountain-2025 | 372 acres, $2.5M, $2.26M state grant; Berkshire Edge says 351 | 372 acres, $2.5M (asking $3M), $2.26M grant confirmed by Tribal Business News (Apr 30, 2025). The 351-acre Berkshire Edge piece is dated **Aug 30, 2023** (grant announcement); its caption says $2.6M and its body $2.26M. The 351-to-372 difference is unexplained. | TBN; Berkshire Edge | corrected (dating of the discrepancy) |
| camp-tributary-land-returns | 50,000+ acres, 11 parcels, 6 complete, eight years, $50M; partners; remaining parcels | Confirmed: 50,000 acres, 11 parcels, 6 complete, eight years, $50M, "about halfway", Houlton Maliseet 1,327 acres. Remaining parcels match. Correction: TNC Maine, TPL, MCHT, AMC, Forest Society and the Conservation Fund are **members of First Light**, not separate partners. The article states no start year. | Bangor Daily News; Maine Public | corrected (partner wording) |

Other figures checked in passing, all confirmed: Blue Lake (48,000 acres, Dec 15, 1970, Pub. L. 91-550, 1906 taking; Taos Pueblo page); Houlton Maliseet 1,327 acres (BDN); Spirit Lake White Horse Hill 680 acres and NANA nearly 28,000 acres (HCN).

## 3. Licensing

Everything below is reported as published. It is not legal advice, and no reconciliation of the conflicts is offered.

### 3.1 Native Land Digital (NLD)

**Indigenous Data Sovereignty Treaty** (https://api-docs.native-land.ca/data-sovereignty-treaty). Confirmed, no "last updated" date shown.
- Permitted: educational and research uses aligned with Indigenous Data Sovereignty; non-commercial applications that do not generate revenue; Indigenous-led initiatives that support community self-determination.
- Prohibited: charging money for access to or integration of NLD API data "in any form" (including subscriptions or bundled services); commercial use (monetized platforms, resale, proprietary applications); modifying Indigenous land boundaries without direct consultation and approval; uses that undermine Indigenous governance or misrepresent territories; derivative works that do not acknowledge Indigenous ownership and governance of the data; **storing or distributing API data without explicit permission from NLD**.
- Attribution: credit NLD as the original source and acknowledge Indigenous communities as rightful stewards.
- Enforcement: NLD may revoke access immediately, may take legal action, and may permanently bar users who monetize, alter or misuse the data.
- The page states no process for requesting permission.

**API key page** (get-and-use-your-api-key): a key has been required since late 2024; the user must tick an agreement box in the API tab; the page urges reading the Treaty first. It gives no numeric rate limits and does not address key sharing. It asks users to avoid calling the full GeoJSON endpoint continually.

**About and disclaimers** (https://api-docs.native-land.ca/about-and-disclaimers): "not under any proprietary license; the work can be considered under a CC0 license (free to use in any way you like)", with a request to "consider the morality of how you use this dataset". The same page says the map does not represent official or legal boundaries and the dataset is "not meant or reasonably to use for academic or legal purposes". The landing page says "You are free to use the dataset for your own maps and applications using the Native Land Digital API."

**native-land.ca FAQ** (https://native-land.ca/about/faq). This source is not mentioned in J4, E1 or E2. Using maps in your work is allowed "with conditions": educational, research or non-commercial use, attribution and a link back. Commercial use: "No", maps "cannot be used in commercial products". Suggested credit begins "Map data provided by Native Land Digital (https://native-land.ca/)" and includes "Used with permission for educational and non-commercial purposes". Maps "should not be used for legal claims, land disputes". No licence is named. The site footer reads "©Native Land Digital 2024, All rights reserved." (https://native-land.ca/about/).

**"What we map"** (https://native-land.ca/about/what-we-map): "NLD maps are not official sources"; "Our map is not a legal document"; Nation and Territory map images and interactive maps were removed from public view because they were "too deeply misused" and remain visible only if a nation requests it.

**Mapbox data-exchange page** (GEO-018): no license stated; "We appreciate if you credit Native Land Digital and Native-Land.ca, but it's not required"; "should not be used for any legal or academic purposes".

**Conflicts.** (a) CC0 in the API docs against the Treaty's prohibitions and the FAQ's "All rights reserved" and commercial "No". (b) "Credit not required" on the Mapbox page against mandatory attribution in the Treaty and FAQ. (c) "Free to use" and "free to use in any way you like" against "storing or distributing ... without explicit permission". NLD does not reconcile these. A native-land.ca terms-of-use page and an Indigenous Data Sovereignty Treaty page on the main domain could not be fetched (`/terms` and `/about/terms-of-service/` errored; the Treaty was read at api-docs.native-land.ca only).

### 3.2 USFS "Tribal Lands Ceded to the United States" (Royce)

- **Data.gov**, both listings (`...-feature-layer` and `...-feature-layer-cf3ca`): License "https://creativecommons.org/licenses/by/4.0/"; access level "public"; publisher U.S. Forest Service (Geospatial Service and Technology Center); issued 2017-04-12; modified 2022-08-29 (second listing also states metadata created 2022-11-03, updated 2025-04-21). The contact for data questions is Rebecca Hill, Policy Analyst, Office of Tribal Relations. Neither listing links to a Research Data Archive record.
- **Agency metadata XML** (`S_USA.TRIBALCEDEDLANDS.xml`): Use constraints "This data is for informational purposes only."; Access constraints "None"; a liability disclaimer ("makes no warranty, express or implied"); **no license text**; credit "USDA Forest Service Office of Tribal Relations"; publication date 20180529; sources are "Sixty-seven maps from 'Indian Land Cessions in the United States,' compiled by Charles C. Royce".
- **Forest Service Research Data Archive record: could-not-verify.** The catalog and the `?q=Royce` search returned only facet menus with no records, and the doi prefix `10.2737/RDS` was the only identifier. I found no RDA record for this dataset.
- **Conflict:** Data.gov says CC BY 4.0; the agency XML says "informational purposes only", no license, no access constraint. The existing J4 and E2 treatment of this as [disputed] is accurate. J4 gate G-01 (written confirmation) remains the right control.

### 3.3 Harvard/High Country News "Land-Grab Universities"

(The data is by High Country News (Robert Lee, March 2020); Harvard is not named on any page I read.)
- **Repo README** (github.com/HCN-Digital-Projects/landgrabu-data; `github.com/HCNData/landgrabu-data` resolves to the same repository page): the database is licensed under the Open Database License and the contents under Creative Commons Attribution-ShareAlike (links to ODbL 1.0 and CC BY-SA 3.0). Cite as Robert Lee, "Morrill Act of 1862 Indigenous Land Parcels Database," High Country News, March 2020. Contact landgrabu@hcn.org.
- **Repo sidebar:** "CC0-1.0 license". **Raw LICENSE file** (`master/LICENSE`): the text is CC0 1.0 Universal, with no attribution clause.
- **landgrabu.org:** repeats the README's ODbL and CC BY-SA wording and the citation line; says the data can be downloaded as CSV and shapefiles; the footer links to site terms (text not read).
- **hcn.org/issues/land-grab-universities:** the article text is licensed "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International"; republishing requires full text and attribution; images only case by case. It links the repo but states **no license for the data**. It does not mention ODbL or CC BY-SA.
- **Corrections to repo docs:** J4 (line 45) and E2 (line 63) attribute "ODbL 1.0 ... contents CC BY-SA" to HCN's *article*. That wording appears on landgrabu.org and in the README, not on the hcn.org article page. The existing instruction to "read the LICENSE file" is now answered: the LICENSE file is CC0.
- **Conflict:** LICENSE file and sidebar (CC0) against README and landgrabu.org (ODbL plus CC BY-SA). Ask landgrabu@hcn.org which governs before any reuse.

## 4. Recommendations

1. Remove the Seeding Sovereignty `donation_url`; blank the ILTF `donation_url` until ILTF confirms the site is clean and the GiveSmart form can be opened.
2. Render `wsdp.org`, `indiancanyon.org` and `kaipoma.org` only as plain text or not at all, and remove the `www.kaipoma.org` URL node from `build/nodes.json`.
3. Add the Conservation Fund EIN; keep the Rematriation and Shared Spaces EINs labelled "probable".
4. Before listing the Save California Salmon link, NARF's form or the PayPal links for WELRP and KUA, open them in a real browser and confirm the payee name at checkout.
5. Narrow the Washoe superlative, restate the Mi'kmaq acreage as "about 3,400", restate the Esselen mechanism, and date the Stockbridge-Munsee 351-acre figure to the 2023 article.
6. Correct the HCN provenance in J4 and E2, add the NLD FAQ as a third NLD source, and record that no Research Data Archive record for the Royce layer was found.
7. Do not recommend any organization listed as could-not-verify or red-flag (Native American Land Conservancy, The Cultural Conservancy, WSDP, Indian Canyon, Kai Poma, Seeding Sovereignty, Friends of CRYP) without a manual check.

## Sources

ProPublica Nonprofit Explorer organization pages for the EINs listed in 1B (`https://projects.propublica.org/nonprofits/organizations/<EIN>`); Charity Navigator pages `https://www.charitynavigator.org/ein/<EIN>` for 823776329, 412014273, 454714238, 840611876, 824415931, 463944868, 330832220, 320447436, 541254491, 411673625, 943003900, 931326405, 460423106, 992707481, 383653476, 881650309, 911122115, 851101586; the donation, homepage and about pages named in 1A and 1C; the campaign sources named in section 2; and the licensing sources named in section 3.

## Confidence and Gaps

- Not reached: cryp.org, nativeamericanlandconservancy.org, cultural-conservancy.org, sixnationsmuseum.org (robots-blocked); the GiveSmart form (two failures); PayPal hosted-button pages (stalled); the NARF form body; the Wayback Machine (blocked); ProPublica search (blocked); westernrivers.org/blue-creek.
- Charity Navigator ratings were confirmed only where listed above; Charity Navigator pages for Six Nations, Kai Poma, NHLC, KUA, HILT, TPL, TNC and others were not opened because the seed claims no rating for them.
- Federal recognition and Federal Register status of the tribal rows were not checked.
- Campaign dates for Mechoopda and the Pe' Sla mining controversy, Rosebud's role, the WRC Green Diamond acquisition dates, and Penobscot, Pamunkey, Santa Ynez, Puyallup, Mashpee and headline-only rows were not verified.
- I did not open any native-land.ca terms-of-use page; none could be reached.
