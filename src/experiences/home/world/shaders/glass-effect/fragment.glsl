uniform sampler2D tDiffuse;
uniform sampler2D uDisplacementMap;
uniform float uStrength;

varying vec2 vUv;

void main() {

	vec3 displacementColor = texture2D(uDisplacementMap, vUv).xyz * 2.0 - 1.0;
	vec2 displacementColorCorrection = vec2(vUv.x, vUv.y) + ((displacementColor.xy + sin(vUv.x * uStrength * 90.0)) * uStrength) * 0.1;
	vec4 color = texture2D(tDiffuse, displacementColorCorrection);

	gl_FragColor = color;
}
