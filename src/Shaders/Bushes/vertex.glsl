uniform float uTime;
uniform sampler2D uNoiseTexture;

varying vec2 vUv;

#include ../Includes/getWorldUV.glsl

void main() {

    vec3 vertexPosition = position;
    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(vertexPosition, 1.);

    vec2 worldUV = getWorldUV(modelPosition.xz);
    float noise = texture(uNoiseTexture, worldUV).r;

    float displacement = (sin(uTime * .002 + noise * 20.) * .2) * vertexPosition.y;
    modelPosition.z += displacement;
    modelPosition.x += displacement;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // gl_Position = projectedPosition;
    csm_PositionRaw = projectedPosition;

    vUv = uv;
}