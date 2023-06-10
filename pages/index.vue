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
}>({
	domElementRef: "home-three-app",
	isometricRoomScene: undefined,
});

onMounted(() => {
	if (process.client && !STATES.isometricRoomScene && initScene) {
		STATES.isometricRoomScene = new initScene({
			domElementRef: "#" + STATES.domElementRef,
		});

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
		<!-- <LandingView /> -->

		<main class="w-full bg-dark text-white">
			<div class="h-screen w-screen absolute e z-0">
				<canvas :id="STATES.domElementRef" class="fixed top-0 left-0" />
			</div>

			<Container class="relative z-20" />
		</main>
	</div>
</template>
