attribute vec2 aCenter;

uniform float uTime;
uniform sampler2D uNoiseTexture;

#include ../Includes/getWorldUV.glsl
#include ../Includes/getRotatePivot2d.glsl

void main() {

  vec2 newCenter = aCenter;
  vec4 modelCenter = modelMatrix * vec4(newCenter.x, 0.0, newCenter.y, 1.0);

  vec4 modelPosition = modelMatrix * vec4(position, 1.);
  modelPosition.xz += newCenter;

  vec2 worldUv = getWorldUV(modelPosition.xz);

  float noise = texture(uNoiseTexture, worldUv).r;

  float displacement = (sin(uTime * .002 + noise * 10.) * .25) * position.y;
  modelPosition.x += displacement;
  modelPosition.z += displacement;

  float angleToCamera = atan(modelCenter.x - cameraPosition.x, modelCenter.z - cameraPosition.z);
  modelPosition.xz = getRotatePivot2d(modelPosition.xz, angleToCamera, modelCenter.xz);

  vec4 modelViewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * modelViewPosition;
  // gl_Position = projectedPosition;
  csm_PositionRaw = projectedPosition;

}
