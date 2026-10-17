<script lang="ts">
  import { relayFetch } from '../lib/relay';
  // One form for claims, corrections and removal requests. It posts to the private intake
  // (relay/api/claim), which files an issue in a private repository: contact details are never public.
  let {
    relay = '',
    kind: initialKind = 'claim',
    recordId = '',
    repo = 'https://github.com/omniharmonic/treaty-land-atlas',
  }: {
    relay?: string;
    kind?: string;
    recordId?: string;
    recordName?: string;
    repo?: string;
  } = $props();

  let kind = $state(initialKind);
  let nation = $state('');
  let role = $state('');
  let contact = $state('');
  let message = $state('');
  let record = $state(recordId);
  let website = $state('');
  let status = $state<'idle' | 'sending' | 'sent' | 'error' | 'offline'>('idle');
  let error = $state('');

  $effect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get('id')) record = p.get('id')!.slice(0, 120);
    if (p.get('record')) record = p.get('record')!.slice(0, 120);
    if (p.get('name') && !nation) nation = p.get('name')!.slice(0, 200);
    if (p.get('kind') && ['claim', 'correction', 'removal'].includes(p.get('kind')!))
      kind = p.get('kind')!;
  });

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    status = 'sending';
    error = '';
    try {
      const res = await relayFetch(relay, `/api/claim`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind, record_id: record, nation, role, contact, message, website }),
      });
      if (res.status === 503) {
        status = 'offline';
        return;
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        error = body.message ?? `The form could not be sent (error ${res.status}).`;
        status = 'error';
        return;
      }
      status = 'sent';
    } catch {
      status = 'offline';
    }
  }
  const issueUrl = $derived(
    `${repo}/issues/new?title=${encodeURIComponent(`${kind === 'correction' ? 'Correction' : 'Claim'}: ${record || nation}`)}&labels=${kind === 'correction' ? 'correction' : 'claim'}`,
  );
</script>

{#if status === 'sent'}
  <div class="done" role="status">
    <p>
      <strong>Received.</strong> We will reply to the contact you gave within a few business days.
    </p>
    {#if kind === 'removal'}
      <p>
        Removal requests are honored first: the page will be hidden at the next build while we talk.
      </p>
    {/if}
  </div>
{:else}
  <form class="sans" onsubmit={submit}>
    <fieldset>
      <legend>What would you like to do?</legend>
      <label
        ><input type="radio" bind:group={kind} value="claim" /> Claim this page for our nation (review
        it, add our account)</label
      >
      <label><input type="radio" bind:group={kind} value="correction" /> Correct something</label>
      <label><input type="radio" bind:group={kind} value="removal" /> Take this content down</label>
    </fieldset>
    <label
      >Nation or community you are writing for <input
        required
        bind:value={nation}
        maxlength="300"
        autocomplete="organization"
      /></label
    >
    <label>Your role or office (optional) <input bind:value={role} maxlength="300" /></label>
    <label
      >Email or phone, so we can reply <input
        required
        bind:value={contact}
        maxlength="300"
        autocomplete="email"
      /></label
    >
    <label
      >Page or record (optional) <input
        bind:value={record}
        maxlength="120"
        pattern="[A-Za-z0-9-]*"
      /></label
    >
    <label>Message <textarea rows="6" bind:value={message} maxlength="5000"></textarea></label>
    <label class="hp" aria-hidden="true"
      >Leave this empty <input tabindex="-1" autocomplete="off" bind:value={website} /></label
    >
    <p class="note">Your contact details go to a private inbox and are never published.</p>
    <button type="submit" disabled={status === 'sending'}
      >{status === 'sending'
        ? 'Sending…'
        : kind === 'removal'
          ? 'Send removal request'
          : 'Send'}</button
    >
    {#if status === 'error'}<p class="err" role="alert">{error}</p>{/if}
    {#if status === 'offline'}
      <p class="err" role="alert">
        The form is not connected yet. Please <a href={issueUrl}>open an issue on GitHub</a> instead (it
        is public; leave contact details out and we will reply there).
      </p>
    {/if}
  </form>
{/if}

<style>
  form {
    display: grid;
    gap: var(--space-4);
    max-width: 38rem;
  }
  fieldset {
    border: 0;
    padding: 0;
    margin: 0;
    display: grid;
    gap: var(--space-2);
  }
  legend {
    font-weight: 600;
    margin-bottom: var(--space-2);
  }
  label {
    display: grid;
    gap: var(--space-1);
    font-size: var(--s-1);
  }
  fieldset label {
    display: flex;
    gap: var(--space-2);
    align-items: center;
    min-height: 32px;
  }
  input:not([type='radio']),
  textarea {
    font: inherit;
    font-size: var(--s0);
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--rule-strong);
    border-radius: var(--radius);
    background: var(--sheet);
    color: var(--ink);
    min-height: var(--tap);
  }
  .hp {
    position: absolute;
    left: -9999px;
  }
  .note {
    font-size: var(--s-2);
    color: var(--ink-2);
    margin: 0;
  }
  button {
    justify-self: start;
    min-height: var(--tap);
    padding: 0 var(--space-5);
    background: var(--moss);
    color: var(--on-moss);
    border: 0;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: var(--s0);
  }
  .err {
    color: var(--warn);
  }
  .done {
    padding: var(--space-4);
    border-left: 3px solid var(--moss);
    background: var(--sheet);
  }
</style>
