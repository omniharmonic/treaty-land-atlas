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
  import { HOW_DASH, HOW_HELP, HOW_LABEL, HOW_ORDER, type How } from './map/how';
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
  }
  interface Series {
    total: number[];
    by_how: Record<How, number[]>;
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

  const RECENT = 5; // years a new cession stays bright

  let s = $state<MapState>(parseHash(typeof location === 'undefined' ? '' : location.hash));
  let follow = $state<string | null>(null);
  let events = $state<CessionEvent[]>([]);
  let stories = $state<Record<string, Story>>({});
  let loss = $state<LandLoss | null>(null);
  let chapters = $state<Chapter[]>([]);
  let moments = $state<Moment[]>([]);
  let headlines = $state<Record<string, string>>({});
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
      .filter((e) => inView(e.t_first, { year: slider, mode: 'cum', win: 999 }))
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
      return `Stopping the clock in ${s.cut}: green is land Royce records as ceded only after ${s.cut}, which the agreements in force that year left with the nations. Outlined: what was taken from ${s.cut + 1} through ${slider}.`;
    const who = followed ? `${followed.label}: ` : '';
    return `${who}${visible.length} cession${visible.length === 1 ? '' : 's'} recorded by the end of ${slider}${thisYear.length ? `, ${thisYear.length} of them in ${slider}` : ''}.`;
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
    m.setGlobalStateProperty('year', slider);
    m.setGlobalStateProperty('recent', RECENT);
    m.setGlobalStateProperty('cut', s.cut);
    m.setGlobalStateProperty('honored', s.view === 'honored');
    m.setGlobalStateProperty('today', s.layers.has('today') || s.year > YEAR_MAX);
    m.setGlobalStateProperty('follow', follow ?? '');
  }
  $effect(() => {
    void [slider, s.cut, s.view, s.layers, s.year, follow];
    if (map && mapReady) applyState(map);
  });

  let lastSel: string | null = null;
  $effect(() => {
    const sel = s.sel;
    if (!map || !mapReady) return;
    if (lastSel) map.setFeatureState({ source: 'cessions', id: lastSel }, { selected: false });
    if (sel) map.setFeatureState({ source: 'cessions', id: sel }, { selected: true });
    lastSel = sel;
  });

  $effect(() => {
    const sel = s.sel;
    selected = null;
    recordError = false;
    recordLoading = !!sel;
    if (!sel) return;
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

  $effect(() => {
    const id = selectedEvent?.id;
    if (!id) return;
    tick().then(() => {
      if (selectedEvent?.id !== id || !rail) return;
      rail.scrollTop = 0;
      if (matchMedia('(max-width: 899px)').matches) rail.scrollIntoView({ block: 'start' });
    });
  });

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
    if (id && playing) togglePlay();
    if (!id)
      tick().then(() => {
        if (rail) rail.scrollTop = 0;
        if (matchMedia('(max-width: 899px)').matches) container?.scrollIntoView({ block: 'start' });
      });
    if (id && fly && map) {
      const b = bboxes.get(id);
      if (b)
        map.fitBounds(
          [
            [b[0], b[1]],
            [b[2], b[3]],
          ],
          { padding: 60, maxZoom: 7, duration: reducedMotion ? 0 : 600 },
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

  function toggleToday() {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- a new Set is assigned, never mutated
    const next = new Set(s.layers);
    if (next.has('today')) next.delete('today');
    else next.add('today');
    s.layers = next;
  }

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
        const [ev, cessions, today, st, ll, story, hl] = await Promise.all([
          get(manifest.layers['cession-events']),
          get(manifest.layers['cessions']),
          get(manifest.layers['today-aiannh']),
          get('tables/cession-stories.json'),
          get('tables/land-loss.json'),
          get('tables/story.json'),
          get('tables/headlines.json'),
        ]);
        if (cancelled) return;
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
        const css = getComputedStyle(document.documentElement);
        const v = (name: string) => css.getPropertyValue(name).trim();
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
            compact: false,
            customAttribution:
              'Early release, <a href="/about/">not yet reviewed</a> by Native nations or legal counsel. Cessions: USDA Forest Service after C. C. Royce (1899), modified. Territories: <a href="https://native-land.ca">Native Land Digital</a>, live, not stored. Today: US Census Bureau. Basemap: <a href="https://openfreemap.org">OpenFreeMap</a> © <a href="https://openmaptiles.org">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }),
        );
        map.on('load', () => {
          if (!map) return;
          applyState(map);
          map.addSource('cessions', { type: 'geojson', data: cessions, promoteId: 'id' });
          map.addSource('today', { type: 'geojson', data: today });
          map.addSource('nld', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });
          const on = (k: string): unknown => ['==', ['global-state', k], true];
          const yearEnd: unknown = ['+', ['global-state', 'year'], 1];
          const ceded: unknown = ['<', ['get', 't0'], yearEnd];
          const recent: unknown = ['>=', ['get', 't0'], ['-', yearEnd, ['global-state', 'recent']]];
          const following: unknown = ['!=', ['global-state', 'follow'], ''];
          const isFollowed: unknown = ['in', ['global-state', 'follow'], ['get', 'nations']];
          const focus = (normal: number, dim: number): unknown => [
            'case',
            following,
            ['case', isFollowed, normal, dim],
            normal,
          ];
          const howColor: unknown = [
            'match',
            ['get', 'how'],
            ...HOW_ORDER.flatMap((h) => [h, v(`--how-${h}`)]),
            v('--how-unknown'),
          ];
          const dash: unknown = [
            'match',
            ['get', 'how'],
            ...HOW_ORDER.flatMap((h) => [h, ['literal', HOW_DASH[h]]]),
            ['literal', [2, 1]],
          ];
          const afterCut: unknown = ['>=', ['get', 't0'], ['+', ['global-state', 'cut'], 1]];

          // land still held (Royce records its cession later): green that shrinks as years pass
          map.addLayer({
            id: 'held',
            type: 'fill',
            source: 'cessions',
            filter: ['all', ['!', on('honored')], ['!', ceded]] as never,
            paint: { 'fill-color': v('--held'), 'fill-opacity': focus(0.42, 0.08) as never },
          });
          // land recorded as ceded, colored by how; recent losses bright, older ones settle
          map.addLayer({
            id: 'ceded',
            type: 'fill',
            source: 'cessions',
            filter: ['all', ['!', on('honored')], ceded] as never,
            paint: {
              'fill-color': howColor as never,
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                0.9,
                [
                  'case',
                  following,
                  ['case', isFollowed, ['case', recent, 0.85, 0.55], 0.06],
                  ['case', recent, 0.8, 0.32],
                ],
              ] as never,
            },
          });
          map.addLayer({
            id: 'ceded-line',
            type: 'line',
            source: 'cessions',
            filter: ['all', ['!', on('honored')], ceded] as never,
            paint: {
              'line-color': v('--ink'),
              'line-opacity': ['case', recent, 0.75, 0.22] as never,
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                2.6,
                ['case', recent, 1.2, 0.5],
              ] as never,
              'line-dasharray': dash as never,
            },
          });
          map.addLayer({
            id: 'honored-ceded',
            type: 'fill',
            source: 'cessions',
            filter: ['all', on('honored'), ['!', afterCut]] as never,
            paint: { 'fill-color': v('--ink-3'), 'fill-opacity': 0.16 },
          });
          map.addLayer({
            id: 'honored-retained',
            type: 'fill',
            source: 'cessions',
            filter: ['all', on('honored'), afterCut] as never,
            paint: {
              'fill-color': v('--held'),
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                0.7,
                0.45,
              ] as never,
            },
          });
          map.addLayer({
            id: 'honored-altered',
            type: 'line',
            source: 'cessions',
            filter: ['all', on('honored'), afterCut, ceded] as never,
            paint: {
              'line-color': howColor as never,
              'line-width': 1.8,
              'line-dasharray': dash as never,
            },
          });
          map.addLayer({
            id: 'today-fill',
            type: 'fill',
            source: 'today',
            filter: ['all', on('today'), ['==', ['get', 'k'], 'land']] as never,
            paint: { 'fill-color': v('--moss'), 'fill-opacity': 0.5 },
          });
          map.addLayer({
            id: 'today-line',
            type: 'line',
            source: 'today',
            filter: ['all', on('today'), ['!=', ['get', 'k'], 'statistical']] as never,
            paint: { 'line-color': v('--moss-deep'), 'line-width': 1.2 },
          });
          map.addLayer({
            id: 'today-statistical',
            type: 'line',
            source: 'today',
            filter: ['all', on('today'), ['==', ['get', 'k'], 'statistical']] as never,
            paint: { 'line-color': v('--river'), 'line-width': 1, 'line-dasharray': [0.5, 2] },
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
              'text-color': v('--ink'),
              'text-halo-color': v('--ground'),
              'text-halo-width': 1.5,
            },
          });
          for (const layer of ['ceded', 'held', 'honored-retained', 'honored-ceded']) {
            map.on(
              'click',
              layer,
              (e: MapMouseEvent & { features?: { properties: { id: string } }[] }) => {
                const id = e.features?.[0]?.properties.id;
                if (id) select(id);
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
      aria-label="Map of land recorded as ceded, by year and by how it was taken"
    ></div>
    <div class="stage" aria-hidden="true">
      <p class="year">{s.view === 'honored' && slider < s.cut ? s.cut : slider}</p>
      {#if chapter}<p class="chapter-title">{chapter.title}</p>{/if}
    </div>
    {#if webglMissing}
      <div class="fallback sans">
        <p>
          This browser cannot draw the map (WebGL 2 is off or unavailable). Every cession is in the
          list beside it and in the <a href={url('/cessions/')}>full index</a>.
        </p>
      </div>
    {/if}
    {#if loadError}<p class="fallback sans" role="alert">{loadError}</p>{/if}
  </div>

  <aside class="rail" bind:this={rail} aria-label="Map explorer">
    {#if selectedEvent}
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
              style={`--c: var(--how-${selectedStory?.how ?? 'unknown'})`}
            />
          </svg>
        {/if}
        <h2 id="detail-h">{selected?.node.label ?? selectionTitle}</h2>
        {#if selectedStory?.plain}<p class="plain">{selectedStory.plain}</p>{/if}
        <p class="how sans">
          <span class="sw" style={`background: var(--how-${selectedStory?.how ?? 'unknown'})`}
          ></span><span
            ><strong>{HOW_LABEL[selectedStory?.how ?? 'unknown']}.</strong>
            {selectedStory?.how_basis ?? ''}</span
          >
        </p>
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
                    ? 'The agreement that took it'
                    : 'Agreement in its record'}</small
                >{n!
                  .label}{#if selectedStory?.instrument && headlines[selectedStory.instrument] && n!.label === selectedAgreement?.label}<em
                    >{headlines[selectedStory.instrument]}</em
                  >{/if}</span
              ><span aria-hidden="true">→</span></a
            >
          {/each}
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
      <ul class="key" aria-label="Colors on the map">
        <li><span class="sw held"></span>Still held</li>
        {#each HOW_ORDER.filter((h) => h !== 'unknown') as h (h)}
          <li><span class="sw" style={`background: var(--how-${h})`}></span>{HOW_LABEL[h]}</li>
        {/each}
      </ul>
      <p class="visually-hidden" aria-live="polite">{announce}</p>
    </section>

    {#if followed && loss}
      <section class="follow-meter sans" aria-label={`${followed.label}: land over time`}>
        <LandMeter
          years={loss.years}
          total={followed.total}
          byHow={followed.by_how}
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
          ><input type="radio" name="view" value="honored" bind:group={s.view} /> If the treaties had
          been honored</label
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
        <LegalStatus {base} />
      {/if}
      <label class="today sans"
        ><input
          type="checkbox"
          checked={s.layers.has('today') || s.year > YEAR_MAX}
          onchange={toggleToday}
        /> Show reservations and trust lands today</label
      >
      {#if loss && !followed}
        <LandMeter
          years={loss.years}
          total={loss.all.total}
          byHow={loss.all.by_how}
          year={slider}
        />
      {/if}
    </details>

    <details class="legend sans context-section">
      <summary>How to read the map</summary>
      <ul>
        <li>
          <span class="sw held"></span><span
            ><strong>Still held</strong> in that year: land the 1899 record shows as ceded only later.
            Watch it shrink.</span
          >
        </li>
        {#each HOW_ORDER as h (h)}
          <li>
            <span class="sw" style={`background: var(--how-${h})`}></span><span
              ><strong>{HOW_LABEL[h]}.</strong> {HOW_HELP[h]}</span
            >
          </li>
        {/each}
        <li>
          <span class="sw bright"></span><span
            >Bright shapes: ceded in the last {RECENT} years. Older losses fade.</span
          >
        </li>
      </ul>
      <p class="small">
        Each shape is a numbered area in Charles Royce’s 1899 federal record of land cessions,
        traced by the US Forest Service. Shapes are approximate, not legal boundaries, and show what
        the government recorded, not any nation’s homeland. The record ends in 1894.
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
                  ><span
                    class="sw"
                    style={`background: var(--how-${stories[e.id]?.how ?? 'unknown'})`}
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
      top: var(--space-3);
      bottom: auto;
    }
    .year {
      font-size: clamp(2.6rem, 14vw, 4rem);
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
  .sw.bright {
    background: var(--how-treaty);
    outline: 1.5px solid var(--ink);
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
