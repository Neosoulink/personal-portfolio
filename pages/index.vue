<script lang="ts" setup>
// @ts-ignore
import type { HomeExperience as _HomeExperience } from "@/plugins/HomeExperience.client";

// NUXT
const { $HomeExperience } = useNuxtApp();

// DATA
const HomeExperience = $HomeExperience as typeof _HomeExperience | undefined;

// STATES
const STATES = reactive<{
	domElementID: string;
	experience?: _HomeExperience;
}>({
	domElementID: "home-three-app",
});

onMounted(() => {
	if (process.client && !STATES.experience) {
		STATES.experience = new HomeExperience({
			domElementRef: "#" + STATES.domElementID,
		});
	}
});

onBeforeUnmount(() => {
	if (STATES.experience.destruct) {
		STATES.experience.destruct();
		STATES.experience = undefined;
	}
});
</script>

<template>
	<main>
		<HomeLandingLoader />

		<canvas :id="STATES.domElementID" class="fixed top-0 left-0 z-0" />

		<div id="mode-bubbles-container" />
	</main>
</template>
