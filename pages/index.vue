<script lang="ts" setup>
import type { Experience } from "@/plugins/Experience";

// NUXT
const { $Experience } = useNuxtApp();
const initScene = $Experience as typeof Experience | undefined;

// STATES
const STATES = reactive<{
	domElementRef: string;
	experience: Experience | undefined;
	sceneProgress: number;
	displayLoader: boolean;
}>({
	domElementRef: "home-three-app",
	experience: undefined,
	sceneProgress: 0,
	displayLoader: true,
});

onMounted(() => {
	if (process.client && !STATES.experience && initScene) {
		STATES.experience = new initScene({
			domElementRef: "#" + STATES.domElementRef,
		});

		STATES.experience.loadingManager.onStart = () => {
			STATES.sceneProgress = 0;
		};

		STATES.experience.loadingManager.onProgress = (
			_itemUrl,
			itemsLoaded,
			itemsToLoad
		) => {
			STATES.sceneProgress = (itemsLoaded / itemsToLoad) * 100;
			console.log(`On progress`, itemsLoaded / itemsToLoad);
		};

		STATES.experience.loadingManager.onLoad = () => {
			setTimeout(() => {
				STATES.displayLoader = false;

				setTimeout(() => {
					STATES.experience?.start();
				}, 200);
			}, 1000);
		};

		STATES.experience?.construct();
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
				<canvas :id="STATES.domElementRef" class="fixed top-0 left-0" />
			</div>

			<Container class="relative z-20" />
		</main>
	</div>
</template>
