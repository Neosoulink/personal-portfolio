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
	<main class="flex flex-1">
		<HomeLandingLoader />

		<canvas :id="STATES.domElementID" class="fixed top-0 left-0 -z-10" />

		<Container class="flex-1 flex items-center text-light">
			<section class="flex-1 flex">
				<h2 class="text-7xl w-1/2 font-bold leading-normal">
					WELCOME TO MY SPACE SHIP
				</h2>
			</section>

			<div
				class="relative min-h-[33.33%] flex flex-col justify-center items-center"
			>
				<div class="absolute w-1 h-full rounded-sm bg-light" />

				<div class="absolute h-full flex flex-col justify-center items-center">
					<div
						v-for="i in Array(3).keys()"
						:key="i"
						class="rounded-full h-4 w-4 cursor-pointer bg-light my-2 transition-all hover:h-6 hover:w-6 hover:my-1"
					/>
				</div>
			</div>
		</Container>

		<div id="mode-bubbles-container" />
	</main>
</template>
