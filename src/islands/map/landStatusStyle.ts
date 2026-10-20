// The map's visual encoding of the K1 land-status model (docs/design/K1-map-visual-encoding.md), in
// one place. Every color, pattern, edge, preset and label the map, legend, key, LandMeter and record
// pages use comes from here; global.css mirrors the colors as --ls-* / --fam-* tokens for swatches.
//
// Hue says which of four families the land is in (recorded as ceded, taken without a cession, no
// cession on the record, held by nations). Lightness and edge say which kind within the family.
// Texture says what was wrong with consent (solid: primary or scholarly source; dotted: reported,
// oral history or disputed). A green outline says a promise stood there. Dots say there is no
// Royce cession record (colonial, state and Texas takings; Alaska and Hawaii). Flags never change the status.

import type { ExpressionSpecification } from 'maplibre-gl';

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

// --- owner-adjustable defaults (decision log; spec s.13): one value each -----------------------
export const CONFIG = {
  /** preset shown when the URL names none */
  defaultPreset: 'recorded' as PresetId,
  /** massacre sites start hidden; turning them on shows the content note once */
  massacresOnByDefault: false,
  /** hatch for documented defects */
  hatch: true,
  /** reported, oral-history and disputed findings drawn as dotted hatch (false: panel only) */
  showReportedOnMap: true,
  /** honored-through view greys only recorded cessions; takings without a cession keep their color */
  honoredGreysTakings: false,
  /** dark theme: "taken with no instrument" brightest (true) rather than darkest */
  darkSalienceFlip: true,
};

export type Theme = 'light' | 'dark';
export type DisplayClass =
  | 'ceded'
  | 'agree'
  | 'contested'
  | 'statute'
  | 'eo'
  | 'none'
  | 'unrat'
  | 'desc'
  | 'reserved'
  | 'prior'
  | 'gone';
export type Family = 'ceded' | 'taken' | 'never' | 'held';

export const LS_TO_CLASS: Record<LandStatus, DisplayClass> = {
  ceded_by_ratified_treaty: 'ceded',
  ceded_by_agreement_with_consent_process: 'agree',
  contested: 'contested',
  taken_by_statute: 'statute',
  taken_by_executive_order: 'eo',
  taken_no_instrument: 'none',
  unratified_treaty_area: 'unrat',
  described_not_ceded: 'desc',
  promised_reserved: 'reserved',
};
export const CLASS_ORDER: DisplayClass[] = [
  'ceded',
  'agree',
  'contested',
  'statute',
  'eo',
  'none',
  'unrat',
  'desc',
  'reserved',
  'prior',
  'gone',
];
export const FAMILY: Record<DisplayClass, Family> = {
  ceded: 'ceded',
  agree: 'ceded',
  contested: 'ceded',
  gone: 'ceded',
  statute: 'taken',
  eo: 'taken',
  none: 'taken',
  unrat: 'never',
  desc: 'never',
  reserved: 'held',
  prior: 'held',
};
export const FAMILY_LABEL: Record<Family, string> = {
  ceded: 'Recorded as ceded',
  taken: 'Taken without a cession',
  never: 'No cession on the record',
  held: 'Held by nations',
};

