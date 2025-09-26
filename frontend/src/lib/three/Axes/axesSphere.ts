import { Color, type ColorRepresentation, Mesh, MeshBasicMaterial, SphereGeometry } from "three";

const materialsCache = new Map<number, MeshBasicMaterial>();
const geometry = new SphereGeometry(0.0625, 8, 4);

export function createAxesSphere(color: ColorRepresentation): Mesh<SphereGeometry, MeshBasicMaterial> {
  const material = getMaterial(color);
  return new Mesh(geometry, material);
}

function getMaterial(color: ColorRepresentation): MeshBasicMaterial {
  const hex = new Color(color).getHex();

  const cachedMaterial = materialsCache.get(hex);
  if (cachedMaterial != null) {
    return cachedMaterial;
  }

  const material = new MeshBasicMaterial({ color, toneMapped: false });
  materialsCache.set(hex, material);
  return material;
}
