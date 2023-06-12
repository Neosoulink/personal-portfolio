<script lang="ts" setup>
import type { InitIsometricRoomScene } from "@/plugins/InitIsometricRoomScene.client";

// NUXT
const { $InitIsometricRoomScene } = useNuxtApp();
const initScene = $InitIsometricRoomScene as
	| typeof InitIsometricRoomScene
	| undefined;

// STATES
const STATES = reactive<{
	domElementRef: string;
	isometricRoomScene: InitIsometricRoomScene | undefined;
	sceneProgress: number;
	displayLoader: boolean;
}>({
	domElementRef: "home-three-app",
	isometricRoomScene: undefined,
	sceneProgress: 0,
	displayLoader: true,
});

onMounted(() => {
	if (process.client && !STATES.isometricRoomScene && initScene) {
		STATES.isometricRoomScene = new initScene({
			domElementRef: "#" + STATES.domElementRef,
		});

		STATES.isometricRoomScene.loadingManager.onStart = () => {
			STATES.sceneProgress = 0;
		};

		STATES.isometricRoomScene.loadingManager.onProgress = (
			_itemUrl,
			itemsLoaded,
			itemsToLoad
		) => {
			STATES.sceneProgress = (itemsLoaded / itemsToLoad) * 100;
			console.log(`On progress`, itemsLoaded / itemsToLoad);
		};

		STATES.isometricRoomScene.loadingManager.onLoad = () => {
			setTimeout(() => {
				STATES.displayLoader = false;

				setTimeout(() => {
					STATES.isometricRoomScene?.start();
				}, 200);
			}, 1000);
		};

		STATES.isometricRoomScene?.construct();
	}
});

onBeforeUnmount(() => {
	if (STATES.isometricRoomScene) {
		STATES.isometricRoomScene.destroy();
		STATES.isometricRoomScene = undefined;
	}
});
</script>

<template>
	<div>
		<LandingView
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
