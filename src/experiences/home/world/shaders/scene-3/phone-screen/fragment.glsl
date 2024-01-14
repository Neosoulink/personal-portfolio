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

bool showMatrix = false;
bool showOff = false;

float segment(vec2 uv, bool On) {
	if(!On && !showOff)
		return .0;

	float seg = (1. - smoothstep(0.08, .09 + float(On) * .02, abs(uv.x))) *
		(1. - smoothstep(0.46, .47 + float(On) * .02, abs(uv.y) + abs(uv.x)));

	// Led like brightness
	if(On)
		seg *= (1. - length(uv * vec2(3.8, .9)));
	else
		seg *= -(0.05 + length(uv * vec2(0.2, .1)));

	return seg;
}

float sevenSegment(vec2 uv, int num) {
	float seg = .0;
	seg += segment(uv.yx + vec2(-1., .0), num != -1 && num != 1 && num != 4);
	seg += segment(uv.xy + vec2(-0.5, -0.5), num != -1 && num != 1 && num != 2 && num != 3 && num != 7);
	seg += segment(uv.xy + vec2(0.5, -0.5), num != -1 && num != 5 && num != 6);
	seg += segment(uv.yx + vec2(.0, .0), num != -1 && num != 0 && num != 1 && num != 7);
	seg += segment(uv.xy + vec2(-0.5, .5), (num == 0 || num == 2 || num == 6 || num == 8));
	seg += segment(uv.xy + vec2(0.5, .5), num != -1 && num != 2);
	seg += segment(uv.yx + vec2(1., .0), num != -1 && num != 1 && num != 4 && num != 7);

	return seg;
}

float showNum(vec2 uv, int nr, bool zeroTrim) {
	// Speed optimization, leave if pixel is not in segment/
	if(abs(uv.x) > 1.5 || abs(uv.y) > 1.2)
		return .0;

	float seg = .0;
	if(uv.x > .0) {
		nr /= 10;
		if(nr == 0 && zeroTrim)
			nr = -1;
		seg += sevenSegment(uv + vec2(-0.75, .0), nr);
	} else
		seg += sevenSegment(uv + vec2(0.75, .0), int(mod(float(nr), 10.0)));

	return seg;
}

float dots(vec2 uv) {
	float seg = .0;
	uv.y -= .5;
	seg += (1. - smoothstep(0.11, .13, length(uv))) * (1. - length(uv) * 2.0);
	uv.y += 1.;
	seg += (1. - smoothstep(0.11, .13, length(uv))) * (1. - length(uv) * 2.0);
	return seg;
}

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

	seg += showNum(uv, int(mod(timeSecs, 60.)), false);
	timeSecs = floor(timeSecs / 60.);
	uv.x -= 1.75;
	seg += dots(uv);

	uv.x -= 1.75;
	seg += showNum(uv, int(mod(timeSecs, 60.)), false);
	timeSecs = floor(timeSecs / 60.);

	uv.x -= 1.75;
	seg += dots(uv);
	uv.x -= 1.75;
	seg += showNum(uv, int(mod(timeSecs, 60.)), true);

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
