<script lang="ts">
  // "Legal status today" panel (G2 s.7). Always shown with the honored-through view. It is filled
  // from the data: what the record says happened to the land lost before the cut (K1 land status),
  // and, for a selected area, its status and documented defects with their evidence labels.
  // Plain-language categories; it never says what is "rightfully" anyone's.
  import {
    EVIDENCE_CLASS,
    FLAG_LABEL,
    LS_TO_CLASS,
    NEVER_GIVEN,
    STATUS_LABEL,
    STATUS_ORDER,
    statusVar,
    type LandStatus,
  } from './landStatusStyle';

  let {
    base = '',
    cut,
    counts = {},
    selected = null,
  }: {
    base?: string;
    cut: number;
    counts?: Partial<Record<LandStatus, number>>;
    selected?: {
      label: string;
      status: LandStatus;
      flags: { flag: string; evidence: string; evidence_display: string }[];
    } | null;
  } = $props();

  const lost = $derived(
    STATUS_ORDER.filter((s) => (counts[s] ?? 0) > 0).map((s) => ({ s, n: counts[s] ?? 0 })),
  );
  // lost without a cession: these keep their color in the honored view (NEVER_GIVEN)
  const unlawful = $derived(
    lost.filter((x) => NEVER_GIVEN.has(LS_TO_CLASS[x.s])).reduce((a, x) => a + x.n, 0),
  );

  const rows: [string, string][] = [
    [
      'Reservation boundaries intact',
      'Congress never clearly reduced them. McGirt v. Oklahoma (2020) held that only Congress can diminish a reservation.',
    ],
    [
      'Diminished or disestablished',
      'Congress clearly reduced or ended a reservation, under the test in Solem v. Bartlett (1984).',
    ],
    [
      'Title declared extinguished by a money award',
      'The Indian Claims Commission paid money at an old valuation and the claim to the land ended, even where the nation refused it (United States v. Dann, 1985).',
    ],
    [
      'A taking recognized, land not returned',
      'Courts found the land was taken and ordered payment, as in United States v. Sioux Nation (1980); the Sioux Nation has refused the money.',
    ],
    [
      'Barriers to regaining authority over repurchased land',
      'City of Sherrill v. Oneida Indian Nation (2005) pointed to trust acquisition instead.',
    ],
    [
      'Treaty rights still enforceable',
      'Hunting, fishing and other reserved rights continue, as in Herrera v. Wyoming (2019) and the Pacific Northwest fishing cases.',
    ],
    [
      'Returned',
      'Land restored by Congress, a state, or purchase, such as Blue Lake (1970) and the Yurok Blue Creek lands (2025).',
    ],
    ['In litigation or negotiation now', 'Shown with an as-of date, because it changes.'],
  ];
</script>

<section class="legal sans" aria-labelledby="legal-today">
  <h2 id="legal-today">Legal status today</h2>
  <p>
    This view asks what had already been promised by {cut}. It is a ledger, not a verdict, and it is
    not a legal claim.
  </p>
  {#if lost.length}
    <h3>Land areas the record shows lost by {cut}</h3>
    <ul class="counts">
      {#each lost as x (x.s)}
        <li>
          <span class="sw" style={`background: var(${statusVar(x.s)})`}></span>{STATUS_LABEL[x.s]}
          <span class="n">{x.n}</span>
        </li>
      {/each}
    </ul>
    {#if unlawful}
      <p class="small">
        {unlawful} of them were taken by an act, an order, a treaty never ratified, or with no instrument:
        no cession is on the record, so the map keeps their own color instead of greying them out.
      </p>
    {/if}
  {/if}
  {#if selected}
    <h3>{selected.label}</h3>
    <p>
      <span class="sw" style={`background: var(${statusVar(selected.status)})`}
      ></span>{STATUS_LABEL[selected.status]}.
    </p>
    {#if selected.flags.length}
      <ul class="flags">
        {#each selected.flags as f (f.flag)}
          <li>
            <span class={`badge ${EVIDENCE_CLASS[f.evidence] ?? ''}`}>{f.evidence_display}</span>
            {FLAG_LABEL[f.flag] ?? f.flag}
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
  <details>
    <summary>What happened to land afterward</summary>
    <dl>
      {#each rows as [t, d] (t)}
        <dt>{t}</dt>
        <dd>{d}</dd>
      {/each}
    </dl>
  </details>
  <p class="small">
    Summary of legal history for learning; not legal advice. Awaiting review by a federal Indian law
    reviewer.
    <a href={`${base}/methods/honored-through/`}>How this view works</a>.
  </p>
</section>

<style>
  .legal {
    margin-top: var(--space-5);
    padding: var(--space-4);
    background: var(--sheet);
    border-left: 3px solid var(--moss);
    font-size: var(--s-1);
  }
  h2 {
    font-size: var(--s1);
    margin: 0 0 var(--space-3);
    font-family: var(--serif);
  }
  h3 {
    font-size: var(--s-1);
    margin: var(--space-3) 0 var(--space-2);
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--space-2);
  }
  li {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
    padding: 2px 0;
  }
  .n {
    margin-left: auto;
    color: var(--ink-2);
    font-variant-numeric: lining-nums tabular-nums;
  }
  .sw {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 1px;
    flex: none;
    margin-right: var(--space-2);
  }
  .badge {
    font-size: var(--s-2);
    padding: 1px 7px;
    border-radius: 20px;
    border: 1px solid var(--rule-strong);
    background: var(--sheet-2);
    white-space: nowrap;
  }
  .badge.ev-primary {
    background: var(--ink);
    color: var(--sheet);
  }
  .badge.ev-scholarly {
    background: var(--lichen);
  }
  .badge.ev-reported {
    border-style: dashed;
    background: var(--sheet);
  }
  .badge.ev-disputed {
    background: var(--ochre);
  }
  summary {
    cursor: pointer;
    color: var(--moss);
    margin-top: var(--space-3);
  }
  dl {
    margin: var(--space-2) 0 var(--space-3);
  }
  dt {
    font-weight: 600;
    margin-top: var(--space-2);
  }
  dd {
    margin: 0;
    color: var(--ink-2);
  }
  .small {
    font-size: var(--s-2);
    color: var(--ink-2);
  }
</style>
