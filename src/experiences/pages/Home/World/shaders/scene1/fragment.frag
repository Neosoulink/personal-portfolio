precision mediump float;

uniform sampler2D uBakedTexture;
uniform vec3 uColor;

varying vec2 vUv;

#pragma glslify: blend = require(glsl-blend/lighten)

void main() {
	vec3 bakedTextureColor = texture2D(uBakedTexture, vUv).rgb;

	gl_FragColor = vec4(bakedTextureColor, 1.0);
}
