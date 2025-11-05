uniform vec3 uBushesColor;

void main() {
    vec3 color = uBushesColor;
    csm_DiffuseColor = vec4(color, 1.);
}