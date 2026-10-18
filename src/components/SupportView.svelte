<script lang="ts">
  // "Who is doing the work": the nations today, then the organizations restoring land and law
  // connected to this part of the graph. Rendered statically on record pages and live in the map.
  import type { SupportIndex, SupportResult } from '../lib/support';

  let {
    base = '',
    ix,
    result,
    compact = false,
  }: {
    base?: string;
    ix: Pick<SupportIndex, 'orgs'>;
    result: SupportResult;
    compact?: boolean;
  } = $props();

  const link = (p: string | null) => (p ? `${base}${p}` : null);
  const groups = $derived(
    [
      { title: 'Working with these nations', ids: result.direct },
      { title: 'Land return and Native-led work nearby', ids: result.nearby },
      { title: 'Native legal and land defense, nationally', ids: result.national },
    ].filter((g) => g.ids.length),
  );
  const KIND_WORD = {
    nation: 'Nation government',
    native: 'Native-led',
    ally: 'Allied land trust',
  };
  const short = (t: string) => (t.length > 120 ? `${t.slice(0, 117).replace(/\s+\S*$/, '')}…` : t);
</script>

<section class="support sans" class:compact aria-labelledby="support-h">
  <h2 id="support-h">Who is doing the work</h2>
  {#if result.today.length}
    <p class="lead">This history belongs to living nations. Start with them:</p>
    <ul class="today">
      {#each result.today as t (t.id)}
        <li>
          {#if t.path}<a href={link(t.path)}>{t.label}</a>{:else}{t.label}{/if}
        </li>
      {/each}
    </ul>
  {/if}
  {#each groups as g (g.title)}
    <h3>{g.title}</h3>
    <ul class="orgs">
      {#each g.ids as id (id)}
        {@const o = ix.orgs[id]!}
        <li>
          <span class="name"
            >{#if o.path}<a href={link(o.path)}>{o.label}</a>{:else}{o.label}{/if}</span
          >
          <span class="kind">{KIND_WORD[o.kind]}</span>
          {#if !compact && o.focus}<span class="focus">{short(o.focus)}</span>{/if}
          <span class="acts">
            {#if o.donate}<a class="give" href={o.donate} rel="noopener">Give on their site</a>{/if}
            {#if o.website && o.website !== o.donate}<a href={o.website} rel="noopener">Website</a
              >{/if}
          </span>
        </li>
      {/each}
    </ul>
  {/each}
  <p class="fine">
    Gifts go straight to each organization; this atlas takes nothing. Listing is not endorsement:
    <a href={`${base}/support/policy/`}>how organizations are listed</a>.
  </p>
</section>

<style>
  .support {
    margin: 48px 0 0;
    padding: 30px;
    border: 1px solid var(--rule);
    border-radius: 16px;
    background: var(--sheet);
  }
  h2 {
    font-family: var(--sans);
    font-size: var(--s3);
    letter-spacing: -0.035em;
    margin: 0 0 16px;
  }
  .compact {
    padding: 20px;
    margin-top: 24px;
  }
  .compact h2 {
    font-size: var(--s1);
  }
  h3 {
    font-size: var(--s-1);
    font-weight: 400;
    color: var(--ink-2);
    margin: 28px 0 12px;
  }
  .lead {
    margin: 0 0 12px;
    font-size: var(--s-1);
    color: var(--ink-2);
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .today {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    font-size: var(--s-1);
  }
  .orgs {
    display: grid;
    gap: 12px;
  }
  .orgs li {
    display: grid;
    gap: 7px;
    padding: 20px;
    border: 1px solid var(--rule);
    border-radius: 10px;
    background: var(--ground);
  }
  .name {
    font-size: var(--s1);
    line-height: 1.25;
    letter-spacing: -0.02em;
  }
  .name a {
    color: var(--ink);
    text-decoration: none;
  }
  .name a:hover {
    color: var(--moss);
    text-decoration: underline;
  }
  .kind {
    font-size: var(--s-2);
    color: var(--moss);
  }
  .focus {
    font-size: var(--s-1);
    color: var(--ink-2);
  }
  .acts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    font-size: var(--s-1);
    margin-top: 8px;
  }
  .acts a {
    min-height: 28px;
    display: inline-flex;
    align-items: center;
  }
  .give {
    font-weight: 600;
    color: var(--moss);
  }
  .fine {
    font-size: var(--s-2);
    color: var(--ink-2);
    margin: 24px 0 0;
  }
  .compact .name {
    font-size: var(--s0);
  }
  .compact .orgs li {
    padding: 14px;
  }
  @media (max-width: 600px) {
    .support {
      padding: 20px;
    }
  }
</style>
