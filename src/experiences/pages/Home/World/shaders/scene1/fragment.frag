precision mediump float;

uniform sampler2D uBakedTexture;
uniform vec3 uColor;

varying vec2 vUv;

#pragma glslify: blend = require(glsl-blend/lighten)

void main() {
	vec3 bakedTextureColor = texture2D(uBakedTexture, vUv).rgb;
	// 3rd param < 0 = transparent, > 1 = opaque
	float alpha = smoothstep(0.0, 1.0, 1.0);

  // 3rd param < 1 = color1, > 2 = color2
	float colorMix = smoothstep(1.0, 2.0, vUv.y);

	gl_FragColor = vec4(mix(bakedTextureColor, uColor, colorMix), alpha);
}
