uniform sampler2D uGrassTexture;

varying vec2 vUv;

void main() {

    vec4 color = texture(uGrassTexture, vUv);

    gl_FragColor = vec4(color);
}