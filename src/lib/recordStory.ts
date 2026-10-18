// "In the record": plain-language paragraphs written from the atlas's own linked records, for
// nations, cessions and states. Every sentence is assembled from graph facts and every name links
// to its record, so nothing here goes beyond what the atlas holds and sources. Build time only.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { incoming, node, outgoing, pathFor, year, type Node } from './graph';

export type Part = string | { text: string; href: string | null };
export type Paragraph = Part[];

interface CessionStory {
  how: string;
  how_basis: string;
  instrument: string | null;
  nations: string[];
  acres: number;
  instruments: { id: string; date: string | null }[];
  ceded_year: number | null;
  status?: 'ceded' | 'taken' | 'kept' | 'unchecked';
  entries?: { date: string; role: string; instrument: string | null; quote: string }[];
  royce_summary?: string;
  plain?: string;
}

let tables: {
  stories: Record<string, CessionStory>;
  loss: { years: number[]; by_nation: Record<string, { total: number[] }> };
} | null = null;
function data() {
  if (tables) return tables;
  const read = (p: string) =>
    JSON.parse(readFileSync(join(process.cwd(), 'public', 'data', 'tables', p), 'utf8'));
  tables = { stories: read('cession-stories.json'), loss: read('land-loss.json') };
  return tables;
}

export const HOW_PHRASE: Record<string, string> = {
  treaty: 'treaties and agreements',
  pressure: 'treaties made under documented pressure',
  removal: 'removal treaties',
  unratified: 'treaties the Senate never ratified',
  congress: 'acts of Congress',
  executive: 'executive orders',
  unknown: 'means the record does not state',
};
const HOW_ONE: Record<string, string> = {
  treaty: 'a treaty or agreement',
  pressure: 'a treaty made under documented pressure',
  removal: 'a removal treaty',
  unratified: 'a treaty the Senate never ratified',
  congress: 'an act of Congress',
  executive: 'an executive order',
};

const link = (id: string): Part => {
  const n = node(id);
  return { text: n?.label ?? id, href: n ? pathFor(n) : null };
};
const acresText = (a: number) =>
  a >= 1e6
    ? `about ${(a / 1e6).toFixed(a >= 1e7 ? 0 : 1)} million acres`
    : `about ${Math.round(a / 1000).toLocaleString('en-US')} thousand acres`;
/** "A, B and C" with links. */
function list(ids: string[], max = 4): Part[] {
  const shown = ids.slice(0, max);
  const out: Part[] = [];
  shown.forEach((id, i) => {
    if (i > 0) out.push(i === shown.length - 1 && ids.length <= max ? ' and ' : ', ');
    out.push(link(id));
  });
  if (ids.length > max) out.push(` and ${ids.length - max} more`);
  return out;
}
const byYear = (ids: string[]) =>
  [...ids].sort((a, b) => (year(node(a)!) ?? 0) - (year(node(b)!) ?? 0));
const uniq = (xs: string[]) => [...new Set(xs)].filter((id) => node(id));
const stateName = (code: string) => node(`plc-state-${code.toLowerCase()}`)?.label ?? code;

