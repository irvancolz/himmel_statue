uniform float uTime;
uniform sampler2D uNoiseTexture;

varying vec2 vUv;

#include ../Includes/getWorldUV.glsl

void main() {

  vec4 mvPosition = vec4(position, 1.0);

  #ifdef USE_INSTANCING 
  mvPosition = instanceMatrix * mvPosition;
  #endif

  vec2 worldUV = getWorldUV(mvPosition.xz);
  float noise = texture(uNoiseTexture, worldUV).r;

  float displacement = (sin(uTime * .002 + noise * 10.) * .2) * uv.y;
  mvPosition.z += displacement;
  mvPosition.x += displacement;

  vec4 modelViewPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * modelViewPosition;

  vUv = uv;
}
