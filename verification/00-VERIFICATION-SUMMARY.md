---
title: Verification Summary
author: Benjamin Life (@omniharmonic)
date: 2026-10-16
status: draft
confidence: medium
---

# Verification Summary (one page)

**Nothing in this project has had tribal review or legal review.** Three AI verification passes checked claims against web sources; a Corrections Agent then applied what they could source. Every change is in `CORRECTIONS-APPLIED.md`; originals are in `originals/`.

## What was verified

| Verifier | Scope | Items | Confirmed | Corrected | Wrong | Could not verify | Single-source / red flag |
|---|---|---|---|---|---|---|---|
| V1 legal | 104 cases, 51 statutes | 142 | 119 | 10 | 0 | 13 | |
| V2 facts | 61 treaty rows, 20 violations, 15 D3 statistics, 11 events | 203 | 139 | 11 | 6 | 15 | 32 single-source |
| V3 donations, licenses | 21 donation URLs, 39 EINs, 11 campaigns, 8 licenses | 85 | 60 | 10 | 0 | 9 | 6 red flags |

## What was corrected

199 field changes in 9 seed CSVs, 165 passages in research Markdown, one crosswalk override, and graph numbers updated in 13 docs. Highlights: Sherrill treaties (Fort Schuyler 1788, Canandaigua 1794); culverts amended opinion; Seneca caption (v. Brucker); Carpenter v. Shaw (Choctaw); Lumbee Pub. L. 119-60; Bears Ears Proclamations 11043 and 11044 (121,096 acres reserved, 1,238,904 excluded); Medicine Creek 20 years; Navajo reservation about 17.5 million acres; 13 statute rows upgraded to `verified`; ILTF, Seeding Sovereignty, wsdp.org, indiancanyon.org and kaipoma.org donation links held or blanked; the Friends of CRYP identifier removed. Rebuilt graph: 1,563 nodes, 3,543 edges, 29 orphans, 0 schema errors.

## What remains unverified

20 proposed corrections were not applied: 13 lacked a firm source or were could-not-verify or single-source (tags kept or flagged, none upgraded), and 7 entries are **unresolved verifier conflicts** (three distinct conflicts): the V047 and *McGirt* Stat. pages (V1: 418/700/786, V2: 417/699/785), the V022 "2 million acres", and the *Cooley* reporter page. Also unverified: 2018-2023 Supreme Court reporter pages (Wikipedia only), *Murphy v. Royal*, the Dawes "Pub. L. 49-105" label, all Kappler page numbers, EINs against IRS TEOS, every donation page opened in a browser, Penobscot "11,000 acres", Franklin 1830, treaties T-023 and T-160, and 2026 litigation claims.

## What could not be reached

OSU Kappler (treaties.okstate.edu), congress.gov and npr.org were blocked; supremecourt.gov bound volumes, CourtListener and some tribal and nonprofit sites were blocked; web search quota was exhausted; WebFetch returned model-written page summaries, not raw pages.

## What a human legal reviewer must check, in priority order

1. The three unresolved conflicts above, against the bound reporters and the Statutes at Large.
2. Written permissions and licenses: Native Land Digital (CC0 label vs Data Sovereignty Treaty vs FAQ), Forest Service CC BY 4.0, High Country News (CC0 LICENSE file vs ODbL/CC BY-SA README), gates G-01 and G-06.
3. Reporter pages for 2018-2023 cases, *Cooley*, *Murphy v. Royal*, the culverts reporter cite (853 F.3d 946).
4. Black Hills figures (B3 still says $17.5 million as the award; the $105 million total is single-source).
5. Donation policy, tax-deductibility language, and the "no evictions" statement (G3).
6. Lifting the ILTF hold only after ILTF confirms its site is clean.

## What tribal reviewers must check

1. Every nation name, endonym and summary, especially the Haudenosaunee (Oneida, Cayuga, Seneca) cases, Lakota (Black Hills, Fort Laramie band list, including the Sihasapa/Blackfeet division), Navajo, Western Shoshone (Ruby Valley, *Dann*), Yurok, Wiyot, Esselen, Washoe, Wabanaki, Pomo (Kai Poma and Blues Beach), Menominee, Klamath and Lumbee.
2. Sacred-site handling (Pe' Sla, Bears Ears, Blue Lake, Oak Flat): no site-level coordinates.
3. Whether each listed organization is Indigenous-led as described, and whether tribes want to be linked to it.
4. Terms such as "ceded" and "extinguished", which are U.S. legal categories.
