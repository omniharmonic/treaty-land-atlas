<script lang="ts">
  import { onMount } from 'svelte';
  interface Entry {
    id: string;
    label: string;
    path: string;
    date: string;
    year: number | null;
    region: string;
    status: string;
    parties: string;
    headline: string;
    events: number;
    nations: number;
  }
  let { entries, base = '' }: { entries: Entry[]; base?: string } = $props();
  let query = $state('');
  let region = $state('');
  let status = $state('');
  let limit = $state(24);
  let hydrated = $state(false);
  const regions = $derived([...new Set(entries.map((e) => e.region).filter(Boolean))].sort());
  const fold = (s: string) => s.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
  const filtered = $derived(
    entries.filter(
      (e) =>
        (!region || e.region === region) &&
        (!status ||
          (status === 'ratified'
            ? e.status.startsWith('ratified')
            : status === 'other'
              ? !e.status.startsWith('ratified') && e.status !== 'unratified'
              : e.status === status)) &&
        fold(query.trim())
          .split(/\s+/)
          .filter(Boolean)
          .every((term) =>
            fold(`${e.label} ${e.parties} ${e.region} ${e.date} ${e.headline}`).includes(term),
          ),
    ),
  );
  const statusText = (s: string) =>
    s === 'ratified'
      ? 'Ratified'
      : s === 'ratified_with_amendments'
        ? 'Ratified with amendments'
        : s === 'unratified'
          ? 'Never ratified'
          : 'Agreement or other instrument';
  function readUrl() {
    const params = new URLSearchParams(location.search);
    query = params.get('q') ?? '';
    const r = params.get('region') ?? '';
    region = regions.includes(r) ? r : '';
    const s = params.get('status') ?? '';
    status = ['ratified', 'unratified', 'other'].includes(s) ? s : '';
    limit = 24;
  }
  onMount(() => {
    readUrl();
    hydrated = true;
    window.addEventListener('popstate', readUrl);
    return () => window.removeEventListener('popstate', readUrl);
  });
  function changed(push = false) {
    limit = 24;
    const u = new URL(location.href);
    for (const [key, value] of [
      ['q', query],
      ['region', region],
      ['status', status],
    ]) {
      if (value) u.searchParams.set(key!, value!);
      else u.searchParams.delete(key!);
    }
    if (push) history.pushState(null, '', u);
    else history.replaceState(null, '', u);
  }
  function reset() {
    query = '';
    region = '';
    status = '';
    changed(true);
  }
</script>

