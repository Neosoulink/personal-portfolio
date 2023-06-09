<template>
	<div>
		<!-- <LandingView /> -->

		<main class="w-full bg-dark text-white">
			<div class="h-screen w-screen absolute bg-white z-0">
				<canvas id="home-three-app" class="fixed top-0 left-0" />
			</div>

			<Container class="relative z-20" />
		</main>
	</div>
</template>

<script lang="ts">
// TYPES
import type { InitIsometricRoomScene } from "@/plugins/InitIsometricRoomScene.client";

export default {
	data() {
		let isometricRoomScene: InitIsometricRoomScene | undefined;

		return {
			isometricRoomScene,
		};
	},
	async mounted() {
		if (process.client && !this.isometricRoomScene) {
			// @ts-ignore
			this.isometricRoomScene = new this.$InitIsometricRoomScene();

			this.isometricRoomScene?.construct();
		}
	},
	beforeUnmount() {
		(this.$refs.firstTitle as HTMLHeadingElement).removeEventListener(
			"mouseover",
			() => {}
		);
		(this.$refs.firstTitle as HTMLHeadingElement).removeEventListener(
			"mouseout",
			() => {}
		);

		if (this.isometricRoomScene) {
			this.isometricRoomScene.destroy();
			this.isometricRoomScene = undefined;
		}
	},
};
</script>
