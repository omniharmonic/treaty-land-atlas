---
title: "F4: Donation Integrity Guidance and Draft Site Donation Policy"
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# F4. Donation Integrity Guidance and Draft Site Donation Policy

*Corrections note (2026-10-16): verification corrections (V1 legal, V2 facts and figures, V3 donations and licensing) were applied to this file where a source URL was given. See `verification/CORRECTIONS-APPLIED.md` for each change and for what was not applied. No lawyer or tribal government has reviewed this file.*

This file does three jobs: (1) a vetting method the project can repeat, (2) real red flags found while researching F2, and (3) draft policy language for the site. Tags follow the brief. Legal statements about tax treatment are `[from-memory]` and must be reviewed by counsel or a CPA before publication.

---

## 1. Core stance

1. **The site collects no money.** It links to organizations' own donation pages. It takes no commission, affiliate fee or data from any link. (Recommended; a decision for the project owner.)
2. **Verify before listing, re-verify before every release.** A listing is a promise to the reader. Links rot, domains lapse, and organizations change legal entities.
3. **Prefer Indigenous-led, and say exactly what that means.** "Tribal government," "Indigenous-led nonprofit," "ally nonprofit" and "fiscally sponsored project" are different things and get different labels.
4. **Say what a gift actually does.** Most large returns were funded by public programs and big philanthropy (Blue Creek: $56 million total, $8 million public grants `[verified]`). A small gift supports an organization's work; it does not "buy back an acre."
5. **Nothing the site cannot check is presented as certain.** Unverifiable groups appear as "information only" with no donate link, or not at all.
6. **Defer to nations.** A tribe's own channel, request, or silence outranks the site's preferences. No fundraising "for" a nation without its written consent.

---

## 2. Vetting checklist (repeatable)

For each organization, record the evidence URL and the date checked.

| Step | Check | Where | Pass condition |
|---|---|---|---|
| 1 | **Legal identity** | Organization's own site (EIN or tax-ID statement), IRS Tax Exempt Organization Search (TEOS), ProPublica Nonprofit Explorer | EIN found in at least two independent places and names match (or the mismatch is explained, for example IEN's EIN is registered to "Indigenous Educational Network of Turtle Island") |
| 2 | **Status and recency** | ProPublica / TEOS: exemption status, latest Form 990 year, revocation list | Filed a 990 for a fiscal year within the last 18 months; not on the IRS auto-revocation list `[from-memory: check TEOS for revocation]` |
| 3 | **Third-party watchdog** | Charity Navigator (`charitynavigator.org/ein/<EIN>`), Candid profile/seal | Record the rating; note low ratings (Honor the Earth is 2/4 `[verified]`) |
| 4 | **Donation URL ownership** | Click the link from the organization's own home page (not from search results or social posts); confirm payee name at checkout; check HTTPS; check that the domain is the same as, or linked from, the org's main site | Payee matches the legal entity or its stated fiscal sponsor |
| 5 | **Domain sanity** | Open the home page the day you add it; check that its content matches the organization | Content is about the organization |
| 6 | **Indigenous leadership** | Leadership page with names and tribal affiliations; board composition; tribal government endorsement | "Verified" = named Native leadership in a source read; "self-described" = the organization says so; else "unverified" |
| 7 | **Fiscal sponsor** | Site wording ("fiscally sponsored by ..."); sponsor's EIN | Sponsor named; gift is tax-deductible only if the sponsor is a 501(c)(3) |
| 8 | **Specific-purpose gifts** | Confirm in writing how a designated gift (for example "LANDBACK") is handled | Written confirmation, or the site says "general support" |
| 9 | **Tribal consent** | For any listing that names a nation, land or campaign | A tribal contact or published tribal statement; log consent status |
| 10 | **Conflicts** | Ownership and benefit | Site owner has no financial interest in the listed organization (disclose any relationship) |

**Tiering used in F2/CSV:** Tier 1 (list; all steps pass), Tier 2 (list with caveats shown), Tier 3 (information only, no donate link), Do not link.

---

## 3. Red flags found in this research (real cases)

These are the reasons the F2 directory contains "hold" and "do not link" rows. They should become training examples for anyone updating the directory.

