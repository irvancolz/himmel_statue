uniform float uTime;

// varying vec3 vNormal;

void main() {

    vec3 vertexPosition = position;

    float dispPower = 1.0 - cos(uv.y * 3.1416 / 2.0);
    float displacement = sin(vertexPosition.z + uTime * .002) * (.1 * dispPower);

    vertexPosition.z += displacement;
    vertexPosition.x += displacement * uv.y;
    vertexPosition.y += displacement * uv.y;

    csm_Position = vertexPosition.xyz;

    vNormal = normal;
}