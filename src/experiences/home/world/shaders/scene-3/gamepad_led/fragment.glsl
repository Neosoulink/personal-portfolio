varying vec2 vUv;

uniform float uTime;

void main() {
	vec2 uv = vUv;

	vec3 col = 0.5 + 0.5 * cos(uTime + uv.xyx + vec3(0, 2, 4));

  // Output to screen
	gl_FragColor = vec4(col, 1.0);
}