| Case | What was seen (2026-10-16 unless noted) | Lesson |
|---|---|---|
| **wsdp.org (Western Shoshone Defense Project)** | The domain served an unrelated Japanese-language blog. Amnesty International's May 2026 report still cites the organization as active; Anthropocene Alliance lists it as "501c3 Tax Deductible: No." | A real, important organization can lose control of its domain. A donation link to a lapsed domain could send money to someone else. Never link a domain you did not open that day. |
| **indiancanyon.org (Indian Canyon Mutsun Band of Costanoan)** | The domain served an unrelated Australian internet-provider article. A ProPublica search for "Indian Canyon" returned only "Indian Canyon Land Charitable Organization" (Glendale, CA), which is not shown to be the band. | Same as above; also do not infer identity from a similar name. |
| **iltf.org (Indian Land Tenure Foundation)** | The home page contained an unrelated spam link (a gambling-site anchor). ILTF's EIN, ProPublica record and Charity Navigator rating (4/4) all check out. | Injected links can mean a compromised website. Re-open the donate URL on the live site and consider contacting the organization. Also: the FY2024 audit reportedly noted a material weakness in internal controls; read it. **Outcome (V3, 2026-10-16):** the spam link was confirmed on the home page and the contribute page, so the ILTF donation link is on hold and `donation_url` is blank in the seed data. |
| **Similar names** | Native Land Conservancy (Mashpee, MA; EIN 46-3944868) vs Native American Land Conservancy (Banning, CA; EIN 33-0832220); Cheyenne River Youth Project (Eagle Butte, SD) vs Friends of the Cheyenne River Youth Project (Lincoln, NE); Rematriation Inc (Syracuse, NY) vs Rematriation Society Inc (Hawthorne, CA); Hawaiian Islands Land Trust vs Hawai'i Land Trust (rename) | Match the EIN, not the name. |
| **Entity change** | Lakota People's Law Project moved from the Romero Institute to Sacred Defense Fund on Dec. 1, 2024; SDF's EIN is 99-2707481 | Older receipts and web pages can name the wrong payee. |
| **Placeholder website** | kaipoma.org says "Our new website is coming soon"; Kai Poma is a real 501(c)(3) (EIN 88-0548030) created by three Pomo tribal governments, and Blues Beach's deed was not recorded as of July 2026 | A legitimate organization may have no donation channel yet. List no link. Do not let a news story's enthusiasm create a donation page that does not exist. |
| **Successor EIN** | Honor the Earth's current EIN (45-4714238) has a 2015 ruling year though the group dates to 1993 `[from-memory]`; its HQ moved (Colstrip / Lame Deer, MT); Charity Navigator 2/4 | Note unusual histories and low ratings rather than hiding them. |
| **Odd registry data** | White Earth Land Recovery Project: ProPublica "tax-exempt since Nov. 2021" despite filings from earlier years | Registry quirks are common; confirm in IRS TEOS before showing an EIN. |
| **Opaque payment links** | Save California Salmon's donate link is a Square short link; IEN uses PayPal; WELRP uses a PayPal hosted button | Not a red flag by itself; confirm the payee name shown at checkout. |
| **Fiscal sponsorship hidden in the footer** | Seeding Sovereignty states it is "fiscally sponsored by the Center for Nuleadership for Urban Solutions"; Right Relationship Boulder's Land Group is sponsored by Mediators Foundation | Name the sponsor next to the listing. |
| **Blocked or unreadable sites** | Several organizations' sites refuse automated reading (CRYP, The Cultural Conservancy, Native American Land Conservancy, First Light) | A human must open these before any link is published. |

**Generic red flags to teach users:** pressure to give today; requests for gift cards, crypto transfers or wires to personal accounts; no EIN on request; donation pages on social platforms with personal names; "sell by the acre/square foot" offers; unsolicited messages claiming to represent a tribe; crowdfunding pages that say "for the tribe" but are not run by it; payees that do not match the organization; thank-you receipts without the organization's EIN; "100% goes to the cause" claims with no source `[from-memory: industry-standard red flags]`.

---

## 4. Who you are giving to: the distinctions the site must show

| Recipient type | What it is | Typical donation route | Tax note `[from-memory; confirm with a CPA]` | Example here |
|---|---|---|---|---|
| **Tribal government** | A sovereign government (federally or state recognized) | Usually no public donation program. Contact the tribal office; some run a designated fund or foundation | Gifts to a tribal government for public purposes may be deductible (federal law treats tribes like states for certain purposes, 26 U.S.C. 7871) | Wiyot, Yurok, Tule River, Washoe: no public channel found |
| **Tribal nonprofit** | A 501(c)(3) the tribe itself controls | Its own donation page | Deductible as a 501(c)(3) | Esselen Tribe of Monterey County; Duwamish Tribal Services; Kai Poma (no channel yet) |
| **Indigenous-led nonprofit** | A 501(c)(3) led by Native people but not a government | Its own donation page | Deductible | NDN Collective; Sogorea Te'; Native Land Conservancy; NARF |
| **Fiscally sponsored project** | A project without its own tax status, using a sponsor's | Sponsor's donation form with a project designation | Deductible only through the sponsor's 501(c)(3); sponsors often keep an admin fee | Seeding Sovereignty; Right Relationship Boulder Land Group; LPLP (program of Sacred Defense Fund) |
| **Allied (non-Indigenous) nonprofit** | A conservation or community group that works with tribes | Its own donation page | Deductible | Western Rivers Conservancy; Trust for Public Land; The Nature Conservancy |
| **Tribal enterprise / corporation** | A business arm of a tribe or an ANC | Not a charity; not a donation channel | Not deductible | Pte Hca Ka, Inc. `[unverified]`; NANA Regional Corporation |
| **State agency** | Government program | Not a donation channel | n/a | Hawaii DHHL and OHA; California CNRA |

