<script lang="ts" setup>
import type { Experience as _Experience } from "@/plugins/Experience.client";

// NUXT
const { $Experience } = useNuxtApp();
const Experience = $Experience as typeof _Experience | undefined;

// STATES
const STATES = reactive<{
	domElementID: string;
	experience?: _Experience;
	sceneProgress: number;
	displayLoader: boolean;
}>({
	domElementID: "home-three-app",
	experience: undefined,
	sceneProgress: 0,
	displayLoader: true,
});

onMounted(() => {
	if (process.client && !STATES.experience && Experience) {
		STATES.experience = new Experience({
			domElementRef: "#" + STATES.domElementID,
		});

		STATES.experience.preloader.on("start", (progress) => {
			STATES.sceneProgress = progress;
		});

		STATES.experience.preloader.on("progress", (progress, item) => {
			STATES.sceneProgress = progress;
			console.log(`On progress`, progress, item);
		});

		STATES.experience.preloader.on("load", (progress) => {
			STATES.sceneProgress = progress;
			STATES.displayLoader = false;
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
			:display="STATES.displayLoader"
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
