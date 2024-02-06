<script setup lang="ts">
import gsap from "gsap";
import { HomeExperience } from "~/experiences/home";
import { events } from "~/static";
const experience = ref<HomeExperience | undefined>();
const progress = ref<number>(0);

const onPointerDown = () => {
	if (experience.value?.cameraAnimation)
		experience.value.cameraAnimation.isSliding = true;
};
const onPointerUp = () => {
	if (experience.value?.cameraAnimation)
		experience.value.cameraAnimation.isSliding = false;
};
const onInput = (e: Event) => {
	const target = e.target as HTMLInputElement | undefined;
	if (!experience.value?.cameraAnimation?.enabled || !target) return;

	experience.value.cameraAnimation.progressTarget = Number(target.value) / 100;
};
const onCameraAnimationUpdate = () => {
	if (!experience.value?.cameraAnimation) return;

	progress.value = experience.value.cameraAnimation.progressCurrent * 100;
};

onMounted(() => {
	if (!process.client) return;

	experience.value = new HomeExperience();

	experience.value.cameraAnimation?.on(events.UPDATED, onCameraAnimationUpdate);
});

onBeforeRouteUpdate(() => {
	gsap.to(progress, { value: 0, duration: 0.5 });
});
</script>

<template>
	<input
		type="range"
		min="0"
		max="100"
		:value="progress"
		class="relative w-full h-[6px] transition-opacity rounded outline-none appearance-none cursor-pointer bg-light sm:opacity-70 sm:hover:opacity-100"
		id="myRange"
		@input="onInput"
		@pointerdown="onPointerDown"
		@pointerup="onPointerUp"
	/>
</template>

<style scoped lang="scss">
input {
	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 9999px;
		background: white;
	}

	&::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 9999px;
		background: white;
	}
}
</style>
