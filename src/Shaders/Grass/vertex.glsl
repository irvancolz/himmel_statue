attribute vec2 aCenter;

uniform float uTime;

varying vec2 vUv;
void main() {

  vec4 modelPosition = modelMatrix * vec4(position, 1.);
  modelPosition.xz += aCenter;

  vec4 modelViewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * modelViewPosition;
  gl_Position = projectedPosition;

  vUv = uv;
}
