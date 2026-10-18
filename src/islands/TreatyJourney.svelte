<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type { TreatyEvent } from '../lib/treaty';
  let {
    events,
    map,
    base = '',
  }: {
    events: TreatyEvent[];
    map: { width: number; height: number; hi: { id: string; d: string }[] };
    base?: string;
  } = $props();
  let selectedId = $state('signed');
  let zoomed = $state(false);
  let viewBox = $state('');
  let svg: SVGSVGElement;
  let chronology: HTMLOListElement;
  const selected = $derived(
    events.find((e) => e.id === selectedId) ?? events.find((e) => e.id === 'signed') ?? events[0]!,
  );
  const currentShapes = $derived(
    selected.geometryIds.filter((id) => map.hi.some((shape) => shape.id === id)),
  );
  const index = $derived(events.indexOf(selected));
  const url = (path: string) => `${base}${path}`;
  const readableFlag = (flag: string) =>
    flag
      .replace(/^text_has_/, '')
      .replace(/_tag$/, '')
      .replace(/_/g, ' ');
  function syncHash() {
    const params = new URLSearchParams(location.hash.slice(1));
    const id = params.get('event');
    if (!params.has('event') && location.hash) return;
    selectedId = events.some((e) => e.id === id) ? id! : 'signed';
  }
  onMount(() => {
    syncHash();
    if (new URLSearchParams(location.hash.slice(1)).has('event'))
      document.getElementById('history')?.scrollIntoView();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  });
  function select(id: string) {
    selectedId = id;
    const hash = `#event=${encodeURIComponent(id)}`;
    if (location.hash !== hash) history.pushState(null, '', hash);
  }
  function move(event: KeyboardEvent, i: number) {
    const next =
      event.key === 'ArrowDown'
        ? Math.min(events.length - 1, i + 1)
        : event.key === 'ArrowUp'
          ? Math.max(0, i - 1)
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? events.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    select(events[next]!.id);
    document.getElementById(`event-${events[next]!.id}`)?.focus();
  }
  function focusMap() {
    if (!zoomed || !svg) {
      viewBox = `0 0 ${map.width} ${map.height}`;
      return;
    }
    const paths = [
      ...svg.querySelectorAll<SVGPathElement>(currentShapes.length ? '.shape.current' : '.shape'),
    ];
    if (!paths.length) {
      viewBox = `0 0 ${map.width} ${map.height}`;
      return;
    }
    const boxes = paths.map((p) => p.getBBox());
    const x = Math.min(...boxes.map((b) => b.x));
    const y = Math.min(...boxes.map((b) => b.y));
    const w = Math.max(...boxes.map((b) => b.x + b.width)) - x;
    const h = Math.max(...boxes.map((b) => b.y + b.height)) - y;
    const pad = Math.max(25, Math.max(w, h) * 0.14);
    viewBox = `${x - pad} ${y - pad} ${Math.max(w, 30) + pad * 2} ${Math.max(h, 30) + pad * 2}`;
  }
  function revealSelected() {
    const button = chronology?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');
    if (!button) return;
    const item = button.getBoundingClientRect();
    const list = chronology.getBoundingClientRect();
    if (chronology.scrollWidth > chronology.clientWidth)
      chronology.scrollLeft += item.left - list.left - (list.width - item.width) / 2;
    else if (item.top < list.top || item.bottom > list.bottom)
      chronology.scrollTop += item.top - list.top - 16;
  }
  $effect(() => {
    const selection = selectedId;
    const shouldFocus = zoomed;
    tick().then(() => {
      if (selection && shouldFocus) focusMap();
      else viewBox = `0 0 ${map.width} ${map.height}`;
      revealSelected();
    });
  });
</script>

