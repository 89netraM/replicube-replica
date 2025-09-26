<script lang="ts">
  import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import { onDestroy, onMount } from "svelte";
  import { Axes } from "$lib/three/Axes";

  let { size = 3 }: { size?: number } = $props();

  let canvas: HTMLCanvasElement;
  let renderer: WebGLRenderer;
  let camera: PerspectiveCamera;
  let controls: OrbitControls;
  let scene: Scene;
  let axes: Axes;

  let canvasSizeObserver: ResizeObserver;

  onMount(() => {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.x = camera.position.y = camera.position.z = getViewingDistance(size) * 2;
    updateRenderSize();
    canvasSizeObserver = new ResizeObserver(updateRenderSize);
    canvasSizeObserver.observe(canvas);

    controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableDamping = true;
    updateViewingDistances(size);

    scene = new Scene();
    scene.add((axes = new Axes(size)));

    renderer.setAnimationLoop(animate);
  });

  $effect(() => {
    updateViewingDistances(size);
    axes.setSize(size);
  });

  function updateViewingDistances(size: number) {
    const viewingDistance = getViewingDistance(size);
    controls.minDistance = viewingDistance + 0.2;
    controls.maxDistance = viewingDistance * 4;
  }
  function getViewingDistance(size: number): number {
    const viewingSize = Math.max(size, 1);
    return new Vector3(viewingSize, viewingSize, viewingSize).length();
  }

  function updateRenderSize() {
    const canvasSize = canvas.getBoundingClientRect();
    renderer.setSize(canvasSize.width, canvasSize.height, false);

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();
  }

  function animate() {
    controls.update();
    renderer.render(scene, camera);
  }

  onDestroy(() => {
    canvasSizeObserver?.disconnect();
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    width: 100cqw;
    height: 100cqh;
  }
</style>
