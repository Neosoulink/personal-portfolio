/**
 * @original-author Andre VanKammen / https://github.com/AndreVanKammen
 *
 * @source https://www.shadertoy.com/view/3dtSRj
 */

varying vec2 vUv;

uniform float uTime;
uniform float uSec;
uniform float uTimestamp;

bool showMatrix = false;
bool showOff = true;

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

float sevenSegment(vec2 uv, int num, bool on) {
	float seg = .0;
	seg += segment(uv.yx + vec2(-1., .0), num != -1 && num != 1 && num != 4 && on);
	seg += segment(uv.xy + vec2(-0.5, -0.5), num != -1 && num != 1 && num != 2 && num != 3 && num != 7 && on);
	seg += segment(uv.xy + vec2(0.5, -0.5), num != -1 && num != 5 && num != 6 && on);
	seg += segment(uv.yx + vec2(.0, .0), num != -1 && num != 0 && num != 1 && num != 7 && on);
	seg += segment(uv.xy + vec2(-0.5, .5), (num == 0 || num == 2 || num == 6 || num == 8) && on);
	seg += segment(uv.xy + vec2(0.5, .5), num != -1 && num != 2 && on);
	seg += segment(uv.yx + vec2(1., .0), num != -1 && num != 1 && num != 4 && num != 7 && on);

	return seg;
}

float showNum(vec2 uv, int nr, bool zeroTrim, bool on) {
	// Speed optimization, leave if pixel is not in segment/
	if(abs(uv.x) > 1.5 || abs(uv.y) > 1.2)
		return .0;

	float seg = .0;
	if(uv.x > .0) {
		nr /= 10;
		if(nr == 0 && zeroTrim)
			nr = -1;
		seg += sevenSegment(uv + vec2(-0.75, .0), nr, on);
	} else
		seg += sevenSegment(uv + vec2(0.75, .0), int(mod(float(nr), 10.0)), on);

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

void clock(out vec4 fragColor) {
	bool blink = mod(uSec, 2.) == 0.;
	bool ampm = false;
	bool isGreen = true;

	vec2 uv = vUv * -8.;
	uv.y += 8. / 2.;
	uv.x += 8. / 1.05;

	float seg = .0;
	float timeSecs = uTimestamp;

	// Display seconds
	// seg += showNum(uv, int(mod(timeSecs, 60.0)), false, blink);
	timeSecs = floor(timeSecs / 60.0);
	// uv.x -= 1.75;
	// seg += dots(uv);
	uv.x -= 1.75;
	seg += showNum(uv, int(mod(timeSecs, 60.0)), false, blink);
	timeSecs = floor(timeSecs / 60.0);

	if(ampm) {
		if(timeSecs > 12.0)
			timeSecs = mod(timeSecs, 12.0);
	}

	uv.x -= 1.75;
	seg += dots(uv);
	uv.x -= 1.75;
	seg += showNum(uv, int(mod(timeSecs, 60.0)), true, blink);

	// Matrix over segment
	if(showMatrix) {
		seg *= .8 + .2 * smoothstep(0.02, .04, mod(uv.y + uv.x, .06025));
		// seg *= .8+0.2*smoothstep(0.02,0.04,mod(uv.y-uv.x,0.06025));
	}

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
	;
}
