import { Axes } from "./Axes";
import {
  AmbientLight,
  AnimationMixer,
  Clock,
  DirectionalLight,
  Group,
  Light,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  type ColorRepresentation,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { VoxelCallback } from "./VoxelCallback";
import { Voxel } from "./Voxel";

export class VoxelRendering {
  public readonly canvas: HTMLCanvasElement;
  public readonly renderer: WebGLRenderer;
  public readonly clock: Clock = new Clock();
  public readonly animationMixer: AnimationMixer;
  public readonly camera: PerspectiveCamera;
  public readonly lights: ReadonlyArray<Light>;
  public readonly controls: OrbitControls;

  #size: number;
  public get size(): number {
    return this.#size;
  }
  public set size(size: number) {
    this.#size = size;
    this.updateViewingDistances();
    this.axes.setSize(this.size);
    this.recreateVoxels();
  }

  private readonly scene: Scene;
  private readonly axes: Axes;

  private readonly voxels: Group = new Group();
  private voxelStateMap: ReadonlyMap<string, number> | null = null;
  #voxelCallback: VoxelCallback | null = null;
  public get voxelCallback(): VoxelCallback | null {
    return this.#voxelCallback;
  }
  public set voxelCallback(voxelCallback: VoxelCallback | null) {
    this.#voxelCallback = voxelCallback;
    this.recreateVoxels();
  }

  #pallette: Map<number, ColorRepresentation> = new Map([
    [1, 0xdfe9f5],
    [2, 0x697594],
    [3, 0x101517],
    [4, 0xf7aaa8],
    [5, 0x782c96],
    [6, 0xe83562],
    [7, 0xf2825c],
    [8, 0xffc76e],
    [9, 0x88c44d],
    [10, 0x3f9e59],
    [11, 0x373461],
    [12, 0x4854a8],
    [13, 0x7199d9],
    [14, 0x9e5252],
    [15, 0x4d2536],
  ]);
  public get pallette(): ReadonlyMap<number, ColorRepresentation> {
    return this.#pallette;
  }
  public set pallette(iterable: Iterable<readonly [number, ColorRepresentation]>) {
    this.#pallette = new Map(iterable);
  }

  public constructor(canvas: HTMLCanvasElement, size: number) {
    this.canvas = canvas;
    this.#size = size;

    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.x = this.camera.position.y = this.camera.position.z = this.getViewingDistance() * 1.5;
    this.updateRenderSize();

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.updateViewingDistances();

    this.scene = new Scene();

    this.axes = new Axes(size);
    this.scene.add(this.axes);

    this.lights = [new AmbientLight(0xffffff, 1), new DirectionalLight(0xffffff, 1), new DirectionalLight(0xffffff, 2)];
    this.lights[1].position.set(-5, -6, -7);
    this.lights[2].position.set(1, 2, 3);
    this.scene.add(...this.lights);

    this.scene.add(this.voxels);

    this.animationMixer = new AnimationMixer(this.voxels);

    this.animate = this.animate.bind(this);
  }

  private updateViewingDistances() {
    const viewingDistance = this.getViewingDistance();
    this.controls.minDistance = viewingDistance + 0.2;
    this.controls.maxDistance = viewingDistance * 4;
  }

  private getViewingDistance(): number {
    const viewingSize = Math.max(this.size, 1);
    return new Vector3(viewingSize, viewingSize, viewingSize).length();
  }

  public updateRenderSize() {
    const canvasSize = this.canvas.getBoundingClientRect();
    this.renderer.setSize(canvasSize.width, canvasSize.height, false);

    this.camera.aspect = canvasSize.width / canvasSize.height;
    this.camera.updateProjectionMatrix();
  }

  private recreateVoxels() {
    this.clearVoxels();

    const newMap = this.calculateVoxelStateMap();
    for (const [key, colorIndex] of newMap) {
      const color = this.pallette.get(colorIndex);
      if (color == null) {
        continue;
      }
      const vec = new Vector3(...key.split(";").map(parseFloat));
      const voxel = new Voxel(color, this.voxelStateMap?.get(key) !== colorIndex ? this.animationMixer : undefined);
      voxel.position.copy(vec);
      this.voxels.add(voxel);
    }
    this.voxelStateMap = newMap;
  }
  private calculateVoxelStateMap(): ReadonlyMap<string, number> {
    const map = new Map<string, number>();
    if (this.voxelCallback == null) {
      return map;
    }

    for (let x = -this.size; x <= this.size; x++) {
      for (let y = -this.size; y <= this.size; y++) {
        for (let z = -this.size; z <= this.size; z++) {
          const colorIndex = this.voxelCallback(x, y, z);
          map.set(`${x};${y};${z}`, colorIndex);
        }
      }
    }
    return map;
  }

  private clearVoxels() {
    this.animationMixer.stopAllAction();
    for (const voxel of this.voxels.children) {
      this.animationMixer.uncacheRoot(voxel);
    }
    this.voxels.clear();
  }

  public startAnimationLoop() {
    this.renderer.setAnimationLoop(this.animate);
  }

  private animate() {
    const deltaTime = this.clock.getDelta();

    this.controls.update();
    this.animationMixer.update(deltaTime);
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    this.renderer.dispose();
  }
}
