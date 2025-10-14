uniform float uTime;
uniform vec3 uBushesColor;
uniform sampler2D uNoiseTexture;

varying vec3 vColor;
varying vec2 vUv;

#include ../Includes/getWorldUV.glsl

void main() {

    vec3 vertexPosition = position;
    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(vertexPosition, 1.);

    vec2 worldUV = getWorldUV(modelPosition.xz);
    float noise = texture(uNoiseTexture, worldUV).r;

    float displacement = (sin(uTime * .002 + noise * 20.) * .2) * uv.y;
    modelPosition.z += displacement;
    modelPosition.x += displacement;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // gl_Position = projectedPosition;
    csm_PositionRaw = projectedPosition;

    vec3 color = uBushesColor;

    // vec3 sunDirection = vec3(1., 0., 0.);

    // float sunIntensity = dot(normal, sunDirection);
    // sunIntensity = 1. - (sunIntensity + 1.) * .5;
    // sunIntensity = 1. - pow(sunIntensity, 3.);

    // vec3 shadowColor = uBushesColor * (sunIntensity);

    // color = mix(shadowColor, uBushesColor, sunIntensity);

    vColor = color;
    vUv = uv;
}