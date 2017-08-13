precision mediump float;
uniform mat4 projection, view;
attribute vec3 position, normal;
attribute vec2 uv;
varying vec2 vUv;
varying vec3 fragNormal, fragPosition;
void main() {
    vUv = uv;
    fragNormal = normal;
    fragPosition = position;
    gl_Position = vec4(position, 1);
}
