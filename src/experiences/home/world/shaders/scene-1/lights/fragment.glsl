uniform sampler2D uBakedTexture;
uniform sampler2D uBakedLightTexture;

uniform vec3 uRedAccent;
uniform float uRedAccentStrength;

uniform vec3 uGreenAccent;
uniform float uGreenAccentStrength;

uniform vec3 uBlueAccent;
uniform float uBlueAccentStrength;

varying vec2 vUv;

#pragma glslify: blend = require(glsl-blend/lighten)

void main() {
	vec3 bakedColor = texture2D(uBakedTexture, vUv).rgb;
	vec3 lightMapColor = texture2D(uBakedLightTexture, vUv).rgb;

	float redAccentStrength = lightMapColor.r * uRedAccentStrength;
	bakedColor = blend(bakedColor, uRedAccent, redAccentStrength);

	float greenAccentStrength = lightMapColor.g * uGreenAccentStrength;
	bakedColor = blend(bakedColor, uGreenAccent, greenAccentStrength);

	float blueAccentStrength = lightMapColor.b * uBlueAccentStrength;
	bakedColor = blend(bakedColor, uBlueAccent, blueAccentStrength);

	// 3rd param < 0 = transparent, > 1 = opaque
	float alpha = smoothstep(0.0, 1.0, 1.0);

	gl_FragColor = vec4(bakedColor, alpha);

	#include <colorspace_fragment>
}
