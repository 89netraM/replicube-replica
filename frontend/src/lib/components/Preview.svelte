<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { VoxelRendering } from "$lib/three/VoxelRendering";

  let { size = 3 }: { size?: number } = $props();

  let canvas: HTMLCanvasElement;
  let preview: VoxelRendering;
  let canvasSizeObserver: ResizeObserver;

  onMount(() => {
    preview = new VoxelRendering(canvas, size);

    canvasSizeObserver = new ResizeObserver(onCanvasResize);
    canvasSizeObserver.observe(canvas);

    preview.startAnimationLoop();
  });

  $effect(() => {
    preview.setSize(size);
  });

  function onCanvasResize() {
    preview.updateRenderSize();
  }

  onDestroy(() => {
    canvasSizeObserver?.disconnect();
    preview?.dispose();
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    width: 100cqw;
    height: 100cqh;
  }
</style>
