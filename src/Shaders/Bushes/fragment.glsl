uniform vec3 uBushesColor;
uniform sampler2D uLeavesTexture;

varying vec2 vUv;

void main() {
    // float alpha = texture(uLeavesTexture, vUv).r;

    vec3 color = uBushesColor;
    // gl_FragColor = vec4(color, alpha);
    csm_DiffuseColor = vec4(color, 1.);
}