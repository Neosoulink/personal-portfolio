<script setup lang="ts">
import { HomeExperience } from "~/experiences/home";

const experience = new HomeExperience();
const isFocusMode = useState<boolean>("isFocusMode");

const onPress = () => {
	if (!isFocusMode.value) return;
	experience.interactions?.leaveFocusMode();
};
</script>

<template>
	<button @pointerup="onPress" title="Leave focus moed">
		<svg viewBox="0 0 37 37" fill="none">
			<path
				d="M14 1H5.00001C2.79087 1 1.00001 2.79086 1.00001 5V14M36.0005 14V4.99997C36.0005 2.79083 34.2096 0.999969 32.0005 0.999969H23M23 36.0001L32.0005 36C34.2096 36 36.0005 34.2092 36.0005 32V23M1 23V32.0001C1 34.2092 2.79086 36.0001 5 36.0001L14 36M9.13068 27.3084L26.8083 9.63075M10.1913 9.6308L27.869 27.3085"
				stroke="#F4F7F5"
				stroke-width="1.5"
			/>
		</svg>
	</button>
</template>
