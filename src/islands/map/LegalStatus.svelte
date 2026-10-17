<script lang="ts">
  // "Legal status today" panel (G2 s.7). Always shown with the honored-through view.
  // Plain-language categories; it never says what is "rightfully" anyone's.
  let { base = '' }: { base?: string } = $props();
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
      'Title extinguished with a money award',
      'The Indian Claims Commission paid money and the claim to the land ended (United States v. Dann, 1985).',
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
    This view asks what had already been promised by a year. It is a ledger, not a verdict, and it
    is not a legal claim. What happened to each area afterward falls into categories like these:
  </p>
  <dl>
    {#each rows as [t, d] (t)}
      <dt>{t}</dt>
      <dd>{d}</dd>
    {/each}
  </dl>
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
  dl {
    margin: 0 0 var(--space-3);
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
