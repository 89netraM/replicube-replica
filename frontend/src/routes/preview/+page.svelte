<script lang="ts">
  import Preview from "$lib/components/Preview.svelte";
  import type { VoxelCallback } from "$lib/three/VoxelCallback";

  let wasmFiles: FileList | null = $state(null);
  let size = $state(3);
  let voxelCallback: VoxelCallback | null = $state(null);

  $effect(() => {
    if (wasmFiles == null || wasmFiles.length < 1) {
      voxelCallback = null;
      return;
    }
    const wasmFile = wasmFiles.item(0);
    if (wasmFile == null) {
      voxelCallback = null;
      return;
    }
    updateVoxelCallback(wasmFile);
  });

  async function updateVoxelCallback(wasmFile: File) {
    const wasm = await WebAssembly.instantiate(await wasmFile.arrayBuffer());
    const exports = wasm.instance.exports;
    if (typeof exports.render === "function") {
      voxelCallback = exports.render as VoxelCallback;
    } else {
      voxelCallback = null;
    }
  }
</script>

<div>
  <main>
    <Preview {size} {voxelCallback} />
  </main>

  <aside>
    <label>
      <span>WASM:</span>
      <input type="file" bind:files={wasmFiles} />
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
