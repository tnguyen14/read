<script>
  import { onMount } from 'svelte';
  import Article from './Article.svelte';
  const baseUrl = 'https://read.cloud.tridnguyen.com';
  let articles;

  onMount(async () => {
    articles = await fetch(`${baseUrl}/tri/articles`)
      .then(r => r.json())
  });
</script>

{#if articles}
  <div class="articles">
  {#each articles as article}
    <Article {article} />
  {/each}
  </div>
{/if}

<style>
  .articles {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 1rem;
  }
</style>
