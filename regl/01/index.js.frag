precision mediump float;
struct Light {
    vec3 color;
    vec3 position;
};
varying vec2 vUv;
uniform sampler2D tex;
uniform Light light;
varying vec3 fragNormal, fragPosition;
void main () {
    vec3 normal = normalize(fragNormal);
    vec3 lightColour = vec3(0, 0, 0);
    vec3 lightDir = normalize(light.position - fragPosition);
    float diffuse = max(0.0, dot(lightDir, normal));
    lightColour += diffuse * light.color;
    gl_FragColor = vec4(lightColour, 1); // texture2D(lightColour, vUv);
}
