<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Map as MapLibre,
    NavigationControl,
    AttributionControl,
    setWorkerUrl,
  } from 'maplibre-gl';
  import type { GeoJSONSource, MapMouseEvent } from 'maplibre-gl';
  import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import {
    CUT_POINTS,
    WINDOWS,
    YEAR_MAX,
    YEAR_MIN,
    inView,
    parseHash,
    toHash,
    type MapState,
  } from './map/state';
  import LegalStatus from './map/LegalStatus.svelte';
  import TerritoryLookup from './map/TerritoryLookup.svelte';

  let { base = '', relay = '' }: { base?: string; relay?: string } = $props();

  interface CessionEvent {
    id: string;
    cessnum: string;
    dates: { n: number; date: string; decimal: number }[];
    t_first: number | null;
    legal_type: string;
    tribes_as_named_in_schedule: string[];
    present_day_tribes_per_usfs: string[];
    states: string[];
    geometry_quality: 'ok' | 'missing';
  }
  interface Neighbor {
    type: string;
    label: string;
    year: number | null;
    path: string | null;
  }
  interface Entity {
    node: Record<string, unknown> & { id: string; label: string };
    edges: {
      out: Record<
        string,
        { target: string; status: string; qualifiers: Record<string, unknown> }[]
      >;
    };
    neighbors: Record<string, Neighbor>;
  }

  const LEGAL_WORD: Record<string, string> = {
    treaty_or_agreement: 'Treaty or agreement',
    statute: 'Act of Congress',
    executive_order: 'Executive order',
    unknown: 'Not stated',
  };

  let s = $state<MapState>(parseHash(typeof location === 'undefined' ? '' : location.hash));
  let events = $state<CessionEvent[]>([]);
  let loadError = $state<string | null>(null);
  let webglMissing = $state(false);
  let selected = $state<Entity | null>(null);
  let selectedEvent = $derived(events.find((e) => e.id === s.sel) ?? null);
  let announce = $state('');
  let playing = $state(false);
  let reducedMotion = $state(false);
  let container: HTMLDivElement;
  let map: MapLibre | null = null;
  let mapReady = $state(false);
  // eslint-disable-next-line svelte/prefer-svelte-reactivity -- lookup cache, not UI state
  let bboxes = new Map<string, [number, number, number, number]>();

  const url = (p: string) => `${base}${p}`;

  let visible = $derived(
    events
      .filter((e) => inView(e.t_first, s))
      .sort((a, b) => (b.t_first ?? 0) - (a.t_first ?? 0) || a.cessnum.localeCompare(b.cessnum)),
  );
  let withShape = $derived(visible.filter((e) => e.geometry_quality === 'ok').length);
  let retainedCount = $derived(
    events.filter((e) => e.t_first !== null && e.t_first >= s.cut + 1).length,
  );
  let years = $derived(
    [...new Set(events.map((e) => Math.floor(e.t_first ?? 0)).filter(Boolean))].sort(
      (a, b) => a - b,
    ),
  );

  function summary(): string {
    if (s.view === 'honored') {
      return `Honored through ${s.cut}: Royce records ${retainedCount} cessions after ${s.cut}. Under the agreements in force in ${s.cut}, those lands would still have been held by the nations. Outlined: alterations recorded from ${s.cut + 1} through ${s.year}.`;
    }
    const n = visible.length;
    if (s.mode === 'cum')
      return `By the end of ${s.year}, Royce’s Schedule records ${n} cession${n === 1 ? '' : 's'} (${withShape} with a mapped shape).`;
    return `In the ${s.win} year${s.win === 1 ? '' : 's'} through ${s.year}, Royce’s Schedule records ${n} cession${n === 1 ? '' : 's'}.`;
  }

  // keep the URL in step with the state (debounced, replaceState: no history spam, no tracking)
  let hashTimer: ReturnType<typeof setTimeout> | undefined;
  $effect(() => {
    const h = toHash($state.snapshot(s) as MapState);
    clearTimeout(hashTimer);
    hashTimer = setTimeout(() => history.replaceState(null, '', h), 250);
  });

  // announce year changes politely, at most once per 800 ms, after the slider settles
  let announceTimer: ReturnType<typeof setTimeout> | undefined;
  $effect(() => {
    const text = summary();
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => (announce = text), 800);
  });

  function applyState(m: MapLibre) {
    m.setGlobalStateProperty('year', s.year);
    m.setGlobalStateProperty('win', s.mode === 'cum' ? 999 : s.win);
    m.setGlobalStateProperty('cut', s.cut);
    m.setGlobalStateProperty('honored', s.view === 'honored');
    m.setGlobalStateProperty('cessions', s.layers.has('cessions'));
    m.setGlobalStateProperty('today', s.layers.has('today') || s.year > YEAR_MAX);
  }

  // drive the map from state
  $effect(() => {
    if (!map || !mapReady) return;
    map.setGlobalStateProperty('year', s.year);
    map.setGlobalStateProperty('win', s.mode === 'cum' ? 999 : s.win);
    map.setGlobalStateProperty('cut', s.cut);
    map.setGlobalStateProperty('honored', s.view === 'honored');
    map.setGlobalStateProperty('cessions', s.layers.has('cessions'));
    map.setGlobalStateProperty('today', s.layers.has('today') || s.year > YEAR_MAX);
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
    if (!sel) return;
    fetch(url(`/data/entities/GeoFeature/${sel}.json`))
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (s.sel === sel) selected = j;
      })
      .catch(() => {});
  });

  function select(id: string | null, fly = false) {
    s.sel = id;
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
    if (id) document.getElementById('detail')?.focus({ preventScroll: false });
  }

  function step(dir: 1 | -1) {
    const list = years;
    if (!list.length) return;
    const next =
      dir === 1 ? list.find((y) => y > s.year) : [...list].reverse().find((y) => y < s.year);
    if (next) s.year = next;
  }

  let playTimer: ReturnType<typeof setInterval> | undefined;
  function togglePlay() {
    playing = !playing;
    clearInterval(playTimer);
    if (playing)
      playTimer = setInterval(() => {
        if (s.year >= YEAR_MAX) {
          playing = false;
          clearInterval(playTimer);
          return;
        }
        step(1);
      }, 1500);
  }

  function toggleLayer(id: 'cessions' | 'today') {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- a new Set is assigned to state, never mutated
    const next = new Set(s.layers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
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
    const onHash = () => (s = parseHash(location.hash));
    addEventListener('hashchange', onHash);
    let cancelled = false;

    (async () => {
      try {
        const manifest = await (await fetch(url('/data/manifest.json'))).json();
        const [ev, cessions, today] = await Promise.all([
          fetch(url(`/data/${manifest.layers['cession-events']}`)).then((r) => r.json()),
          fetch(url(`/data/${manifest.layers['cessions']}`)).then((r) => r.json()),
          fetch(url(`/data/${manifest.layers['today-aiannh']}`)).then((r) => r.json()),
        ]);
        if (cancelled) return;
        events = ev;
        for (const f of cessions.features) bboxes.set(f.properties.id, bbox(f.geometry));

        const canvas = document.createElement('canvas');
        if (!canvas.getContext('webgl2')) {
          webglMissing = true;
          return;
        }
        setWorkerUrl(workerUrl);
        const dark = matchMedia('(prefers-color-scheme: dark)').matches;
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
              'Cessions: USDA Forest Service after C. C. Royce (1899), modified. Today: US Census Bureau. Basemap: <a href="https://openfreemap.org">OpenFreeMap</a> © <a href="https://openmaptiles.org">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }),
        );
        map.on('load', () => {
          if (!map) return;
          applyState(map);
          map.addSource('cessions', { type: 'geojson', data: cessions, promoteId: 'id' });
          map.addSource('today', { type: 'geojson', data: today });
          const shown: unknown = ['<', ['get', 't0'], ['+', ['global-state', 'year'], 1]];
          const inWin: unknown = [
            '>=',
            ['get', 't0'],
            ['-', ['+', ['global-state', 'year'], 1], ['global-state', 'win']],
          ];
          const on = (k: string): unknown => ['==', ['global-state', k], true];
          const visibleRecord: unknown = [
            'all',
            on('cessions'),
            ['!', on('honored')],
            shown,
            inWin,
          ];
          const afterCut: unknown = ['>=', ['get', 't0'], ['+', ['global-state', 'cut'], 1]];
          // legal type by dash pattern as well as legend text (never color alone)
          const dash: unknown = [
            'match',
            ['get', 'lt'],
            'statute',
            ['literal', [1, 1.5]],
            'executive_order',
            ['literal', [5, 1.5, 1, 1.5]],
            ['literal', [3, 1.5]],
          ];
          map.addLayer({
            id: 'today-fill',
            type: 'fill',
            source: 'today',
            filter: ['all', on('today'), ['==', ['get', 'k'], 'land']] as never,
            paint: { 'fill-color': v('--moss'), 'fill-opacity': 0.22 },
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
              'fill-color': v('--moss'),
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                0.6,
                0.38,
              ],
            },
          });
          map.addLayer({
            id: 'honored-altered',
            type: 'line',
            source: 'cessions',
            filter: ['all', on('honored'), afterCut, shown] as never,
            paint: {
              'line-color': v('--data-cession-line'),
              'line-width': 1.6,
              'line-dasharray': dash as never,
            },
          });
          map.addLayer({
            id: 'cession-fill',
            type: 'fill',
            source: 'cessions',
            filter: visibleRecord as never,
            paint: {
              'fill-color': v('--data-cession'),
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                0.55,
                0.26,
              ],
            },
          });
          map.addLayer({
            id: 'cession-line',
            type: 'line',
            source: 'cessions',
            filter: visibleRecord as never,
            paint: {
              'line-color': v('--data-cession-line'),
              'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 2.6, 0.9],
              'line-dasharray': dash as never,
            },
          });
          map.addLayer({
            id: 'today-line',
            type: 'line',
            source: 'today',
            filter: ['all', on('today'), ['!=', ['get', 'k'], 'statistical']] as never,
            paint: { 'line-color': v('--river'), 'line-width': 1.3 },
          });
          map.addLayer({
            id: 'today-statistical',
            type: 'line',
            source: 'today',
            filter: ['all', on('today'), ['==', ['get', 'k'], 'statistical']] as never,
            paint: { 'line-color': v('--river'), 'line-width': 1, 'line-dasharray': [0.5, 2] },
          });
          for (const layer of ['cession-fill', 'honored-retained', 'honored-ceded']) {
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
          if (s.sel && !s.center) select(s.sel, true);
          void (map.getSource('cessions') as GeoJSONSource | undefined);
        });
      } catch (err) {
        loadError = `The map data could not load (${(err as Error).message}). The list below still works once the page reloads.`;
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
      aria-label="Map of cessions recorded by Royce"
    ></div>
    <p class="year" aria-hidden="true">{s.view === 'honored' && s.year < s.cut ? s.cut : s.year}</p>
    {#if webglMissing}
      <div class="fallback sans">
        <p>
          This browser cannot draw the map (WebGL 2 is off or unavailable). Every cession is in the
          list beside it and in the <a href={url('/cessions/')}>full index</a>.
        </p>
      </div>
    {/if}
    {#if loadError}
      <p class="fallback sans" role="alert">{loadError}</p>
    {/if}
  </div>

  <div class="rail">
    <section class="controls sans" aria-label="Time and view">
      <div class="view-toggle" role="radiogroup" aria-label="View">
        <label
          ><input type="radio" name="view" value="record" bind:group={s.view} /> As recorded</label
        >
        <label
          ><input type="radio" name="view" value="honored" bind:group={s.view} /> Honored through</label
        >
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

      <label for="year" class="slider-label">Year</label>
      <div class="slider-row">
        <button type="button" onclick={() => step(-1)} aria-label="Previous year with a cession"
          >‹</button
        >
        <input
          id="year"
          type="range"
          min={YEAR_MIN}
          max={YEAR_MAX}
          step="1"
          bind:value={s.year}
          aria-valuetext={`${s.year}`}
        />
        <button type="button" onclick={() => step(1)} aria-label="Next year with a cession"
          >›</button
        >
      </div>
      <div class="ticks" aria-hidden="true">
        <span>{YEAR_MIN}</span><span>1830</span><span>1860</span><span>{YEAR_MAX}</span>
      </div>

      <div class="row">
        {#if s.view === 'record'}
          <label>
            Show
            <select bind:value={s.mode}>
              <option value="cum">everything up to this year</option>
              <option value="win">only recent years</option>
            </select>
          </label>
          {#if s.mode === 'win'}
            <label>
              Years
              <select bind:value={s.win}>
                {#each WINDOWS as w (w)}<option value={w}>{w}</option>{/each}
              </select>
            </label>
          {/if}
        {/if}
        <button
          type="button"
          class="play"
          onclick={togglePlay}
          disabled={reducedMotion}
          aria-pressed={playing}
        >
          {playing ? 'Pause' : 'Play years'}
        </button>
      </div>

      <div class="row layers">
        <label
          ><input
            type="checkbox"
            checked={s.layers.has('cessions')}
            onchange={() => toggleLayer('cessions')}
          /> Cessions</label
        >
        <label
          ><input
            type="checkbox"
            checked={s.layers.has('today') || s.year > YEAR_MAX}
            onchange={() => toggleLayer('today')}
          /> Reservations and trust lands today</label
        >
      </div>

      <p class="summary">{summary()}</p>
      <p class="visually-hidden" aria-live="polite">{announce}</p>

      <details class="legend">
        <summary>How to read the map</summary>
        <ul>
          <li>
            <span class="sw ceded"></span> Land the United States recorded as ceded, from Royce’s 1899
            maps. Line pattern shows the kind of instrument: short dashes a treaty or agreement, dots
            an act of Congress, dash-dot an executive order.
          </li>
          <li>
            <span class="sw retained"></span> In the honored view: land still held by the nations under
            the agreements in force that year.
          </li>
          <li>
            <span class="sw today"></span> Reservations and trust lands today (Census statistical boundaries;
            not legal descriptions).
          </li>
        </ul>
        <p>
          Shapes are approximate (about 1:2,000,000) and are not legal boundaries. Royce recorded
          what the government treated as ceded, not any nation’s homeland. Royce’s record ends in
          1894.
        </p>
      </details>
    </section>

    {#if s.view === 'honored'}
      <LegalStatus {base} />
    {/if}

    <section id="detail" class="detail" tabindex="-1" aria-label="Selected cession">
      {#if selectedEvent}
        <h2>Royce cession {selectedEvent.cessnum}</h2>
        <dl class="sans">
          <dt>Dates in Royce’s Schedule</dt>
          <dd>{selectedEvent.dates.map((d) => d.date).join(', ') || 'none'}</dd>
          <dt>Kind of instrument</dt>
          <dd>{LEGAL_WORD[selectedEvent.legal_type]}</dd>
          <dt>Tribes as named by Royce</dt>
          <dd>{selectedEvent.tribes_as_named_in_schedule.join(', ') || 'not listed'}</dd>
        </dl>
        {#if selected}
          {@const insts = (selected.edges.out['depicts'] ?? []).map((e) => ({
            e,
            n: selected?.neighbors[e.target],
          }))}
          {@const nations = (selected.edges.out['attributed_to_nation'] ?? [])
            .filter((e) => e.qualifiers['role'] === 'present_day_per_usfs')
            .map((e) => selected?.neighbors[e.target])
            .filter(Boolean)}
          {#if insts.length}
            <h3 class="sans">Instrument</h3>
            <ul>
              {#each insts as { e, n } (e.target)}
                <li>
                  {#if n?.path}<a href={url(n.path)}>{n.label}</a
                    >{:else}{n?.label}{/if}{#if e.status === 'proposed'}
                    <span class="mark">suggested</span>{/if}
                </li>
              {/each}
            </ul>
          {/if}
          {#if nations.length}
            <h3 class="sans">Nations today, per the Forest Service (under review)</h3>
            <ul class="inline">
              {#each nations as n, i (i)}
                <li>
                  {#if n?.path}<a href={url(n.path)}>{n.label}</a>{:else}{n?.label}{/if}
                </li>
              {/each}
            </ul>
          {/if}
        {/if}
        <p class="sans">
          <a href={url(`/cessions/${selectedEvent.cessnum.toLowerCase()}/`)}
            >Full record for cession {selectedEvent.cessnum}</a
          >
        </p>
        <button type="button" class="link sans" onclick={() => select(null)}>Clear selection</button
        >
      {:else}
        <p class="muted sans small">Select a shape on the map or a row below to see its record.</p>
      {/if}
    </section>

    <TerritoryLookup
      {relay}
      getCenter={() => (map ? [map.getCenter().lat, map.getCenter().lng] : null)}
    />

    <section class="table sans" aria-labelledby="inview">
      <h2 id="inview">Cessions in view ({visible.length})</h2>
      <ul>
        {#each visible.slice(0, 250) as e (e.id)}
          <li>
            <button type="button" class:on={s.sel === e.id} onclick={() => select(e.id, true)}>
              <span class="d">{e.dates[0]?.date ?? ''}</span>
              <span
                >Cession {e.cessnum}: {e.tribes_as_named_in_schedule.join(', ') ||
                  'tribes not listed'}</span
              >
              {#if e.geometry_quality === 'missing'}<span class="mark">no shape</span>{/if}
            </button>
          </li>
        {/each}
      </ul>
      {#if visible.length > 250}
        <p class="small muted">
          Showing the 250 most recent. All {visible.length} are in the
          <a href={url('/cessions/')}>cessions index</a>.
        </p>
      {/if}
    </section>
  </div>
</div>

<style>
  .app {
    display: grid;
    grid-template-rows: minmax(55vh, 1fr) auto;
    min-height: calc(100dvh - 96px);
  }
  @media (min-width: 900px) {
    .app {
      grid-template-columns: minmax(0, 1fr) 24rem;
      grid-template-rows: none;
      height: calc(100dvh - 96px);
    }
    .rail {
      overflow-y: auto;
      border-left: 1px solid var(--rule);
    }
  }
  .mapwrap {
    position: relative;
    min-height: 55vh;
  }
  .map {
    position: absolute;
    inset: 0;
  }
  .year {
    position: absolute;
    left: var(--space-5);
    bottom: 3.4rem;
    margin: 0;
    font-family: var(--serif);
    font-size: var(--s-year);
    line-height: 0.85;
    color: var(--ink);
    opacity: 0.86;
    pointer-events: none;
    font-variant-numeric: lining-nums;
    letter-spacing: -0.02em;
    text-shadow: 0 0 18px var(--ground);
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
    padding: var(--space-5) var(--gutter) var(--space-7);
  }
  .controls label {
    font-size: var(--s-1);
  }
  .view-toggle {
    display: flex;
    gap: var(--space-5);
    margin-bottom: var(--space-4);
  }
  .view-toggle label,
  .chip,
  .layers label {
    display: inline-flex;
    gap: var(--space-2);
    align-items: center;
    min-height: 32px;
  }
  .chips {
    border: 0;
    padding: 0;
    margin: 0 0 var(--space-4);
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-4);
  }
  .chips legend {
    font-size: var(--s-1);
    color: var(--ink-2);
    margin-bottom: var(--space-2);
  }
  .slider-label {
    display: block;
    color: var(--ink-2);
  }
  .slider-row {
    display: grid;
    grid-template-columns: var(--tap) 1fr var(--tap);
    align-items: center;
    gap: var(--space-2);
  }
  .slider-row button {
    min-height: var(--tap);
    font-size: var(--s2);
    background: none;
    border: 1px solid var(--rule-strong);
    border-radius: var(--radius);
    cursor: pointer;
    color: var(--ink);
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
  select {
    min-height: 32px;
    background: var(--sheet);
    border: 1px solid var(--rule-strong);
    border-radius: var(--radius);
    margin-left: var(--space-1);
  }
  .play {
    min-height: 32px;
    padding: 0 var(--space-4);
    background: var(--sheet);
    border: 1px solid var(--rule-strong);
    border-radius: var(--radius);
    cursor: pointer;
  }
  .play:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .summary {
    font-family: var(--serif);
    font-size: var(--s0);
    margin: var(--space-5) 0 var(--space-3);
  }
  .legend summary {
    cursor: pointer;
    color: var(--moss);
    font-size: var(--s-1);
    min-height: 24px;
  }
  .legend ul {
    list-style: none;
    padding: 0;
    font-size: var(--s-1);
  }
  .legend li {
    display: grid;
    grid-template-columns: 1.4rem 1fr;
    gap: var(--space-2);
    margin: var(--space-2) 0;
  }
  .legend p {
    font-size: var(--s-2);
    color: var(--ink-2);
  }
  .sw {
    display: inline-block;
    width: 1.1rem;
    height: 0.8rem;
    margin-top: 0.3em;
  }
  .sw.ceded {
    background: color-mix(in srgb, var(--data-cession) 35%, transparent);
    border: 1.5px dashed var(--data-cession-line);
  }
  .sw.retained {
    background: color-mix(in srgb, var(--moss) 45%, transparent);
  }
  .sw.stat {
    border: 1.5px dotted var(--river);
  }
  .sw.today {
    border: 1.5px solid var(--river);
    background: color-mix(in srgb, var(--moss) 18%, transparent);
  }
  .detail {
    margin-top: var(--space-6);
    padding-top: var(--space-4);
    border-top: 1px solid var(--rule);
  }
  .detail:focus {
    outline: none;
  }
  .detail h2 {
    margin-top: 0;
    font-size: var(--s2);
  }
  .detail h3 {
    font-size: var(--s-1);
    color: var(--ink-2);
    margin: var(--space-4) 0 var(--space-1);
  }
  .detail dl {
    font-size: var(--s-1);
    display: grid;
    grid-template-columns: 9rem 1fr;
    gap: var(--space-1) var(--space-3);
  }
  .detail dt {
    color: var(--ink-3);
  }
  .detail dd {
    margin: 0;
  }
  .detail ul {
    padding-left: 1.1em;
    font-size: var(--s-1);
  }
  .detail ul.inline {
    list-style: none;
    padding: 0;
  }
  .link {
    background: none;
    border: 0;
    padding: 0;
    color: var(--moss);
    text-decoration: underline;
    cursor: pointer;
    font-size: var(--s-1);
    min-height: 24px;
  }
  .mark {
    font-size: var(--s-2);
    color: var(--ink-3);
    border: 1px solid var(--rule-strong);
    border-radius: 999px;
    padding: 0 0.45em;
    margin-left: var(--space-2);
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
    grid-template-columns: 6.2rem 1fr auto;
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
  .small {
    font-size: var(--s-1);
  }
  .muted {
    color: var(--ink-2);
  }
  .honored .year {
    color: var(--moss-deep);
  }
</style>