**Why the difference matters.** A tribal government holding land has jurisdiction and can decide how land is used; an Indigenous-led nonprofit holds land under state property and tax law (and may later convey it); an ally nonprofit may hold the land only until transfer. A donation to the ally is not a donation to the tribe, and an ally's press release may credit the ally more than the nation. The site's labels must make this visible.

**Tribal-led versus nonprofit-led.** Prefer tribal-led or tribal-controlled vehicles for "return of land to a nation." Use Indigenous-led nonprofits for rematriation, stewardship, legal capacity and programs where the nonprofit itself is the actor. Use ally nonprofits only where they are doing the transaction at a tribe's request, and say so.

**Non-federally-recognized nations.** The Duwamish, and likely the Esselen and Amah Mutsun, are not federally recognized `[Duwamish verified; others from-memory]`. Their land is often held through a tribal nonprofit, so the nonprofit may be the only giving channel. Say "not federally recognized" plainly and respectfully; do not imply illegitimacy.

**Hawaii and Alaska.** Hawaiian Home Lands and OHA are state programs, and ANCs are for-profit shareholder corporations. They must not appear in the same "tribal government" list.

---

## 5. Avoiding performative or exploitative fundraising

The site may not:

- use images of people, ceremonies, or sacred sites without the community's consent;
- reduce Indigenous people to need ("poverty porn") or to a symbol of the donor's virtue;
- sell merchandise, "adopt an acre," or "buy a square foot of Land Back" products, or imply that a fixed dollar amount returns a fixed area of land (see the Blue Creek financing above);
- gamify donations, run public leaderboards of donors, or offer donors tax advice;
- fundraise for a nation, land return or campaign without that nation's written consent;
- promise outcomes (for example, that a gift will close Mount Rushmore, stop a pipeline or return a named parcel);
- present allied organizations as Indigenous-led;
- publish locations of sacred sites beyond what the stewards publish (brief principle 5); Bear Butte, Blue Lake and Pe' Sla are publicly discussed by their stewards, but parcel-level coordinates should be withheld without tribal consent;
- use a nation's name, flag, seal or art as branding.

The site should:

