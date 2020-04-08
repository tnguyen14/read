<script>
  let url;
  const baseUrl = 'https://read.cloud.tridnguyen.com';
  async function extract() {
    const resp = await fetch(`${baseUrl}/extract?url=${encodeURIComponent(url)}`)
      .then(r => r.json())
    console.log(resp);
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
  .field label {
    display: inline-block;
    width: 25%;
  }
  .field input,
  .field textarea {
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
