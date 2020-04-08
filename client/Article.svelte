<script>
  export let article;
</script>

<div class="article">
	<button type="button" class="article-remove" aria-label="remove article" data-confirm="false">
		<i class="material-icons">delete</i>
	</button>
    <h3 class="title"><a href="{article.link}">
      {article.title}</a></h3>
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
    opacity: 0;
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .article-remove.confirm {
    color: red;
  }
  .article:hover .article-remove {
    opacity: 0.4;
  }
  .article:hover .article-remove:hover {
    opacity: 1;
  }
  .article .content {
    height: calc(100% - 1.26em - 0.45em);
    overflow: scroll;
  }
  .content p {
    margin: 0;
  }
</style>
