<template>
	<div>
		<LandingView />

		<main class="w-full bg-dark-radial-gradient text-white">
			<section class="h-screen flex items-center pl-28">
				<h1 ref="firstTitle" class="text-glitch text-9xl font-semibold relative" :data-text="firstTitle">{{
					firstTitle
				}}</h1>
			</section>
		</main>
	</div>
</template>

<script lang="ts">
export default {
	data() {
		return {
			firstTitle: "I MAKE THINKS",
		};
	},
	mounted() {
		(this.$refs.firstTitle as HTMLHeadingElement).addEventListener("mouseover", () => {
			this.firstTitle = "I BREAK THINKS"
		});
		(this.$refs.firstTitle as HTMLHeadingElement).addEventListener("mouseout", () => {
			this.firstTitle = "I MAKE THINKS"
		});
	},
	beforeUnmount() {
		(this.$refs.firstTitle as HTMLHeadingElement).removeEventListener("mouseover", () => { });
		(this.$refs.firstTitle as HTMLHeadingElement).removeEventListener("mouseout", () => { });

	}
}
</script>
