attribute vec2 aCenter;

uniform float uTime;

varying vec2 vUv;

vec2 getRotatePivot2d(vec2 uv, float rotation, vec2 pivot) {
  return vec2(cos(rotation) * (uv.x - pivot.x) + sin(rotation) * (uv.y - pivot.y) + pivot.x, cos(rotation) * (uv.y - pivot.y) - sin(rotation) * (uv.x - pivot.x) + pivot.y);
}

void main() {

  vec2 newCenter = aCenter;
  vec4 modelCenter = modelMatrix * vec4(newCenter.x, 0.0, newCenter.y, 1.0);

  vec4 modelPosition = modelMatrix * vec4(position, 1.);
  modelPosition.xz += newCenter;

  float angleToCamera = atan(modelCenter.x - cameraPosition.x, modelCenter.z - cameraPosition.z);
  modelPosition.xz = getRotatePivot2d(modelPosition.xz, angleToCamera, modelCenter.xz);

  // modelPosition.xz += aCenter;

  vec4 modelViewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * modelViewPosition;
  // gl_Position = projectedPosition;
  csm_PositionRaw = projectedPosition;

  vUv = uv;
}
