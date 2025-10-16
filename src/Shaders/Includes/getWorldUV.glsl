#define WORLD_DIAMETER 60.

vec2 getWorldUV(vec2 worldPos) {
    vec2 pos = worldPos + vec2(.5 * WORLD_DIAMETER);

    return fract(pos / vec2(WORLD_DIAMETER));
}