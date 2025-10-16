uniform float uTime;
uniform sampler2D uNoiseTexture;

varying vec2 vUv;

#include ../Includes/getWorldUV.glsl

void main() {

  vec4 modelPosition = instanceMatrix * vec4(position, 1.);

  vec2 worldUV = getWorldUV(modelPosition.xz);
  float noise = texture(uNoiseTexture, worldUV).r;

  float displacement = (sin(uTime * .002 + noise * 10.) * .2) * uv.y;
  modelPosition.z += displacement;
  modelPosition.x += displacement;

  vec4 modelViewPosition = modelViewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * modelViewPosition;
  gl_Position = projectedPosition;
  // csm_PositionRaw = projectedPosition;

  vUv = uv;
}
