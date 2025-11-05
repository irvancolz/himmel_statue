uniform float uTime;

varying vec2 vUv;

#include ../Includes/getWorldUV.glsl;

void main() {

    vec3 modifiedPosition = position;

    // animate wings
    float edge = distance(uv.x, .5);
    float angle = uTime * .017862;
    float y = sin(angle) * edge;
    modifiedPosition.y += y;

    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(modifiedPosition, 1.);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}