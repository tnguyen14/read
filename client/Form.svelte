<script>
  let url, title, description;
  const baseUrl = 'https://read.cloud.tridnguyen.com';
  let isRetrieving = false;
  async function extract() {
    if (isRetrieving) {
      console.log('already being retrieved');
      return;
    }
    isRetrieving = true;
    title = description = 'Retrieving...';
   ({title, description}= await fetch(`${baseUrl}/extract?url=${encodeURIComponent(url)}`)
      .then(r => r.json()))
    isRetrieving = false;
  }
</script>

<form class="clearfix">
  <h2 class="title">Save an article</h2>
  <div class="field">
    <label for="link">Link URL</label>
    <input type="url" class="form-control"
      placeholder="https://coolstuff.com"
      id="link" name="link" bind:value={url}
		on:change={extract}/>
  </div>
  <div class="field {title ? '' : 'inactive'}">
    <label for="title">Title</label>
    <input name="title" type="text" id="title" bind:value={title}/>
  </div>
  <div class="field {description ? '' : 'inactive'}">
    <label for="description">Description</label>
    <textarea name="description" id="description" bind:value={description}></textarea>
  </div>
  <button type="submit">Save</button>
</form>

<style>
  form {
    padding: 1em;
  }
  @media (min-width: 37.5em) {
    form {
      padding: 2em;
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
    display: inline-block;
    width: 25%;
  }
  input,
  textarea {
    padding: 1em;
    vertical-align: middle;
    width: 74%; /* not sure why 75% push the text box down */
  }
  textarea {
    height: 7em;
  }
  button {
    float: right;
  }
  .inactive {
    display: none;
  }
</style>
