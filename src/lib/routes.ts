// Page paths for graph nodes. Shared by the site build and the data emit (so map panels can link
// to record pages). Pure: pass the set of all nation ids for slug collisions.

const strip = (id: string, prefix: string) =>
  id.startsWith(prefix) ? id.slice(prefix.length) : id;

/** nat-pd-cherokee-nation -> cherokee-nation; nat-cherokee -> cherokee; a collision keeps "pd-". */
export function nationSlug(id: string, nationIds: Iterable<string>): string {
  if (!id.startsWith('nat-pd-')) return strip(id, 'nat-');
  const base = strip(id, 'nat-pd-');
  for (const other of nationIds) if (other === `nat-${base}`) return `pd-${base}`;
  return base;
}

export function routeFor(id: string, type: string, nationIds: Iterable<string>): string | null {
  switch (type) {
    case 'Instrument':
      return `/treaties/${id.toLowerCase()}/`;
    case 'Nation':
      return `/nations/${nationSlug(id, nationIds)}/`;
    case 'GeoFeature':
      return `/cessions/${strip(id, 'geo-royce-')}/`;
    case 'Violation':
      return `/violations/${id.toLowerCase()}/`;
    case 'Case':
      return `/cases/${strip(id, 'case-')}/`;
    case 'Statute':
      return `/statutes/${strip(id, 'stat-')}/`;
    case 'Doctrine':
      return `/doctrine/${strip(id, 'doctrine-')}/`;
    case 'Organization':
      return `/organizations/${strip(id, 'org-')}/`;
    case 'Campaign':
      return `/returns/${strip(id, 'camp-')}/`;
    case 'PolicyEra':
      return `/eras/${id}/`;
    default:
      return null;
  }
}
