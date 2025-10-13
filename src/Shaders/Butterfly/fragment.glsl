varying vec2 vUv;
uniform sampler2D uButterflyTexture;

void main() {
    vec4 color = texture(uButterflyTexture, vUv);
    gl_FragColor = vec4(color);
}