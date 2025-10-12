varying vec3 vColor;

uniform vec3 uDayHighColor;
uniform vec3 uDayLowColor;
uniform vec3 uNightHighColor;
uniform vec3 uNightLowColor;
uniform vec3 uSunColor;
uniform vec3 uSunDirection;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vec3 sunDirection = uSunDirection;

    float sunIntensity = dot(normal, sunDirection);
    sunIntensity = sunIntensity * .5 + .5;

    vec3 color = vec3(sunIntensity);

    vec3 dayColorHigh = uDayHighColor;
    vec3 dayColorLow = uDayLowColor;
    float dayIntensity = smoothstep(.5, 1., sunIntensity);
    vec3 dayColor = mix(dayColorLow, dayColorHigh, dayIntensity);

    vec3 nightColorHigh = uNightHighColor;
    vec3 nightColorLow = uNightLowColor;
    float nightIntensity = smoothstep(0., .5, sunIntensity);
    vec3 nightColor = mix(nightColorHigh, nightColorLow, nightIntensity);

    color = nightColorHigh;

    float sun = clamp(sunIntensity, 0., 1.);
    sun = pow(sun, 5.);
    color = mix(color, uSunColor, sun);

    vColor = color;
}