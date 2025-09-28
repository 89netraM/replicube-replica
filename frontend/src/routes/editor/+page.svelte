<script lang="ts">
  import Editor from "$lib/components/Editor.svelte";
  import Preview from "$lib/components/Preview.svelte";
  import { JsWorker } from "$lib/jsWorker";
  import type { VoxelCallback } from "$lib/three/VoxelCallback";

  let javascript = $state(`function render(x, y, z) {
  return x + y + z;
}
`);
  let voxelCallback: VoxelCallback | null = $state(null);

  $effect(() => {
    const jsWorker = JsWorker.create(javascript);
    voxelCallback = jsWorker.invokeRenderingFunction;
    return () => jsWorker.dispose();
  });
</script>

<div>
  <main>
    <Editor bind:text={javascript} />
  </main>
  <aside>
    <Preview {voxelCallback} />
  </aside>
</div>

<style>
  div {
    display: grid;
    height: 99.5cqh;
    width: 100cqw;
    grid-template-areas: "editor preview";
    grid-template-columns: 1fr 1fr;

    main {
      container-type: size;
      grid-area: editor;
    }

    aside {
      container-type: size;
      grid-area: preview;
    }
  }
</style>
