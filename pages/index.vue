<template>
	<div>
		<!-- <LandingView /> -->

		<main class="w-full bg-dark text-white">
			<div class="h-screen w-screen absolute bg-white z-0">
				<div class="h-full w-full bg-dark-radial-gradient" />

				<canvas id="home-three-app" class="fixed top-0 left-0" />
			</div>

			<Container class="relative z-20">
				<section class="h-screen flex items-center">
					<h1
						ref="firstTitle"
						class="text-glitch text-9xl font-medium relative"
						:data-text="firstTitle"
					>
						{{ firstTitle }}
					</h1>
				</section>

				<section
					class="min-h-screen flex flex-row justify-center items-center p-10"
				>
					<div
						class="md:max-w-screen-sm p-12 rounded-3xl border-t-8 border-t-primary-900 bg-white/10"
					>
						<h2 class="font-medium text-4xl mb-8">About me</h2>

						<div class="text-base text-justify mb-8">
							<p class="mb-5">A simple passionate developer .</p>

							<p
								v-for="(item, index) in aboutMeParagraphs"
								:key="index"
								:class="index === aboutMeParagraphs.length - 1 ? '' : 'mb-4'"
							>
								{{ item }}
							</p>
						</div>

						<div class="flex flex-row justify-end w-full">
							<div
								v-for="(item, index) in [1, 2, 3]"
								:key="index"
								class="flex h-9 w-9 rounded-full bg-primary-900 ml-6"
							/>
						</div>
					</div>
				</section>

				<section
					class="h-screen flex md:justify-end justify-center items-center md:px-28"
				>
					<div class="md:max-w-screen-sm md:px-28">
						<button
							type="button"
							href=""
							:onClick="() => homeThree?.handleMessaging()"
							class="font-semibold border-2 border-primary-900 rounded-3xl py-2 px-16"
						>
							Send me a message
						</button>
					</div>
				</section>
			</Container>
		</main>
	</div>
</template>

<script lang="ts">
// TYPES
import type { initThreeResponseType } from "@/plugins/initThree.client";
import type { initHomePageThree } from "@/plugins/initHomePageThree.client";

export default {
	data() {
		let THREE_APP: ReturnType<typeof initHomePageThree> | undefined;

		return {
			firstTitle: "I MAKE THINKS",
			homeThree: THREE_APP,
			aboutMeParagraphs: [
				"I like to develop stuff and it's a real pleasure to have positive feedback from my clients as well as from my users (TheNirvana) .",
				"I greatly admire & respect those who also develop and do great things from a few lines of code .",
				"As for work, I am pragmatic, I like to learn from others and I always try to do better than before ",
				"I adapt very quickly to a new work environment and I’m comfortable working in a team (I'm actually quite calm).",
			],
		};
	},
	async mounted() {
		if (process.client && !this.homeThree) {
			const homeThree = this.$initHomePageThree();

			(this.$refs?.firstTitle as HTMLHeadingElement).addEventListener(
				"mouseover",
				() => {
					this.firstTitle = "I BREAK THINKS";
					homeThree.postProcessing.GLITCH_PASS.enabled = true;
					const INTERVAL = setInterval(() => {
						homeThree.postProcessing.GLITCH_PASS.curF = 0;
					}, 100);

					setTimeout(() => {
						clearInterval(INTERVAL);
						homeThree.postProcessing.GLITCH_PASS.curF = 0;
					}, 500);
				}
			);
			(this.$refs?.firstTitle as HTMLHeadingElement).addEventListener(
				"mouseout",
				() => {
					this.firstTitle = "I MAKE THINKS";
					homeThree.postProcessing.GLITCH_PASS.enabled = false;
					homeThree.postProcessing.GLITCH_PASS.clear = true;
					homeThree.postProcessing.GLITCH_PASS.curF = 0;
				}
			);

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
			this.homeThree.app.scene.remove();
			this.homeThree.clear();
			this.homeThree = undefined;
		}
	},
};
</script>
