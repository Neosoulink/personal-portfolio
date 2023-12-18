<script lang="ts" setup>
// EXPERIENCES
import HomeExperience from "@/experiences/pages/Home";

// MODELS
import { CHANGED } from "@/experiences/common/Event.model";

// CONSTANTS
import { HOME_DOM_REF } from "@/constants/UI";

// DATA
const states = reactive<{
	experience?: HomeExperience;
}>({});

// FUNCTIONS
const initExperience = () => {
	if (!process.client) return;

	const Experience = new HomeExperience({
		domElementRef: "#" + HOME_DOM_REF,
	});

	Experience.construct();
	states.experience = Experience;
};

const endExperience = () => {
	if (!states.experience) return;

	states.experience.destruct();
	states.experience = undefined;
};

// HOOKS
onMounted(() => {
	!states.experience && setTimeout(initExperience, 500);
});

onBeforeUnmount(() => setTimeout(endExperience, 500));

onBeforeRouteUpdate((route) => {
	states.experience?.navigation?.emit(CHANGED, route);
});
</script>

<template>
	<main class="flex flex-1">
		<!--	<HomeLandingLoader /> -->

		<canvas :id="HOME_DOM_REF" class="fixed top-0 left-0 w-full h-full" />

		<NuxtPage />

		<!-- <div id="mode-bubbles-container" /> -->
	</main>
</template>
