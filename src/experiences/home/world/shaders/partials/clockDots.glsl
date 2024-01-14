/**
 * clock Dots
 *
 * @original-author Andre VanKammen / https://github.com/AndreVanKammen
 *
 * @source https://www.shadertoy.com/view/3dtSRj
 */

float clockDots(vec2 uv) {
	float seg = .0;
	uv.y -= .5;
	seg += (1. - smoothstep(0.11, .13, length(uv))) * (1. - length(uv) * 2.0);
	uv.y += 1.;
	seg += (1. - smoothstep(0.11, .13, length(uv))) * (1. - length(uv) * 2.0);
	return seg;
}

#pragma glslify: export(clockDots)
