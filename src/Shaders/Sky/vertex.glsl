varying vec3 vColor;

uniform vec3 uDayHighColor;
uniform vec3 uDayLowColor;
uniform vec3 uNightHighColor;
uniform vec3 uNightLowColor;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vec3 sunDirection = vec3(0., 1., 0.);

    float sunIntensity = dot(normal, sunDirection);
    sunIntensity = clamp(sunIntensity, 0., 1.);

    vec3 color = vec3(sunIntensity);

    vec3 dayColorHigh = uDayHighColor;
    vec3 dayColorLow = uDayLowColor;
    float dayIntensity = smoothstep(.5, 1., sunIntensity * 4.);
    vec3 dayColor = mix(dayColorLow, dayColorHigh, dayIntensity);

    vec3 nightColorHigh = uNightHighColor;
    vec3 nightColorLow = uNightLowColor;
    float nightIntensity = smoothstep(0., .5, sunIntensity * 4.);
    vec3 nightColor = mix(nightColorHigh, nightColorLow, nightIntensity);

    color = mix(nightColor, dayColor, sunIntensity);

    vColor = color;
}