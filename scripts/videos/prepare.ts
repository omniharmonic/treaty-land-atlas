// Export the same published records and projected geometry used by the website.
// Run from the repository root: node --import tsx scripts/videos/prepare.ts <output.json>
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { graph } from '../../src/lib/graph';
import { homeMap, locatorMap } from '../../src/lib/svgmap';
import { treatyExperience } from '../../src/lib/treaty';

const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const { nodes, edges } = graph();
const stories = read('public/data/tables/cession-stories.json');
const support = read('public/data/tables/support.json');
const ids = Object.keys(stories).filter(
  (id) => ['ceded', 'taken'].includes(stories[id].status) && stories[id].ceded_year,
);
const map = locatorMap(ids);
const groups = map.hi.map((shape) => ({
  ...shape,
  year: stories[shape.id].ceded_year,
  status: stories[shape.id].status,
}));
const published = (type: string, id: string) =>
  read(`public/data/entities/${type}/${id}.json`).node;
const treaty = nodes.get('TLA-T-369')!;
const experience = treatyExperience(treaty, [...nodes.values()], edges);
const records = [
  published('Instrument', 'TLA-T-369'),
  published('Violation', 'V024'),
  published('Case', 'case-us-v-sioux-nation-1980'),
];
if (!records.every((r) => r.overlay?.headline && r.overlay?.sources?.length))
  throw new Error('Published evidence is required for every narrated historical record.');
const suggested = edges.find(
  (e) => e.source === 'geo-royce-261' && e.target === 'TLA-T-242' && e.type === 'depicts',
);
if (!suggested) throw new Error('The example map-to-treaty link is no longer published.');
const orgIds = ['org-honor-the-earth', 'org-glifwc', 'org-welrp'];
if (!orgIds.every((id) => support.by_nation['nat-chippewa-ojibwe'].includes(id)))
  throw new Error('The organization example needs editorial review after support-index changes.');
const output = {
  provenance: {
    commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    hashes: Object.fromEntries(
      [
        'build/nodes.json',
        'build/edges.json',
        'public/data/tables/cession-stories.json',
        'public/data/tables/support.json',
        'data/derived/cessions.json',
        'data/derived/today-aiannh.json',
      ].map((p) => [p, createHash('sha256').update(readFileSync(p)).digest('hex')]),
    ),
  },
  title: 'Living Law, Living Land',
  site: 'https://landback.land',
  map: { ...map, hi: undefined, groups, lands: homeMap().lands },
  treaty: {
    records,
    events: experience.events,
    map: locatorMap(experience.geometryIds),
    url: 'https://landback.land/treaties/tla-t-369/',
  },
  pathway: {
    map: locatorMap(['geo-royce-261']),
    story: stories['geo-royce-261'],
    edge: suggested,
    treaty: published('Instrument', 'TLA-T-242'),
    nation: nodes.get('nat-chippewa-ojibwe'),
    orgs: orgIds.map((id) => support.orgs[id]),
  },
};
writeFileSync(process.argv[2] ?? '/tmp/living-law-video-data.json', JSON.stringify(output));
console.log(
  `Exported ${groups.length} researched map areas and ${records.length} published records.`,
);
