/**
 * Mystic blob x Clock Shader
 *
 * @original-author laserdog / https://www.shadertoy.com/user/laserdog
 * @original-author Andre VanKammen / https://github.com/AndreVanKammen
 *
 * @source https://www.shadertoy.com/view/XsKfDm
 * @source https://www.shadertoy.com/view/3dtSRj
 */

varying vec2 vUv;

uniform float uTime;
uniform float uSec;
uniform float uTimestamp;

#pragma glslify: clockNumber = require(../../partials/clockNumber.glsl)
#pragma glslify: clockDots = require(../../partials/clockDots.glsl)

bool showMatrix = false;

void clock(out vec4 fragColor) {
	bool blink = mod(uSec, 2.) == 0.;
	bool isGreen = true;

	vec2 uv = vUv * -8.;
	uv.y += 8. / 2.;
	uv.x += 8. / 1.05;

	float seg = .0;
	float timeSecs = uTimestamp;

	// Display seconds
	timeSecs = floor(timeSecs / 60.0);
	uv.x -= 1.75;
	seg += clockNumber(uv, int(mod(timeSecs, 60.)), false, blink);
	timeSecs = floor(timeSecs / 60.0);

	uv.x -= 1.75;
	seg += clockDots(uv);
	uv.x -= 1.75;
	seg += clockNumber(uv, int(mod(timeSecs, 60.0)), true, blink);

	// Matrix over segment
	if(showMatrix)
		seg *= .8 + .2 * smoothstep(0.02, .04, mod(uv.y + uv.x, .06025));

	if(seg < .0) {
		seg = -seg;

		fragColor = vec4(seg, seg, seg, 1.);
	} else if(showMatrix)
		if(isGreen)
			fragColor = vec4(.0, seg, seg * .5, 1.);
		else
			fragColor = vec4(.0, seg * .8, seg, 1.);
	else if(isGreen)
		fragColor = vec4(.0, seg, .0, 1.);
	else {
		fragColor = vec4(seg, .0, .0, 1.);
	}

	fragColor;
}

void mysticBlobBackground(out vec4 fragColor) {
	const float tau = 3.14 * 2.;
	const float numRings = 10.;

	vec2 uv = -vUv;
	uv.y += .5;
	uv.x += .5;

	float len = length(uv);
	fragColor.rgb = vec3(0., 0., 0.);

	for(float i = 0.; i < numRings; i++) {
		float angle = atan(uv.y, uv.x) + 3.14 + i * (tau / numRings);
		float val = len + sin(angle * 6. + uTime) * .05 * sin((uTime + i * .5) * 2.);
		float size = .18 + .12 * sin(uTime + i * (tau / numRings));
		float lenVal = smoothstep(size, size + .1, val) * smoothstep(size + .06, size + .05, val);
		lenVal *= smoothstep(0., .3, len);
		float lerpVal = (i / (numRings * 1.5)) + ((sin(uTime) + 1.) / 4.);
		fragColor.rgb += mix(vec3(1., 0., 0.2), vec3(0.25, 0., 1.), lerpVal) * lenVal;
	}
	fragColor *= 1.25;
}

void main() {
	vec4 mystic_blob_color;
	mysticBlobBackground(mystic_blob_color);

	vec4 clock_fragement_color;
	clock(clock_fragement_color);

	gl_FragColor = mystic_blob_color + clock_fragement_color;
}
