import {
  BoxGeometry,
  Color,
  Mesh,
  MeshPhongMaterial,
  type ColorRepresentation,
  AnimationMixer,
  AnimationClip,
  VectorKeyframeTrack,
  LoopOnce,
} from "three";

const sizeLength = 0.95;

const materialsCache = new Map<number, MeshPhongMaterial>();
const geometry = new BoxGeometry(sizeLength, sizeLength, sizeLength);

export class Voxel extends Mesh {
  public constructor(color: ColorRepresentation, animationMixer?: AnimationMixer) {
    super(geometry, getMaterial(color));
    if (animationMixer == null) {
      return;
    }

    const action = animationMixer.clipAction(getRandomizedAnimationClip(), this);
    action.setLoop(LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
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

function getRandomizedAnimationClip(): AnimationClip {
  const delay = Math.random() * 0.1;
  const time = 0.3 + Math.random() * 0.1;
  const times = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const values = [0.01, 0.01, 0.01, 1.25, 1.25, 1.25, 0.85, 0.85, 0.85, 1.1, 1.1, 1.1, 0.98, 0.98, 0.98, 1.0, 1.0, 1.0];
  const track = new VectorKeyframeTrack(
    ".scale",
    times.map((t) => t * time + delay),
    values,
  );
  return new AnimationClip("bounce", time + delay, [track]);
}
