<script setup lang="ts">
import { HomeExperience } from "~/experiences/home";

const experience = new HomeExperience();
const isSoundMuted = useState("isSoundMuted");

const onPress = () => {
	experience.sound?.toggleMute();
};
</script>

<template>
	<button
		@pointerup="onPress"
		:title="`${isSoundMuted ? 'Enable' : 'Disable'} Sound`"
	>
		<svg
			viewBox="0 0 38 25"
			fill="none"
			:class="`transition-transform scale-y-100 translate-y-0  ${
				isSoundMuted ? '' : 'active'
			}`"
		>
			<path
				d="M1 11V15"
				stroke="#F4F7F5"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M7 11V15"
				stroke="#F4F7F5"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M13 11V15"
				stroke="#F4F7F5"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M19 11V15"
				stroke="#F4F7F5"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M25 11V15"
				stroke="#F4F7F5"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M31 11V13V15"
				stroke="#F4F7F5"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M37 11V15"
				stroke="#F4F7F5"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>
</template>

<style scoped lang="scss">
@use "sass:list";

$delays: 0.6, 0.7, 0.4, 0.65, 0.8, 0.6, 0.9, 0.55, 0.5, 0.7;
$length: 7;

svg {
	path {
		@for $i from 1 through $length {
			&:nth-of-type(10n - #{$length - $i }) {
				animation-delay: #{list.nth($delays, $i)}s !important;
			}
		}
	}

	&.active {
		path {
			@for $i from 0 through 1 {
				&:nth-of-type(2n - #{$i}) {
					animation: #{1 *
						($i + 1)}s
						linear
						yoyo
						forwards
						infinite
						alternate-reverse;
				}
			}
		}
	}
}

@keyframes yoyo {
	0% {
		transform: scaleY(1);
		transform-origin: 50% 50%;
	}

	50% {
		transform: scaleY(4);
		transform-origin: 50% 50%;
	}

	100% {
		transform: scaleY(1);
		transform-origin: 50% 50%;
	}
}
</style>