/** Opaque fills (spec s.2.1). Contested shares the ceded fill and carries a badge. */
const darkNone = CONFIG.darkSalienceFlip ? '#E7B3DC' : '#5A2D52';
export const FILL: Record<Theme, Record<DisplayClass, string>> = {
  light: {
    ceded: '#CEAC6C',
    agree: '#E8CC8E',
    contested: '#CEAC6C',
    statute: '#985F8C',
    eo: '#B377A6',
    none: '#6C3662',
    unrat: '#7DAFDB',
    desc: '#9DC3E2',
    reserved: '#48804A',
    prior: '#DAE5D0',
    gone: '#E3DED0',
  },
  dark: {
    ceded: '#D1A556',
    agree: '#AC8B4C',
    contested: '#D1A556',
    statute: '#CD8EBF',
    eo: '#8D6183',
    none: darkNone,
    unrat: '#164D7E',
    desc: '#1A3C54',
    reserved: '#2F6C3B',
    prior: '#1F2C1C',
    gone: '#41463F',
  },
};
/** Family ink: edges, legend key strokes (spec s.2.2). */
export const INK: Record<Theme, Record<Family | 'gap', string>> = {
  light: {
    ceded: '#7D5600',
    taken: '#4F2246',
    never: '#2B6492',
    held: '#2F5E33',
    gap: '#686A5B',
  },
  dark: {
    ceded: '#E9C47C',
    taken: '#F0C6E6',
    never: '#8FC0EA',
    held: '#9ACF9E',
    gap: '#A3A893',
  },
};
export const PROMISE: Record<Theme, string> = { light: '#1F6B35', dark: '#7FD08C' };
export const CASING: Record<Theme, string> = { light: '#FDFBF6', dark: '#121915' };
export const MUTED: Record<Theme, string> = { light: '#9D9F8E', dark: '#6F7C72' };
export const TEXT: Record<Theme, string> = { light: '#302F28', dark: '#ECE9DE' };
export const TODAY_LINE: Record<Theme, string> = { light: '#302F28', dark: '#ECE9DE' };
export const TODAY_FILL: Record<Theme, string> = { light: '#9DBB8C', dark: '#4F7D55' };
const HATCH_INK: Record<Theme, { dk: string; lt: string }> = {
  light: { dk: '#302F28', lt: '#FDFBF6' },
  dark: { dk: '#121915', lt: '#ECE9DE' },
};

/** Subtype edges (spec s.4). */
export const EDGE: Record<DisplayClass, { width: number; dash?: number[] }> = {
  ceded: { width: 0.6 },
  agree: { width: 0.6, dash: [4, 2] },
  contested: { width: 0.6 },
  statute: { width: 0.6 },
  eo: { width: 0.6, dash: [4, 2] },
  none: { width: 1.5 },
  unrat: { width: 0.6 },
  desc: { width: 1.5 },
  reserved: { width: 0.6 },
  prior: { width: 0.4 },
  gone: { width: 0.6 },
};

function lum(h: string) {
  const c = [1, 3, 5]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}
