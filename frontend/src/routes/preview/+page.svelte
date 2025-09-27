<script lang="ts">
  import Preview from "$lib/components/Preview.svelte";
  import type { VoxelCallback } from "$lib/three/VoxelCallback";

  let size = $state(3);
  // svelte-ignore state_referenced_locally
  let previewSize = $state(size);

  $effect(() => {
    if (!Number.isSafeInteger(size) || size < 0) {
      return;
    }
    previewSize = size;
  });

  let wasmFiles: FileList | null = $state(null);
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
    <Preview size={previewSize} {voxelCallback} />
  </main>

  <aside>
    <label>
      <input type="file" bind:files={wasmFiles} />
      <span>Upload WASM voxel renderer</span>
    </label>
    <label>
      <span>Size:</span>
      <input type="number" bind:value={size} min="0" step="1" required pattern="^[1-9]\d*$" />
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

    aside {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      gap: 1rem;
      padding: 0.5rem;

      label {
        input {
          &[type="file"] {
            display: none;

            + span {
              display: inline-block;
              background: #aaaaaa;
              border: 1px solid #000000;
              border-radius: 0.25rem;
              padding: 0.25rem 0.5rem;
              cursor: pointer;
              user-select: none;

              &:hover {
                background: #afafaf;
              }
              &:active {
                background: #999999;
              }
            }
          }

          &:invalid {
            border-color: #ff0000;
            outline-color: #ff0000;
          }
        }
      }
    }
  }
</style>
