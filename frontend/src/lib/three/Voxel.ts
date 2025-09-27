import { BoxGeometry, Color, Mesh, MeshPhongMaterial, type ColorRepresentation } from "three";

const sizeLength = 0.95;

const materialsCache = new Map<number, MeshPhongMaterial>();
const geometry = new BoxGeometry(sizeLength, sizeLength, sizeLength);

export class Voxel extends Mesh {
  public constructor(color: ColorRepresentation) {
    super(geometry, getMaterial(color));
  }
}

function getMaterial(color: ColorRepresentation): MeshPhongMaterial {
  const hex = new Color(color).getHex();

  const cachedMaterial = materialsCache.get(hex);
  if (cachedMaterial != null) {
    return cachedMaterial;
  }

  const material = new MeshPhongMaterial({ color, toneMapped: false });
  materialsCache.set(hex, material);
  return material;
}
