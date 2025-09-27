import { ArrowHelper, Group, Vector3, type ColorRepresentation } from "three";
import { createAxesSphere } from "./axesSphere";

export class AxesArrow extends ArrowHelper {
  private readonly dir: Vector3;
  private readonly color: ColorRepresentation;
  private readonly margin: number;
  private readonly spheres: Group = new Group();

  public constructor(dir: Vector3, length: number, color: ColorRepresentation, margin: number = 0.25) {
    super(
      dir,
      dir.clone().multiplyScalar(-(length + 0.5 + margin)),
      (length + 0.5 + margin) * 2,
      color,
      margin,
      margin,
    );
    this.dir = dir;
    this.color = color;
    this.margin = margin;

    this.add(this.spheres);
    this.updateSpheres(length);
  }

  public setSize(size: number) {
    this.position.copy(this.dir.clone().multiplyScalar(-(size + 0.5 + this.margin)));
    this.setLength((size + 0.5 + this.margin) * 2, this.margin, this.margin);
    this.updateSpheres(size);
  }

  private updateSpheres(length: number) {
    this.spheres.clear();

    for (let i = 0; i <= length * 2; i++) {
      if (i === length) {
        continue;
      }
      const sphere = createAxesSphere(this.color);
      sphere.position.set(0, this.margin + 0.5 + i, 0);
      this.spheres.add(sphere);
    }
  }
}
