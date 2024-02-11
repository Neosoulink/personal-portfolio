varying vec3 vColor;

uniform float uTime;
uniform float uDisplacementMultiplayer;
uniform float uDisplacementRadius;
uniform float uUvScale;
uniform vec3 uColors[2];
uniform vec2 uCursor;

#pragma glslify: snoise = require(./partials/simplex.glsl)

void main() {
	vec2 newUv = vec2(uv);
	vec2 displacedUv = newUv * vec2(3, 4);
	vec3 newPosition = vec3(position);

	float distanceToCursor = distance(uCursor, newUv);
	float noiseCoord = snoise(vec3(displacedUv.x + uTime * .01, displacedUv.y, uTime * .1)) * -1.;

	float bumpDisplacement = uDisplacementMultiplayer * smoothstep(1., 0., uDisplacementRadius * distanceToCursor);

	newPosition.z += (bumpDisplacement + (noiseCoord * .2)) * (uUvScale * .5);

	vColor = mix(uColors[1], uColors[0], clamp(((noiseCoord) + bumpDisplacement * 15.) * .65, 0., 1.));

	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

}
