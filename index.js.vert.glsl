precision mediump float;
attribute vec3 position;
varying vec2 vUv;
uniform mat4 projection, view;
void main() {
    vUv = vec2(position.x, 1.0 - position.y);
    gl_Position = projection * view * vec4(position, 1);
}
