<script lang="ts" setup>
// @ts-ignore
import type { HomeExperience as _HomeExperience } from "@/plugins/HomeExperience.client";

// NUXT
const { $HomeExperience } = useNuxtApp();
const HomeExperience = $HomeExperience as typeof _HomeExperience | undefined;

// STATES
const STATES = reactive<{
	domElementID: string;
	experience?: _HomeExperience;
	sceneProgress: number;
	displayLoader: boolean;
	currentLoadedItem?: string;
}>({
	domElementID: "home-three-app",
	sceneProgress: 0,
	displayLoader: true,
});

onMounted(() => {
	if (process.client && !STATES.experience && HomeExperience) {
		STATES.experience = new HomeExperience({
			domElementRef: "#" + STATES.domElementID,
		});

		STATES.experience.preloader?.on("start", (progress: number) => {
			STATES.sceneProgress = progress;
		});

		STATES.experience.preloader?.on(
			"progress",
			(progress: number, item: string) => {
				STATES.sceneProgress = progress;
				STATES.currentLoadedItem = item.replace(/^.*\//, "");
			}
		);

		STATES.experience.preloader?.on("load", (progress: number) => {
			STATES.sceneProgress = progress;
		});
	}
});

onBeforeUnmount(() => {
	if (STATES.experience) {
		STATES.experience.destroy();
		STATES.experience = undefined;
	}
});
</script>

<template>
	<div>
		<LandingLoader
			:progress="STATES.sceneProgress"
			:loadedItem="STATES.currentLoadedItem"
		/>

		<main class="w-full bg-dark text-white">
			<div class="h-screen w-screen absolute e z-0">
				<canvas :id="STATES.domElementID" class="fixed top-0 left-0" />
			</div>

			<Container class="relative z-20" />
		</main>
	</div>
</template>
@/plugins/Experience.client/Experience.client