<div class="journey">
  <div class="chronology">
    <div class="chronology-head">
      <h3>Follow the record</h3>
      <span>{events.length} entries</span>
    </div>
    <p class="chronology-help">
      Choose an entry to explore. Dates may describe a period, not a single event.
    </p>
    <ol bind:this={chronology} class="event-list" aria-label="Treaty chronology">
      {#each events as event, i (event.id)}
        <li class:chosen={event.id === selected.id}>
          <button
            id={`event-${event.id}`}
            type="button"
            aria-pressed={event.id === selected.id}
            aria-controls="event-detail"
            onclick={() => select(event.id)}
            onkeydown={(e) => move(e, i)}
          >
            <span class="event-date">{event.date}</span>
            <span class="event-kind">{event.kind}</span>
            <span class="event-title"
              >{event.id === 'signed'
                ? 'The agreement'
                : event.id === 'ratified'
                  ? 'Ratification'
                  : event.label}</span
            >
            {#if event.context}<span class="event-note">Context / related history</span>{/if}
          </button>
        </li>
      {/each}
    </ol>
  </div>
  <div class="exploration">
    <figure class="event-map">
      <div class="map-toolbar">
        <span
          >{currentShapes.length
            ? 'Land connected to this entry'
            : 'Land records linked to the agreement'}</span
        >{#if map.hi.length}<button
            type="button"
            aria-pressed={zoomed}
            onclick={() => (zoomed = !zoomed)}>{zoomed ? 'Show wider map' : 'Focus on land'}</button
          >{/if}
      </div>
      <svg
        bind:this={svg}
        viewBox={viewBox || `0 0 ${map.width} ${map.height}`}
        role="group"
        aria-label={currentShapes.length
          ? `Historical map highlighting ${currentShapes.length} land records connected to ${selected.kind.toLowerCase()}`
          : 'Historical land records connected to this treaty; no event-specific geometry is established'}
      >
        <image href={url('/map/base.svg')} width={map.width} height={map.height} />
        {#each map.hi as shape (shape.id)}
          <a
            href={url(`/cessions/${shape.id.replace('geo-royce-', '')}/`)}
            aria-label={`Open Royce land record ${shape.id.replace('geo-royce-', '')}`}
          >
            <path class="shape" class:current={currentShapes.includes(shape.id)} d={shape.d} />
          </a>
        {/each}
      </svg>
      <figcaption>
        {#if !map.hi.length}No mapped geometry is linked to this agreement yet. Its written history
          is available below.
        {:else if !currentShapes.length}No event-specific geometry is established here. The map
          keeps the treaty’s linked land records in view; it does not reconstruct territory for this
          date.
        {:else}Highlighted shapes are linked land records, not a reconstruction of the whole
          territory at this date.{/if}
        <span
          >Royce’s historical shapes, lower 48. Approximate, not legal boundaries. Connections may
          be suggested.</span
        >
      </figcaption>
    </figure>
    <section id="event-detail" class="event-detail" aria-labelledby="event-title">
      <div class="detail-meta"><span>{selected.kind}</span><span>{selected.date}</span></div>
      <h3 id="event-title">
        {selected.id === 'signed'
          ? 'The agreement and its terms'
          : selected.id === 'ratified'
            ? 'The ratification record'
            : selected.label}
      </h3>
      {#if selected.confidence}
        <p class="entry-confidence" class:low={selected.confidence === 'low'}>
          Source confidence: {selected.confidence === 'low'
            ? 'Low. Thinly sourced; inspect the evidence before relying on this entry'
            : selected.confidence === 'high'
              ? 'High'
              : 'Medium'}. Confidence in the record is separate from whether its connection to this
          agreement has been reviewed.
        </p>
      {/if}
      {#if selected.context}<p class="context-note">
          Related history. This connection is not itself a finding that this treaty was breached.
        </p>{/if}
      {#if selected.suggested}<p class="suggested-note">
          Suggested connection to this agreement; not reviewed by a person.
        </p>{/if}
      {#if selected.flags.length}<p class="research-flags">
          Research notes: {selected.flags.map(readableFlag).join('; ')}.
        </p>{/if}
      {#if selected.details.length}<dl class="event-facts">
          {#each selected.details as fact (fact.label)}<div>
              <dt>{fact.label}</dt>
              <dd>
                {#if fact.href}<a href={fact.href}>{fact.value}</a
                  >{:else}{fact.value}{/if}{#each fact.flags ?? [] as flag (flag)}<span
                    class="inline-flag">{flag}</span
                  >{/each}
              </dd>
            </div>{/each}
        </dl>
      {:else}<p class="empty-detail">
          This entry does not yet have a detailed account. Open its full record to inspect the
          linked evidence and research status.
        </p>{/if}
      {#if selected.path && selected.id !== 'signed' && selected.id !== 'ratified'}<a
          class="record-link"
          href={url(selected.path)}
          >Read the full record and sources <span aria-hidden="true">↗</span></a
        >{/if}
      {#if selected.sources.length}<details class="event-sources">
          <summary>Sources for this entry ({selected.sources.length})</summary>
          <ul>
            {#each selected.sources as source, i (i)}<li>
                <a href={source.url} rel="noopener">{source.label}</a>
              </li>{/each}
          </ul>
        </details>{/if}
      {#if selected.links.length}<details class="event-connections">
          <summary>Explore this entry’s connections ({selected.links.length})</summary>
          <ul>
            {#each selected.links as link (link.id)}<li>
                {#if link.path}<a
                    href={events.some((e) => e.id === link.id)
                      ? `#event=${encodeURIComponent(link.id)}`
                      : url(link.path)}
                    onclick={(event) => {
                      if (events.some((e) => e.id === link.id)) {
                        event.preventDefault();
                        select(link.id);
                      }
                    }}>{link.label}</a
                  >{:else}<span>{link.label}</span>{/if}<small
                  >{link.type}{link.suggested ? ' · suggested connection' : ''}{link.context
                    ? ' · context'
                    : ''}</small
                >
              </li>{/each}
          </ul>
        </details>{/if}
      {#if selected.basis}<details class="event-basis">
          <summary>Why this entry is linked</summary>
          <p>{selected.basis}</p>
        </details>{/if}
      <div class="event-pagination">
        <button type="button" disabled={index === 0} onclick={() => select(events[index - 1]!.id)}
          >Previous entry</button
        ><span aria-live="polite">{index + 1} of {events.length}</span><button
          type="button"
          disabled={index === events.length - 1}
          onclick={() => select(events[index + 1]!.id)}>Next entry</button
        >
      </div>
    </section>
  </div>
</div>

<style>
  .journey {
    display: grid;
    grid-template-columns: minmax(240px, 0.72fr) minmax(0, 1.4fr);
    gap: 48px;
    align-items: start;
  }
  .chronology {
    position: sticky;
    top: 24px;
    min-width: 0;
  }
  .chronology-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
  }
  .chronology-head h3 {
    font-size: 1.2rem;
    letter-spacing: -0.025em;
    margin: 0;
  }
  .chronology-head > span {
    font-size: 0.75rem;
    color: var(--ink-2);
  }
  .chronology-help {
    font-size: 0.8rem;
    color: var(--ink-2);
    margin: 12px 0 24px;
  }
  .event-list {
    list-style: none;
    padding: 0 12px 0 0;
    margin: 0;
    max-height: 75vh;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--rule-strong) transparent;
  }
  .event-list li {
    max-width: none;
    padding-left: 20px;
    border-left: 1px solid var(--rule-strong);
    position: relative;
  }
  .event-list li::before {
    content: '';
    position: absolute;
    width: 7px;
    height: 7px;
    border: 1px solid var(--rule-strong);
    background: var(--ground);
    border-radius: 50%;
    top: 26px;
    left: -4px;
  }
  .event-list li.chosen::before {
    background: var(--moss);
    border-color: var(--moss);
  }
  .event-list button {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    width: 100%;
    border: 1px solid transparent;
    border-radius: 10px;
    text-align: left;
    padding: 16px;
    background: none;
    cursor: pointer;
    color: var(--ink);
    line-height: 1.4;
  }
  .event-list button:hover {
    background: var(--sheet-2);
  }
  .event-list button[aria-pressed='true'] {
    background: var(--sage);
    border-color: #bdc7ac;
  }
  .event-date {
    font-size: 0.8rem;
    color: var(--moss);
    font-variant-numeric: lining-nums tabular-nums;
  }
  .event-kind {
    font-size: 0.7rem;
    color: var(--ink-2);
  }
  .event-title {
    font-size: 0.95rem;
  }
  .event-note {
    font-size: 0.7rem;
    color: var(--ink-2);
  }
  .exploration {
    min-width: 0;
  }
  .event-map {
    background: var(--sage);
    border-radius: 18px;
    margin: 0 0 32px;
    padding: 24px;
  }
  .map-toolbar {
    display: flex;
    gap: 16px;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: var(--ink-2);
  }
  .map-toolbar button {
    background: var(--sheet);
    border: 1px solid var(--rule-strong);
    border-radius: 30px;
    padding: 8px 12px;
    font-size: 0.75rem;
    cursor: pointer;
    white-space: nowrap;
  }
  .event-map svg {
    display: block;
    width: 100%;
    height: 220px;
    margin: 12px 0;
  }
  .shape {
    fill: #a3af8d;
    stroke: #4d603c;
    stroke-width: 1;
    fill-opacity: 0.5;
    vector-effect: non-scaling-stroke;
    transition:
      fill 200ms,
      fill-opacity 200ms;
  }
  .shape.current {
    fill: #9d6b4b;
    fill-opacity: 0.8;
    stroke: #765032;
  }
  .event-map a:hover .shape,
  .event-map a:focus-visible .shape {
    fill-opacity: 1;
    stroke-width: 2;
  }
  figcaption {
    font-size: 0.75rem;
    color: var(--ink-2);
    line-height: 1.5;
  }
  figcaption span {
    display: block;
    margin-top: 8px;
  }
  .detail-meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    font-size: 0.8rem;
    color: var(--moss);
    margin-bottom: 14px;
  }
  .event-detail h3 {
    font-size: clamp(1.6rem, 3vw, 2.3rem);
    font-weight: 400;
    letter-spacing: -0.035em;
    line-height: 1.15;
    margin: 0 0 24px;
  }
  .entry-confidence {
    font-size: 0.75rem;
    color: var(--ink-2);
    margin-bottom: 16px;
  }
  .entry-confidence.low {
    background: var(--ochre);
    color: var(--ink);
    padding: 12px 16px;
    border-radius: 8px;
  }
  .context-note,
  .suggested-note,
  .research-flags {
    padding: 12px 16px;
    background: var(--ochre);
    border-radius: 8px;
    font-size: 0.8rem;
    color: var(--ink);
  }
  .suggested-note {
    background: var(--sheet-2);
  }
  .research-flags {
    background: var(--clay);
  }
  .event-facts {
    margin: 24px 0;
  }
  .event-facts > div {
    padding: 16px 0;
    border-top: 1px solid var(--rule);
  }
  dt {
    font-size: 0.75rem;
    color: var(--ink-2);
    margin-bottom: 6px;
  }
  dd {
    margin: 0;
    font-size: 1rem;
    line-height: 1.65;
    overflow-wrap: anywhere;
  }
  .inline-flag {
    display: inline-block;
    color: var(--warn);
    margin-left: 8px;
    font-size: 0.75rem;
  }
  .record-link {
    display: inline-flex;
    gap: 24px;
    margin-bottom: 24px;
    font-size: 0.9rem;
  }
  details {
    font-size: 0.85rem;
    padding: 14px 0;
    border-top: 1px solid var(--rule);
  }
  summary {
    cursor: pointer;
    min-height: 24px;
    color: var(--moss);
  }
  details ul {
    padding-left: 20px;
    margin: 16px 0 0;
  }
  details li {
    margin-bottom: 12px;
    overflow-wrap: anywhere;
  }
  details li small {
    display: block;
    font-size: 0.75rem;
    color: var(--ink-2);
  }
  details p {
    margin-top: 12px;
  }
  .event-pagination {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
    padding-top: 24px;
    margin-top: 16px;
    border-top: 1px solid var(--rule);
  }
  .event-pagination button {
    border: 1px solid var(--rule-strong);
    background: var(--sheet);
    border-radius: 30px;
    padding: 10px 14px;
    cursor: pointer;
    font-size: 0.8rem;
  }
  .event-pagination button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .event-pagination span {
    font-size: 0.75rem;
    color: var(--ink-2);
    white-space: nowrap;
  }
  @media (max-width: 850px) {
    .journey {
      grid-template-columns: 1fr;
      gap: 28px;
    }
    .chronology {
      position: static;
    }
    .event-list {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      max-height: none;
      padding: 0 0 12px;
    }
    .event-list li {
      flex: 0 0 230px;
      border-left: 0;
      padding: 0;
    }
    .event-list li::before {
      display: none;
    }
    .event-list button {
      height: 100%;
      border-color: var(--rule);
      background: var(--sheet);
    }
    .event-title {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  @media (max-width: 450px) {
    .event-map {
      padding: 18px;
    }
    .map-toolbar {
      flex-wrap: wrap;
    }
    .event-pagination {
      gap: 8px;
    }
    .event-pagination button {
      padding: 10px 12px;
      font-size: 0.75rem;
    }
  }
</style>
