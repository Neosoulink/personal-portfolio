<script lang="ts" setup>
// @ts-ignore
import type { HomeExperience as _HomeExperience } from "@/plugins/HomeExperience.client";

// NUXT
const { $HomeExperience } = useNuxtApp();

// ROUTER
const HASH = useHashUrl();

// DATA
const HOME_EXPERIENCE = $HomeExperience as typeof _HomeExperience | undefined;
const HASH_SECTIONS: { [hash: string]: { content: string } } = {
	about: {
		content: "WELCOME TO MY SPACE SHIP",
	},
	skills: { content: "Skills" },
};

// STATES
const STATES = reactive<{
	domElementID: string;
	experience?: _HomeExperience;
}>({
	domElementID: "home-three-app",
});

onMounted(() => {
	if (process.client && !STATES.experience) {
		STATES.experience = new HOME_EXPERIENCE({
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
	<main class="flex flex-1">
		<!-- <HomeLandingLoader /> -->

		<canvas :id="STATES.domElementID" class="fixed top-0 left-0" />

		<!-- <div id="mode-bubbles-container" /> -->
	</main>
</template>
