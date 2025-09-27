<script lang="ts">
  import Preview from "$lib/components/Preview.svelte";

  let size = $state(3);
</script>

<div>
  <main>
    <Preview {size} />
  </main>

  <aside>
    <label>
      <span>WASM:</span>
      <input type="file" />
    </label>
    <label>
      <span>Size:</span>
      <input type="number" bind:value={size} min="0" step="1" />
    </label>
  </aside>
</div>

<style>
  div {
    width: 100cqw;
    height: 100cqh;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    main {
      container-type: size;
      flex-grow: 1;
    }
  }
</style>
