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
  import TerritoryLookup from './map/TerritoryLookup.svelte';
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
  let territories = $state<{ name: string; url: string | null }[]>([]);
  let territoryStatus = $state<'idle' | 'loading' | 'done' | 'unavailable'>('idle');
  let container: HTMLDivElement;
  let rail: HTMLElement;
  let recordLoading = $state(false);
  let recordError = $state(false);
  let map: MapLibre | null = null;
  let mapReady = $state(false);
  // eslint-disable-next-line svelte/prefer-svelte-reactivity -- lookup cache, not UI state
  let bboxes = new Map<string, [number, number, number, number]>();

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

  // Native Land Digital territories for a followed nation: loaded live through the relay, never stored.
  $effect(() => {
    const id = follow;
    const f = followed;
    territories = [];
    if (map && mapReady)
      (map.getSource('nld') as GeoJSONSource | undefined)?.setData({
        type: 'FeatureCollection',
        features: [],
      });
    if (!id || !f || !relay) {
      territoryStatus = 'idle';
      return;
    }
    territoryStatus = 'loading';
    const points = f.cessions
      .map((c) => bboxes.get(c))
      .filter((b): b is [number, number, number, number] => !!b)
      .slice(0, 4)
      .map((b) => [(b[1] + b[3]) / 2, (b[0] + b[2]) / 2] as [number, number]);
    Promise.all(
      points.map((p) =>
        relayFetch(relay, `/api/lookup?lat=${p[0]}&lng=${p[1]}&maps=territories`)
          .then((r) => (r.ok ? r.json() : r.status === 503 ? 'unavailable' : []))
          .catch(() => []),
      ),
    ).then((results) => {
      if (follow !== id) return;
      if (results.some((r) => r === 'unavailable')) {
        territoryStatus = 'unavailable';
        return;
      }
      // eslint-disable-next-line svelte/prefer-svelte-reactivity -- local dedupe, not state
      const seen = new Set<string>();
      const feats = (
        results.flat() as { properties: { Name?: string; description?: string; Slug?: string } }[]
      ).filter(
        (x) => x?.properties?.Slug && !seen.has(x.properties.Slug) && seen.add(x.properties.Slug),
      );
      territories = feats.map((x) => ({
        name: x.properties.Name ?? '',
        url: x.properties.description ?? null,
      }));
      if (map && mapReady)
        (map.getSource('nld') as GeoJSONSource | undefined)?.setData({
          type: 'FeatureCollection',
          features: feats as never,
        });
      territoryStatus = 'done';
    });
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
        for (const f of cessions.features) bboxes.set(f.properties.id, bbox(f.geometry));

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
              'Cessions: USDA Forest Service after C. C. Royce (1899), modified. Territories: <a href="https://native-land.ca">Native Land Digital</a>, live, not stored. Today: US Census Bureau. Basemap: <a href="https://openfreemap.org">OpenFreeMap</a> © <a href="https://openmaptiles.org">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
            id: 'nld-line',
            type: 'line',
            source: 'nld',
            paint: { 'line-color': v('--moss-deep'), 'line-width': 2, 'line-dasharray': [2, 2] },
          });
          map.addLayer({
            id: 'nld-label',
            type: 'symbol',
            source: 'nld',
            layout: {
              'text-field': ['get', 'Name'],
              'text-font': ['Noto Sans Regular'],
              'text-size': 12,
            },
            paint: {
              'text-color': v('--moss-deep'),
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
    <div class="rail-heading">
      <h2>{selectedEvent ? 'Explore this place' : 'Explore the land'}</h2>
      {#if selectedEvent}<button type="button" class="back-map" onclick={() => select(null)}
          >Back to map</button
        >{:else}<a href={url('/where/')}>Find your place</a>{/if}
    </div>
    {#if selectedEvent}
      <section id="detail" class="detail" tabindex="-1" aria-label="Selected land record">
        <p class="selected-label">
          {selectedAgreement ? 'Linked agreement' : 'Selected land record'}
        </p>
        <h2>{selectionTitle}</h2>
        <p class="how sans">
          <span class="sw" style={`background: var(--how-${selectedStory?.how ?? 'unknown'})`}
          ></span>{HOW_LABEL[selectedStory?.how ?? 'unknown']}
        </p>
        <p class="sans small">
          {selectedEvent.dates.map((d) => d.date).join(', ')}, {selectedEvent.tribes_as_named_in_schedule.join(
            ', ',
          ) || 'tribes not listed'}
        </p>
        {#if selectedStory?.instrument && headlines[selectedStory.instrument]}<p class="hl-big">
            {headlines[selectedStory.instrument]}
          </p>{/if}
        {#if recordLoading}<p class="record-status" role="status">
            Loading this record’s treaty connections…
          </p>{/if}
        {#if recordError}<p class="record-status" role="status">
            The detailed connections could not load. You can still open the full land record below.
          </p>{/if}
        {#if selected}
          {@const insts = (selected.edges.out['depicts'] ?? [])
            .map((e) => selected?.neighbors[e.target])
            .filter(Boolean)}
          {#if insts.length}
            <div class="treaty-links">
              <h3>Explore the agreement</h3>
              {#each insts as n, i (i)}
                {#if n?.path}<a class="treaty-open" href={url(n.path)}
                    ><span>{n.label}<small>Promises, linked history, and sources</small></span><span
                      aria-hidden="true">↗</span
                    ></a
                  >{/if}
              {/each}
              <p class="small">
                Connections may be suggested; each agreement shows its research status.
              </p>
            </div>
          {:else if selectedStory?.instrument}
            <a
              class="treaty-open"
              href={url(`/treaties/${selectedStory.instrument.toLowerCase()}/`)}
              >Explore the linked agreement <span aria-hidden="true">↗</span></a
            >
          {/if}
        {/if}
        {#if selectedStory?.how_basis}<details class="cause-details">
            <summary>Why this land is shown this way</summary>
            <p>{selectedStory.how_basis}</p>
          </details>{/if}
        <p class="sans small">
          <a href={url(`/cessions/${selectedEvent.cessnum.toLowerCase()}/`)}
            >Read the full land record and sources</a
          >
        </p>
        <p class="record-reference">Royce’s historical land record · No. {selectedEvent.cessnum}</p>
      </section>

      <p class="visually-hidden" aria-live="polite">
        Selected {selectionTitle}. Its land record and treaty connections are at the beginning of
        the sidebar.
      </p>
    {/if}
    {#if !selectedEvent}<p class="map-hint">
        Choose an area on the map to see its land record, treaty, and the people doing the work
        today.
      </p>{/if}
    {#if orgNations.length}<details class="context-section selected-support">
        <summary>People doing the work</summary><OrgPanel {base} nations={orgNations} />
      </details>{/if}
    <details class="context-section time-section" open={!selectedEvent}>
      <summary>Time and map controls <span>{slider}</span></summary>
      <section class="controls sans" aria-label="Time">
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
          <div class="view-toggle" role="radiogroup" aria-label="View">
            <label
              ><input type="radio" name="view" value="record" bind:group={s.view} /> As it happened</label
            >
            <label
              ><input type="radio" name="view" value="honored" bind:group={s.view} /> Honored through…</label
            >
          </div>
        </div>
        {#if s.view === 'honored'}
          <fieldset class="chips">
            <legend>Stop the clock in</legend>
            {#each CUT_POINTS as c (c)}
              <label class="chip"
                ><input type="radio" name="cut" value={c} bind:group={s.cut} /> {c}</label
              >
            {/each}
          </fieldset>
        {/if}
        <label class="follow">
          Follow a nation
          <select
            value={follow ?? ''}
            onchange={(e) => followNation((e.currentTarget as HTMLSelectElement).value || null)}
          >
            <option value="">All nations</option>
            {#each nationOptions as o (o.id)}<option value={o.id}>{o.label}</option>{/each}
          </select>
        </label>
        <p class="summary">{summary()}</p>
        <p class="visually-hidden" aria-live="polite">{announce}</p>
      </section>
    </details>
    {#if s.view === 'honored'}<LegalStatus {base} />{/if}

    <details class="context-section history-context">
      <summary>History around {slider}</summary>
      {#if chapter}
        <section class="chapter" aria-labelledby="chapter-h">
          <p class="span sans">{chapter.start_year}–{chapter.end_year}</p>
          <h2 id="chapter-h">{chapter.title}</h2>
          <p class="lede">{chapter.lede}</p>
          <details>
            <summary class="sans">Read this chapter</summary>
            {#each chapter.narrative.split(/\n\n+/) as para, i (i)}<p>{para}</p>{/each}
            {#if chapter.sources?.length}
              <p class="srcs sans">
                Sources: {#each chapter.sources as src, i (i)}{i > 0 ? ', ' : ''}<a href={src.url}
                    >{src.title ?? new URL(src.url).hostname}</a
                  >{/each}
              </p>
            {/if}
          </details>
        </section>
      {/if}

      {#if nearMoments.length || thisYear.length}
        <section class="moments" aria-label="What happened">
          {#each nearMoments as m, i (i)}
            <article class="moment">
              <p class="m-year sans">{m.year}</p>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </article>
          {/each}
          {#if thisYear.length}
            <h3 class="sans this-year">Recorded as ceded in {slider}</h3>
            <ul class="this-year-list">
              {#each thisYear as e (e.id)}
                {@const st = stories[e.id]}
                <li>
                  <button type="button" onclick={() => select(e.id, true)}>
                    <span class="sw" style={`background: var(--how-${st?.how ?? 'unknown'})`}
                    ></span>
                    <span>
                      <strong
                        >{e.tribes_as_named_in_schedule.join(', ') ||
                          `Cession ${e.cessnum}`}</strong
                      >
                      {#if st?.instrument && headlines[st.instrument]}<span class="hl"
                          >{headlines[st.instrument]}</span
                        >{/if}
                    </span>
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </section>
      {/if}
    </details>
    <details class="context-section">
      <summary>{followed ? `${followed.label}: land over time` : 'Land over time'}</summary>
      {#if loss}
        {#if followed}
          <LandMeter
            years={loss.years}
            total={followed.total}
            byHow={followed.by_how}
            year={slider}
            label={followed.label}
          />
          <p class="sans small">
            {#if followed.path}<a href={url(followed.path)}>{followed.label}: full record</a> ·
            {/if}<button type="button" class="link" onclick={() => followNation(null)}
              >Back to all nations</button
            >
          </p>
          <section class="nld sans" aria-label="Territory from Native Land Digital">
            {#if territoryStatus === 'loading'}<p class="small">
                Loading territories from Native Land Digital…
              </p>{/if}
            {#if territoryStatus === 'done' && territories.length}
              <p class="small">
                Dashed green on the map: territories in this region as communities describe them,
                from <a href="https://native-land.ca/">Native Land Digital</a> (loaded live, not stored;
                not legal boundaries):
              </p>
              <ul class="small">
                {#each territories as t, i (i)}<li>
                    {#if t.url}<a href={t.url}>{t.name}</a>{:else}{t.name}{/if}
                  </li>{/each}
              </ul>
            {/if}
            {#if territoryStatus === 'unavailable'}<p class="small">
                Territory maps are not available right now; see <a href="https://native-land.ca/"
                  >native-land.ca</a
                >.
              </p>{/if}
          </section>
        {:else}
          <LandMeter
            years={loss.years}
            total={loss.all.total}
            byHow={loss.all.by_how}
            year={slider}
          />
        {/if}
      {/if}
    </details>
    <details class="legend sans context-section">
      <summary>How to read the map</summary>
      <ul>
        <li>
          <span class="sw held"></span><span
            ><strong>Still held</strong> in that year: land Royce records as ceded only later. Watch it
            shrink.</span
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
      <label class="today"
        ><input
          type="checkbox"
          checked={s.layers.has('today') || s.year > YEAR_MAX}
          onchange={toggleToday}
        /> Show reservations and trust lands today</label
      >
      <p class="small">
        Shapes are approximate (about 1:2,000,000) and are not legal boundaries. Royce recorded what
        the government treated as ceded, not any nation’s homeland, and his record ends in 1894. How
        each cession happened comes from its treaty record and sourced research; open a shape to see
        why.
      </p>
    </details>

    <details class="context-section">
      <summary>Whose homelands are here?</summary>
      <TerritoryLookup
        {relay}
        getCenter={() => (map ? [map.getCenter().lat, map.getCenter().lng] : null)}
      />
    </details>
    <details class="context-section record-browser">
      <summary>Browse land records <span>{visible.length}</span></summary>
      <section class="table sans" aria-labelledby="inview">
        <h2 id="inview">Cessions recorded by {slider} ({visible.length})</h2>
        <ul>
          {#each visible.slice(0, 200) as e (e.id)}
            <li>
              <button type="button" class:on={s.sel === e.id} onclick={() => select(e.id, true)}>
                <span class="d">{e.dates[0]?.date ?? ''}</span>
                <span
                  ><span
                    class="sw"
                    style={`background: var(--how-${stories[e.id]?.how ?? 'unknown'})`}
                  ></span>Cession {e.cessnum}:
                  {e.tribes_as_named_in_schedule.join(', ') || 'tribes not listed'}</span
                >
              </button>
            </li>
          {/each}
        </ul>
        {#if visible.length > 200}<p class="small muted">
            Showing the 200 most recent. All are in the <a href={url('/cessions/')}
              >cessions index</a
            >.
          </p>{/if}
      </section>
    </details>
  </aside>
</div>

<style>
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