<div class="directory">
  <div class="filters" class:ready={hydrated}>
    <label class="search"
      ><span>Find an agreement</span><input
        type="search"
        placeholder="A treaty, nation, place, or year"
        value={query}
        oninput={(e) => {
          query = e.currentTarget.value;
          changed();
        }}
        disabled={!hydrated}
      /></label
    >
    <label
      ><span>Region</span><select
        aria-label="Region"
        value={region}
        onchange={(e) => {
          region = e.currentTarget.value;
          changed(true);
        }}
        disabled={!hydrated}
        ><option value="">All regions</option>{#each regions as r (r)}<option value={r}>{r}</option
          >{/each}</select
      ></label
    >
    <label
      ><span>Ratification</span><select
        aria-label="Ratification"
        value={status}
        onchange={(e) => {
          status = e.currentTarget.value;
          changed(true);
        }}
        disabled={!hydrated}
        ><option value="">All instruments</option><option value="ratified">Ratified</option><option
          value="unratified">Never ratified</option
        ><option value="other">Other instruments</option></select
      ></label
    >
  </div>
  <div class="results-heading">
    <p role="status">
      {filtered.length}
      {filtered.length === 1 ? 'agreement' : 'agreements'}{query || region || status
        ? ' matching your search'
        : ' in the record'}
    </p>
    {#if query || region || status}<button class="reset" type="button" onclick={reset}
        >Clear filters</button
      >{:else}<span>In date order</span>{/if}
  </div>
  <div class="agreement-grid">
    {#each filtered.slice(0, limit) as entry (entry.id)}
      <article class="agreement">
        <div class="agreement-meta">
          <span>{entry.date || 'Date not recorded'}</span><span
            >{entry.region || 'Region not recorded'}</span
          >
        </div>
        <h3>
          <a href={`${base}${entry.path}`}
            >{entry.label}<span class="card-arrow" aria-hidden="true">↗</span></a
          >
        </h3>
        <p>
          {entry.headline ||
            entry.parties ||
            'Open this agreement to explore its terms, linked records, and sources.'}
        </p>
        <div class="agreement-footer">
          <span class:unratified={entry.status === 'unratified'}>{statusText(entry.status)}</span
          ><span>{entry.events} linked {entry.events === 1 ? 'entry' : 'entries'}</span>
        </div>
      </article>
    {/each}
  </div>
  {#if filtered.length === 0}<div class="empty">
      <h3>No agreements match yet.</h3>
      <p>Try a nation’s name, a treaty location, or a different spelling.</p>
      <button type="button" onclick={reset}>Show all agreements</button>
    </div>{/if}
  {#if filtered.length > limit}<div class="load-more">
      <button type="button" onclick={() => (limit += 24)}>Show more agreements</button><span
        >Showing {Math.min(limit, filtered.length)} of {filtered.length}</span
      >
    </div>{/if}
</div>

<style>
  .filters {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 20px;
    padding: 28px;
    background: var(--sheet-2);
    border-radius: 14px;
  }
  .filters label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 0.8rem;
    min-width: 0;
  }
  input,
  select {
    width: 100%;
    min-height: 48px;
    padding: 12px 14px;
    border: 1px solid var(--rule-strong);
    background: var(--sheet);
    color: var(--ink);
    border-radius: 7px;
    font-size: 0.95rem;
  }
  input::placeholder {
    color: var(--ink-3);
    opacity: 1;
  }
  .results-heading {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    padding: 24px 0;
    font-size: 0.8rem;
    color: var(--ink-2);
  }
  .results-heading p {
    margin: 0;
  }
  .reset {
    background: none;
    border: 0;
    color: var(--moss);
    text-decoration: underline;
    cursor: pointer;
    min-height: 32px;
  }
  .agreement-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }
  .agreement {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 28px;
    border: 1px solid var(--rule);
    background: var(--sheet);
    border-radius: 14px;
  }
  .agreement:hover {
    border-color: var(--moss);
  }
  .agreement:focus-within {
    outline: 2px solid var(--moss);
    outline-offset: 3px;
  }
  .agreement-meta {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 0.75rem;
    color: var(--ink-2);
    margin-bottom: 28px;
  }
  h3 {
    font-size: 1.45rem;
    line-height: 1.2;
    font-weight: 400;
    letter-spacing: -0.025em;
    margin: 0 0 18px;
    padding-right: 18px;
  }
  h3 a {
    color: var(--ink);
    text-decoration: none;
  }
  h3 a::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
  }
  .card-arrow {
    position: absolute;
    right: 24px;
    top: 68px;
    color: var(--moss);
  }
  .agreement p {
    font-size: 0.875rem;
    color: var(--ink-2);
    margin: 0 0 24px;
    line-height: 1.65;
  }
  .agreement-footer {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px 12px;
    border-top: 1px solid var(--rule);
    padding-top: 16px;
    font-size: 0.7rem;
    color: var(--ink-2);
  }
  .unratified {
    color: #774e35;
  }
  .load-more {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    margin: 36px 0;
  }
  .load-more span {
    font-size: 0.8rem;
    color: var(--ink-2);
  }
  .load-more button,
  .empty button {
    border: 1px solid var(--moss);
    background: var(--moss);
    color: var(--on-moss);
    border-radius: 30px;
    padding: 14px 24px;
    cursor: pointer;
  }
  .empty {
    padding: 48px 0;
  }
  .empty h3 {
    font-size: 1.8rem;
  }
  @media (max-width: 1000px) {
    .agreement-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 650px) {
    .filters {
      grid-template-columns: 1fr 1fr;
      padding: 20px;
      gap: 16px;
    }
    .search {
      grid-column: 1/-1;
    }
    .agreement-grid {
      grid-template-columns: 1fr;
    }
    .agreement {
      padding: 24px;
    }
    .agreement-meta {
      margin-bottom: 20px;
    }
  }
  @media (max-width: 380px) {
    .filters {
      grid-template-columns: 1fr;
    }
  }
</style>
