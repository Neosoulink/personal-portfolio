<script lang="ts" setup>
// @ts-ignore
import type { HomeExperience as _HomeExperience } from "@/plugins/HomeExperience.client";
import { useRouter, useRoute } from "vue-router";

// NUXT
const { $HomeExperience } = useNuxtApp();

// ROUTER
const ROUTER = useRouter();
const ROUTE = useRoute();

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
	currentSectionHash: string;
}>({
	domElementID: "home-three-app",
	currentSectionHash: (ROUTE?.hash ?? "").replace("#", "")
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

watch(ROUTE, async (newState) => {
	STATES.currentSectionHash = (newState?.hash ?? "").replace("#", "");
});
</script>

<template>
	<main class="flex flex-1">
		<HomeLandingLoader />

		<canvas :id="STATES.domElementID" class="fixed top-0 left-0 -z-10" />

		<Container class="flex-1 flex items-center text-light">
			<section class="flex-1 flex">
				<h2 class="text-7xl w-1/2 font-bold leading-normal">
					{{
						STATES.currentSectionHash &&
						HASH_SECTIONS[STATES.currentSectionHash]
							? HASH_SECTIONS[STATES.currentSectionHash].content
							: HASH_SECTIONS.about.content
					}}
				</h2>
			</section>

			<div
				class="relative min-h-[33.33%] flex flex-col justify-center items-center"
			>
				<div class="absolute w-1 h-full rounded-sm bg-light" />

				<div class="absolute h-full flex flex-col justify-center items-center">
					<a
						v-for="(hash, index) in Object.keys(HASH_SECTIONS)"
						:key="index"
						:href="`#${hash}`"
						class="rounded-full h-4 w-4 cursor-pointer bg-light my-2 transition-all hover:h-6 hover:w-6 hover:my-1"
					/>
				</div>
			</div>
		</Container>

		<div id="mode-bubbles-container" />
	</main>
</template>
