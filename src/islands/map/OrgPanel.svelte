<script lang="ts">
  // The map's support panel: organizations connected to the selected cession or followed nation.
  import SupportView from '../../components/SupportView.svelte';
  import { supportFor, type SupportIndex } from '../../lib/support';

  let { base = '', nations }: { base?: string; nations: string[] } = $props();

  let ix = $state<SupportIndex | null>(null);
  $effect(() => {
    if (ix) return;
    fetch(`${base}/data/tables/support.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => (ix = j))
      .catch(() => {});
  });
  const result = $derived(
    ix ? supportFor(ix, { nations }, { today: 6, direct: 4, nearby: 3 }) : null,
  );
</script>

{#if ix && result}<SupportView {base} {ix} {result} compact />{/if}
