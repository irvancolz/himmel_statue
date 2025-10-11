uniform float uTime;
uniform vec3 uBushesColor;

varying vec3 vColor;
varying vec2 vUv;

void main() {

    vec3 vertexPosition = position;

    float dispPower = 1.0 - cos(uv.y * 3.1416 / 2.0);
    float displacement = sin(vertexPosition.z + uTime * .002) * (.1 * dispPower);

    vertexPosition.z += displacement;
    vertexPosition.x += displacement * normal.y;
    vertexPosition.y += displacement * normal.y;

    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(vertexPosition, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // gl_Position = projectedPosition;
    csm_Position = vertexPosition;

    vec3 color = uBushesColor;

    vec3 sunDirection = vec3(1., 0., 0.);

    float sunIntensity = dot(normal, sunDirection);
    sunIntensity = 1. - (sunIntensity + 1.) * .5;
    sunIntensity = 1. - pow(sunIntensity, 3.);

    vec3 shadowColor = uBushesColor * (sunIntensity);

    // color = mix(shadowColor, uBushesColor, sunIntensity);

    vColor = color;
    vUv = uv;
}