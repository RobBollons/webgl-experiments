precision mediump float;
#pragma glslify: inverse = require(glsl-inverse)
uniform vec3 lightPosition, lightColour;
varying mat4 lightMat;
varying vec3 fragNormal, fragPosition;
varying vec2 vuv;
uniform sampler2D tex;
void main() {
    mat4 invLightMat = inverse(lightMat);
    vec4 newLightPosition = invLightMat * vec4(lightPosition, 1);
    vec3 normal = normalize(fragNormal);
    vec3 lightDirection = normalize(vec3(newLightPosition) - fragPosition);
    float diffuse = max(0.0, dot(lightDirection, normal));
    vec3 light = diffuse * lightColour;
    vec3 cubeColour = vec3(0.5, 0.7, 0.3);
    vec4 texelColour = texture2D(tex, vuv);

    gl_FragColor = vec4(texelColour.rgb * light, 1);
}