- put Indigenous voices first (quote tribal sources and spell names the nation's way, such as Tuluwat, Waší·šiw, Peeskawso Peak);
- show that money is one lever among several (see F2 section 8: voluntary rent, in-kind gifts, volunteering as asked, advocacy);
- credit the work: say "completed by the Yurok Tribe with Western Rivers Conservancy" rather than "returned by WRC."

---

## 6. Draft site donation-policy language

Everything below is **draft copy for the project owner to adapt**. Bracketed items are decisions.

### 6.1 Short version (footer or link text)

> **How we handle donations.** This site does not collect money. We link to organizations that we have checked: we confirm their legal status, look for Indigenous leadership, and open the donation page ourselves. We prefer organizations led by the Native nations and people whose land is involved. Last checked: [date]. Spot a problem? [contact].

### 6.2 Full policy (page: "Giving, support and our donation policy")

> **What this page is.** The Treaty Land Atlas is an educational and advocacy project by Benjamin Life (@omniharmonic). It points readers to ways of supporting Land Back: returning land and authority over land to Indigenous nations. We do not receive, hold or process donations. We take no payment, commission, affiliate fee or data from any organization we list.
>
> **How we choose who to list.** Before we list a group we check (1) its legal identity and tax status in public registries, (2) whether it has filed recent financial reports, (3) the payee on its donation page, (4) who leads it and whether they are Native people or a tribal government, and (5) whether the nation or community whose land is concerned supports being named. We repeat these checks [every quarter and before each major update]. If we cannot verify something, we say so, or we do not list the group.
>
> **How we label.** Each listing shows: *Tribal government*, *Tribal nonprofit*, *Indigenous-led nonprofit*, *Fiscally sponsored project*, or *Allied organization (not Indigenous-led)*. It also shows the date we last verified it and what we could and could not verify. "Self-described" means the group tells us it is Indigenous-led and we have not independently confirmed its leadership.
>
> **Our preference.** We put Indigenous-led and tribally controlled efforts first. Allied organizations such as conservation groups have helped complete many land returns, but a gift to an ally is not a gift to a tribe. We say which is which.
>
> **Gifts to tribes.** Most tribal governments do not run public donation programs. We do not ask you to give to a tribal government unless the nation has told us how it wishes to receive support. If you want to support a particular nation, contact its government or one of the Indigenous-led groups listed, and ask what would help.
>
> **What your money does (and does not) do.** Large land returns are usually paid for by public programs, foundations and long-term negotiation. A gift to a nonprofit supports that organization's work. It does not buy a certain number of acres.
>
> **What we will never do.** We will not use images or stories without consent, sell products or "adopt an acre" schemes, run donor leaderboards, promise outcomes, or tell you to give to a person or group we have not verified.
>
> **Other ways to help.** Money is not the only way. Some Indigenous hosts ask local residents to pay a voluntary rent or land tax (for example Real Rent Duwamish in Seattle and the Shuumi Land Tax in the East Bay). Others ask for goods, volunteers or land. Learn what each nation or organization is actually asking for before you act.
>
> **Staying safe.** Open donation links from the organization's own website. Check that the payee matches the organization. Be cautious of pressure, gift-card requests or personal accounts. If a link on this site looks wrong, tell us and we will take it down while we check.
>
> **Corrections and removal.** If a listed organization, a tribal government, or a community member asks us to change or remove a listing, we will do so promptly [target: within 5 business days]. Contact: [email].
>
> **Limits.** We are not tax or legal advisers. Tax treatment of gifts varies by recipient and by country; please ask a tax professional.

### 6.3 Per-listing label template

```
Name:            [official name]
Type:            [Tribal government | Tribal nonprofit | Indigenous-led nonprofit |
                  Fiscally sponsored project (sponsor: ...) | Allied org (not Indigenous-led)]
Leadership:      [Verified: names and nations | Self-described | Not verified]
Registry:        EIN [..]  (IRS-listed 501(c)(3); latest 990: FY[..]); Charity Navigator: [..]
Gift goes to:    [payee name shown at checkout]
Designated gift: [General support only | Written confirmation received on [date]]
Nation consulted:[Yes, [date] | Not yet]
Last verified:   [date], by [name], evidence: [URL]
Caveats:         [text]
```

### 6.4 Operational rules

- Store `last_verified`, `verifier`, `evidence_url`, `status` (`listed` | `info-only` | `delisted`) with every organization record (suggested additions to the CSV schema).
- Run an automated link and content check on every donation URL before each release and at least monthly; delist automatically on HTTP failure, redirect to a different domain, or page text that no longer contains the organization's name.
- Delist triggers: IRS revocation; domain change; credible reports of fraud; loss of Indigenous leadership if the listing depended on it; request from the nation or organization.
- Keep a visible changelog of listing changes.
- Have the donation page and policy language reviewed by a lawyer licensed in the project owner's state (charitable solicitation rules vary; some states regulate third-party promotion of charities `[from-memory]`).

---

## Sources

- Evidence cases come from this session's fetches of: https://www.wsdp.org/ ; https://www.indiancanyon.org/ ; https://www.iltf.org/ ; https://www.kaipoma.org/ ; https://lakotalaw.org/about ; https://www.honorearth.org/ ; https://www.ienearth.org/ways-to-give/ ; https://www.seedingsovereignty.org/ ; https://rightrelationshipboulder.org/land-group/
- Registry: ProPublica Nonprofit Explorer API and organization pages (EINs in F2); Charity Navigator profiles (`https://www.charitynavigator.org/ein/<EIN>`)
- Anthropocene Alliance listing: https://anthropocenealliance.org/western-shoshone-defense-project/ ; Amnesty International AMR 51/0943/2026: https://www.amnesty.org/en/documents/amr51/0943/2026/en/
- Blue Creek financing: https://nativenewsonline.net/sovereignty/land-back-47-097-acres-returned-to-yurok-tribe/
- Real Rent Duwamish: https://www.realrentduwamish.org/ ; Sogorea Te' donate page: https://sogoreate-landtrust.org/donate/
- 26 U.S.C. 7871 and general charity-solicitation points are `[from-memory]` and not consulted this session.

## Confidence & Gaps

**Overall: medium.** The case-study findings are directly observed (with the caveat that fetches were made through a summarizing tool and from one network vantage point; a site that failed once may work for a human, and the wsdp.org result should be rechecked by opening it in a browser and by a WHOIS or DNS check, which I did not run). The policy language is original draft copy, not legal advice.

- Not checked: IRS TEOS and revocation lists; Candid/GuideStar seals; state charity registrations; WHOIS/domain age for any site.
- Tax statements (26 U.S.C. 7871; deductibility of gifts to tribal governments; fiscal-sponsor fees) are `[from-memory]` and need legal review.
- No tribal government's own donation policy was found or read; the claim that "most tribal governments do not run public donation programs" is a general observation from the nations checked (Wiyot, Yurok; Karuk site had no donation content) and should be validated nation by nation `[unverified generalization]`.
- Consent from named nations and organizations has not been sought; every listing needs it before publication.
