uniform float uTime;

varying vec2 vUv;
void main() {

  vec4 mvPosition = vec4(position, 1.0);

  #ifdef USE_INSTANCING 
  mvPosition = instanceMatrix * mvPosition;
  #endif

  float dispPower = 1.0 - cos(uv.y * 3.1416 / 2.0);
  float displacement = sin(mvPosition.z + uTime * .002) * (.1 * dispPower);
  mvPosition.z += displacement;
  mvPosition.x += displacement * uv.y;
  mvPosition.y += displacement * uv.y;

  vec4 modelViewPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * modelViewPosition;

  vUv = uv;
}
