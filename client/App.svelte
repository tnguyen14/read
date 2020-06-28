<script>
  import Form from './Form.svelte';
  import Articles from './Articles.svelte';
  import { user } from './stores.js';
  import { getSession } from '@tridnguyen/auth';

  function handleVisibilityChange() {
    if (!document.hidden) {
      const session = getSession();
      user.set(session || {});
    }
  }
</script>

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
  .save {
    background-color: #fff;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.16),
      0px 0px 5px 0px rgba(0, 0, 0, 0.23);
    border-radius: 0 0 3px 3px;
    margin: .5rem auto;
  }
  @media (min-width: 42.5em) {
    .save {
      margin: 2rem auto;
    }
  }
</style>

<svelte:window on:visibilitychange={handleVisibilityChange}/>

<main>
  <div class="save">
    <h1>Read</h1>
    {#if $user.profile}
      <Form />
    {/if}
  </div>
  <Articles />
</main>
