<script lang="ts">
  import { relayFetch } from '../lib/relay';
  // Where you live: type an address (or share your location) and read the record of that land.
  // The address stays in the URL hash, which browsers never send to a server; it goes only to the
  // geocoder through the relay, which keeps nothing. After lookup the hash holds rounded
  // coordinates (about 100 m), so a shared link shows a neighborhood, not a house.
  import { onMount } from 'svelte';
  import SupportView from '../components/SupportView.svelte';
  import { placeReport, type WhereData, type WhereReport } from '../lib/where';
  import { supportFor, type SupportIndex } from '../lib/support';
  import { NOT_LOST, STATUS_LABEL, statusFill, type LandStatus } from './map/landStatusStyle';

  let { base = '', relay = '' }: { base?: string; relay?: string } = $props();

  let q = $state('');
  let status = $state<'idle' | 'loading' | 'done' | 'notfound' | 'error'>('idle');
  let message = $state('');
  let place = $state('');
  let report = $state<WhereReport | null>(null);
  let homelands = $state<{ name: string; url: string | null }[]>([]);
  let homelandStatus = $state<'idle' | 'loading' | 'done' | 'unavailable'>('idle');
  let data: Promise<WhereData> | null = null;
  let supportIx = $state<SupportIndex | null>(null);
  let heading: HTMLElement | undefined = $state();

  const url = (p: string) => `${base}${p}`;
  const round = (v: number) => Math.round(v * 1000) / 1000;

  function loadData(): Promise<WhereData> {
    data ??= (async () => {
      const get = (p: string) => fetch(url(`/data/${p}`)).then((r) => r.json());
      const m = (await get('manifest.json')).layers as Record<string, string>;
      const [cessions, today, stories, headlines, lite, story, support] = await Promise.all([
        get(m['cessions']!),
        get(m['today-aiannh']!),
        get('tables/cession-stories.json'),
        get('tables/headlines.json'),
        get('graph-lite.json'),
        get('tables/story.json'),
        get('tables/support.json'),
      ]);
      return { cessions, today, stories, headlines, lite, story, support };
    })();
    return data;
  }

  async function show(lat: number, lng: number, label: string, state: string | null) {
    status = 'loading';
    message = 'Reading the record…';
    const d = await loadData();
    const r = placeReport(d, lat, lng);
    supportIx = d.support;
    if (state && !r.states.includes(state)) {
      // Places outside Royce's maps still have a state: use it for the people doing the work there.
      r.states = [state];
      r.support = supportFor(d.support, { nations: r.nations.map((n) => n.id), states: [state] });
    }
    report = r;
    place = label;
    status = 'done';
    history.replaceState(
      null,
      '',
      `#at=${round(lat)},${round(lng)}${label ? `&p=${encodeURIComponent(label)}` : ''}${state ? `&s=${state}` : ''}`,
    );
    loadHomelands(lat, lng);
    requestAnimationFrame(() => heading?.focus());
  }

  async function lookup(event?: SubmitEvent) {
    event?.preventDefault();
    const text = q.trim();
    if (text.length < 3) {
      status = 'error';
      message = 'Type a street address, a town and state, or a ZIP code.';
      return;
    }
    status = 'loading';
    message = 'Finding the place…';
    loadData();
    try {
      const res = await relayFetch(relay, `/api/geocode?q=${encodeURIComponent(text)}`);
      if (res.status === 404) {
        status = 'notfound';
        message = 'No match. Try a town and state (Tulsa, OK) or a ZIP code.';
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const g = await res.json();
      await show(g.lat, g.lng, g.place ?? '', g.state ?? null);
    } catch {
      status = 'error';
      message = 'The address lookup is not answering. Try again, or use your location instead.';
    }
  }

  function useLocation() {
    if (!navigator.geolocation) {
      status = 'error';
      message = 'This browser cannot share a location. Type a town or ZIP code instead.';
      return;
    }
    status = 'loading';
    message = 'Asking your browser for your location…';
    loadData();
    navigator.geolocation.getCurrentPosition(
      (p) => show(round(p.coords.latitude), round(p.coords.longitude), 'Your location', null),
      () => {
        status = 'error';
        message = 'Location was not shared. Type a town or ZIP code instead.';
      },
      { maximumAge: 600000, timeout: 15000 },
    );
  }

  // Native Land Digital: the homelands mapped here, fetched live through the relay, never stored.
  function loadHomelands(lat: number, lng: number) {
    homelands = [];
    if (!relay) return;
    homelandStatus = 'loading';
    relayFetch(relay, `/api/lookup?lat=${lat}&lng=${lng}&maps=territories`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((list: { properties?: { Name?: string; description?: string } }[]) => {
        homelands = (Array.isArray(list) ? list : [])
          .filter((x) => x?.properties?.Name)
          .map((x) => ({ name: x.properties!.Name!, url: x.properties!.description ?? null }));
        homelandStatus = 'done';
      })
      .catch(() => (homelandStatus = 'unavailable'));
  }

  onMount(() => {
    const h = new URLSearchParams(location.hash.slice(1));
    const at = h.get('at')?.split(',').map(Number);
    const s = h.get('s');
    if (at?.length === 2 && at.every(Number.isFinite))
      show(at[0]!, at[1]!, h.get('p') ?? '', s && /^[A-Z]{2}$/.test(s) ? s : null);
    else if (location.hash === '#loc') useLocation();
    else if (h.get('q')) {
      q = h.get('q')!;
      lookup();
    }
  });

  const list = (xs: string[]) =>
    xs.length <= 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`;
  const HOW_PHRASE: Record<string, string> = {
    treaty: 'by treaty',
    pressure: 'by a treaty made under documented pressure',
    removal: 'by a removal treaty',
    unratified: 'under a treaty the Senate never ratified',
    congress: 'by act of Congress',
    executive: 'by executive order',
    unknown: 'by means the record does not state',
  };
  // the earliest taking here; areas Royce records as kept reservations are told separately
  const first = $derived(report?.cessions.find((c) => !NOT_LOST.has(c.land_status)) ?? null);
  const keptHere = $derived(report?.cessions.filter((c) => NOT_LOST.has(c.land_status)) ?? []);
  const firstNations = $derived(first ? list(first.nations.map((n) => n.label)) : '');
</script>

<div class="where">
  <form class="ask sans" onsubmit={lookup} role="search" aria-label="Look up a place">
    <label for="where-q">Address, town or ZIP code</label>
    <div class="row">
      <input
        id="where-q"
        name="q"
        type="text"
        autocomplete="street-address"
        placeholder="e.g. 200 Main St, Boulder, CO"
        bind:value={q}
      />
      <button type="submit">Look up</button>
    </div>
    <button type="button" class="loc" onclick={useLocation}>Use my location instead</button>
    <p class="privacy">
      Not stored, not tracked. The address goes to the Census Bureau’s geocoder (or OpenStreetMap)
      and nowhere else. <a href={url('/privacy/')}>Privacy</a>
    </p>
  </form>

  <p class="status sans" role="status" aria-live="polite">
    {status === 'loading' || status === 'error' || status === 'notfound' ? message : ''}
  </p>

  {#if report && status === 'done'}
    <article class="report">
      <p class="place sans">{place || `${report.lat}, ${report.lng}`}</p>
      <h2 tabindex="-1" bind:this={heading}>
        {#if first && !first.checked && first.instruments.length > 1}
          The United States’ record ties this land to treaties and acts of {list(
            first.instruments.map((i) => String(i.year ?? '')).filter(Boolean),
          )}{firstNations ? `, taken from the ${firstNations}` : ''}.
        {:else if first}
          The United States recorded this land as ceded in {first.year}, {HOW_PHRASE[first.how] ??
            'by means the record does not state'}{firstNations ? `, from the ${firstNations}` : ''}.
        {:else}
          Royce’s federal record has no area for this place. Colonial and state takings, most of
          Texas, Alaska and Hawaii are not in it; that does not mean no nation held this land.
        {/if}
      </h2>
      {#if keptHere.length}
        <p class="lede">
          Royce’s schedule also records a reservation here that the nation kept, at least until
          1894: {#each keptHere as k, i (k.id)}{i > 0 ? ', ' : ''}{#if k.path}<a href={url(k.path)}
                >{k.label}</a
              >{:else}{k.label}{/if}{/each}.
        </p>
      {/if}
      {#if !first}
        <p class="lede">
          Royce mapped land the United States recorded as ceded from 1784 to 1894. Much of the East
          was taken earlier, by colonies and states; Alaska and Hawaiʻi were taken by other means.
          The homelands below, and the people doing the work, still apply.
        </p>
      {/if}

      <section aria-labelledby="homelands">
        <h3 id="homelands">Whose homelands</h3>
        {#if homelandStatus === 'loading'}
          <p class="muted sans">Loading the territory maps…</p>
        {:else if homelandStatus === 'done' && homelands.length}
          <p class="homelands">
            {#each homelands as h, i (i)}{i > 0
                ? i === homelands.length - 1
                  ? ' and '
                  : ', '
                : ''}{#if h.url}<a href={h.url} rel="noopener">{h.name}</a
                >{:else}{h.name}{/if}{/each}.
          </p>
          <p class="fine sans">
            From <a href="https://native-land.ca/">Native Land Digital</a>, loaded live and not
            stored. These maps show homelands as communities and researchers have drawn them; they
            are not legal boundaries, and nations may see their lands differently.
          </p>
        {:else if homelandStatus === 'done'}
          <p class="muted sans">Native Land Digital has no territory mapped at this point.</p>
        {:else if homelandStatus === 'unavailable'}
          <p class="muted sans">
            The territory maps are not available right now. See <a href="https://native-land.ca/"
              >native-land.ca</a
            >.
          </p>
        {/if}
      </section>

      {#if first}
        <section aria-labelledby="taken">
          <h3 id="taken">How this land was taken</h3>
          <ol class="strata">
            {#each report.cessions.filter((c) => !NOT_LOST.has(c.land_status)) as c (c.id)}
              <li style={`--c: ${statusFill(c.land_status)}`}>
                <span class="yr">{c.year}</span>
                <div>
                  <p class="how sans">
                    {STATUS_LABEL[c.land_status as LandStatus] ?? c.land_status}
                  </p>
                  {#if c.royce_summary}<p class="what">{c.royce_summary}</p>{/if}
                  {#if !c.checked && c.instruments.length > 1}
                    <p class="sans small">
                      Royce ties this land to {c.instruments.length} instruments: {#each c.instruments as x, i (i)}{i >
                        0
                          ? ', '
                          : ''}{#if x.path}<a href={url(x.path)}>{x.label}</a
                          >{:else}{x.label}{/if}{/each}. Which one the record ties to the loss is
                      still being checked against Royce’s schedule.
                    </p>
                  {/if}
                  {#if c.instrument}
                    <p class="what">
                      {#if c.instrument.headline}{c.instrument.headline}{:else}{c.instrument
                          .label}{/if}
                    </p>
                  {/if}
                  {#if c.nations.length}
                    <p class="sans small">
                      Recorded from: {#each c.nations as n, i (n.id)}{i > 0
                          ? ', '
                          : ''}{#if n.path}<a href={url(n.path)}>{n.label}</a
                          >{:else}{n.label}{/if}{/each}
                    </p>
                  {/if}
                  <p class="sans small links">
                    {#if c.instrument?.path}<a href={url(c.instrument.path)}
                        >Read the treaty’s story</a
                      >{/if}
                    {#if c.path}<a href={url(c.path)}>{c.label}</a>{/if}
                    <a href={url(`/map/#y=${c.year}&sel=${c.id}`)}>See it on the map</a>
                  </p>
                </div>
              </li>
            {/each}
          </ol>
        </section>
      {/if}

      {#if report.broken.length}
        <section aria-labelledby="broken">
          <h3 id="broken">Promises broken</h3>
          <p class="sans small muted">
            Violations recorded against the treaties that took this land.
          </p>
          <ul class="refs">
            {#each report.broken as b (b.id)}
              <li>
                <a href={url(b.path ?? '/')}>{b.label}</a>
                {#if b.headline}<span class="sub">{b.headline}</span>{/if}
              </li>
            {/each}
          </ul>
        </section>
      {/if}

      {#if report.lands_here.length || report.lands_near.length}
        <section aria-labelledby="today">
          <h3 id="today">Native lands today</h3>
          <ul class="refs sans">
            {#each report.lands_here as l, i (i)}<li>
                You are inside: <strong>{l}</strong>
              </li>{/each}
            {#each report.lands_near as l, i (i)}<li>{l.name}, about {l.km} km away</li>{/each}
          </ul>
          <p class="fine sans">
            Census Bureau boundaries (2024). Statistical areas are not reservations.
          </p>
        </section>
      {/if}

      {#if supportIx}<SupportView {base} ix={supportIx} result={report.support} />{/if}

      {#if report.cases.length}
        <section aria-labelledby="courts">
          <h3 id="courts">In the courts</h3>
          <ul class="refs">
            {#each report.cases as c (c.id)}
              <li>
                <a href={url(c.path ?? '/')}>{c.label}</a>
                {#if c.headline}<span class="sub">{c.headline}</span>{/if}
              </li>
            {/each}
          </ul>
        </section>
      {/if}

      {#if report.chapter}
        <section aria-labelledby="chapter">
          <h3 id="chapter">The larger story: {report.chapter.title}</h3>
          <p>{report.chapter.lede}</p>
          <p class="sans small">
            <a href={url(`/map/#y=${first?.year ?? report.chapter.start_year}`)}
              >Watch {report.chapter.start_year} to {report.chapter.end_year} on the map</a
            >
          </p>
        </section>
      {/if}

      <p class="fine sans">
        Built from C. C. Royce’s 1899 maps as digitized by the US Forest Service, the treaty records
        in this atlas, and Census boundaries. Royce’s lines are approximate. Not a legal description
        of land or title. <a href={url('/methods/')}>Methods</a> ·
        <a href={url(`/corrections/`)}>Report an error</a> ·
        <a href={url('/ask/')}>Talk it through with an AI assistant</a>
      </p>
    </article>
  {/if}
</div>

<style>
  .where {
    max-width: 46rem;
  }
  .ask label {
    display: block;
    font-weight: 600;
    margin-bottom: var(--space-2);
  }
  .row {
    display: flex;
    gap: var(--space-2);
  }
  input {
    flex: 1;
    min-width: 0;
    min-height: var(--tap);
    font: inherit;
    font-size: var(--s1);
    padding: var(--space-2) var(--space-3);
    border: 2px solid var(--ink);
    border-radius: var(--radius);
    background: var(--sheet);
    color: var(--ink);
  }
  button[type='submit'] {
    min-height: var(--tap);
    padding: 0 var(--space-5);
    font: inherit;
    font-weight: 600;
    background: var(--moss);
    color: var(--on-moss);
    border: 0;
    border-radius: var(--radius);
    cursor: pointer;
  }
  button[type='submit']:hover {
    background: var(--moss-deep);
  }
  .loc {
    margin-top: var(--space-2);
    background: none;
    border: 0;
    padding: var(--space-1) 0;
    font: inherit;
    color: var(--moss);
    text-decoration: underline;
    cursor: pointer;
    min-height: var(--tap);
  }
  .privacy,
  .fine {
    font-size: var(--s-2);
    color: var(--ink-3);
  }
  .status {
    min-height: 1.5em;
    color: var(--ink-2);
  }
  .report {
    margin-top: var(--space-5);
  }
  .place {
    font-size: var(--s-1);
    color: var(--ink-2);
    margin: 0;
  }
  h2 {
    font-size: clamp(1.5rem, 3.2vw, 2.2rem);
    line-height: 1.22;
    margin: var(--space-2) 0 var(--space-4);
  }
  h2:focus {
    outline: none;
  }
  h3 {
    font-size: var(--s1);
    margin: var(--space-6) 0 var(--space-2);
  }
  .homelands {
    font-size: var(--s1);
    line-height: 1.4;
  }
  .strata {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .strata li {
    display: grid;
    grid-template-columns: 4.2rem minmax(0, 1fr);
    gap: var(--space-4);
    padding: var(--space-3) 0 var(--space-3) var(--space-3);
    border-left: 6px solid var(--c);
    border-top: 1px solid var(--rule);
  }
  .yr {
    font-size: var(--s2);
    line-height: 1;
    font-variant-numeric: lining-nums;
  }
  .how {
    font-size: var(--s-1);
    font-weight: 600;
    margin: 0;
  }
  .what {
    margin: var(--space-1) 0;
  }
  .small {
    font-size: var(--s-1);
    margin: var(--space-1) 0;
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-4);
  }
  .refs {
    list-style: none;
    padding: 0;
  }
  .refs li {
    padding: var(--space-2) 0;
    border-top: 1px solid var(--rule);
  }
  .sub {
    display: block;
    font-size: var(--s-1);
    color: var(--ink-2);
  }
  .muted {
    color: var(--ink-2);
  }
</style>
