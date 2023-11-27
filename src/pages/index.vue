<script lang="ts" setup>
// EXPERIENCES
import HomeExperience from "@/experiences/pages/Home";

// CONSTANTS
import { HOME_DOM_REF } from "@/constants/UI";

// DATA
const STATES = reactive<{
	experience?: HomeExperience;
}>({});

// FUNCTIONS
const initExperience = () => {
	if (!process.client) return;

	const EXPERIENCE = new HomeExperience({
		domElementRef: "#" + HOME_DOM_REF,
	});

	EXPERIENCE.construct();
	STATES.experience = EXPERIENCE;
};

const endExperience = () => {
	if (!STATES.experience) return;

	STATES.experience.destruct();
	STATES.experience = undefined;
};

// HOOKS
onMounted(() => {
	!STATES.experience && setTimeout(() => initExperience(), 500);
});
onBeforeUnmount(() => setTimeout(() => endExperience(), 500));
</script>

<template>
	<main class="flex flex-1">
		<HomeLandingLoader />

		<canvas :id="HOME_DOM_REF" class="fixed top-0 left-0 w-full h-full" />

		<!-- <div id="mode-bubbles-container" /> -->
	</main>
</template>
