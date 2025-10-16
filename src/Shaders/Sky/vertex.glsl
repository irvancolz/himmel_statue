varying vec3 vColor;

uniform vec3 uHorizonColor;
uniform vec3 uSkyDayColor;
uniform vec3 uSunDirection;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vec3 sunDirection = uSunDirection;

    float sunIntensity = dot(normal, sunDirection);
    sunIntensity = sunIntensity * .5 + .5;
    sunIntensity = pow(sunIntensity, 3.);

    vec3 color = vec3(sunIntensity);

    color = mix(uHorizonColor, uSkyDayColor, sunIntensity);

    // float sun = clamp(sunIntensity, 0., 1.);
    // sun = pow(sun, 5.);
    // color = mix(color, uSunColor, sun);

    vColor = color;
}