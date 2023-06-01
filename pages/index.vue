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
import type { initHomePageThree } from "@/plugins/initHomePageThree.client";

export default {
	data() {
		let THREE_APP: ReturnType<typeof initHomePageThree> | undefined;

		return {
			homeThree: THREE_APP,
		};
	},
	async mounted() {
		if (process.client && !this.homeThree) {
			const homeThree = this.$initHomePageThree();

			this.homeThree = homeThree;
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

		if (this.homeThree) {
			this.homeThree.app.destroy();
			this.homeThree.app.scene.remove();
			this.homeThree.clear();
			this.homeThree = undefined;
		}
	},
};
</script>