/** WCAG contrast ratio between two hex colors. */
export function contrast(a: string, b: string) {
  const x = lum(a);
  const y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
/** Which hatch ink a fill gets: whichever contrasts more (spec s.3). */
export function hatchSide(theme: Theme, cls: DisplayClass): 'dk' | 'lt' {
  const ink = HATCH_INK[theme];
  const fill = FILL[theme][cls];
  return contrast(ink.dk, fill) >= contrast(ink.lt, fill) ? 'dk' : 'lt';
}
export const hatchInk = (theme: Theme, cls: DisplayClass) =>
  HATCH_INK[theme][hatchSide(theme, cls)];

// --- words ------------------------------------------------------------------------------------
/** Legend lines per display class (spec s.8). */
export const LABEL: Record<DisplayClass, string> = {
  ceded: 'Ceded by a ratified treaty',
  agree: 'Ceded by an agreement Congress ratified',
  contested: 'Contested: federal sources doubt the cession reached here',
  statute: 'Taken by an Act of Congress',
  eo: 'Taken by executive order',
  none: 'Taken with no treaty, act or order',
  unrat: 'Treaty never ratified; the land was taken anyway',
  desc: 'Described in a treaty, never ceded',
  reserved: 'Promised or reserved to the nation, held in this year',
  prior: 'Not yet taken in this year',
  gone: 'Recorded as ceded before the chosen year',
};
/** Short labels for the phone key strip. */
export const SHORT: Record<DisplayClass, string> = {
  ceded: 'Ceded, treaty',
  agree: 'Ceded, agreement',
  contested: 'Contested',
  statute: 'Act of Congress',
  eo: 'Executive order',
  none: 'No instrument',
  unrat: 'Never ratified',
  desc: 'Described, never ceded',
  reserved: 'Promised, held',
  prior: 'Not yet taken',
  gone: 'Ceded before then',
};

/** Panel labels per status. "Ceded" always means recorded as ceded in the federal record. */
export const STATUS_LABEL: Record<LandStatus, string> = {
  ceded_by_ratified_treaty: 'Recorded as ceded by a ratified treaty',
  ceded_by_agreement_with_consent_process: 'Recorded as ceded by an agreement Congress ratified',
  taken_by_statute: 'Taken by an Act of Congress',
  taken_by_executive_order: 'Taken by executive order',
  taken_no_instrument: 'Taken with no treaty, act or order',
  unratified_treaty_area: 'Treaty never ratified; the land was taken anyway',
  promised_reserved: 'Promised or reserved to the nation, still held in 1894',
  described_not_ceded: 'Described in a treaty, never ceded',
  contested: 'Contested: federal sources doubt the cession reached here',
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

/** CSS token for a status (its display class) or a class, for swatches. */
export const statusVar = (s: string) =>
  `--ls-${(LS_TO_CLASS as Record<string, DisplayClass>)[s] ?? (CLASS_ORDER.includes(s as DisplayClass) ? s : 'none')}`;
export const classOf = (s: string): DisplayClass =>
  (LS_TO_CLASS as Record<string, DisplayClass>)[s] ?? 'none';
/** The older cause vocabulary (`how`, kept for prose and story moments) on the land-status classes. */
export const HOW_TO_CLASS: Record<string, DisplayClass> = {
  treaty: 'ceded',
  pressure: 'ceded',
  removal: 'ceded',
  unratified: 'unrat',
  congress: 'statute',
  executive: 'eo',
  unknown: 'none',
};
/** CSS fill and family-ink values for a land status, for SVG shapes and swatches on any page. */
export const statusFill = (s: string) => `var(${statusVar(s)})`;
export const statusInk = (s: string) => `var(--fam-${FAMILY[classOf(s)]}-ink)`;

/** Never counted as given, in any view: no cession on the record. */
export const NO_LAWFUL_CESSION: ReadonlySet<string> = new Set([
  'unratified_treaty_area',
  'taken_no_instrument',
  'contested',
]);
/** Takings without a cession: keep their color in the honored-through view (spec s.6.3). */
export const NEVER_GIVEN: ReadonlySet<DisplayClass> = new Set(
  CONFIG.honoredGreysTakings
    ? (['unrat', 'none'] as DisplayClass[])
    : ['statute', 'eo', 'none', 'unrat'],
);
/** Still with the nation when the record ends (shown from the year it was promised or described). */
export const NOT_LOST: ReadonlySet<string> = new Set(['promised_reserved', 'described_not_ceded']);

export const FLAG_LABEL: Record<string, string> = {
  duress_military: 'Signed under armed force',
  duress_starvation: 'Food or annuities withheld to force signing',
  hostages: 'Hostages held',
  signatory_defect: 'Signers lacked authority',
  excluded_party: 'A nation with rights to the land was left out',
  intertribal_dispute: 'Assigned to more than one nation',
  bribery_fraud: 'Bribery or fraud',
  senate_amended_no_consent: 'The Senate changed the text without the nation agreeing',
  consent_threshold_not_met: 'The treaty’s own consent rule was not met',
  massacre_linked: 'A massacre linked to this land',
  promise_broken: 'A promise for this land was not kept',
  icc_money_not_land: 'Claim settled with money, not land',
  judicially_found_taking: 'A court found a taking',
  trespass_before_cession: 'Settlers occupied it before any cession',
  rights_reserved: 'Rights reserved on this land',
  payment_refused: 'The nation refused the payment',
  annuities_conditioned_on_assent: 'Annuities withheld until the nation assented',
};

/** Evidence chips (decision log 2026-10-20); the text is the CSV's evidence_display. */
export const EVIDENCE_CLASS: Record<string, string> = {
  primary: 'ev-primary',
  scholarly: 'ev-scholarly',
  oral_history: 'ev-oral',
  reported: 'ev-reported',
  disputed: 'ev-disputed',
};
export const EVIDENCE_LEGEND: [string, string][] = [
  ['primary', 'Primary source'],
  ['scholarly', 'Scholarly source'],
  ['oral_history', 'Oral history (published with permission)'],
  ['reported', 'Reported by a single source'],
  ['disputed', 'Disputed'],
];

export const MASSACRE_LINK: Record<string, string> = {
  preceded: 'Preceded',
  enforced: 'Enforced',
  followed: 'Followed',
  none: 'Context for',
};
export const MASSACRE_NOTE =
  'Content note: these points mark killings of Native people. Each is at a general location, never a burial or sacred site.';

/** Overlays a reader can switch on in any preset (in the URL as l=...). */
export const OVERLAYS = [
  { id: 'massacres', label: 'Massacre sites, at a general location', note: MASSACRE_NOTE },
  { id: 'today', label: 'Reservations and trust lands today', note: '' },
] as const;
export type OverlayId = (typeof OVERLAYS)[number]['id'];

// --- presets (spec s.7), as data ----------------------------------------------------------------
export const PRESET_IDS = ['recorded', 'how', 'promised', 'broken', 'never', 'today'] as const;
export type PresetId = (typeof PRESET_IDS)[number];
export interface PresetSpec {
  label: string;
  question: string;
  /** display classes that keep their color; others are thin muted outlines */
  color: DisplayClass[];
  /** also color every broken-promise area in the color of how it was lost */
  brokenColor?: boolean;
  hatch: boolean | 'broken';
  promise: 'none' | 'lost' | 'broken' | 'reserved1894';
  /** opacity of the no-federal-record dots */
  gap: number;
  badges: boolean;
  today?: boolean;
  /** honored-through view allowed */
  honored: boolean;
}
const ALL: DisplayClass[] = [
  'ceded',
  'agree',
  'contested',
  'statute',
  'eo',
  'none',
  'unrat',
  'desc',
  'reserved',
  'prior',
];
export const PRESETS: Record<PresetId, PresetSpec> = {
  recorded: {
    label: 'What the US recorded',
    question: 'What the United States recorded for each area by this year, and how it got it.',
    color: ALL,
    hatch: true,
    promise: 'none',
    gap: 0.75,
    badges: true,
    honored: true,
  },
  how: {
    label: 'How it was taken',
    question:
      'How the land was taken: by treaty, by Act of Congress, by executive order, or with no instrument at all.',
    color: ['ceded', 'agree', 'contested', 'statute', 'eo', 'none', 'unrat', 'prior'],
    hatch: true,
    promise: 'none',
    gap: 0.75,
    badges: true,
    honored: true,
  },
  promised: {
    label: 'What was promised',
    question:
      'What was promised: land a treaty, act or order set apart for a nation by this year. A green outline marks a promise already gone.',
    color: ['reserved'],
    hatch: false,
    promise: 'lost',
    gap: 0,
    badges: false,
    honored: false,
  },
  broken: {
    label: 'Broken promises',
    question: 'Promised, then taken: a green outline stays where a promise stood.',
    color: ['reserved'],
    brokenColor: true,
    hatch: 'broken',
    promise: 'broken',
    gap: 0,
    badges: false,
    honored: true,
  },
  never: {
    label: 'Never ceded',
    question:
      'No cession on the record: treaties never ratified, land described in a treaty and never ceded, land taken with no instrument, and land with no Royce cession record.',
    color: ['unrat', 'desc', 'none', 'contested'],
    hatch: true,
    promise: 'none',
    gap: 1,
    badges: true,
    honored: false,
  },
  today: {
    label: 'Today',
    question:
      'Land held today: reservations and trust land (Census), over what was reserved in 1894.',
    color: [],
    hatch: false,
    promise: 'reserved1894',
    gap: 0,
    badges: false,
    today: true,
    honored: false,
  },
};

// --- MapLibre expressions (spec s.7.1), generated here, not inline in components ------------------
type E = ExpressionSpecification;
const get = (k: string): E => ['get', k] as unknown as E;
const Y: E = ['global-state', 'year'] as unknown as E;
const CUT: E = ['global-state', 'cut'] as unknown as E;
const lostBy = (year: E): E => ['<', get('t0'), ['+', year, 1]] as unknown as E;
const promisedBy = (year: E): E =>
  ['all', ['!=', get('py'), null], ['<=', get('py'), year]] as unknown as E;

/** Display class of an area in a given year (expression). */
export function displayClassExpr(year: E = Y): E {
  return [
    'case',
    ['in', get('ls'), ['literal', [...NOT_LOST]]],
    [
      'case',
      ['all', ['!=', get('py'), null], ['>', get('py'), year]],
      'prior',
      ['match', get('ls'), 'promised_reserved', 'reserved', 'desc'],
    ],
    lostBy(year),
    ['match', get('ls'), ...STATUS_ORDER.flatMap((s) => [s, LS_TO_CLASS[s]]), 'none'],
    promisedBy(year),
    'reserved',
    'prior',
  ] as unknown as E;
}
/** Display class in the honored-through view (spec s.6.3). */
export function honoredClassExpr(): E {
  const atCut = displayClassExpr(CUT);
  return [
    'case',
    lostBy(CUT),
    ['case', ['in', atCut, ['literal', [...NEVER_GIVEN]]], atCut, 'gone'],
    promisedBy(CUT),
    'reserved',
    'prior',
  ] as unknown as E;
}
const honored: E = ['==', ['global-state', 'honored'], true] as unknown as E;
/** The class drawn now: record view or honored view. */
export function classExpr(): E {
  return ['case', honored, honoredClassExpr(), displayClassExpr()] as unknown as E;
}
const matchClass = (cls: E, values: (c: DisplayClass) => unknown, fallback: unknown): E =>
  ['match', cls, ...CLASS_ORDER.flatMap((c) => [c, values(c)]), fallback] as unknown as E;

/** Is the area colored in the current preset (expression)? */
export function coloredExpr(): E {
  const cls = classExpr();
  return [
    'case',
    honored,
    true,
    [
      'match',
      ['global-state', 'preset'],
      ...PRESET_IDS.flatMap((p) => {
        const P = PRESETS[p];
        const base: E = ['in', cls, ['literal', P.color]] as unknown as E;
        return [
          p,
          P.brokenColor
            ? (['any', base, ['all', ['==', get('bp'), 1], lostBy(Y)]] as unknown as E)
            : base,
        ];
      }),
      true,
    ],
  ] as unknown as E;
}
export const fillColorExpr = (theme: Theme): E =>
  matchClass(classExpr(), (c) => FILL[theme][c], FILL[theme].none);
export const edgeColorExpr = (theme: Theme): E =>
  [
    'case',
    coloredExpr(),
    matchClass(classExpr(), (c) => INK[theme][FAMILY[c]], INK[theme].taken),
    MUTED[theme],
  ] as unknown as E;
export const edgeWidthExpr = (): E =>
  [
    'case',
    ['boolean', ['feature-state', 'selected'], false],
    2.2,
    ['case', coloredExpr(), matchClass(classExpr(), (c) => EDGE[c].width, 0.6), 0.5],
  ] as unknown as E;
export const edgeOpacityExpr = (): E => ['case', coloredExpr(), 0.75, 0.35] as unknown as E;
export const dashedClasses = CLASS_ORDER.filter((c) => EDGE[c].dash);
/** Hatch image per area: hatch-{solid|dot}-{dk|lt}, chosen by evidence and fill. */
export const hatchPatternExpr = (theme: Theme): E =>
  [
    'concat',
    'hatch-',
    ['case', ['==', get('fh'), 2], 'solid', 'dot'],
    '-',
    matchClass(classExpr(), (c) => hatchSide(theme, c), 'dk'),
  ] as unknown as E;
/** Which areas get hatch now. */
export function hatchFilterExpr(): E {
  const min = CONFIG.showReportedOnMap ? 0 : 1;
  const presetHatch: E = [
    'match',
    ['global-state', 'preset'],
    ...PRESET_IDS.flatMap((p) => {
      const h = PRESETS[p].hatch;
      return [p, h === 'broken' ? (['==', get('bp'), 1] as unknown as E) : h];
    }),
    false,
  ] as unknown as E;
  return [
    'all',
    CONFIG.hatch,
    ['>', get('fh'), min],
    coloredExpr(),
    ['!=', classExpr(), 'prior'],
    ['!=', classExpr(), 'reserved'],
    ['any', honored, presetHatch],
  ] as unknown as E;
}
/** Promise outline filter per preset (spec s.7). */
export function promiseFilterExpr(): E {
  return [
    'all',
    ['!', honored],
    [
      'match',
      ['global-state', 'preset'],
      'promised',
      ['all', promisedBy(Y), lostBy(Y)],
      'broken',
      ['all', ['==', get('bp'), 1], lostBy(Y)],
      'today',
      ['==', get('ls'), 'promised_reserved'],
      false,
    ],
  ] as unknown as E;
}
/** Evidence levels drawn as a dotted (weaker) mark: hatch, massacre ring, promise outline. */
export const WEAK_EVIDENCE = ['oral_history', 'reported', 'disputed'];
/** Promise outline: solid; dotted for an oral or contested promise (pe) and for "Today". */
export const promiseDashExpr = (): E =>
  [
    'case',
    ['==', ['global-state', 'preset'], 'today'],
    ['literal', [1, 1.6]],
    ['in', ['coalesce', get('pe'), ''], ['literal', WEAK_EVIDENCE]],
    ['literal', [1.5, 2.5]],
    ['literal', [1, 0]],
  ] as unknown as E;
/** Later change outline in the honored view: lost after the cut, by the slider year. */
export function laterFilterExpr(): E {
  return ['all', honored, ['!', lostBy(CUT)], lostBy(Y)] as unknown as E;
}
export const laterColorExpr = (theme: Theme): E =>
  matchClass(displayClassExpr(), (c) => INK[theme][FAMILY[c]], INK[theme].taken);
export const gapOpacityExpr = (): E =>
  [
    'match',
    ['global-state', 'preset'],
    ...PRESET_IDS.flatMap((p) => [p, PRESETS[p].gap]),
    0,
  ] as unknown as E;
export const badgeFilterExpr = (): E =>
  [
    'all',
    ['has', 'bd'],
    [
      'match',
      ['global-state', 'preset'],
      ...PRESET_IDS.flatMap((p) => [p, PRESETS[p].badges]),
      false,
    ],
  ] as unknown as E;

/** The same display logic in TypeScript, for the table view and tests. */
export function displayClass(
  f: { ls: string; t0: number; py: number | null; bp?: number },
  year: number,
  honoredCut?: number,
): DisplayClass {
  const at = (y: number): DisplayClass => {
    if (NOT_LOST.has(f.ls)) return f.py !== null && f.py > y ? 'prior' : classOf(f.ls);
    if (f.t0 < y + 1) return classOf(f.ls);
    return f.py !== null && f.py <= y ? 'reserved' : 'prior';
  };
  if (honoredCut === undefined) return at(year);
  if (f.t0 < honoredCut + 1) {
    const c = at(honoredCut);
    return NEVER_GIVEN.has(c) ? c : 'gone';
  }
  return f.py !== null && f.py <= honoredCut ? 'reserved' : 'prior';
}

// --- patterns (spec s.3, s.5), drawn once per theme ----------------------------------------------
type Img = { width: number; height: number; data: Uint8Array };
function canvasLike(size: number) {
  const data = new Uint8Array(size * size * 4);
  const blend = (x: number, y: number, rgb: number[], a: number) => {
    if (x < 0 || y < 0 || x >= size || y >= size || a <= 0) return;
    const i = (Math.floor(y) * size + Math.floor(x)) * 4;
    const old = data[i + 3]! / 255;
    const na = a + old * (1 - a);
    for (let k = 0; k < 3; k++)
      data[i + k] = Math.round((rgb[k]! * a + data[i + k]! * old * (1 - a)) / (na || 1));
    data[i + 3] = Math.round(na * 255);
  };
  return { data, blend };
}
const rgbOf = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/** Anti-aliased marks by distance: lines at 45 degrees, or dots. */
function paint(
  size: number,
  ink: string,
  alpha: number,
  cover: (x: number, y: number) => number,
): Img {
  const { data, blend } = canvasLike(size);
  const rgb = rgbOf(ink);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) blend(x, y, rgb, alpha * cover(x + 0.5, y + 0.5));
  return { width: size, height: size, data };
}
const smooth = (d: number, r: number) => Math.max(0, Math.min(1, r + 0.5 - d));

/** Hatch, gap-dot and massacre-ring images at a device pixel ratio. */
export function drawPatterns(theme: Theme, dpr = 1): Record<string, Img> {
  const out: Record<string, Img> = {};
  const s = Math.max(1, Math.round(dpr));
  for (const side of ['dk', 'lt'] as const) {
    const ink = HATCH_INK[theme][side];
    const n = 8 * s;
    // one 1.3 px line at 45 degrees per tile (tiles seamlessly)
    out[`hatch-solid-${side}`] = paint(n, ink, 0.62, (x, y) => {
      const d = Math.abs(((((x + y) % n) + n) % n) - n / 2) / Math.SQRT2;
      return smooth(Math.abs(d - n / (2 * Math.SQRT2)), 0.65 * s);
    });
    // dots along the same diagonal every 4 px
    out[`hatch-dot-${side}`] = paint(n, ink, 0.75, (x, y) => {
      let best = 99;
      for (const [cx, cy] of [
        [n * 0.25, n * 0.25],
        [n * 0.75, n * 0.75],
      ])
        for (const ox of [-n, 0, n])
          for (const oy of [-n, 0, n])
            best = Math.min(best, Math.hypot(x - cx! - ox, y - cy! - oy));
      return smooth(best, 0.85 * s);
    });
  }
  const g = 9 * s;
  out['gap-dots'] = paint(g, INK[theme].gap, 0.75, (x, y) => {
    const d = Math.min(Math.hypot(x - 2 * s, y - 2 * s), Math.hypot(x - 6.5 * s, y - 6.5 * s));
    return smooth(d, 0.85 * s);
  });
  // massacre rings: hollow, solid (primary or scholarly) or broken (reported or disputed)
  const r = 22 * s;
  const c = r / 2;
  for (const kind of ['solid', 'dotted'] as const)
    for (const sel of [false, true]) {
      const { data, blend } = canvasLike(r);
      const ring = 4.2 * s;
      const stroke = (sel ? 3 : 1.8) * s;
      const halo = (sel ? 8 : 6.5) * s;
      for (let y = 0; y < r; y++)
        for (let x = 0; x < r; x++) {
          const d = Math.hypot(x + 0.5 - c, y + 0.5 - c);
          blend(x, y, rgbOf(CASING[theme]), smooth(d, halo) * 0.95);
          const ang = Math.atan2(y + 0.5 - c, x + 0.5 - c);
          const on =
            kind === 'solid' || Math.floor(((ang + Math.PI) / (2 * Math.PI)) * 10) % 2 === 0;
          if (on) blend(x, y, rgbOf(TEXT[theme]), smooth(Math.abs(d - ring), stroke / 2));
        }
      out[`mas-${kind}${sel ? '-sel' : ''}`] = { width: r, height: r, data };
    }
  return out;
}

/** Legend rows by family, in the spec's order (s.8). */
export const LEGEND_GROUPS: { family: Family; classes: DisplayClass[] }[] = [
  { family: 'ceded', classes: ['ceded', 'agree', 'contested'] },
  { family: 'taken', classes: ['statute', 'eo', 'none'] },
  { family: 'never', classes: ['unrat', 'desc'] },
  { family: 'held', classes: ['reserved', 'prior'] },
];
