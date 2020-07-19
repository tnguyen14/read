<script>
  import Form from './Form.svelte';
  import Articles from './Articles.svelte';
  import { user } from './stores.js';
  /* import history from 'history/browser'; */
  import { getSession, deleteSession, createAuth } from '@tridnguyen/auth';

  const auth = createAuth();

  function getUserSession() {
    const session = getSession();
    user.set(session || {});
  }

  function handleVisibilityChange() {
    if (!document.hidden) {
      getUserSession();
    }
  }

  function login() {
    auth.silentAuth();
  }

  function logout() {
    deleteSession();
    getUserSession();
  }

  if (window.location.hash.startsWith('#access_token')) {
    auth.handleCallback((err) => {
      if (err) {
        console.error(err);
        return;
      }
      /*
      can't use history module yet due to
      https://github.com/ReactTraining/history/issues/821
      */
      /* history.replace(location.pathname); */
      history.replaceState(null, '', location.pathname);
      getUserSession();
    });
  }

  getUserSession();
</script>

<svelte:window on:visibilitychange={handleVisibilityChange} />

<main>
  <h1>Reads</h1>
  {#if $user.profile}
    <div class="auth">
      <button type="button" class="logout" on:click={logout}>Logout</button>
    </div>
    <Form />
  {:else}
    <div class="auth">
      <button type="button" class="login" on:click={login}>Login</button>
    </div>
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
    margin: 1rem auto 0;
    padding: 0.5rem 1rem;
    width: 100%;
  }
  @media (min-width: 37.5em) {
    h1 {
      margin: 2rem auto 0;
      padding: 0.75rem 2rem;
      width: 80%;
    }
  }

  .auth {
    text-align: right;
    height: 0; /* hide this div as it's unnecessary */
  }
  .auth button {
    background-color: var(--primary-color-dark);
    color: var(--primary-color-text);
    margin-right: 2rem;
    /* push the button higher up in the banner */
    transform: translateY(-4rem);
  }
  @media (min-width: 37.5em) {
    .auth {
      margin: 0 auto;
      width: 80%;
    }
  }
</style>
