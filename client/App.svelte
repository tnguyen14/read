<script>
  import Form from './Form.svelte';
  import Articles from './Articles.svelte';
  import { user } from './stores.js';
  import { getSession } from '@tridnguyen/auth';

  function getUserSession() {
    const session = getSession();
    user.set(session || {});
  }

  function handleVisibilityChange() {
    if (!document.hidden) {
      getUserSession();
    }
  }

  getUserSession();
</script>

<svelte:window on:visibilitychange={handleVisibilityChange} />

<main>
  <h1>Read</h1>
  {#if $user.profile}
    <Form />
  {/if}
  <Articles />
</main>

<style>
  main:before {
    background-color: var(--primary-color);
    content: '';
    width: 100%;
    height: 10em;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  h1 {
    color: var(--primary-color-text);
    margin: 1rem auto;
    padding: 0.5rem 1rem;
    width: 100%;
  }
  @media (min-width: 37.5em) {
    h1 {
      margin: 2rem auto;
      padding: 0.75rem 2rem;
      width: 80%;
    }
  }
</style>
