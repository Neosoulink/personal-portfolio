/**
 * Metro sun shader x Clock shader
 *
 * @original-author Jan Mróz (jaszunio15)
 * @original-author Andre VanKammen / https://github.com/AndreVanKammen
 *
 * @source https://www.shadertoy.com/view/3t3GDB
 * @source https://www.shadertoy.com/view/3dtSRj
 */

varying vec2 vUv;
uniform float uTime;
uniform float uTimestamp;

#pragma glslify: clockNumber = require(../../partials/clockNumber.glsl)
#pragma glslify: clockDots = require(../../partials/clockDots.glsl)

bool showMatrix = false;

float sun(vec2 uv, float battery) {
	float val = smoothstep(0.3, 0.29, length(uv));
	float bloom = smoothstep(0.7, 0.0, length(uv));
	float cut = 3.0 * sin((uv.y + uTime * 0.1 * (battery + 0.02)) * 100.0) + clamp(uv.y * 14.0 + 1.0, -6.0, 6.0);
	cut = clamp(cut, 0.0, 1.0);
	return clamp(val * cut, 0.0, 1.0) + bloom * 0.6;
}

float grid(vec2 uv, float battery) {
	vec2 size = vec2(uv.y, uv.y * uv.y * 0.2) * 0.01;
	uv += vec2(0.0, uTime * 2.0 * (battery + 0.05));
	uv = abs(fract(uv) - 0.5);
	vec2 lines = smoothstep(size, vec2(0.0), uv);
	lines += smoothstep(size * 5.0, vec2(0.0), uv) * 0.4 * battery;
	return clamp(lines.x + lines.y, 0.0, 3.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 uv = vUv * -1.5;
	uv.x += .35;
	uv.y += .7;

	float battery = .8;
	// TODO: connect the mouse position.
	// if(iMouse.x > 1.0 && iMouse.y > 1.0)
	// 	battery = iMouse.y / iResolution.y;
	// else
	//  battery = 0.8;

	if(abs(uv.x) < (9.0 / 16.0)) {
		float fog = smoothstep(0.1, -0.02, abs(uv.y + 0.2));
		vec3 col = vec3(0.0, 0.1, 0.2);
		if(uv.y < -0.2) {
			uv.y = 3.0 / (abs(uv.y + 0.2) + 0.05);
			uv.x *= uv.y * 1.0;
			float gridVal = grid(uv, battery);
			col = mix(col, vec3(1.0, 0.5, 1.0), gridVal);
		} else {
			uv.y -= battery * 1.1 - 0.51;
			col = vec3(1.0, 0.2, 1.0);
			float sunVal = sun(uv, battery);
			col = mix(col, vec3(1.0, 0.4, 0.1), uv.y * 2.0 + 0.2);
			col = mix(vec3(0.0, 0.0, 0.0), col, sunVal);
			col += vec3(0.0, 0.1, 0.2);
		}

		col += fog * fog * fog;
		col = mix(vec3(col.r, col.b, col.r) * 0.5, col, battery * 0.7);

		fragColor = vec4(col, 1.0);
	} else
		fragColor = vec4(0.0);

	uv = vUv * -24.;
	uv.y += 24. / 2.;
	uv.x += 24. / 2.75;

	float seg = .0;
	float timeSecs = uTimestamp;

	seg += clockNumber(uv, int(mod(timeSecs, 60.)), false, true);
	timeSecs = floor(timeSecs / 60.);
	uv.x -= 1.75;
	seg += clockDots(uv);

	uv.x -= 1.75;
	seg += clockNumber(uv, int(mod(timeSecs, 60.)), false, true);
	timeSecs = floor(timeSecs / 60.);

	uv.x -= 1.75;
	seg += clockDots(uv);
	uv.x -= 1.75;
	seg += clockNumber(uv, int(mod(timeSecs, 60.)), true, true);

	// Matrix over segment
	if(showMatrix) {
		seg *= .8 + .2 * smoothstep(0.02, .04, mod(uv.y + uv.x, .06025));
	}

	vec3 finalColor;

	if(seg < .0)
		seg = -seg;

	finalColor = vec3(seg, seg, seg);
	finalColor += smoothstep(0.8, 0.9, 1. - seg) * fragColor.xyz;

	fragColor = vec4(finalColor, 1.);
}

void main() {
	vec4 fragment_color;
	mainImage(fragment_color, gl_FragColor.xy);
	gl_FragColor = fragment_color;
}
