<script>
  import { onMount } from 'svelte';
  import { articles } from './stores.js';
  let url, title, description;
  let isRetrieving = false;
  async function extract() {
    if (isRetrieving) {
      console.log('already being retrieved');
      return;
    }
    isRetrieving = true;
    title = description = 'Retrieving...';
    ({title, description} = await fetch(
      `${THIRDPARTY_API_URL}/embedly?url=${encodeURIComponent(url)}`)
      .then(r => r.json()))
    if (!title) {
      title = 'Error - no title found';
    }
    // allow description to be set manually
    if (!description) {
      description = '';
    }
    isRetrieving = false;
  }
  $: isSubmittable = !isRetrieving && (
    !!url && !!title
  )

  async function addArticle(e) {
    if (!isSubmittable) {
      return;
    }
    e.preventDefault();
    const newArticle = {
      link: url,
      title,
      description
    };
    const resp = await fetch(`${API_URL}/${COLLECTION}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newArticle)
    }).then(r => r.json())
    articles.update(n => {
      n.unshift({
        ...newArticle,
        id: resp.id
      });
      return n;
    });
    // reset
    url = '';
    title = undefined;
    description = undefined;
  }
  async function paste() {
    if (!navigator.clipboard.readText) {
      return;
    }
    const clipText = await navigator.clipboard.readText();
    url = clipText;
  }
</script>

<form class="clearfix">
  <h2 class="title">Save an article</h2>
  <div class="field">
    <label for="link">Link URL</label>
    <button class="input-action before" type="button" title="Paste from clipboard" on:click={paste}>
      <i class="material-icons">file_copy</i>
    </button>
    <input type="url" class="link"
      placeholder="https://coolstuff.com"
      id="link" name="link" bind:value={url}
      on:change={extract}/>
    <button class="input-action after" type="button" title="Retrieve"
      disabled={isRetrieving}
      on:click={extract}>
      <i class="material-icons">get_app</i>
    </button>
  </div>
  <div class="field {title != undefined ? '' : 'inactive'}">
    <label for="title">Title</label>
    <input name="title" type="text" id="title" bind:value={title}/>
  </div>
  <div class="field {description != undefined ? '' : 'inactive'}">
    <label for="description">Description</label>
    <textarea name="description" id="description" bind:value={description}></textarea>
  </div>
  <input class="save-article" type="submit" disabled={!isSubmittable}
         on:click={addArticle} value="Save" />
</form>

<style>
  form {
    background-color: #fff;
    padding: 1em;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.16),
      0px 0px 5px 0px rgba(0, 0, 0, 0.23);
    border-radius: 0 0 3px 3px;
    margin: .5rem auto;
    width: 100%;
  }
  @media (min-width: 37.5em) {
    form {
      padding: 2em;
      margin: 2rem auto;
      width: 80%;
    }
  }
  .title {
    font-weight: 300;
    margin: 0;
  }
  .field {
    display: block;
    margin: 2em 0;
  }
  label {
    display: block;
    padding: 1em 0;
  }
  @media (min-width: 37.5em) {
    label {
      float: left;
      width: 25%;
      padding: 1em;
    }
  }
  input,
  textarea {
    padding: 1em;
    vertical-align: middle;
    width: 100%;
  }
  input.link {
    width: calc(100% - 5.6rem);
  }
  @media (min-width: 37.5em) {
    input,
    textarea {
      width: 75%;
    }
    input.link {
      width: calc(75% - 5.6rem);
    }
  }
  .input-action {
    background-color: var(--divider-color);
    padding: 5px;
    width: 2.8rem;
    height: 2.8rem;
  }
  textarea {
    height: 7em;
  }
  button,
  [type='submit']{
    width: auto;
  }
  .input-action.before {
    float: left;
  }
  .input-action.after,
  .save-article {
    float: right;
  }
  .inactive {
    display: none;
  }
  input:disabled {
    background-color: var(--divider-color);
    cursor: auto;
  }
</style>
