varying vec2 vUvs;

uniform float uTime;
uniform samplerCube uSpecMap;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
    vec3 lighting = vec3(0.0);

    vec3 normal = normalize(
        cross(
            dFdx(vPosition.xyz),
            dFdy(vPosition.xyz)
        )
    );
    vec3 viewDir = normalize(cameraPosition - vPosition);

    // Ambient
    vec3 ambient = vec3(1.0);

    // Hemi
    vec3 skyColour = vec3(0.0, 0.3, 0.6);
    vec3 groundColour = vec3(0.6, 0.3, 0.1);

    vec3 hemi = mix(groundColour, skyColour, remap(normal.y, -1.0, 1.0, 0.0, 1.0));

    // Diffuse lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 lightColour = vec3(1.0, 1.0, 0.9);
    float dp = max(0.0, dot(lightDir, normal));

    vec3 diffuse = dp * lightColour;
    vec3 specular = vec3(0.0);

    // Specular
    vec3 r = normalize(reflect(-lightDir, normal));
    float phongValue = max(0.0, dot(viewDir, r));
    phongValue = pow(phongValue, 32.0);

    specular += phongValue * 0.15;

    // IBL Specular
    vec3 iblCoord = normalize(reflect(-viewDir, normal));
    vec3 iblSample = textureCube(uSpecMap, iblCoord).xyz;

    specular += iblSample * 0.15;

    // Fresnel
    float fresnel = 1.0 - max(0.0, dot(viewDir, normal));
    fresnel = pow(fresnel, 2.0);

    specular *= fresnel;

    // Combine lighting
    lighting = hemi * 0.1 + diffuse;

    float x = remap(sin(uTime), -1.0, 1.0, 0.125, 1.0);
    // float x = vUvs.x * sin(uTime);
    float y = remap(cos(uTime), -1.0, 1.0, 0.125, 1.0);
    // float y = vUvs.y * sin(uTime);
    vec3 color = vec3(x, 0.0, y);
    color = color * lighting + specular;

    gl_FragColor = vec4(color, 1.0);
}