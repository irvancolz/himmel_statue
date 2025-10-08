uniform float uTime;

varying vec2 vUv;
varying vec2 vCloudUv;
varying vec3 vColor;

vec2 getRotatePivot2d(vec2 uv, float rotation, vec2 pivot) {
    return vec2(cos(rotation) * (uv.x - pivot.x) + sin(rotation) * (uv.y - pivot.y) + pivot.x, cos(rotation) * (uv.y - pivot.y) - sin(rotation) * (uv.x - pivot.x) + pivot.y);
}

void main() {

    vUv = uv;
    vCloudUv = uv;
    vColor = vColor;
    vec3 cPos = position;

    float waveSize = 5.0;
    float tipDistance = .3;
    float centerDistance = .1;

    if(color.x > .6) {
        cPos.x += sin((uTime / 500.0) + (uv.x * waveSize)) * tipDistance;
    } else if(color.x > 0.0) {
        cPos.x += sin((uTime / 500.0) + (uv.x * waveSize)) * centerDistance;
    }

// float diff = position.x - cPos.x;
    vCloudUv.x += uTime / 20000.0;
    vCloudUv.y += uTime / 10000.0;

    vec4 worldPosition = vec4(cPos, 1.0);

    vec4 modelPosition = modelMatrix * worldPosition;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * modelViewMatrix * worldPosition;

    gl_Position = projectionPosition;
}