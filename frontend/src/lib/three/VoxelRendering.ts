import { Axes } from "./Axes";
import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class VoxelRendering {
  public readonly canvas: HTMLCanvasElement;
  public readonly renderer: WebGLRenderer;
  public readonly camera: PerspectiveCamera;
  public readonly controls: OrbitControls;

  private readonly scene: Scene;
  private readonly axes: Axes;

  public constructor(canvas: HTMLCanvasElement, size: number) {
    this.canvas = canvas;
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.x =
      this.camera.position.y =
      this.camera.position.z =
        VoxelRendering.getViewingDistance(size) * 1.5;
    this.updateRenderSize();

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.updateViewingDistances(size);

    this.scene = new Scene();
    this.scene.add((this.axes = new Axes(size)));

    this.animate = this.animate.bind(this);
  }

  public setSize(size: number) {
    this.updateViewingDistances(size);
    this.axes.setSize(size);
  }

  private updateViewingDistances(size: number) {
    const viewingDistance = VoxelRendering.getViewingDistance(size);
    this.controls.minDistance = viewingDistance + 0.2;
    this.controls.maxDistance = viewingDistance * 4;
  }

  private static getViewingDistance(size: number): number {
    const viewingSize = Math.max(size, 1);
    return new Vector3(viewingSize, viewingSize, viewingSize).length();
  }

  public updateRenderSize() {
    const canvasSize = this.canvas.getBoundingClientRect();
    this.renderer.setSize(canvasSize.width, canvasSize.height, false);

    this.camera.aspect = canvasSize.width / canvasSize.height;
    this.camera.updateProjectionMatrix();
  }

  public startAnimationLoop() {
    this.renderer.setAnimationLoop(this.animate);
  }

  private animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    this.renderer.dispose();
  }
}
