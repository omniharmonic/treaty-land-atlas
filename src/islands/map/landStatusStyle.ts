// The map's visual encoding of the K1 land-status model, in one place. Colors live in
// src/styles/global.css as --ls-* tokens; this module maps statuses, flags, evidence and overlay
// layers to labels, tokens, line patterns and hatch images. Change the encoding here (and the
// tokens), not in components. Every status has a label and a line pattern, so color is never the
// only signal; flags add a hatch whose weight follows the evidence.

export const STATUS_ORDER = [
  'ceded_by_ratified_treaty',
  'ceded_by_agreement_with_consent_process',
  'taken_by_statute',
  'taken_by_executive_order',
  'taken_no_instrument',
  'unratified_treaty_area',
  'promised_reserved',
  'described_not_ceded',
  'contested',
] as const;
export type LandStatus = (typeof STATUS_ORDER)[number];

/** Short legend labels. "Ceded" always means recorded as ceded in the federal record. */
export const STATUS_LABEL: Record<LandStatus, string> = {
  ceded_by_ratified_treaty: 'Recorded as ceded by a ratified treaty',
  ceded_by_agreement_with_consent_process: 'Recorded as ceded by an agreement Congress ratified',
  taken_by_statute: 'Taken by Act of Congress',
  taken_by_executive_order: 'Taken by executive order',
  taken_no_instrument: 'Taken with no treaty, act or order',
  unratified_treaty_area: 'Claimed under a treaty never ratified',
  promised_reserved: 'Promised or reserved to the nation, still held in 1894',
  described_not_ceded: 'Described by treaty, never ceded',
  contested: 'Cession contested in the federal record itself',
};

export const STATUS_HELP: Record<LandStatus, string> = {
  ceded_by_ratified_treaty:
    'The Senate ratified a treaty with a cession clause. This says what the record shows, not that the nation consented freely: open a shape for what is documented about how it was signed.',
  ceded_by_agreement_with_consent_process:
    'An agreement signed with the nation and given effect by Congress, with a consent rule written into it. Whether that rule was met is shown for each area.',
  taken_by_statute:
    'Congress took the land or ordered it sold without a valid cession: annulment, forfeiture, or an act that went beyond what the nation signed.',
  taken_by_executive_order:
    'A president revoked a reserve or declared land “considered as ceded”, with no instrument the nation signed.',
  taken_no_instrument:
    'No treaty, agreement, act or order transferred it. The United States took possession, or the record names nothing.',
  unratified_treaty_area:
    'Royce maps it from a treaty the Senate never ratified; the United States treated the land as taken anyway (for example California, 1851–52).',
  promised_reserved:
    'Set apart for the nation by treaty, agreement, act or order and still reserved when the record ends in 1894. Later allotment and surplus-land acts are not shown as areas.',
  described_not_ceded:
    'A treaty described the nation’s territory and contained no cession, and no later instrument ceded it. In 1945 the Supreme Court held that such descriptions did not recognize title.',
  contested:
    'A cession instrument exists, but federal officials, courts or the claims commission doubted its reach over this land.',
};

/** Line pattern per status (MapLibre line-dasharray), a second cue beside color. */
export const STATUS_DASH: Record<LandStatus, number[]> = {
  ceded_by_ratified_treaty: [3, 1.5],
  ceded_by_agreement_with_consent_process: [6, 1.5, 1, 1.5],
  taken_by_statute: [6, 1.5],
  taken_by_executive_order: [1, 2.5],
  taken_no_instrument: [0.5, 2],
  unratified_treaty_area: [2, 2, 6, 2],
  promised_reserved: [1, 0],
  described_not_ceded: [4, 1, 1, 1],
  contested: [1, 1],
};

/** CSS token for a status fill. */
export const statusVar = (s: string) =>
  `--ls-${(STATUS_ORDER as readonly string[]).includes(s) ? s : 'taken_no_instrument'}`;

/** Lost with no lawful cession on the record: keeps its own color in the counterfactual view. */
export const NO_LAWFUL_CESSION: ReadonlySet<string> = new Set([
  'unratified_treaty_area',
  'taken_no_instrument',
  'contested',
]);
/** Still with the nation when the record ends (shown from the year it was promised or described). */
export const NOT_LOST: ReadonlySet<string> = new Set(['promised_reserved', 'described_not_ceded']);

export const FLAG_LABEL: Record<string, string> = {
  duress_military: 'Signed under military duress',
  duress_starvation: 'Signed under hunger or withheld food',
  hostages: 'Hostages held',
  signatory_defect: 'Signers’ authority contested',
  excluded_party: 'A nation with rights to the land was left out',
  intertribal_dispute: 'Assigned to more than one nation',
  bribery_fraud: 'Bribery or fraud documented',
  senate_amended_no_consent: 'Changed by the Senate without the nation’s assent',
  consent_threshold_not_met: 'Its own consent rule was not met',
  massacre_linked: 'A massacre on or near the land, before or during the taking',
  promise_broken: 'A promise for this land was not kept',
  icc_money_not_land: 'Claim ended with money, not land (Indian Claims Commission)',
  judicially_found_taking: 'A court found a taking',
  trespass_before_cession: 'Settlers or miners were already trespassing',
  rights_reserved: 'Hunting, fishing or other rights reserved',
  payment_refused: 'The nation refused the money',
  annuities_conditioned_on_assent: 'Annuities withheld until the nation assented',
};

/** Reader-facing evidence badges (decision log 2026-10-20). */
export const EVIDENCE_CLASS: Record<string, string> = {
  primary: 'ev-primary',
  scholarly: 'ev-scholarly',
  reported: 'ev-reported',
  disputed: 'ev-disputed',
};

export const MASSACRE_LINK: Record<string, string> = {
  preceded: 'Preceded',
  enforced: 'Enforced',
  followed: 'Followed',
  none: 'Context for',
};

/** Overlay layers a reader can switch on and off (in the URL as l=...). */
export const OVERLAYS = [
  {
    id: 'massacres',
    label: 'Massacre sites, at a general location',
    note: 'Content warning: violence. Off until you turn it on.',
  },
  {
    id: 'norecord',
    label: 'Land with no federal cession record',
    note: 'Colonial and state takings, Texas: Royce records nothing here.',
  },
  { id: 'today', label: 'Reservations and trust lands today', note: '' },
] as const;
export type OverlayId = (typeof OVERLAYS)[number]['id'];

/** Hatch images for MapLibre fill-pattern: solid diagonal lines, or dots for reported-only flags. */
export function hatchImage(
  kind: 'solid' | 'dots' | 'faint',
  ink: string,
  size = 10,
): { width: number; height: number; data: Uint8Array } {
  const data = new Uint8Array(size * size * 4);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(ink.slice(i, i + 2), 16) || 0) as [
    number,
    number,
    number,
  ];
  const put = (x: number, y: number, a: number) => {
    const i = (((y + size) % size) * size + ((x + size) % size)) * 4;
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = Math.max(data[i + 3]!, a);
  };
  for (let x = 0; x < size; x++)
    for (let y = 0; y < size; y++) {
      if (kind === 'solid' && (x + y) % size < 2) put(x, y, 200);
      if (kind === 'faint' && (x - y + size) % size === 0) put(x, y, 70);
    }
  if (kind === 'dots') {
    const h = Math.floor(size / 2);
    for (const [x, y] of [
      [1, 1],
      [1 + h, 1 + h],
    ] as const) {
      put(x, y, 230);
      put(x + 1, y, 170);
      put(x, y + 1, 170);
      put(x + 1, y + 1, 120);
    }
  }
  return { width: size, height: size, data };
}
