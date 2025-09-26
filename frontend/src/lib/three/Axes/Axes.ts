import { Group, Vector3 } from "three";
import { AxesArrow } from "./AxesArrow";
import { createAxesSphere } from "./axesSphere";

export class Axes extends Group {
  private xAxis: AxesArrow;
  private yAxis: AxesArrow;
  private zAxis: AxesArrow;

  public constructor(size: number) {
    super();

    this.add(createAxesSphere(0xffffff));

    this.add((this.xAxis = new AxesArrow(new Vector3(1, 0, 0), size, 0xff0000)));
    this.add((this.yAxis = new AxesArrow(new Vector3(0, 1, 0), size, 0x00ff00)));
    this.add((this.zAxis = new AxesArrow(new Vector3(0, 0, 1), size, 0x0000ff)));
  }

  public setSize(size: number) {
    this.xAxis.setSize(size);
    this.yAxis.setSize(size);
    this.zAxis.setSize(size);
  }
}
