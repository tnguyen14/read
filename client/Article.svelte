<script>
  import { createEventDispatcher } from 'svelte';
  import { user } from './stores.js';

  const dispatch = createEventDispatcher();

  export let article;
  let title = 'Click twice to delete article';
  let deleteClickedOnce = false;
  async function deleteArticle() {
    if (!article || !article.id) {
      console.error('No article to be deleted');
      return;
    }
    if (!deleteClickedOnce) {
      deleteClickedOnce = true;
      title = 'Click again to delete article';
      return;
    }
    await fetch(`${API_URL}/${COLLECTION}/articles/${article.id}`, {
      method: 'DELETE'
    });
    dispatch('article:deleted', {
      id: article.id
    });
  }
</script>

<div class="article">
  {#if $user.profile}
    <button
      type="button"
      class="article-remove {deleteClickedOnce ? 'confirm' : ''}"
      {title}
      on:click={deleteArticle}
      aria-label="remove article"
      data-confirm="false">
      <i class="material-icons">delete</i>
    </button>
  {/if}
  <h3 class="title">
    <a href={article.link}>{article.title}</a>
  </h3>
  <div class="content">
    <p>{article.description}</p>
  </div>
</div>

<style>
  .article {
    background-color: #fff;
    border: 1px solid var(--divider-color);
    flex-basis: 100%;
    height: 15rem;
    margin: 1rem 0;
    padding: 1em 1rem;
    position: relative;
  }
  @media (min-width: 37.5em) {
    .article {
      flex-basis: 45%;
    }
  }
  @media (min-width: 65em) {
    .article {
      flex-basis: 30%;
    }
  }
  .title {
    font-weight: 600;
    font-size: 0.9em;
    line-height: 1.4;
    margin: 0 0 0.5em 0;
    width: calc(100% - 2rem); /* 2rem to accommodate delete icon */
  }
  .title a {
    color: var(--primary-color-dark);
  }
  .title a:hover {
    color: var(--accent-color);
  }
  .article-remove {
    background-color: transparent;
    border: none;
    cursor: pointer;
    opacity: 0.2;
    position: absolute;
    top: 0;
    right: 0;
  }
  .article-remove.confirm {
    color: red;
  }
  .article:hover .article-remove {
    opacity: 0.6;
  }
  .article:hover .article-remove:hover {
    opacity: 1;
  }
  .content {
    height: 10rem;
    overflow: auto;
  }
  .content p {
    margin: 0;
  }
</style>
