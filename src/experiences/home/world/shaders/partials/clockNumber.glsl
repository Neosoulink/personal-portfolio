#pragma glslify: sevenSegment = require(./sevenSegment.glsl)

float clockNumber(vec2 uv, int nr, bool zeroTrim, bool on) {
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

#pragma glslify: export(clockNumber)
