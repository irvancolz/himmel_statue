varying vec3 vColor;

uniform sampler2D uLeavesTexture;
varying vec2 vUv;

void main() {
    float alpha = texture(uLeavesTexture, vUv).r;

    vec3 color = vColor;
    // gl_FragColor = vec4(color, alpha);
    csm_DiffuseColor = vec4(color, alpha);
}