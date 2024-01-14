/**
 * SevenSegment
 *
 * @original-author Andre VanKammen / https://github.com/AndreVanKammen
 *
 * @source https://www.shadertoy.com/view/3dtSRj
 */

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

#pragma glslify: export(sevenSegment)
