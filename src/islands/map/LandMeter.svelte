<script lang="ts">
  // Cumulative land recorded as ceded, stacked by how it was taken, with a marker at the current year.
  // An estimate from Royce's shapes (overlaps counted once); the text below says so.
  import { HOW_ORDER, HOW_LABEL, type How } from './how';

  let {
    years,
    total,
    byHow,
    year,
    label = 'All nations',
  }: {
    years: number[];
    total: number[];
    byHow: Record<How, number[]>;
    year: number;
    label?: string;
  } = $props();

  const W = 320;
  const H = 96;
  const max = $derived(Math.max(1, ...total));
  const x = (i: number) => (i / (years.length - 1)) * W;
  const y = (v: number) => H - (v / max) * H;
  const idx = $derived(
    Math.max(
      0,
      Math.min(years.length - 1, years.indexOf(Math.min(year, years[years.length - 1]!))),
    ),
  );

  // stacked bands, bottom to top in legend order
  const bands = $derived.by(() => {
    const out: { how: How; d: string }[] = [];
    const base = years.map(() => 0);
    for (const h of HOW_ORDER) {
      const top = years.map((_, i) => base[i]! + (byHow[h]?.[i] ?? 0));
      if (top.every((v, i) => v === base[i])) continue;
      const upper = top.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
      const lower = base
        .map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`)
        .reverse()
        .join(' ');
      out.push({ how: h, d: `M${upper} L${lower} Z` });
      for (let i = 0; i < base.length; i++) base[i] = top[i]!;
    }
    return out;
  });

  const fmt = (acres: number) =>
    acres >= 1e9
      ? `${(acres / 1e9).toFixed(2)} billion`
      : acres >= 1e6
        ? `${Math.round(acres / 1e6)} million`
        : `${Math.round(acres / 1e3)} thousand`;
  const now = $derived(total[idx] ?? 0);
  const parts = $derived(
    HOW_ORDER.map((h) => ({ h, v: byHow[h]?.[idx] ?? 0 })).filter((p) => p.v > 0),
  );
</script>

<figure class="meter">
  <figcaption>
    <span class="who">{label}</span>
    <span class="big">About {fmt(now)} acres</span>
    <span class="sub"
      >recorded as ceded by the end of {Math.min(year, years[years.length - 1]!)}</span
    >
  </figcaption>
  <svg
    viewBox={`0 0 ${W} ${H}`}
    role="img"
    aria-label={`Land recorded as ceded over time, ${label.toLowerCase()}. By ${Math.min(year, 1894)}: about ${fmt(now)} acres.`}
    preserveAspectRatio="none"
  >
    {#each bands as b (b.how)}
      <path d={b.d} style={`fill: var(--how-${b.how})`} opacity="0.85"></path>
    {/each}
    <line x1={x(idx)} x2={x(idx)} y1="0" y2={H} class="cursor"></line>
  </svg>
  <div class="axis" aria-hidden="true">
    <span>{years[0]}</span><span>{years[years.length - 1]}</span>
  </div>
  <ul class="parts">
    {#each parts as p (p.h)}
      <li>
        <span class="sw" style={`background: var(--how-${p.h})`}></span>{HOW_LABEL[p.h]}<span
          class="v">{fmt(p.v)}</span
        >
      </li>
    {/each}
  </ul>
  <p class="note">
    Estimate from Royce’s maps; overlapping cessions counted once. Not a survey or legal measure.
  </p>
</figure>

<style>
  .meter {
    margin: var(--space-5) 0 0;
  }
  figcaption {
    display: grid;
    gap: 2px;
    margin-bottom: var(--space-2);
  }
  .who {
    font-family: var(--sans);
    font-size: var(--s-2);
    color: var(--ink-3);
  }
  .big {
    font-family: var(--serif);
    font-size: var(--s2);
    line-height: 1.15;
  }
  .sub {
    font-family: var(--sans);
    font-size: var(--s-1);
    color: var(--ink-2);
  }
  svg {
    width: 100%;
    height: 96px;
    display: block;
    background: color-mix(in srgb, var(--held) 14%, transparent);
  }
  .cursor {
    stroke: var(--ink);
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
  }
  .axis {
    display: flex;
    justify-content: space-between;
    font-family: var(--sans);
    font-size: var(--s-2);
    color: var(--ink-3);
  }
  .parts {
    list-style: none;
    padding: 0;
    margin: var(--space-3) 0 0;
    font-family: var(--sans);
    font-size: var(--s-1);
  }
  .parts li {
    display: grid;
    grid-template-columns: 1rem 1fr auto;
    gap: var(--space-2);
    align-items: center;
    padding: 2px 0;
  }
  .sw {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 1px;
  }
  .v {
    color: var(--ink-2);
    font-variant-numeric: lining-nums tabular-nums;
  }
  .note {
    font-family: var(--sans);
    font-size: var(--s-2);
    color: var(--ink-3);
    margin: var(--space-2) 0 0;
  }
</style>
