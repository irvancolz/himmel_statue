uniform sampler2D uGrassTextures;
uniform sampler2D uCloudTextures;

varying vec2 vUv;
varying vec2 vCloudUv;
varying vec3 vColor;

void main() {
    float contrast = 1.5;
    float brightness = .1;
    vec3 color = texture2D(uGrassTextures, vUv).rgb * contrast;
    color = color + vec3(brightness, brightness, brightness);
    color = mix(color, texture2D(uCloudTextures, vCloudUv).rgb, 0.4);

    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
}