precision mediump float;
attribute vec3 position, normal;
attribute vec2 uv;
uniform mat4 view, projection;
varying vec3 fragNormal, fragPosition;
varying mat4 lightMat;
varying vec2 vuv;
void main() {
    vuv = uv;
    fragNormal = normal;
    fragPosition = position;
    lightMat = view;

    gl_Position = projection * view * vec4(position, 1);
}

