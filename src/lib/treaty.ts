// Build-time projection of existing records, not a new historical interpretation.
import { year, type Node, type Edge } from './graph';
import { factsFor, type Fact } from './facts';
import { routeFor } from './routes';

export interface TreatyLink {
  id: string;
  label: string;
  path: string | null;
  type: string;
  suggested: boolean;
  context: boolean;
}
export interface TreatyEvent extends TreatyLink {
  kind: string;
  date: string;
  year: number | null;
  basis: string | null;
  confidence: string | null;
  details: Fact[];
  flags: string[];
  geometryIds: string[];
  sources: { label: string; url: string }[];
  links: TreatyLink[];
}
export interface TreatyExperience {
  events: TreatyEvent[];
  nations: TreatyLink[];
  related: TreatyLink[];
  geometryIds: string[];
}

export function treatyExperience(n: Node, nodes: Node[], edges: Edge[]): TreatyExperience {
  const byId = new Map(nodes.map((x) => [x.id, x]));
  const kept = edges.filter(
    (e) => e.status !== 'rejected' && byId.has(e.source) && byId.has(e.target),
  );
  const nationIds = nodes.filter((x) => x.type === 'Nation').map((x) => x.id);
  const out = (id: string) => kept.filter((e) => e.source === id);
  const inc = (id: string) => kept.filter((e) => e.target === id);
  const relation = (other: Node, via: Edge[]): TreatyLink => ({
    id: other.id,
    label: other.label,
    path: routeFor(other.id, other.type, nationIds),
    type: other.type,
    suggested: via.some((e) => e.status === 'proposed'),
    context: via.some((e) => e.qualifiers?.['role'] === 'context'),
  });
  const geometryIds = inc(n.id)
    .filter((e) => e.type === 'depicts' && byId.get(e.source)?.type === 'GeoFeature')
    .map((e) => e.source);
  const eventMap = new Map<string, { node: Node; via: Edge[] }>();
  const add = (id: string, via: Edge[]) => {
    const other = byId.get(id);
    if (!other || other.id === n.id) return;
    const previous = eventMap.get(id);
    if (
      !previous ||
      (previous.via.some((e) => e.qualifiers?.['role'] === 'context') &&
        !via.some((e) => e.qualifiers?.['role'] === 'context'))
    )
      eventMap.set(id, { node: other, via });
  };
  for (const e of out(n.id))
    if (e.type === 'violated_by') {
      add(e.target, [e]);
      for (const next of out(e.target))
        if (['adjudicated_in', 'enabled_by', 'responds_to'].includes(next.type))
          add(next.target, [e, next]);
      for (const next of inc(e.target)) if (next.type === 'remedies') add(next.source, [e, next]);
    }
  for (const e of inc(n.id))
    if (['concerns_instrument', 'depicts'].includes(e.type)) add(e.source, [e]);
  const sources = (id: string) =>
    out(id)
      .filter((e) => e.type === 'evidenced_by')
      .flatMap((e) => {
        const source = byId.get(e.target)!;
        const url = source['url'];
        return typeof url === 'string' && /^https?:\/\//.test(url)
          ? [{ label: source.label, url }]
          : [];
      });
  const eventFor = (other: Node, via: Edge[]): TreatyEvent => {
    const dateRows = (other['dates'] as { date: string }[] | undefined) ?? [];
    const date = String(
      other['year_text'] ??
        other['date_signed'] ??
        other['year'] ??
        other['start_year'] ??
        (other['year_start']
          ? `${other['year_start']}${other['year_end'] && other['year_end'] !== other['year_start'] ? `–${other['year_end']}` : ''}`
          : null) ??
        (dateRows.length ? dateRows.map((d) => d.date).join(', ') : 'Date not recorded'),
    );
    const context =
      via.some((e) => e.qualifiers?.['role'] === 'context') ||
      (other.type === 'Violation' && other['adjudicated_breach_label_allowed'] === false);
    const directGeos =
      other.type === 'GeoFeature'
        ? [other.id]
        : [...out(other.id), ...inc(other.id)]
            .filter((e) => ['depicts', 'located_in'].includes(e.type))
            .map((e) => byId.get(e.source === other.id ? e.target : e.source)!)
            .filter((x) => x.type === 'GeoFeature')
            .map((x) => x.id);
    const links = [...out(other.id), ...inc(other.id)]
      .filter((e) => !['evidenced_by', 'derived_from'].includes(e.type))
      .flatMap((e) => {
        const target = byId.get(e.source === other.id ? e.target : e.source)!;
        return target.id !== n.id && target.type !== 'Source'
          ? [relation(target, [...via, e])]
          : [];
      });
    return {
      ...relation(other, via),
      context,
      kind:
        other.type === 'Case'
          ? 'Court decision'
          : other.type === 'GeoFeature'
            ? 'Land record'
            : other.type === 'Statute'
              ? 'Legislation'
              : other.type === 'Campaign'
                ? 'Land return'
                : other.type === 'Instrument'
                  ? 'Related agreement'
                  : context
                    ? 'Related history'
                    : 'Recorded event',
      date,
      year:
        year(other) ?? (dateRows[0]?.date ? Number(dateRows[0].date.slice(0, 4)) || null : null),
      basis:
        via
          .map((e) => e.basis)
          .filter(Boolean)
          .join(' · ') || null,
      confidence: other.confidence ?? null,
      details: factsFor(other),
      flags: other.flags ?? [],
      geometryIds: directGeos,
      sources: sources(other.id),
      links: links.filter((l, i) => links.findIndex((x) => x.id === l.id) === i),
    };
  };
  const signed = eventFor(n, []);
  signed.id = 'signed';
  signed.kind = n['date_signed'] ? 'Agreement signed' : 'The agreement';
  signed.geometryIds = geometryIds;
  const events = [signed, ...[...eventMap.values()].map(({ node, via }) => eventFor(node, via))];
  if (n['date_ratified'])
    events.push({
      ...signed,
      id: 'ratified',
      kind: 'Ratification record',
      date: String(n['date_ratified']),
      year: Number(String(n['date_ratified']).slice(0, 4)) || null,
      details: factsFor(n).filter((f) => ['Ratified', 'Status', 'Kind'].includes(f.label)),
    });
  // Unknown dates stay at the end; order is not a claim that an event began or ended on an exact day.
  events.sort(
    (a, b) =>
      (a.year ?? 9999) - (b.year ?? 9999) ||
      (a.id === 'signed' ? -1 : b.id === 'signed' ? 1 : a.id.localeCompare(b.id)),
  );
  const nations = inc(n.id)
    .filter((e) => e.type === 'party_to')
    .map((e) => relation(byId.get(e.source)!, [e]));
  const related = [...eventMap.values()]
    .filter(({ node }) => node.type !== 'GeoFeature')
    .map(({ node, via }) => relation(node, via));
  // Legal doctrines are exposed through the linked court decisions, retaining the entire suggested path.
  for (const { node, via } of eventMap.values())
    if (node.type === 'Case')
      for (const e of out(node.id))
        if (['applies_doctrine', 'establishes_doctrine', 'applies_statute'].includes(e.type))
          related.push(relation(byId.get(e.target)!, [...via, e]));
  return {
    events,
    nations,
    related: related.filter((l, i) => related.findIndex((x) => x.id === l.id) === i),
    geometryIds: [...new Set(geometryIds)],
  };
}
