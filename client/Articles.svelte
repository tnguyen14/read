<script>
  import { onMount } from 'svelte';
  import { articles } from './stores.js';
  import Article from './Article.svelte';

  onMount(async () => {
    const resp = await fetch(
      `${API_URL}/${COLLECTION}/articles`
    ).then((r) => r.json());
    articles.update(n => n.concat(resp));
  });

  function removeArticle(e) {
    const articleToDelete = e.detail.id;
    const deleteIndex = $articles.findIndex((a) => a.id == articleToDelete);
    articles.update(n => {
      n.splice(deleteIndex, 1);
      return n;
    });
  }
</script>

<style>
  .articles {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 1rem auto;
    width: 100%;
  }
  @media (min-width: 37.5em) {
    .articles {
      width: 80%;
    }
  }
</style>

{#if $articles}
  <div class="articles">
    {#each $articles as article}
      <Article {article} on:article:deleted={removeArticle} />
    {/each}
  </div>
{/if}
