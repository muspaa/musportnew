import { Vector3, MathUtils } from 'three';
const stageKinds = new Set(['room','hero','intro','journey','orbit','project','anime']);
export function isSceneKind(kind) { return stageKinds.has(kind); }

/** Perspective fit at the subject plane, in world units. */
export function fitDistance(width, height, aspect, fov) {
  const tangent = Math.tan(MathUtils.degToRad(fov / 2));
  return Math.max(height / (2 * tangent), width / (2 * tangent * Math.max(.01, aspect)));
}

/** A narrower viewport must fit immediately; moving closer can ease without cropping. */
export function settleFitDistance(previous, required, seconds) {
  return previous < required ? required : MathUtils.damp(previous, required, 6, Math.max(0, seconds));
}

/** Exact exponential integration, so release travel is independent of refresh rate. */
export function decaySpin(velocity, seconds, friction = 7) {
  const decay = Math.exp(-friction * Math.max(0, seconds));
  return { travel: velocity * (1 - decay) / friction, velocity: velocity * decay };
}

export function horizontalIntent(dx, dy, threshold = 8) {
  return Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy) * 1.15;
}

/** Native hit areas follow camera-space depth, not Euclidean camera distance. */
export function projectHit(worldPosition, camera, width, height, worldSize) {
  const projected = new Vector3().copy(worldPosition).project(camera);
  const depth = -new Vector3().copy(worldPosition).applyMatrix4(camera.matrixWorldInverse).z;
  const size = MathUtils.clamp(height * worldSize / (2 * Math.max(.01, depth) * Math.tan(MathUtils.degToRad(camera.fov / 2))), 34, 86);
  const x = (projected.x + 1) * width / 2;
  const y = (1 - projected.y) * height / 2;
  return {
    x, y, size, depth,
    visible: depth > camera.near && projected.z >= -1 && projected.z <= 1 && x + size / 2 > 0 && x - size / 2 < width && y + size / 2 > 0 && y - size / 2 < height
  };
}
