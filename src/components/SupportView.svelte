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
    margin: var(--space-6) 0 0;
    padding: var(--space-4) var(--space-4) var(--space-3);
    background: color-mix(in srgb, var(--held) 10%, var(--sheet));
    border-left: 4px solid var(--held);
  }
  h2 {
    font-family: var(--serif);
    font-size: var(--s2);
    margin: 0 0 var(--space-2);
  }
  .compact h2 {
    font-size: var(--s1);
  }
  h3 {
    font-size: var(--s-1);
    font-weight: 600;
    color: var(--ink-2);
    margin: var(--space-4) 0 var(--space-1);
  }
  .lead {
    margin: 0 0 var(--space-1);
    font-size: var(--s-1);
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .today {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-4);
    font-size: var(--s0);
  }
  .orgs li {
    display: grid;
    gap: 1px;
    padding: var(--space-2) 0;
    border-top: 1px solid color-mix(in srgb, var(--held) 30%, transparent);
  }
  .name {
    font-size: var(--s0);
    font-weight: 600;
  }
  .kind,
  .focus {
    font-size: var(--s-2);
    color: var(--ink-2);
  }
  .acts {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-4);
    font-size: var(--s-1);
  }
  .give {
    font-weight: 600;
    color: var(--moss);
  }
  .fine {
    font-size: var(--s-2);
    color: var(--ink-2);
    margin: var(--space-3) 0 0;
  }
</style>
