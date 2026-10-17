<script lang="ts">
  import { relayFetch } from '../../lib/relay';
  // Native Land Digital lookup through our no-store relay (docs/release/nld-relay.md).
  // The browser never sees an API key, and nothing is saved. If the relay is not set up,
  // this falls back to a plain link to native-land.ca.
  let { relay = '', getCenter }: { relay?: string; getCenter: () => [number, number] | null } =
    $props();

  interface Feature {
    properties: { Name?: string; description?: string; Slug?: string };
  }
  let status = $state<'idle' | 'loading' | 'done' | 'unavailable' | 'error'>('idle');
  let results = $state<{ name: string; url: string | null; layer: string }[]>([]);
  let where = $state('');

  async function lookup() {
    const c = getCenter();
    if (!c || !relay) {
      status = 'unavailable';
      return;
    }
    status = 'loading';
    where = `${c[0].toFixed(2)}, ${c[1].toFixed(2)}`;
    try {
      const res = await relayFetch(
        relay,
        `/api/lookup?lat=${c[0]}&lng=${c[1]}&maps=territories,languages`,
      );
      if (res.status === 503 || res.status === 410 || res.status === 403) {
        status = 'unavailable';
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const body = (await res.json()) as Feature[] | { features?: Feature[] };
      const feats = Array.isArray(body) ? body : (body.features ?? []);
      results = feats
        .map((f) => ({
          name: f.properties?.Name ?? '',
          url: f.properties?.description?.startsWith('https://native-land.ca/')
            ? f.properties.description
            : null,
          layer: f.properties?.description?.includes('/languages/') ? 'language' : 'territory',
        }))
        .filter((r) => r.name);
      status = 'done';
    } catch {
      status = 'error';
    }
  }
</script>

<section class="nld sans" aria-labelledby="nld-title">
  <h2 id="nld-title">Whose land, in their maps</h2>
  <p>
    Native Land Digital, an Indigenous-led nonprofit, maps territories and languages as communities
    describe them. Look up the center of the map:
  </p>
  <button type="button" onclick={lookup} disabled={status === 'loading'}>
    {status === 'loading' ? 'Looking up…' : 'Look up this place'}
  </button>
  <div aria-live="polite">
    {#if status === 'done'}
      {#if results.length}
        <p class="small">Near {where}:</p>
        <ul>
          {#each results as r (r.name + r.layer)}
            <li>
              {#if r.url}<a href={r.url}>{r.name}</a>{:else}{r.name}{/if}
              <span class="kind">{r.layer}</span>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="small">Native Land Digital has no entry for this spot.</p>
      {/if}
    {:else if status === 'unavailable'}
      <p class="small">
        The live lookup is not switched on yet. Explore it directly at <a
          href="https://native-land.ca/">native-land.ca</a
        >.
      </p>
    {:else if status === 'error'}
      <p class="small">
        The lookup did not answer. Try again, or visit <a href="https://native-land.ca/"
          >native-land.ca</a
        >.
      </p>
    {/if}
  </div>
  <p class="credit">
    From <a href="https://native-land.ca/">Native Land Digital</a>, loaded live and not stored. Its
    maps do not represent official or legal boundaries, and they are separate from the federal
    record shown on this map.
  </p>
</section>

<style>
  .nld {
    margin-top: var(--space-6);
    padding-top: var(--space-4);
    border-top: 1px solid var(--rule);
    font-size: var(--s-1);
  }
  h2 {
    font-family: var(--serif);
    font-size: var(--s1);
    margin: 0 0 var(--space-2);
  }
  button {
    min-height: var(--tap);
    padding: 0 var(--space-4);
    background: var(--moss);
    color: var(--on-moss);
    border: 0;
    border-radius: var(--radius);
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.6;
  }
  ul {
    padding-left: 1.1em;
  }
  .kind,
  .credit,
  .small {
    font-size: var(--s-2);
    color: var(--ink-2);
  }
</style>