export function nationStory(n: Node): Paragraph[] {
  const { stories, loss } = data();
  const out: Paragraph[] = [];
  const treaties = byYear(
    uniq(
      outgoing(n.id)
        .filter((e) => e.type === 'party_to')
        .map((e) => e.target),
    ),
  );
  if (treaties.length) {
    const first = node(treaties[0]!)!;
    const last = node(treaties.at(-1)!)!;
    out.push(
      treaties.length === 1
        ? [
            'The United States made one treaty or agreement that names ',
            n.label,
            ' as a party: ',
            link(first.id),
            '.',
          ]
        : [
            `The United States made ${treaties.length} treaties and agreements that name `,
            n.label,
            ' as a party, from ',
            link(first.id),
            ` to `,
            link(last.id),
            '.',
          ],
    );
  }
  const cessions = Object.entries(stories)
    .filter(([, s]) => s.nations.includes(n.id))
    .sort(([, a], [, b]) => (a.ceded_year ?? 0) - (b.ceded_year ?? 0));
  if (cessions.length) {
    const total = loss.by_nation[n.id]?.total.at(-1) ?? 0;
    const counts: Record<string, number> = {};
    for (const [, s] of cessions) counts[s.how] = (counts[s.how] ?? 0) + 1;
    const [topHow, topN] = Object.entries(counts).sort(([, a], [, b]) => b - a)[0]!;
    const largest = [...cessions].sort(([, a], [, b]) => b.acres - a.acres)[0]!;
    const y0 = cessions[0]![1].ceded_year;
    const y1 = cessions.at(-1)![1].ceded_year;
    const p: Paragraph = [
      `C. C. Royce’s 1899 schedule records ${cessions.length} cession${cessions.length === 1 ? '' : 's'} of land from `,
      n.label,
      y0 && y1 ? (y0 === y1 ? ` in ${y0}` : ` between ${y0} and ${y1}`) : '',
      total ? `: ${acresText(total)} by this atlas’s estimate, counting overlaps once. ` : '. ',
      cessions.length > 1
        ? `${topN} of them came through ${HOW_PHRASE[topHow] ?? topHow}. `
        : `It came through ${HOW_PHRASE[topHow] ?? topHow}. `,
    ];
    if (cessions.length > 1) {
      p.push('The largest was ', link(largest[0]), `, ${acresText(largest[1].acres)}`);
      if (largest[1].instrument)
        p.push(
          largest[1].entries ? ', ceded under ' : ', tied in the record to ',
          link(largest[1].instrument),
        );
      p.push('.');
    }
    out.push(p);
  }
  const broken = byYear(
    uniq(
      incoming(n.id)
        .filter((e) => e.type === 'involves_nation' && node(e.source)?.type === 'Violation')
        .map((e) => e.source),
    ),
  );
  const cases = byYear(
    uniq(
      incoming(n.id)
        .filter((e) => e.type === 'involves_nation' && node(e.source)?.type === 'Case')
        .map((e) => e.source),
    ),
  );
  if (broken.length || cases.length) {
    const p: Paragraph = [];
    if (broken.length)
      p.push(
        `The atlas records ${broken.length} broken treaty promise${broken.length === 1 ? '' : 's'} involving `,
        n.label,
        ': ',
        ...list(broken, 3),
        '. ',
      );
    if (cases.length)
      p.push(
        `${cases.length === 1 ? 'One court case' : `${cases.length} court cases`} turned on ${cases.length === 1 ? 'its' : 'their'} rights: `,
        ...list(cases, 3),
        '.',
      );
    out.push(p);
  }
  const today = uniq(
    incoming(n.id)
      .filter((e) => e.type === 'successor_of')
      .map((e) => e.source),
  );
  const carries = uniq(
    outgoing(n.id)
      .filter((e) => e.type === 'successor_of')
      .map((e) => e.target),
  );
  const partOf = uniq(
    outgoing(n.id)
      .filter((e) => e.type === 'part_of')
      .map((e) => e.target),
  );
  const returns = byYear(
    uniq(
      incoming(n.id)
        .filter((e) => e.type === 'involves_nation' && node(e.source)?.type === 'Campaign')
        .map((e) => e.source),
    ),
  );
  const p: Paragraph = [];
  if (partOf.length) p.push('The records group it with ', ...list(partOf, 3), '. ');
  if (today.length)
    p.push(
      'Today, ',
      ...list(today, 6),
      today.length === 1 ? ' carries' : ' carry',
      ' this history, as their own pages or research records say. ',
    );
  if (carries.length)
    p.push('This nation carries the history of ', ...list(carries, 6), ' in the treaty record. ');
  if (returns.length) p.push('Land has come back: ', ...list(returns, 3), '.');
  if (p.length) out.push(p);
  return out;
}

