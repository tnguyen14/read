<script>
  import { onMount } from 'svelte';
  import { articles } from './stores.js';
  import Article from './Article.svelte';
  const baseUrl = 'https://read.cloud.tridnguyen.com';

  onMount(async () => {
    const resp = await fetch(`${baseUrl}/tri/articles`).then((r) => r.json());
    articles.update(n => n.concat(resp));
  });
</script>

<style>
  .articles {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 1rem;
  }
</style>

{#if $articles}
  <div class="articles">
    {#each $articles as article}
      <Article {article} />
    {/each}
  </div>
{/if}
