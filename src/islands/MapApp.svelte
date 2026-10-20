<script lang="ts">
  import { relayFetch } from '../lib/relay';
  import { onMount, tick } from 'svelte';
  import {
    Map as MapLibre,
    NavigationControl,
    AttributionControl,
    setWorkerUrl,
  } from 'maplibre-gl';
  import type { MapMouseEvent, GeoJSONSource } from 'maplibre-gl';
  import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import {
    CUT_POINTS,
    YEAR_MAX,
    YEAR_MIN,
    inView,
    parseHash,
    toHash,
    type MapState,
  } from './map/state';
  import { HOW_LABEL, type How } from './map/how';
  import {
    CASING,
    CONFIG,
    EVIDENCE_CLASS,
    EVIDENCE_LEGEND,
    FAMILY,
    FAMILY_LABEL,
    FLAG_LABEL,
    LABEL,
    LEGEND_GROUPS,
    MASSACRE_LINK,
    MASSACRE_NOTE,
    NEVER_GIVEN,
    classOf,
    NOT_LOST,
    OVERLAYS,
    PRESETS,
    PRESET_IDS,
    PROMISE,
    SHORT,
    STATUS_HELP,
    STATUS_LABEL,
    TEXT,
    TODAY_FILL,
    TODAY_LINE,
    badgeFilterExpr,
    classExpr,
    coloredExpr,
    dashedClasses,
    drawPatterns,
    edgeColorExpr,
    edgeOpacityExpr,
    edgeWidthExpr,
    fillColorExpr,
    gapOpacityExpr,
    hatchFilterExpr,
    hatchPatternExpr,
    laterColorExpr,
    laterFilterExpr,
    promiseDashExpr,
    promiseFilterExpr,
    statusVar,
    type DisplayClass,
    type LandStatus,
    type OverlayId,
    type Theme,
  } from './map/landStatusStyle';
  import LegalStatus from './map/LegalStatus.svelte';
  import LandMeter from './map/LandMeter.svelte';
  import OrgPanel from './map/OrgPanel.svelte';

  let { base = '', relay = '' }: { base?: string; relay?: string } = $props();

  interface CessionEvent {
    id: string;
    cessnum: string;
    dates: { n: number; date: string; decimal: number }[];
    t_first: number | null;
    tribes_as_named_in_schedule: string[];
    geometry_quality: 'ok' | 'missing';
  }
  interface Story {
    how: How;
    how_basis: string;
    instrument: string | null;
    nations: string[];
    plain?: string;
    land_status: LandStatus;
    land_status_basis: string;
    land_status_source: 'k1' | 'record';
    promised_year: number | null;
    broken_promise: boolean;
  }
  interface FlagRecord {
    flag: string;
    evidence: string;
    evidence_display: string;
    hatch: 'solid' | 'dotted';
    citation: string;
    quote: string;
    summary: string;
  }
  interface AreaK1 {
    land_status: LandStatus | null;
    instrument: string | null;
    basis: string | null;
    evidence: string | null;
    evidence_display: string | null;
    flags: FlagRecord[];
    sub_areas: {
      area: string;
      label: string;
      land_status: LandStatus;
      basis: string;
      evidence_display: string;
    }[];
    massacres: string[];
  }
  interface Site {
    id: string;
    name: string;
    other_names: string[];
    category: string;
    date: string;
    lat: number | null;
    lon: number | null;
    nations: string;
    deaths_range: string;
    deaths_source: string;
    perpetrators: string;
    areas: string[];
    link_kind: string;
    linked_instrument: string;
    link_note: string;
    citation: string;
    quote: string;
    summary: string;
    evidence: string;
    evidence_display: string;
  }
  interface Series {
    total: number[];
    by_how: Record<How, number[]>;
    by_status: Record<LandStatus, number[]>;
  }
  interface NationSeries extends Series {
    cessions: string[];
    label: string;
    path: string | null;
  }
  interface LandLoss {
    years: number[];
    all: Series;
    by_nation: Record<string, NationSeries>;
  }
  interface Chapter {
    start_year: number;
    end_year: number;
    title: string;
    lede: string;
    narrative: string;
    sources?: { url: string; title?: string }[];
  }
  interface Moment {
    year: number;
    title: string;
    text: string;
    sources?: { url: string; title?: string }[];
  }
  interface Entity {
    node: Record<string, unknown> & { id: string; label: string };
    edges: {
      out: Record<
        string,
        { target: string; status: string; qualifiers: Record<string, unknown> }[]
      >;
    };
    neighbors: Record<
      string,
      { type: string; label: string; year: number | null; path: string | null }
    >;
  }

  let s = $state<MapState>(parseHash(typeof location === 'undefined' ? '' : location.hash));
  let follow = $state<string | null>(null);
  let events = $state<CessionEvent[]>([]);
  let stories = $state<Record<string, Story>>({});
  let loss = $state<LandLoss | null>(null);
  let chapters = $state<Chapter[]>([]);
  let moments = $state<Moment[]>([]);
  let headlines = $state<Record<string, string>>({});
  let k1 = $state<Record<string, AreaK1>>({});
  // other records under the last tapped point, topmost first
  let under = $state<string[]>([]);
  let massacreNoteSeen = $state(false);
  let sites = $state<Site[]>([]);
  let loadError = $state<string | null>(null);
  let webglMissing = $state(false);
  let selected = $state<Entity | null>(null);
  let announce = $state('');
  let playing = $state(false);
  let reducedMotion = $state(false);
  // Native homelands from Native Land Digital, loaded live through the relay and never stored
  interface Homeland {
    name: string;
    url: string | null;
    color: string;
    geometry: { type: string; coordinates: unknown };
  }
  let homelands = $state<Homeland[]>([]);
  let homeStatus = $state<'idle' | 'loading' | 'done' | 'unavailable' | 'error'>('idle');
  let homeFor = $state<'selection' | 'center' | 'nation' | null>(null);
  let homeRequest = 0;
  let container: HTMLDivElement;
  let rail: HTMLElement;
  let recordLoading = $state(false);
  let recordError = $state(false);
  let map: MapLibre | null = null;
  let mapReady = $state(false);
  // eslint-disable-next-line svelte/prefer-svelte-reactivity -- lookup cache, not UI state
  let bboxes = new Map<string, [number, number, number, number]>();
  // eslint-disable-next-line svelte/prefer-svelte-reactivity -- geometry cache, not UI state
  let shapes = new Map<string, { type: string; coordinates: unknown }>();

  const url = (p: string) => `${base}${p}`;
  const slider = $derived(Math.min(s.year, YEAR_MAX));
  const selectedEvent = $derived(events.find((e) => e.id === s.sel) ?? null);
  const selectedStory = $derived(s.sel ? stories[s.sel] : null);
  const selectedK1 = $derived(s.sel ? (k1[s.sel] ?? null) : null);
  const selectedSite = $derived(s.sel ? (sites.find((x) => x.id === s.sel) ?? null) : null);
  const siteById = $derived(new Map(sites.map((x) => [x.id, x])));
  const lsOf = (id: string) => stories[id]?.land_status ?? 'taken_no_instrument';
  // areas lost before the honored-through cut, by land status, for the legal status panel
  const honoredCounts = $derived.by(() => {
    const out: Partial<Record<LandStatus, number>> = {};
    for (const e of events)
      if (e.t_first !== null && e.t_first < s.cut + 1) {
        const k = lsOf(e.id);
        out[k] = (out[k] ?? 0) + 1;
      }
    return out;
  });
  const selectedAgreement = $derived(
    (selectedStory?.instrument ? selected?.neighbors[selectedStory.instrument] : null) ??
      (selected?.edges.out['depicts'] ?? [])
        .map((edge) => selected?.neighbors[edge.target])
        .find((record) => record?.type === 'Instrument') ??
      null,
  );
  const selectionTitle = $derived.by(() => {
    if (selectedAgreement) {
      // Keep the source's title through its year; the full parties remain immediately below.
      return (
        selectedAgreement.label.match(/^(.+?\(\d{4}\))(?:[\s,]|$)/)?.[1] ?? selectedAgreement.label
      );
    }
    const people = selectedEvent?.tribes_as_named_in_schedule.join(', ') || 'Land record';
    const date = selectedEvent?.dates.length === 1 ? selectedEvent.dates[0]?.date : null;
    const year = date?.match(/^\d{4}/)?.[0];
    return year ? `${people} (${year})` : people;
  });
  const followed = $derived(follow && loss ? (loss.by_nation[follow] ?? null) : null);
  const visible = $derived(
    events
      .filter((e) => inView(e.t_first, { year: slider, mode: 'cum', win: 25 }))
      .filter((e) => !follow || stories[e.id]?.nations.includes(follow))
      .sort((a, b) => (b.t_first ?? 0) - (a.t_first ?? 0) || a.cessnum.localeCompare(b.cessnum)),
  );
  const thisYear = $derived(visible.filter((e) => Math.floor(e.t_first ?? 0) === slider));
  const chapter = $derived(
    chapters.find((c) => slider >= c.start_year && slider <= c.end_year) ?? null,
  );
  const nearMoments = $derived(
    moments.filter((m) => m.year <= slider && m.year > slider - 4).sort((a, b) => b.year - a.year),
  );
  const nationOptions = $derived(
    loss
      ? Object.entries(loss.by_nation)
          .map(([id, v]) => ({ id, label: v.label }))
          .sort((a, b) => a.label.localeCompare(b.label))
      : [],
  );
  // nations behind the current selection, for the "who is doing the work" panel
  const orgNations = $derived(follow ? [follow] : selectedStory ? selectedStory.nations : []);

  function summary(): string {
    if (s.view === 'honored')
      return `Stopping the clock in ${s.cut}: green is land the record shows leaving Native hands only after ${s.cut}, which the instruments in force that year left with the nations. Land taken before then by an act, an order, a treaty never ratified or with no instrument keeps its own color: no cession is on the record. Outlined: what was taken from ${s.cut + 1} through ${slider}.`;
    const who = followed ? `${followed.label}: ` : '';
    const n = visible.length;
    const noCession = visible.filter((e) => NEVER_GIVEN.has(classOf(lsOf(e.id)))).length;
    return `${who}${n} land area${n === 1 ? '' : 's'} the record shows taken or ceded by the end of ${slider}${thisYear.length ? `, ${thisYear.length} of them in ${slider}` : ''}${noCession ? `; ${noCession} with no cession on the record` : ''}.`;
  }

  let hashTimer: ReturnType<typeof setTimeout> | undefined;
  $effect(() => {
    const h = toHash($state.snapshot(s) as MapState) + (follow ? `&nation=${follow}` : '');
    clearTimeout(hashTimer);
    hashTimer = setTimeout(() => history.replaceState(null, '', h), 250);
  });

  let announceTimer: ReturnType<typeof setTimeout> | undefined;
  $effect(() => {
    const text = `${slider}. ${chapter?.title ?? ''}. ${summary()}`;
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => (announce = text), 800);
  });

  function applyState(m: MapLibre) {
    m.setGlobalStateProperty('year', s.preset === 'today' ? 2026 : slider);
    m.setGlobalStateProperty('preset', s.preset);
    m.setGlobalStateProperty('sel', s.sel ?? '');
    m.setGlobalStateProperty('cut', s.cut);
    m.setGlobalStateProperty('honored', s.view === 'honored' && PRESETS[s.preset].honored);
    m.setGlobalStateProperty(
      'today',
      s.layers.has('today') || s.year > YEAR_MAX || s.preset === 'today',
    );
    m.setGlobalStateProperty('follow', follow ?? '');
    m.setGlobalStateProperty('massacres', s.layers.has('massacres'));
  }
  $effect(() => {
    void [slider, s.cut, s.view, s.layers, s.year, s.preset, s.sel, follow];
    if (map && mapReady) applyState(map);
  });

  let lastSel: string | null = null;
  $effect(() => {
    const sel = s.sel;
    if (!map || !mapReady) return;
    if (lastSel && !lastSel.startsWith('mas-'))
      map.setFeatureState({ source: 'cessions', id: lastSel }, { selected: false });
    if (sel && !sel.startsWith('mas-'))
      map.setFeatureState({ source: 'cessions', id: sel }, { selected: true });
    lastSel = sel;
  });

  $effect(() => {
    const sel = s.sel;
    selected = null;
    recordError = false;
    recordLoading = !!sel && !sel.startsWith('mas-');
    if (!sel || sel.startsWith('mas-')) return;
    const controller = new AbortController();
    fetch(url(`/data/entities/GeoFeature/${sel}.json`), { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('Record unavailable');
        return r.json();
      })
      .then((j) => {
        if (s.sel === sel) selected = j;
      })
      .catch((error) => {
        if (s.sel === sel && error.name !== 'AbortError') recordError = true;
      })
      .finally(() => {
        if (s.sel === sel) recordLoading = false;
      });
    return () => controller.abort();
  });

  const phone = () => typeof matchMedia !== 'undefined' && matchMedia('(max-width: 899px)').matches;
  // on a phone the panel opens as a bottom sheet over the lower part of the map
  const sheetOpen = $derived(!!(selectedEvent || selectedSite));
  $effect(() => {
    const id = selectedEvent?.id ?? selectedSite?.id;
    if (!id) return;
    tick().then(() => {
      if ((selectedEvent?.id ?? selectedSite?.id) !== id || !rail) return;
      rail.scrollTop = 0;
      if (phone()) container?.scrollIntoView({ block: 'start' });
    });
  });
  /** Map padding that keeps a selection clear of the phone sheet. */
  function sheetPadding() {
    if (!phone() || !container) return 60;
    const overlap = Math.max(0, container.clientHeight - innerHeight * 0.45);
    return { top: 60, left: 30, right: 30, bottom: Math.round(overlap + 24) };
  }
  // desktop hover: a one-line summary of the area under the pointer (all of it is in the panel too)
  let tip = $state<{ x: number; y: number; text: string } | null>(null);

  function showHomelands(list: Homeland[]) {
    if (!map || !mapReady) return;
    (map.getSource('nld') as GeoJSONSource | undefined)?.setData({
      type: 'FeatureCollection',
      features: list.map((h) => ({
        type: 'Feature',
        properties: { Name: h.name, color: h.color },
        geometry: h.geometry,
      })) as never,
    });
  }
  /** Native Land Digital territories at these points (lat, lng), drawn on the map in NLD's colors. */
  async function loadHomelands(points: [number, number][], why: 'selection' | 'center' | 'nation') {
    const req = ++homeRequest;
    homeFor = why;
    homelands = [];
    showHomelands([]);
    if (!relay || !points.length) {
      homeStatus = 'unavailable';
      return;
    }
    homeStatus = 'loading';
    const results = await Promise.all(
      points.map(([lat, lng]) =>
        relayFetch(
          relay,
          `/api/lookup?lat=${lat.toFixed(3)}&lng=${lng.toFixed(3)}&maps=territories`,
        )
          .then((r) =>
            r.ok ? r.json() : [503, 410, 403].includes(r.status) ? 'unavailable' : 'error',
          )
          .catch(() => 'error'),
      ),
    );
    if (req !== homeRequest) return;
    if (results.every((r) => r === 'unavailable' || r === 'error')) {
      homeStatus = results.includes('unavailable') ? 'unavailable' : 'error';
      return;
    }
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- local dedupe, not state
    const seen = new Set<string>();
    homelands = (
      results.filter(Array.isArray).flat() as {
        properties: { Name?: string; description?: string; Slug?: string; color?: string };
        geometry: Homeland['geometry'];
      }[]
    )
      .filter(
        (x) => x?.properties?.Slug && !seen.has(x.properties.Slug) && seen.add(x.properties.Slug),
      )
      .map((x) => ({
        name: x.properties.Name ?? '',
        url: x.properties.description?.startsWith('https://native-land.ca/')
          ? x.properties.description
          : null,
        color: /^#[0-9a-f]{6}$/i.test(x.properties.color ?? '') ? x.properties.color! : '#35462f',
        geometry: x.geometry,
      }));
    homeStatus = 'done';
    showHomelands(homelands);
  }
  function clearHomelands() {
    homeRequest++;
    homelands = [];
    homeStatus = 'idle';
    homeFor = null;
    showHomelands([]);
  }
  function homelandsHere() {
    if (!map) return;
    const c = map.getCenter();
    loadHomelands([[c.lat, c.lng]], 'center');
  }

  /** A point inside a land area: its bounding-box center if that falls inside, else a vertex mean. */
  function insidePoint(id: string): [number, number] | null {
    const b = bboxes.get(id);
    const g = shapes.get(id);
    if (!b || !g) return null;
    const polys = (g.type === 'Polygon' ? [g.coordinates] : g.coordinates) as [
      number,
      number,
    ][][][];
    const inRing = (x: number, y: number, r: [number, number][]) => {
      let inside = false;
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        const [xi, yi] = r[i]!;
        const [xj, yj] = r[j]!;
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };
    const cx = (b[0] + b[2]) / 2;
    const cy = (b[1] + b[3]) / 2;
    if (polys.some((p) => inRing(cx, cy, p[0]!))) return [cy, cx];
    const ring = polys[0]![0]!;
    const mx = ring.reduce((s, v) => s + v[0], 0) / ring.length;
    const my = ring.reduce((s, v) => s + v[1], 0) / ring.length;
    return [my, mx];
  }

  // a selected area: whose homelands it lies in
  $effect(() => {
    const id = selectedEvent?.id;
    if (!id || !mapReady) return;
    const pt = insidePoint(id);
    if (pt) loadHomelands([pt], 'selection');
  });
  // a followed nation: homelands around the land recorded in its name
  $effect(() => {
    const f = followed;
    if (!f || !mapReady || s.sel) return;
    const pts = f.cessions
      .map((c) => insidePoint(c))
      .filter((p): p is [number, number] => !!p)
      .slice(0, 4);
    loadHomelands(pts, 'nation');
  });

  /** The selected area's outline, with the homelands around it, for the panel. */
  const outline = $derived.by(() => {
    const id = selectedEvent?.id;
    const g = id ? shapes.get(id) : null;
    const b = id ? bboxes.get(id) : null;
    if (!g || !b) return null;
    const k = Math.cos((((b[1] + b[3]) / 2) * Math.PI) / 180);
    const w = (b[2] - b[0]) * k;
    const h = b[3] - b[1];
    const size = Math.max(w, h, 0.2) * 1.5;
    const cx = ((b[0] + b[2]) / 2) * k;
    const cy = -(b[1] + b[3]) / 2;
    const toPath = (geom: { type: string; coordinates: unknown }) =>
      (
        (geom.type === 'Polygon'
          ? [geom.coordinates]
          : geom.type === 'MultiPolygon'
            ? geom.coordinates
            : []) as [number, number][][][]
      )
        .flat()
        .map(
          (r) =>
            r
              .map(([x, y], i) => `${i ? 'L' : 'M'}${(x * k).toFixed(3)} ${(-y).toFixed(3)}`)
              .join('') + 'Z',
        )
        .join('');
    return {
      view: `${cx - size * 0.7} ${cy - size / 2} ${size * 1.4} ${size}`,
      stroke: size / 160,
      area: toPath(g),
      lands:
        homeFor === 'selection'
          ? homelands.map((hl) => ({ d: toPath(hl.geometry), color: hl.color }))
          : [],
    };
  });

  function select(id: string | null, fly = false) {
    s.sel = id;
    under = [];
    tip = null;
    if (id && phone()) fly = true;
    if (id && playing) togglePlay();
    if (!id)
      tick().then(() => {
        if (rail) rail.scrollTop = 0;
        if (matchMedia('(max-width: 899px)').matches) container?.scrollIntoView({ block: 'start' });
      });
    if (id && fly && map) {
      const b = bboxes.get(id);
      const site = sites.find((x) => x.id === id);
      if (site?.lat != null && site.lon != null)
        map.easeTo({
          center: [site.lon, site.lat],
          zoom: Math.max(map.getZoom(), 5),
          padding: sheetPadding() as never,
          duration: reducedMotion ? 0 : 600,
        });
      else if (b)
        map.fitBounds(
          [
            [b[0], b[1]],
            [b[2], b[3]],
          ],
          { padding: sheetPadding(), maxZoom: 7, duration: reducedMotion ? 0 : 600 },
        );
    }
  }

  function followNation(id: string | null) {
    follow = id;
    if (!id || !map || !loss) return;
    const f = loss.by_nation[id];
    if (!f) return;
    let x0 = 180,
      y0 = 90,
      x1 = -180,
      y1 = -90;
    for (const c of f.cessions) {
      const b = bboxes.get(c);
      if (!b) continue;
      x0 = Math.min(x0, b[0]);
      y0 = Math.min(y0, b[1]);
      x1 = Math.max(x1, b[2]);
      y1 = Math.max(y1, b[3]);
    }
    if (x0 < x1)
      map.fitBounds(
        [
          [x0, y0],
          [x1, y1],
        ],
        { padding: 60, maxZoom: 6.5, duration: reducedMotion ? 0 : 800 },
      );
  }

  function step(dir: 1 | -1) {
    s.year = Math.max(YEAR_MIN, Math.min(YEAR_MAX, slider + dir));
  }

  let playTimer: ReturnType<typeof setInterval> | undefined;
  function togglePlay() {
    playing = !playing;
    clearInterval(playTimer);
    if (!playing) return;
    if (slider >= YEAR_MAX) s.year = YEAR_MIN;
    playTimer = setInterval(() => {
      if (slider >= YEAR_MAX) {
        playing = false;
        clearInterval(playTimer);
        return;
      }
      step(1);
    }, 700);
  }

  let presetBar: HTMLDivElement;
  // keep the chosen preset chip in view on a narrow screen
  $effect(() => {
    void s.preset;
    tick().then(() =>
      presetBar
        ?.querySelector('button.on')
        ?.scrollIntoView({ inline: 'nearest', block: 'nearest' }),
    );
  });
  function setPreset(id: (typeof PRESET_IDS)[number]) {
    s.preset = id;
    if (!PRESETS[id].honored && s.view === 'honored') s.view = 'record';
  }
  const preset = $derived(PRESETS[s.preset]);
  const keyClasses = $derived(
    (s.view === 'honored'
      ? (['gone', 'statute', 'eo', 'none', 'unrat', 'reserved', 'prior'] as DisplayClass[])
      : preset.color
    ).filter((c) => c !== 'contested'),
  );
  function toggleLayer(id: OverlayId) {
    if (id === 'massacres' && !s.layers.has('massacres')) massacreNoteSeen = true;
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- a new Set is assigned, never mutated
    const next = new Set(s.layers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    s.layers = next;
  }
  const layerOn = (id: OverlayId) => s.layers.has(id) || (id === 'today' && s.year > YEAR_MAX);

  function bbox(geom: { type: string; coordinates: unknown }): [number, number, number, number] {
    let x0 = 180,
      y0 = 90,
      x1 = -180,
      y1 = -90;
    const walk = (c: unknown): void => {
      if (Array.isArray(c) && typeof c[0] === 'number') {
        const [x, y] = c as [number, number];
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      } else if (Array.isArray(c)) c.forEach(walk);
    };
    walk(geom.coordinates);
    return [x0, y0, x1, y1];
  }

  onMount(() => {
    reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    follow = new URLSearchParams(location.hash.slice(1)).get('nation');
    if (CONFIG.massacresOnByDefault && !/[#&]l=/.test(location.hash))
      s.layers = new Set([...s.layers, 'massacres']);
    const onHash = (event: HashChangeEvent) => {
      clearTimeout(hashTimer);
      s = parseHash(new URL(event.newURL).hash);
    };
    addEventListener('hashchange', onHash);
    let cancelled = false;

    (async () => {
      try {
        const manifest = await (await fetch(url('/data/manifest.json'))).json();
        const get = (p: string) => fetch(url(`/data/${p}`)).then((r) => r.json());
        const [ev, cessions, today, st, ll, story, hl, lsTable, mas, norecord] = await Promise.all([
          get(manifest.layers['cession-events']),
          get(manifest.layers['cessions']),
          get(manifest.layers['today-aiannh']),
          get('tables/cession-stories.json'),
          get('tables/land-loss.json'),
          get('tables/story.json'),
          get('tables/headlines.json'),
          get('tables/land-status.json').catch(() => ({})),
          get('tables/massacre-sites.json').catch(() => ({ features: [], sites: [] })),
          manifest.layers['no-cession']
            ? get(manifest.layers['no-cession']).catch(() => null)
            : Promise.resolve(null),
        ]);
        if (cancelled) return;
        k1 = lsTable;
        sites = mas.sites ?? [];
        events = ev;
        stories = st;
        loss = ll;
        chapters = story.chapters ?? [];
        moments = story.moments ?? [];
        headlines = hl;
        for (const f of cessions.features) {
          bboxes.set(f.properties.id, bbox(f.geometry));
          shapes.set(f.properties.id, f.geometry);
        }

        if (!document.createElement('canvas').getContext('webgl2')) {
          webglMissing = true;
          return;
        }
        setWorkerUrl(workerUrl);
        const dark = getComputedStyle(document.documentElement).colorScheme === 'dark';
        const theme: Theme = dark ? 'dark' : 'light';
        map = new MapLibre({
          container,
          style: url(`/map/style-atlas-${dark ? 'dark' : 'light'}.json`),
          center: s.center ? [s.center[1], s.center[0]] : [-96, 39],
          zoom: s.center ? s.center[2] : 3.4,
          minZoom: 2,
          maxZoom: 8,
          attributionControl: false,
        });
        map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
        map.addControl(
          new AttributionControl({
            // on a phone the credits fold behind the (i) button instead of covering the map
            compact: window.innerWidth < 720,
            customAttribution:
              'Early release, <a href="/about/">not yet reviewed</a> by Native nations or legal counsel. Cessions: USDA Forest Service after C. C. Royce (1899), modified. Territories: <a href="https://native-land.ca">Native Land Digital</a>, live, not stored. Today: US Census Bureau. Basemap: <a href="https://openfreemap.org">OpenFreeMap</a> © <a href="https://openmaptiles.org">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }),
        );
        map.on('load', () => {
          if (!map) return;
          // a compact attribution starts unfolded; on a phone keep it folded until asked
          if (window.innerWidth < 720)
            container?.querySelectorAll('.maplibregl-ctrl-attrib').forEach((el) => {
              el.classList.remove('maplibregl-compact-show');
              el.removeAttribute('open');
            });
          applyState(map);
          map.addSource('cessions', { type: 'geojson', data: cessions, promoteId: 'id' });
          map.addSource('today', { type: 'geojson', data: today });
          map.addSource('nld', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });
          const on = (k: string): unknown => ['==', ['global-state', k], true];
          const following: unknown = ['!=', ['global-state', 'follow'], ''];
          const isFollowed: unknown = ['in', ['global-state', 'follow'], ['get', 'nations']];
          const focus = (normal: number, dim: number): unknown => [
            'case',
            following,
            ['case', isFollowed, normal, dim],
            normal,
          ];
          const selected: unknown = ['boolean', ['feature-state', 'selected'], false];
          // patterns and ring icons, drawn for this theme at the screen's pixel ratio
          const dpr = Math.max(1, Math.round(window.devicePixelRatio || 1));
          for (const [name, img] of Object.entries(drawPatterns(theme, dpr)))
            map.addImage(name, img, { pixelRatio: dpr });

          // no federal cession record: colonial, state and Texas takings (dots on the basemap)
          if (norecord) {
            map.addSource('norecord', { type: 'geojson', data: norecord });
            map.addLayer({
              id: 'gap-fill',
              type: 'fill',
              source: 'norecord',
              filter: ['!', on('honored')] as never,
              paint: { 'fill-pattern': 'gap-dots', 'fill-opacity': gapOpacityExpr() as never },
            });
          }
          // what the record says happened: one opaque fill per display class; areas outside the
          // preset keep a zero-opacity fill so they stay tappable
          map.addLayer({
            id: 'status-fill',
            type: 'fill',
            source: 'cessions',
            paint: {
              'fill-color': fillColorExpr(theme) as never,
              'fill-opacity': ['case', coloredExpr(), focus(1, 0.12), 0] as never,
            },
          });
          // documented defects: solid hatch for primary or scholarly evidence, dots otherwise
          map.addLayer({
            id: 'status-hatch',
            type: 'fill',
            source: 'cessions',
            filter: hatchFilterExpr() as never,
            paint: {
              'fill-pattern': hatchPatternExpr(theme) as never,
              'fill-opacity': (reducedMotion ? focus(0.35, 0.05) : focus(1, 0.1)) as never,
            },
          });
          map.addLayer({
            id: 'status-edge',
            type: 'line',
            source: 'cessions',
            filter: ['!', ['in', classExpr(), ['literal', dashedClasses]]] as never,
            paint: {
              'line-color': edgeColorExpr(theme) as never,
              'line-width': edgeWidthExpr() as never,
              'line-opacity': edgeOpacityExpr() as never,
            },
          });
          map.addLayer({
            id: 'status-edge-dashed',
            type: 'line',
            source: 'cessions',
            filter: ['in', classExpr(), ['literal', dashedClasses]] as never,
            paint: {
              'line-color': edgeColorExpr(theme) as never,
              'line-width': edgeWidthExpr() as never,
              'line-opacity': edgeOpacityExpr() as never,
              'line-dasharray': [4, 2],
            },
          });
          map.addLayer({
            id: 'today-fill',
            type: 'fill',
            source: 'today',
            filter: ['all', on('today'), ['==', ['get', 'k'], 'land']] as never,
            paint: { 'fill-color': TODAY_FILL[theme], 'fill-opacity': 0.75 },
          });
          map.addLayer({
            id: 'today-line',
            type: 'line',
            source: 'today',
            filter: ['all', on('today'), ['!=', ['get', 'k'], 'statistical']] as never,
            paint: { 'line-color': TODAY_LINE[theme], 'line-width': 1.1 },
          });
          map.addLayer({
            id: 'today-statistical',
            type: 'line',
            source: 'today',
            filter: ['all', on('today'), ['==', ['get', 'k'], 'statistical']] as never,
            paint: { 'line-color': TODAY_LINE[theme], 'line-width': 1, 'line-dasharray': [0.5, 2] },
          });
          // a promise stood here: green outline over a casing, inside the ring
          map.addLayer({
            id: 'promise-casing',
            type: 'line',
            source: 'cessions',
            filter: promiseFilterExpr() as never,
            layout: { 'line-join': 'round' },
            paint: {
              'line-color': CASING[theme],
              'line-width': 4.6,
              'line-offset': -1.2,
              'line-opacity': focus(0.9, 0.1) as never,
            },
          });
          map.addLayer({
            id: 'promise-line',
            type: 'line',
            source: 'cessions',
            filter: promiseFilterExpr() as never,
            layout: { 'line-join': 'round' },
            paint: {
              'line-color': PROMISE[theme],
              'line-width': 2.2,
              'line-offset': -1.2,
              'line-dasharray': promiseDashExpr() as never,
              'line-opacity': focus(1, 0.15) as never,
            },
          });
          // honored-through: each later taking as a dashed outline in the color of how it was taken
          map.addLayer({
            id: 'later-line',
            type: 'line',
            source: 'cessions',
            filter: laterFilterExpr() as never,
            paint: {
              'line-color': laterColorExpr(theme) as never,
              'line-width': 1.2,
              'line-dasharray': [3, 2],
            },
          });
          map.addLayer({
            id: 'select-casing',
            type: 'line',
            source: 'cessions',
            paint: {
              'line-color': CASING[theme],
              'line-width': 5,
              'line-opacity': ['case', selected, 1, 0] as never,
            },
          });
          map.addLayer({
            id: 'select-line',
            type: 'line',
            source: 'cessions',
            paint: {
              'line-color': TEXT[theme],
              'line-width': 2.2,
              'line-opacity': ['case', selected, 1, 0] as never,
            },
          });
          map.addLayer({
            id: 'nld-fill',
            type: 'fill',
            source: 'nld',
            paint: { 'fill-color': ['get', 'color'] as never, 'fill-opacity': 0.14 },
          });
          map.addLayer({
            id: 'nld-line',
            type: 'line',
            source: 'nld',
            paint: {
              'line-color': ['get', 'color'] as never,
              'line-width': 2.2,
              'line-opacity': 0.9,
            },
          });
          map.addLayer({
            id: 'nld-label',
            type: 'symbol',
            source: 'nld',
            layout: {
              'text-field': ['get', 'Name'],
              'text-font': ['Noto Sans Regular'],
              'text-size': 13,
              'symbol-placement': 'point',
            },
            paint: {
              'text-color': TEXT[theme],
              'text-halo-color': CASING[theme],
              'text-halo-width': 1.5,
            },
          });
          // always-visible badges: "Contested", "Payment refused"
          map.addLayer({
            id: 'badge',
            type: 'symbol',
            source: 'cessions',
            minzoom: 4,
            filter: badgeFilterExpr() as never,
            layout: {
              'text-field': [
                'match',
                ['get', 'bd'],
                'contested',
                'Contested',
                'Payment refused',
              ] as never,
              'text-font': ['Noto Sans Regular'],
              'text-size': 11,
              'symbol-placement': 'point',
            },
            paint: {
              'text-color': TEXT[theme],
              'text-halo-color': CASING[theme],
              'text-halo-width': 2.5,
            },
          });
          // massacre sites at a general location (0.1 degree): hollow rings, broken when the
          // evidence is reported or disputed; off until the reader turns them on
          map.addSource('massacres', { type: 'geojson', data: mas, promoteId: 'id' });
          map.addLayer({
            id: 'massacre-points',
            type: 'symbol',
            source: 'massacres',
            filter: [
              'all',
              on('massacres'),
              ['<=', ['coalesce', ['get', 'year'], 0], ['global-state', 'year']],
            ] as never,
            layout: {
              'icon-image': [
                'concat',
                'mas-',
                [
                  'case',
                  ['in', ['get', 'evidence'], ['literal', ['primary', 'scholarly']]],
                  'solid',
                  'dotted',
                ],
                ['case', ['==', ['get', 'id'], ['global-state', 'sel']], '-sel', ''],
              ] as never,
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'icon-padding': 11,
            },
          });
          if (matchMedia('(hover: hover)').matches) {
            map.on(
              'mousemove',
              'status-fill',
              (e: MapMouseEvent & { features?: { properties: Record<string, unknown> }[] }) => {
                const p = e.features?.[0]?.properties;
                const id = p ? String(p['id']) : '';
                if (!id || phone()) return (tip = null);
                const st = stories[id];
                const ev = events.find((x) => x.id === id);
                const n = k1[id]?.flags.length ?? 0;
                const year = ev?.t_first ? Math.floor(ev.t_first) : null;
                tip = {
                  x: e.point.x,
                  y: e.point.y,
                  text: `${STATUS_LABEL[st?.land_status ?? 'taken_no_instrument']}${year ? `, ${year}` : ''}${n ? `; ${n} consent problem${n === 1 ? '' : 's'}` : ''}`,
                };
              },
            );
            map.on('mouseleave', 'status-fill', () => (tip = null));
          }
          const clickable = ['massacre-points', 'status-fill'];
          for (const layer of clickable) {
            map.on(
              'click',
              layer,
              (e: MapMouseEvent & { features?: { properties: Record<string, unknown> }[] }) => {
                // a massacre point drawn over a land area takes the click
                if (
                  layer !== 'massacre-points' &&
                  map?.getLayer('massacre-points') &&
                  map.queryRenderedFeatures(e.point, { layers: ['massacre-points'] }).length
                )
                  return;
                // every record under the point, topmost first, so the panel can list the others
                const ids = [...new Set((e.features ?? []).map((f) => String(f.properties.id)))];
                const id = ids[0];
                if (id) select(id);
                if (layer === 'status-fill') under = ids.slice(1);
              },
            );
            map.on('mouseenter', layer, () => map && (map.getCanvas().style.cursor = 'pointer'));
            map.on('mouseleave', layer, () => map && (map.getCanvas().style.cursor = ''));
          }
          map.on('moveend', () => {
            if (!map) return;
            const c = map.getCenter();
            s.center = [c.lat, c.lng, map.getZoom()];
          });
          mapReady = true;
          if (follow) followNation(follow);
          else if (s.sel && !s.center) select(s.sel, true);
        });
      } catch (err) {
        loadError = `The map data could not load (${(err as Error).message}).`;
      }
    })();

    return () => {
      cancelled = true;
      removeEventListener('hashchange', onHash);
      clearInterval(playTimer);
      map?.remove();
    };
  });
</script>

<div class="app" class:honored={s.view === 'honored'}>
  <div class="mapwrap">
    <div
      class="map"
      bind:this={container}
      role="region"
      aria-label="Map of what the federal record says happened to Native land, by year"
    ></div>
    <div
      class="presets sans"
      role="radiogroup"
      aria-label="Ways to look at the map"
      bind:this={presetBar}
    >
      {#each PRESET_IDS as id (id)}
        <button
          type="button"
          role="radio"
          aria-checked={s.preset === id}
          class:on={s.preset === id}
          onclick={() => setPreset(id)}>{PRESETS[id].label}</button
        >
      {/each}
    </div>
    <div class="stage" aria-hidden="true">
      <p class="year">
        {s.preset === 'today' ? 'Today' : s.view === 'honored' && slider < s.cut ? s.cut : slider}
      </p>
      {#if chapter}<p class="chapter-title">{chapter.title}</p>{/if}
    </div>
    {#if webglMissing}
      <div class="fallback sans">
        <p>
          This browser cannot draw the map (WebGL 2 is off or unavailable). Every land area is in
          the list beside it and in the <a href={url('/cessions/')}>full index</a>.
        </p>
      </div>
    {/if}
    {#if loadError}<p class="fallback sans" role="alert">{loadError}</p>{/if}
    {#if tip}<p
        class="tip sans"
        style={`left: ${tip.x + 14}px; top: ${tip.y + 14}px`}
        aria-hidden="true"
      >
        {tip.text}
      </p>{/if}
  </div>

  <aside class="rail" class:sheet={sheetOpen} bind:this={rail} aria-label="Map explorer">
    {#if selectedSite}
      {@const m = selectedSite}
      <div class="rail-heading">
        <button type="button" class="back-map" onclick={() => select(null)}
          ><span aria-hidden="true">←</span> Back to the map</button
        >
      </div>
      <section id="detail" class="detail site sans" tabindex="-1" aria-labelledby="detail-h">
        <p class="warning">{MASSACRE_NOTE}</p>
        <p class="kicker">
          {m.category === 'mass_execution'
            ? 'Mass execution'
            : m.category === 'internment_deaths'
              ? 'Deaths in internment'
              : 'Massacre'}, {m.date.slice(0, 4)}
        </p>
        <h2 id="detail-h">{m.name}</h2>
        {#if m.other_names.length}<p class="small">Also called {m.other_names.join('; ')}.</p>{/if}
        <dl>
          <dt>Who was attacked</dt>
          <dd>{m.nations}</dd>
          {#if m.perpetrators}<dt>By</dt>
            <dd>{m.perpetrators}</dd>{/if}
          {#if m.deaths_range}<dt>Killed</dt>
            <dd>{m.deaths_range}{m.deaths_source ? ` (${m.deaths_source})` : ''}</dd>{/if}
          <dt>{MASSACRE_LINK[m.link_kind] ?? 'Context for'}</dt>
          <dd>
            {m.linked_instrument || 'No instrument recorded'}{#if m.link_note}. {m.link_note}{/if}
            {#each m.areas as a (a)}
              <button type="button" class="link area-link" onclick={() => select(a, true)}
                >Land area {a.replace('geo-royce-', '')}</button
              >
            {/each}
          </dd>
        </dl>
        <p>
          {m.summary}
          <span class={`badge ${EVIDENCE_CLASS[m.evidence] ?? ''}`}>{m.evidence_display}</span>
        </p>
        {#if m.quote}<blockquote>“{m.quote}”</blockquote>{/if}
        {#if m.citation}<p class="cite">{m.citation}</p>{/if}
        <p class="small">
          The point is a general location, rounded to about 10 km, never a burial or sacred site. “{MASSACRE_LINK[
            m.link_kind
          ] ?? 'Context for'}” is the order of events the sources give, not a claim that one caused
          the other.
        </p>
        <p class="small">
          Descendant nations can ask for a change or removal:
          <a href={url(`/claim/?record=${encodeURIComponent(m.id)}&kind=correction`)}
            >ask for a change or removal</a
          >.
        </p>
      </section>
    {:else if selectedEvent}
      <div class="rail-heading">
        <button type="button" class="back-map" onclick={() => select(null)}
          ><span aria-hidden="true">←</span> Back to the map</button
        >
      </div>
      <section id="detail" class="detail" tabindex="-1" aria-labelledby="detail-h">
        {#if outline}
          <svg
            class="outline"
            viewBox={outline.view}
            aria-hidden="true"
            style={`--sw: ${outline.stroke}`}
          >
            {#each outline.lands as l, i (i)}<path
                class="hl"
                d={l.d}
                style={`--c: ${l.color}`}
              />{/each}
            <path
              class="ar"
              d={outline.area}
              style={`--c: var(${statusVar(selectedStory?.land_status ?? '')})`}
            />
          </svg>
        {/if}
        <h2 id="detail-h">{selected?.node.label ?? selectionTitle}</h2>
        {#if selectedStory?.plain}<p class="plain">{selectedStory.plain}</p>{/if}
        {#if selectedStory}
          {@const ls = selectedStory.land_status}
          <section class="status sans" aria-labelledby="status-h">
            <h3 id="status-h">What the record says happened to the land</h3>
            <p class="how">
              <span class="sw" style={`background: var(${statusVar(ls)})`}></span><span
                ><strong>{STATUS_LABEL[ls]}.</strong>
                {selectedStory.land_status_basis}{#if selectedK1?.evidence_display}
                  <span class={`badge ${EVIDENCE_CLASS[selectedK1.evidence ?? 'reported'] ?? ''}`}
                    >{selectedK1.evidence_display}</span
                  >{/if}</span
              >
            </p>
            <p class="small">{STATUS_HELP[ls]}</p>
            {#if ['pressure', 'removal'].includes(selectedStory.how)}
              <p class="small">
                Also in the research record: {HOW_LABEL[selectedStory.how].toLowerCase()} ({selectedStory.how_basis}).
              </p>
            {/if}
            {#if selectedStory.broken_promise}
              <p class="small">
                <span class="edge" style={`background: var(${statusVar(ls)})`} aria-hidden="true"
                ></span>Promised or reserved to the nation{selectedStory.promised_year
                  ? ` in ${selectedStory.promised_year}`
                  : ''}, then taken.
              </p>
            {:else if selectedStory.promised_year && NOT_LOST.has(ls)}
              <p class="small">
                <span class="edge held" aria-hidden="true"></span>Promised, reserved or described in {selectedStory.promised_year}.
              </p>
            {/if}
            {#if selectedK1?.basis}
              <details class="note small">
                <summary>Research note (working text, for checking)</summary>{selectedK1.basis}
              </details>
            {/if}
            {#each selectedK1?.sub_areas ?? [] as sub (sub.area)}
              <div class="sub-area small">
                <strong
                  >Part of this area{sub.label
                    ? ` (${sub.label.replace(/^proposed (split|sub-area): /, '')})`
                    : ''}:</strong
                >
                {STATUS_LABEL[sub.land_status]}.
                <span class="badge ev-reported">{sub.evidence_display}</span>
                <details class="note"><summary>Research note</summary>{sub.basis}</details>
              </div>
            {/each}
          </section>
          {#if selectedK1?.flags.length}
            <section class="flags sans" aria-labelledby="flags-h">
              <h3 id="flags-h">What is documented about how it was taken</h3>
              <p class="small">
                These never change the status above. Each shows how well it is sourced.
              </p>
              <ul>
                {#each selectedK1.flags as f (f.flag)}
                  <li>
                    <details>
                      <summary
                        ><span class={`badge ${EVIDENCE_CLASS[f.evidence] ?? ''}`}
                          >{f.evidence_display}</span
                        >
                        {FLAG_LABEL[f.flag] ?? f.flag}</summary
                      >
                      {#if f.summary}<p>{f.summary}</p>{/if}
                      {#if f.quote}<blockquote>“{f.quote}”</blockquote>{/if}
                      {#if f.citation}<p class="cite">{f.citation}</p>{/if}
                    </details>
                  </li>
                {/each}
              </ul>
            </section>
          {/if}
          {#if selectedK1?.massacres.length}
            <section class="linked-sites sans" aria-labelledby="sites-h">
              <h3 id="sites-h">Massacres linked to this land</h3>
              <ul>
                {#each selectedK1.massacres as mid (mid)}
                  {@const m = siteById.get(mid)}
                  {#if m}
                    <li>
                      {MASSACRE_LINK[m.link_kind] ?? 'Context for'}{m.link_kind === 'none'
                        ? ''
                        : ' the taking'}:
                      <button type="button" class="link" onclick={() => select(m.id, true)}
                        >{m.name}, {m.date.slice(0, 4)}</button
                      >
                    </li>
                  {/if}
                {/each}
              </ul>
            </section>
          {/if}
          <section class="nation-says sans" aria-labelledby="nation-h">
            <h3 id="nation-h">What the nation says</h3>
            <p class="small">No nation has reviewed this yet.</p>
          </section>
        {/if}
        {#if recordLoading}<p class="record-status" role="status">Finding its treaties…</p>{/if}
        {#if recordError}<p class="record-status" role="status">
            The treaty connections could not load. The full record has them.
          </p>{/if}
        {#if selected}
          {@const insts = (selected.edges.out['depicts'] ?? [])
            .map((e) => selected?.neighbors[e.target])
            .filter((x) => x?.path)}
          {#each insts as n, i (i)}
            <a class="treaty-open" href={url(n!.path!)}
              ><span
                ><small
                  >{selectedStory?.instrument && n!.label === selectedAgreement?.label
                    ? 'The instrument the record ties to the loss'
                    : 'Also in its record'}</small
                >{n!
                  .label}{#if selectedStory?.instrument && headlines[selectedStory.instrument] && n!.label === selectedAgreement?.label}<em
                    >{headlines[selectedStory.instrument]}</em
                  >{/if}</span
              ><span aria-hidden="true">→</span></a
            >
          {/each}
        {/if}
        {#if under.length}
          <div class="under sans">
            <p class="small">
              {under.length} other record{under.length === 1 ? '' : 's'} cover{under.length === 1
                ? 's'
                : ''} this spot:
            </p>
            {#each under.slice(0, 6) as u (u)}
              {@const ev = events.find((e) => e.id === u)}
              <button type="button" class="link" onclick={() => select(u)}
                >Area {ev?.cessnum ?? u.replace('geo-royce-', '')}: {STATUS_LABEL[lsOf(u)]}</button
              >
            {/each}
          </div>
        {/if}
        <p class="record-reference">
          <a href={url(`/cessions/${selectedEvent.cessnum.toLowerCase()}/`)}
            >Full record of area {selectedEvent.cessnum}</a
          >, with its sources
        </p>
      </section>
      <p class="visually-hidden" aria-live="polite">
        Selected {selected?.node.label ?? selectionTitle}.
      </p>
    {:else}
      <section class="now" aria-labelledby="now-h">
        <p class="now-years sans">
          {chapter ? `${chapter.start_year}–${chapter.end_year}` : slider}
        </p>
        <h2 id="now-h">{chapter?.title ?? 'Explore the land'}</h2>
        {#if chapter}<p class="lede">{chapter.lede}</p>{/if}
        {#each nearMoments.slice(0, 2) as m, i (i)}
          <p class="moment">
            <span class="m-year sans">{m.year}</span> <strong>{m.title}.</strong>
            {m.text}
          </p>
        {/each}
        {#if chapter}
          <details class="more">
            <summary class="sans">Read the chapter</summary>
            {#each chapter.narrative.split(/\n\n+/) as para, i (i)}<p>{para}</p>{/each}
            {#if chapter.sources?.length}
              <p class="srcs sans">
                Sources: {#each chapter.sources as src, i (i)}{i > 0 ? ', ' : ''}<a href={src.url}
                    >{src.title ?? new URL(src.url).hostname}</a
                  >{/each}
              </p>
            {/if}
          </details>
        {/if}
        <p class="map-hint sans">Choose any shape on the map to see what happened to that land.</p>
      </section>
    {/if}

    <section class="homelands sans" aria-labelledby="home-h">
      <div class="home-head">
        <h2 id="home-h">
          {homeFor === 'selection'
            ? 'Whose homelands these are'
            : homeFor === 'nation' && followed
              ? `Homelands around ${followed.label}’s land`
              : 'Native homelands'}
        </h2>
        {#if homeStatus === 'done' && homeFor !== 'selection'}<button
            type="button"
            class="link"
            onclick={clearHomelands}>Hide</button
          >{/if}
      </div>
      {#if homeStatus === 'loading'}
        <p class="small" role="status">Asking Native Land Digital…</p>
      {:else if homeStatus === 'done' && homelands.length}
        <ul class="chips">
          {#each homelands as h, i (i)}
            <li style={`--c: ${h.color}`}>
              {#if h.url}<a href={h.url} rel="noopener">{h.name}</a>{:else}{h.name}{/if}
            </li>
          {/each}
        </ul>
        <p class="small">
          Outlined on the map in their colors: territories as communities describe them, from
          <a href="https://native-land.ca/">Native Land Digital</a>. Loaded live, not stored, and
          not legal boundaries.
        </p>
      {:else if homeStatus === 'done'}
        <p class="small">Native Land Digital has no territory mapped at this spot.</p>
      {:else if homeStatus === 'unavailable' || homeStatus === 'error'}
        <p class="small">
          The homelands lookup did not answer.
          <button type="button" class="link" onclick={homelandsHere}>Try again</button> or visit
          <a href="https://native-land.ca/">native-land.ca</a>.
        </p>
      {/if}
      {#if !selectedEvent && homeStatus !== 'loading'}
        <button type="button" class="pill-btn" onclick={homelandsHere}
          >{homeStatus === 'done' && homeFor === 'center'
            ? 'Show homelands at the new map center'
            : 'Show the homelands at the map’s center'}</button
        >
      {/if}
    </section>

    {#if orgNations.length}
      <section class="work" aria-label="People doing the work">
        <OrgPanel {base} nations={orgNations} />
      </section>
    {/if}

    <section class="controls sans" aria-label="Time and view">
      <div class="slider-row">
        <button type="button" onclick={() => step(-1)} aria-label="Previous year">‹</button>
        <label class="visually-hidden" for="year">Year</label>
        <input
          id="year"
          type="range"
          min={YEAR_MIN}
          max={YEAR_MAX}
          step="1"
          bind:value={s.year}
          aria-valuetext={`${slider}`}
        />
        <button type="button" onclick={() => step(1)} aria-label="Next year">›</button>
      </div>
      <div class="ticks" aria-hidden="true">
        <span>{YEAR_MIN}</span><span>1830</span><span>1860</span><span>{YEAR_MAX}</span>
      </div>
      <div class="row">
        <button
          type="button"
          class="play"
          onclick={togglePlay}
          disabled={reducedMotion}
          aria-pressed={playing}
        >
          {playing ? 'Pause' : slider >= YEAR_MAX ? 'Play again from 1784' : 'Play the years'}
        </button>
        <label class="follow">
          <span class="visually-hidden">Follow a nation</span>
          <select
            value={follow ?? ''}
            onchange={(e) => followNation((e.currentTarget as HTMLSelectElement).value || null)}
          >
            <option value="">Follow a nation…</option>
            {#each nationOptions as o (o.id)}<option value={o.id}>{o.label}</option>{/each}
          </select>
        </label>
      </div>
      <p class="summary">{summary()}</p>
      <p class="question">
        {s.view === 'honored'
          ? `If the treaties had been honored through ${s.cut}: what the United States had promised or not yet acquired by ${s.cut}, with every later taking as a dashed outline. A model, not a claim about today.`
          : preset.question}
      </p>
      <p class="key-head">What the record says happened to the land</p>
      <ul class="key" aria-label="Colors in this view">
        {#each keyClasses as c (c)}
          <li>
            <span
              class="sw"
              style={`background: var(--ls-${c}); border-color: var(--fam-${FAMILY[c]}-ink)`}
              class:dash={c === 'agree' || c === 'eo'}
              class:heavy={c === 'none' || c === 'desc'}
            ></span>{SHORT[c]}
          </li>
        {/each}
        {#if preset.hatch || s.view === 'honored'}<li>
            <span class="sw hatch"></span>Consent problem
          </li>{/if}
        {#if preset.promise !== 'none' && s.view !== 'honored'}<li>
            <span class="edge" class:dotted={preset.promise === 'reserved1894'}
            ></span>{preset.promise === 'reserved1894' ? 'Reserved in 1894' : 'Promise stood here'}
          </li>{/if}
        {#if preset.gap > 0 && s.view !== 'honored'}<li>
            <span class="sw gap"></span>No federal record
          </li>{/if}
        {#if preset.today}<li><span class="sw today-sw"></span>Held today</li>{/if}
      </ul>
      <p class="key-note">
        Royce shows what the United States recorded as acquired, not what nations agreed to.
      </p>
      <div class="overlays" role="group" aria-label="More layers">
        {#each OVERLAYS as o (o.id)}
          <label class="today"
            ><input type="checkbox" checked={layerOn(o.id)} onchange={() => toggleLayer(o.id)} />
            <span
              >{o.label}{#if o.note && (o.id !== 'massacres' || !massacreNoteSeen || layerOn(o.id))}<small
                  >{o.note}</small
                >{/if}</span
            ></label
          >
        {/each}
      </div>
      <p class="visually-hidden" aria-live="polite">{announce}</p>
    </section>

    {#if followed && loss}
      <section class="follow-meter sans" aria-label={`${followed.label}: land over time`}>
        <LandMeter
          years={loss.years}
          total={followed.total}
          byStatus={followed.by_status}
          year={slider}
          label={followed.label}
        />
        <p class="small">
          {#if followed.path}<a href={url(followed.path)}>{followed.label}: full record</a> ·
          {/if}<button type="button" class="link" onclick={() => followNation(null)}
            >Back to all nations</button
          >
        </p>
      </section>
    {/if}

    <details class="context-section more-views" open={s.view === 'honored'}>
      <summary>More ways to look</summary>
      <div class="view-toggle sans" role="radiogroup" aria-label="View">
        <label
          ><input type="radio" name="view" value="record" bind:group={s.view} /> As it happened</label
        >
        <label
          ><input
            type="radio"
            name="view"
            value="honored"
            bind:group={s.view}
            disabled={!preset.honored}
          />
          If the treaties had been honored{#if !preset.honored}<small>
              (not in “{preset.label}”)</small
            >{/if}</label
        >
      </div>
      {#if s.view === 'honored'}
        <fieldset class="chips-cut sans">
          <legend>Stop the clock in</legend>
          {#each CUT_POINTS as c (c)}
            <label class="chip"
              ><input type="radio" name="cut" value={c} bind:group={s.cut} /> {c}</label
            >
          {/each}
        </fieldset>
        <LegalStatus
          {base}
          cut={s.cut}
          counts={honoredCounts}
          selected={selectedStory
            ? {
                label: selected?.node.label ?? selectionTitle,
                status: selectedStory.land_status,
                flags: selectedK1?.flags ?? [],
              }
            : null}
        />
      {/if}
      {#if loss && !followed}
        <LandMeter
          years={loss.years}
          total={loss.all.total}
          byStatus={loss.all.by_status}
          year={slider}
        />
      {/if}
    </details>

    <details class="legend sans context-section">
      <summary>How to read the map</summary>
      <h2 class="legend-head">What the record says happened to the land</h2>
      <p class="lead-note">
        Royce shows what the United States recorded as acquired, not what nations agreed to.
      </p>
      {#each LEGEND_GROUPS as g (g.family)}
        <h3 class="fam">{FAMILY_LABEL[g.family]}</h3>
        <ul>
          {#each g.classes as c (c)}
            {@const shown = s.view === 'honored' || preset.color.includes(c)}
            <li class:muted-row={!shown}>
              <span
                class="sw"
                class:dash={c === 'agree' || c === 'eo'}
                class:heavy={c === 'none' || c === 'desc'}
                style={`background: var(--ls-${c}); border-color: var(--fam-${FAMILY[c]}-ink)`}
              ></span><span
                >{LABEL[c]}{#if !shown}<small> (outlines only in this view)</small>{/if}</span
              >
            </li>
          {/each}
        </ul>
      {/each}
      <h3 class="fam">Marks on top</h3>
      <ul>
        <li>
          <span class="sw hatch"></span><span
            >Hatched: a documented problem with consent (duress, hostages, bribery, signers, a
            missing nation), from a primary or scholarly source</span
          >
        </li>
        <li>
          <span class="sw dots"></span><span
            >Dotted hatch: a problem reported but not yet confirmed (one source, oral history, or
            disputed)</span
          >
        </li>
        <li>
          <span class="edge"></span><span
            >Green outline around taken land: promised to the nation, then taken (“Broken promises”
            and “What was promised”)</span
          >
        </li>
        <li>
          <span class="edge dotted"></span><span
            >Green dots: a promise known only from oral history, a single report, or disputed; in
            “Today”, land reserved in 1894, to compare with what is held now</span
          >
        </li>
        <li>
          <span class="sw gap"></span><span
            >Dots: no federal cession record (colonial and state takings, most of Texas; Alaska and
            Hawaii are not drawn)</span
          >
        </li>
        <li>
          <span class="ring"></span><span
            >Ring: massacre site, general location (primary or scholarly source). Broken ring:
            reported, source not yet confirmed. Off until you turn it on.</span
          >
        </li>
        <li>
          <span class="sw thin"></span><span
            >Thin outline: other records, not part of this view</span
          >
        </li>
        <li>
          <span class="sw later"></span><span
            >Dashed outline (honored view): taken after the chosen year, in the color of how it was
            taken</span
          >
        </li>
      </ul>
      <p class="small">
        Where records overlap, the most recent is drawn on top, and every edge is shown. Tap a spot
        to list every record there. Each finding carries its evidence:
      </p>
      <p class="chips-ev">
        {#each EVIDENCE_LEGEND as [k, t] (k)}<span class={`badge ${EVIDENCE_CLASS[k]}`}>{t}</span
          >{/each}
      </p>
      <p class="small">
        Each shape is a numbered area in Charles Royce’s 1899 federal record, traced by the US
        Forest Service. “Ceded” is that record’s word; it does not mean the land was given freely or
        lawfully. Shapes are approximate, not legal boundaries, and do not show any nation’s
        homeland. The record ends in 1894: cession geometry ends there, and later changes are shown
        as events, not areas.
      </p>
      <p class="small">
        <strong>What Royce does not cover.</strong> Colonial and state takings before or outside federal
        treaty-making (most of New England and the original states), most of Texas (which kept its public
        lands when it joined the Union), Alaska and Hawaii have no Royce area. Blank or dotted land there
        is not land no one held.
      </p>
    </details>

    <details class="context-section record-browser">
      <summary>Every land area recorded by {slider} <span>{visible.length}</span></summary>
      <section class="table sans" aria-label="Land areas">
        <ul>
          {#each visible.slice(0, 200) as e (e.id)}
            <li>
              <button type="button" class:on={s.sel === e.id} onclick={() => select(e.id, true)}>
                <span class="d">{e.dates[0]?.date.slice(0, 4) ?? ''}</span>
                <span
                  ><span class="sw" style={`background: var(${statusVar(lsOf(e.id))})`}
                  ></span>{e.tribes_as_named_in_schedule.join(', ') || 'Peoples not listed'}
                  <small>area {e.cessnum}</small></span
                >
              </button>
            </li>
          {/each}
        </ul>
        {#if visible.length > 200}<p class="small muted">
            Showing the 200 most recent. All are in the <a href={url('/cessions/')}
              >index of land areas</a
            >.
          </p>{/if}
      </section>
    </details>
  </aside>
</div>

<style>
  .outline {
    display: block;
    width: 100%;
    aspect-ratio: 7 / 5;
    background: var(--sage);
    border-radius: 10px;
    margin-bottom: 16px;
  }
  /* the map is right above on a phone: the outline only needs to say which shape */
  @media (max-width: 899px) {
    .outline {
      aspect-ratio: 5 / 2;
      margin-bottom: 12px;
    }
  }
  .outline path {
    stroke-width: var(--sw);
    stroke-linejoin: round;
  }
  .outline .ar {
    fill: var(--c);
    fill-opacity: 0.75;
    stroke: var(--ink);
  }
  .outline .hl {
    fill: var(--c);
    fill-opacity: 0.12;
    stroke: var(--c);
    stroke-width: calc(var(--sw) * 1.6);
  }
  .detail .how {
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: 2px;
  }
  .plain {
    font-size: var(--s0);
    line-height: 1.5;
    margin: 0 0 12px;
  }
  .how span:last-child {
    color: var(--ink-2);
  }
  .treaty-open em {
    display: block;
    font-style: normal;
    font-size: var(--s-1);
    color: var(--ink-2);
    margin-top: 6px;
  }
  .treaty-open small {
    margin: 0 0 4px;
    color: var(--moss);
  }
  .now {
    margin-bottom: 20px;
  }
  .now-years {
    font-size: var(--s-1);
    color: var(--moss);
    margin: 0 0 4px;
  }
  .now h2 {
    font-size: var(--s2);
    letter-spacing: -0.03em;
    line-height: 1.15;
    margin: 0 0 12px;
  }
  .now .lede {
    font-size: var(--s0);
    line-height: 1.5;
  }
  .now .moment {
    border-left: 3px solid var(--lichen);
    padding-left: 12px;
    font-size: var(--s-1);
    margin: 12px 0;
  }
  .more summary {
    cursor: pointer;
    color: var(--moss);
    font-size: var(--s-1);
    min-height: 28px;
  }
  .map-hint {
    font-size: var(--s-1);
    color: var(--ink-2);
    margin: 16px 0 0;
  }
  .homelands {
    background: var(--sheet);
    border: 1px solid var(--rule);
    border-radius: 14px;
    padding: 18px 20px;
    margin: 0 0 20px;
  }
  .home-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
  }
  .homelands h2 {
    font-size: var(--s0);
    margin: 0 0 10px;
  }
  .chips {
    list-style: none;
    padding: 0;
    margin: 0 0 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chips li {
    border: 2px solid var(--c);
    background: color-mix(in srgb, var(--c) 10%, var(--sheet));
    border-radius: 30px;
    padding: 4px 12px;
    font-size: var(--s-1);
  }
  .chips a {
    color: var(--ink);
  }
  .pill-btn {
    margin-top: 6px;
    border: 1px solid var(--rule-strong);
    border-radius: 30px;
    background: var(--sage);
    color: var(--moss-deep);
    padding: 9px 14px;
    font: inherit;
    font-size: var(--s-1);
    cursor: pointer;
    min-height: 40px;
  }
  .pill-btn:hover {
    background: var(--lichen);
  }
  .work {
    margin: 0 0 20px;
  }
  .work :global(.support) {
    margin: 0;
  }
  .controls {
    border-top: 1px solid var(--rule);
    padding-top: 16px;
    margin-bottom: 8px;
  }
  .row .follow {
    margin: 0;
    flex: 1 1 10rem;
  }
  .follow select {
    width: 100%;
  }
  .key {
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    font-size: var(--s-2);
    color: var(--ink-2);
  }
  .key li {
    display: inline-flex;
    align-items: center;
  }
  .key .sw {
    margin-top: 0;
    margin-right: 5px;
  }
  .follow-meter {
    margin-bottom: 8px;
  }
  .chips-cut {
    border: 0;
    padding: 0;
    margin: 12px 0;
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
    font-size: var(--s-1);
  }
  .table small {
    color: var(--ink-3);
    margin-left: 6px;
  }
  .rail-heading {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    margin-bottom: 24px;
  }
  .rail-heading h2 {
    font-size: 1.2rem;
    letter-spacing: -0.025em;
    margin: 0;
  }
  .rail-heading > a {
    font-size: 0.8rem;
  }
  .back-map {
    border: 1px solid var(--rule-strong);
    border-radius: 24px;
    background: var(--sheet);
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.8rem;
  }
  .map-hint {
    font-size: 0.95rem;
    color: var(--ink-2);
    margin-bottom: 24px;
  }
  .context-section {
    border-top: 1px solid var(--rule);
    padding: 16px 0;
    margin: 0;
  }
  .context-section > summary {
    display: list-item;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--moss);
    min-height: 28px;
  }
  .context-section > summary > span {
    font-size: 0.75rem;
    margin-left: 8px;
    color: var(--ink-2);
  }
  .context-section[open] > summary {
    margin-bottom: 20px;
  }
  .context-section :global(.support) {
    margin-top: 16px;
  }
  .record-reference {
    font-size: 0.75rem;
    color: var(--ink-2);
    margin: 16px 0 0;
  }
  .selected-label {
    font-size: 0.75rem;
    color: var(--moss);
    margin: 0 0 10px;
  }
  .record-status {
    font-size: 0.8rem;
    color: var(--ink-2);
  }
  .cause-details {
    border-top: 1px solid var(--rule);
    padding: 16px 0;
    margin: 20px 0;
    font-size: 0.8rem;
    color: var(--ink-2);
  }
  .cause-details > summary {
    cursor: pointer;
    color: var(--moss);
    min-height: 24px;
  }
  .cause-details p {
    margin: 12px 0 0;
  }
  .detail {
    background: var(--sheet);
    padding: 24px;
    border: 1px solid var(--rule);
    border-radius: 14px;
    margin: 0 0 24px;
  }
  .detail h2 {
    font-size: 1.65rem;
    letter-spacing: -0.03em;
  }
  .treaty-links {
    margin: 24px 0;
  }
  .treaty-links h3 {
    margin: 0 0 12px;
    font-size: var(--s1);
  }
  .treaty-open {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    background: var(--sage);
    border: 1px solid var(--rule-strong);
    border-radius: 10px;
    padding: 16px;
    font-size: var(--s0);
    text-decoration: none;
    margin-bottom: 12px;
  }
  .treaty-open small {
    display: block;
    color: var(--ink-2);
    font-size: var(--s-2);
    margin-top: 8px;
  }
  .app {
    display: grid;
    grid-template-rows: minmax(58vh, 1fr) auto;
  }
  @media (min-width: 900px) {
    .app {
      grid-template-columns: minmax(0, 1fr) 26rem;
      grid-template-rows: none;
      height: calc(100dvh - 132px);
    }
    .rail {
      overflow-y: auto;
      border-left: 1px solid var(--rule);
    }
  }
  .mapwrap {
    position: relative;
    min-height: 58vh;
  }
  .map {
    position: absolute;
    inset: 0;
  }
  .stage {
    position: absolute;
    left: var(--space-5);
    bottom: 3.6rem;
    pointer-events: none;
    max-width: 70%;
  }
  .year {
    margin: 0;
    font-family: var(--sans);
    font-size: var(--s-year);
    line-height: 0.85;
    color: var(--ink);
    opacity: 0.9;
    font-variant-numeric: lining-nums;
    letter-spacing: -0.02em;
    text-shadow:
      0 0 18px var(--ground),
      0 0 4px var(--ground);
  }
  .chapter-title {
    margin: var(--space-2) 0 0;
    font-family: var(--sans);
    font-style: normal;
    font-size: var(--s1);
    color: var(--ink);
    text-shadow:
      0 0 10px var(--ground),
      0 0 3px var(--ground);
  }
  @media (max-width: 899px) {
    .stage {
      top: 52px;
      bottom: auto;
    }
    .year {
      font-size: clamp(2.2rem, 11vw, 3.2rem);
    }
    .chapter-title {
      font-size: var(--s0);
    }
  }
  .mapwrap :global(.maplibregl-ctrl-attrib) {
    background: color-mix(in srgb, var(--ground) 82%, transparent);
    font-family: var(--sans);
    font-size: 10px;
    line-height: 1.35;
    color: var(--ink-2);
  }
  .mapwrap :global(.maplibregl-ctrl-attrib a) {
    color: var(--ink-2);
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .mapwrap :global(.maplibregl-ctrl-icon) {
      filter: invert(1);
    }
  }
  :global(:root[data-theme='dark']) .mapwrap :global(.maplibregl-ctrl-icon) {
    filter: invert(1);
  }
  .mapwrap :global(.maplibregl-ctrl-group) {
    background: var(--sheet);
    border-radius: var(--radius);
    box-shadow: none;
    border: 1px solid var(--rule-strong);
  }
  .fallback {
    position: absolute;
    inset: auto var(--space-4) var(--space-4) var(--space-4);
    background: var(--sheet);
    border: 1px solid var(--rule);
    padding: var(--space-4);
  }
  .rail {
    background: var(--ground);
    padding: var(--space-5) var(--gutter) 110px;
  }
  .slider-row {
    display: grid;
    grid-template-columns: var(--tap) 1fr var(--tap);
    align-items: center;
    gap: var(--space-2);
  }
  .slider-row button,
  .play {
    min-height: var(--tap);
    background: var(--sheet);
    border: 1px solid var(--rule-strong);
    border-radius: var(--radius);
    cursor: pointer;
    color: var(--ink);
  }
  .slider-row button {
    font-size: var(--s2);
  }
  .play {
    padding: 0 var(--space-4);
    font-size: var(--s-1);
  }
  .play:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  input[type='range'] {
    width: 100%;
    accent-color: var(--moss);
    min-height: var(--tap);
  }
  .ticks {
    display: flex;
    justify-content: space-between;
    font-size: var(--s-2);
    color: var(--ink-3);
    padding: 0 calc(var(--tap) + var(--space-2));
    font-variant-numeric: lining-nums tabular-nums;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3) var(--space-5);
    align-items: center;
    margin-top: var(--space-4);
  }
  .view-toggle {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-4);
    font-size: var(--s-1);
  }
  .view-toggle label,
  .chip {
    display: inline-flex;
    gap: var(--space-2);
    align-items: center;
    min-height: 32px;
  }
  .chips {
    border: 0;
    padding: 0;
    margin: var(--space-3) 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-4);
    font-size: var(--s-1);
  }
  .chips legend {
    color: var(--ink-2);
    margin-bottom: var(--space-1);
  }
  .follow {
    display: grid;
    gap: var(--space-1);
    margin-top: var(--space-4);
    font-size: var(--s-1);
    color: var(--ink-2);
  }
  .follow select {
    min-height: var(--tap);
    background: var(--sheet);
    border: 1px solid var(--rule-strong);
    border-radius: var(--radius);
    font-size: var(--s0);
    color: var(--ink);
  }
  .summary {
    font-family: var(--sans);
    font-size: var(--s0);
    margin: var(--space-4) 0 0;
  }
  .chapter {
    margin-top: var(--space-6);
    padding-top: var(--space-4);
    border-top: 1px solid var(--rule);
  }
  .span {
    font-size: var(--s-2);
    color: var(--ink-3);
    margin: 0;
  }
  .chapter h2 {
    margin: var(--space-1) 0 var(--space-2);
    font-size: var(--s2);
  }
  .chapter .lede {
    font-size: var(--s0);
  }
  .chapter details summary,
  .legend summary {
    cursor: pointer;
    color: var(--moss);
    font-size: var(--s-1);
    min-height: 24px;
  }
  .srcs {
    font-size: var(--s-2);
    color: var(--ink-2);
  }
  .moments {
    margin-top: var(--space-5);
  }
  .moment {
    border-left: 3px solid var(--lichen);
    padding-left: var(--space-3);
    margin-bottom: var(--space-4);
  }
  .m-year {
    font-size: var(--s-2);
    color: var(--ink-3);
    margin: 0;
  }
  .moment h3 {
    font-size: var(--s1);
    margin: 0 0 var(--space-1);
  }
  .moment p {
    margin: 0;
  }
  .this-year {
    font-size: var(--s-1);
    color: var(--ink-2);
    margin: var(--space-4) 0 var(--space-2);
  }
  .this-year-list {
    list-style: none;
    padding: 0;
  }
  .this-year-list button {
    display: grid;
    grid-template-columns: 0.9rem 1fr;
    gap: var(--space-2);
    text-align: left;
    background: none;
    border: 0;
    padding: var(--space-2) 0;
    cursor: pointer;
    color: var(--ink);
    font: inherit;
    width: 100%;
  }
  .hl {
    display: block;
    color: var(--ink-2);
    font-size: var(--s-1);
  }
  .sw {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 1px;
    margin-top: 0.35em;
    margin-right: var(--space-2);
    flex: none;
  }
  .sw.held {
    background: var(--held);
  }
  .sw {
    border: 1px solid transparent;
  }
  .sw.dash {
    border-style: dashed;
  }
  .sw.heavy {
    border-width: 2px;
  }
  .sw.hatch {
    background: repeating-linear-gradient(
      45deg,
      var(--ls-hatch) 0 1.3px,
      var(--ls-ceded) 1.3px 5.6px
    );
  }
  .sw.dots {
    background:
      radial-gradient(circle, var(--ls-hatch) 0.9px, transparent 1.2px) 0 0 / 4px 4px,
      var(--ls-ceded);
  }
  .sw.gap {
    background:
      radial-gradient(circle, var(--fam-gap-ink) 0.9px, transparent 1.2px) 0 0 / 4.5px 4.5px,
      var(--ground);
    border-color: var(--rule);
  }
  .sw.thin {
    background: transparent;
    border: 1px solid var(--rule-strong);
  }
  .sw.later {
    background: transparent;
    border: 1.5px dashed var(--fam-taken-ink);
  }
  .sw.today-sw {
    background: var(--held);
    border-color: var(--ink);
  }
  .edge {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    margin-top: 0.35em;
    margin-right: var(--space-2);
    flex: none;
    border: 2.5px solid var(--ls-promise);
    background: var(--ls-statute);
  }
  .edge.dotted {
    border-style: dotted;
    background: transparent;
  }
  .edge.held {
    background: var(--ls-reserved);
  }
  .ring {
    display: inline-block;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    border: 2px solid var(--ink);
    background: var(--ls-casing);
    margin: 0.4em var(--space-2) 0 0.05rem;
    flex: none;
  }
  .tip {
    position: absolute;
    z-index: 3;
    pointer-events: none;
    margin: 0;
    max-width: 18rem;
    padding: 4px 10px;
    font-size: var(--s-2);
    background: var(--sheet);
    color: var(--ink);
    border: 1px solid var(--rule-strong);
    border-radius: 6px;
  }
  @media (max-width: 899px) {
    .rail.sheet {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 55dvh;
      overflow-y: auto;
      z-index: 20;
      border-top: 1px solid var(--rule-strong);
      border-radius: 16px 16px 0 0;
      box-shadow: 0 -6px 24px rgb(0 0 0 / 0.18);
      padding-top: var(--space-3);
    }
    .rail.sheet::before {
      content: '';
      display: block;
      width: 40px;
      height: 4px;
      border-radius: 2px;
      background: var(--rule-strong);
      margin: 0 auto var(--space-3);
    }
  }
  .presets {
    position: absolute;
    top: var(--space-2);
    left: var(--space-2);
    right: 56px;
    display: flex;
    gap: 6px;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    padding: 2px;
    scrollbar-width: none;
    z-index: 2;
  }
  .presets button {
    flex: none;
    scroll-snap-align: start;
    min-height: 36px;
    padding: 0 14px;
    border-radius: 20px;
    border: 1px solid var(--rule-strong);
    background: var(--sheet);
    color: var(--ink);
    font: inherit;
    font-size: var(--s-1);
    cursor: pointer;
  }
  .presets button.on {
    background: var(--ink);
    color: var(--sheet);
    border-color: var(--ink);
  }
  .question {
    font-size: var(--s-1);
    color: var(--ink-2);
    margin: var(--space-3) 0 0;
  }
  .fam {
    font-size: var(--s-1);
    margin: var(--space-4) 0 0;
  }
  .muted-row {
    color: var(--ink-3);
  }
  .muted-row .sw {
    opacity: 0.45;
  }
  .chips-ev {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .warning {
    font-size: var(--s-2);
    background: var(--sheet-2);
    border-left: 3px solid var(--ink-3);
    padding: var(--space-2) var(--space-3);
    margin: 0 0 var(--space-3);
  }
  .under {
    margin-top: var(--space-4);
    display: grid;
    gap: 4px;
    justify-items: start;
  }
  .under .link {
    font-size: var(--s-1);
    text-align: left;
  }
  .view-toggle small {
    color: var(--ink-3);
  }
  .key-head {
    font-size: var(--s-1);
    font-weight: 700;
    margin: var(--space-4) 0 0;
  }
  .key-note,
  .lead-note {
    font-size: var(--s-1);
    color: var(--ink-2);
    margin: var(--space-2) 0 0;
  }
  .legend-head {
    font-size: var(--s1);
    margin: 0 0 var(--space-2);
  }
  .key .edge {
    margin-top: 0;
    margin-right: 5px;
  }
  .overlays {
    margin-top: var(--space-3);
    display: grid;
    gap: var(--space-1);
    font-size: var(--s-1);
  }
  .overlays label {
    align-items: flex-start;
  }
  .overlays input {
    margin-top: 0.3em;
  }
  .overlays small {
    display: block;
    color: var(--ink-2);
    font-size: var(--s-2);
  }
  .badge {
    display: inline-block;
    font-size: var(--s-2);
    line-height: 1.3;
    padding: 1px 7px;
    border-radius: 20px;
    border: 1px solid var(--rule-strong);
    background: var(--sheet-2);
    color: var(--ink);
    margin-left: 4px;
    white-space: nowrap;
  }
  .badge.ev-primary {
    background: var(--ink);
    color: var(--sheet);
    border-color: var(--ink);
  }
  .badge.ev-scholarly {
    background: var(--lichen);
    border-color: var(--moss);
  }
  .badge.ev-reported {
    background: var(--sheet);
    border-style: dashed;
  }
  .badge.ev-disputed {
    background: var(--ochre);
    border-color: var(--warn);
  }
  .badge.ev-oral {
    background: var(--sage);
    border-color: var(--moss);
    border-style: dotted;
  }
  .status,
  .flags,
  .linked-sites,
  .nation-says {
    margin-top: var(--space-4);
  }
  .status h3,
  .flags h3,
  .linked-sites h3,
  .nation-says h3 {
    font-size: var(--s-1);
    margin: 0 0 var(--space-2);
  }
  .flags ul,
  .linked-sites ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .flags li {
    border-top: 1px solid var(--rule);
    padding: var(--space-2) 0;
    font-size: var(--s-1);
  }
  .flags summary {
    cursor: pointer;
  }
  .flags summary .badge {
    margin: 0 4px 0 0;
  }
  .detail blockquote {
    margin: var(--space-2) 0;
    padding-left: var(--space-3);
    border-left: 2px solid var(--rule-strong);
    color: var(--ink-2);
    font-size: var(--s-1);
    overflow-wrap: anywhere;
  }
  .cite {
    font-size: var(--s-2);
    color: var(--ink-2);
    overflow-wrap: anywhere;
  }
  .note summary {
    cursor: pointer;
    color: var(--moss);
  }
  .note {
    font-size: var(--s-2);
    color: var(--ink-2);
    overflow-wrap: anywhere;
  }
  .sub-area {
    border-left: 3px solid var(--fam-ceded-ink);
    padding-left: var(--space-2);
  }
  .site dl,
  .site > p {
    font-size: var(--s-1);
  }
  .site dt {
    font-weight: 700;
    margin-top: var(--space-2);
  }
  .site dd {
    margin: 0;
  }
  .area-link {
    display: inline-block;
    margin-right: var(--space-2);
  }
  .kicker {
    font-size: var(--s-2);
    color: var(--ink-2);
    margin: 0 0 var(--space-1);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .legend {
    margin-top: var(--space-6);
    font-size: var(--s-1);
  }
  .legend ul {
    list-style: none;
    padding: 0;
  }
  .legend li {
    display: grid;
    grid-template-columns: 1.2rem 1fr;
    margin: var(--space-2) 0;
  }
  .today {
    display: flex;
    gap: var(--space-2);
    align-items: center;
    min-height: 32px;
  }
  .small {
    font-size: var(--s-2);
    color: var(--ink-2);
  }
  .detail:focus {
    outline: none;
  }
  .detail h2 {
    font-size: var(--s2);
    margin: 0 0 var(--space-2);
  }
  .how {
    font-size: var(--s-1);
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
  }
  .basis {
    color: var(--ink-2);
  }
  .hl-big {
    font-size: var(--s0);
  }
  .link {
    background: none;
    border: 0;
    padding: 0;
    color: var(--moss);
    text-decoration: underline;
    cursor: pointer;
    font: inherit;
    font-size: var(--s-2);
  }
  .nld ul {
    padding-left: 1.1em;
  }
  .table {
    margin-top: var(--space-6);
  }
  .table h2 {
    font-size: var(--s1);
  }
  .table ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .table button {
    width: 100%;
    text-align: left;
    background: none;
    border: 0;
    border-bottom: 1px solid var(--rule);
    padding: var(--space-2) 0;
    display: grid;
    grid-template-columns: 6.2rem 1fr;
    gap: var(--space-2);
    cursor: pointer;
    font-size: var(--s-1);
    min-height: var(--tap);
    color: var(--ink);
  }
  .table button:hover,
  .table button.on {
    background: var(--sheet-2);
  }
  .d {
    color: var(--ink-3);
    font-variant-numeric: lining-nums tabular-nums;
  }
  .muted {
    color: var(--ink-2);
  }
  .honored .year {
    color: var(--moss-deep);
  }
</style>