export function cessionStory(g: Node): Paragraph[] {
  const s = data().stories[g.id];
  if (!s) return [];
  const states = ((g['states'] as string[]) ?? []).map(stateName);
  const out: Paragraph[] = [];
  out.push([
    s.plain ?? s.royce_summary ?? '',
    s.plain || s.royce_summary ? ' ' : '',
    `The area covers ${acresText(s.acres)}`,
    states.length
      ? ` in what is now ${states.length > 1 ? `${states.slice(0, -1).join(', ')} and ${states.at(-1)}` : states[0]}`
      : '',
    '.',
  ]);
  if (s.nations.length)
    out.push(['The 1899 record names ', ...list(s.nations, 5), ' as the people of this land.']);
  if (s.status === 'kept')
    out.push([
      'This area was not ceded. The 1899 record shows it as a reservation the nation kept, at least until the record ends in 1894.',
    ]);
  else if (!s.entries?.length && s.instruments.length > 1) {
    const p: Paragraph = [`The record ties this land to ${s.instruments.length} agreements: `];
    s.instruments.forEach((x, i) => {
      if (i > 0) p.push(i === s.instruments.length - 1 ? ' and ' : ', ');
      p.push(link(x.id));
    });
    p.push('. Which one ceded it has not been checked yet, so the map dates it by the first.');
    out.push(p);
  }
  if (s.instrument && s.status !== 'kept')
    out.push([
      'How it was taken: ',
      `${HOW_ONE[s.how] ?? 'not stated'}. `,
      s.how_basis ? `${s.how_basis.replace(/\.?$/, '.')}` : '',
    ]);
  const today = uniq(
    s.nations.flatMap((id) =>
      incoming(id)
        .filter((e) => e.type === 'successor_of')
        .map((e) => e.source),
    ),
  );
  if (today.length)
    out.push([
      'Today, ',
      ...list(today, 6),
      today.length === 1 ? ' carries' : ' carry',
      ' the history of the people named here.',
    ]);
  return out;
}

export function placeStory(p: Node): Paragraph[] {
  const code = String(p['code'] ?? '').toUpperCase();
  if (!code) return [];
  const { stories } = data();
  const geos = incoming(p.id)
    .filter((e) => e.type === 'located_in' && node(e.source)?.type === 'GeoFeature')
    .map((e) => e.source)
    .filter((id) => stories[id]);
  const out: Paragraph[] = [];
  if (geos.length) {
    const years = geos
      .map((id) => stories[id]!.ceded_year)
      .filter((y): y is number => !!y)
      .sort((a, b) => a - b);
    const nationCount: Record<string, number> = {};
    for (const id of geos)
      for (const nid of stories[id]!.nations) nationCount[nid] = (nationCount[nid] ?? 0) + 1;
    const top = Object.entries(nationCount)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => id);
    const insts = uniq(geos.map((id) => stories[id]!.instrument).filter((x): x is string => !!x));
    out.push([
      `Royce’s schedule records ${geos.length} cessions that lie at least partly in ${p.label}`,
      years.length ? `, from ${years[0]} to ${years.at(-1)}` : '',
      `, under ${insts.length} treaties, agreements and acts. The peoples named most often are `,
      ...list(top, 5),
      '.',
    ]);
  }
  const here = (type: string) =>
    byYear(
      uniq(
        incoming(p.id)
          .filter((e) => e.type === 'located_in' && node(e.source)?.type === type)
          .map((e) => e.source),
      ),
    );
  const broken = here('Violation');
  const returns = here('Campaign');
  const q: Paragraph = [];
  if (broken.length)
    q.push(
      `The atlas records ${broken.length} broken treaty promise${broken.length === 1 ? '' : 's'} here, including `,
      ...list(broken.slice(-3), 3),
      '. ',
    );
  if (returns.length) q.push('Land has come back here: ', ...list(returns.slice(-4), 4), '.');
  if (q.length) out.push(q);
  return out;
}

export function storyFor(n: Node): Paragraph[] {
  if (n.type === 'Nation') return nationStory(n);
  if (n.type === 'GeoFeature') return cessionStory(n);
  if (n.type === 'Place') return placeStory(n);
  return [];
}
