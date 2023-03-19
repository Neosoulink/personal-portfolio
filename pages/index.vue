<template>
	<div>
		<!-- <LandingView /> -->

		<main class="w-full bg-dark text-white">
			<div class="h-screen w-screen absolute bg-white z-0">
				<div class="h-full w-full bg-dark-radial-gradient" />

				<canvas id="home-three-app" class="fixed top-0 left-0" />
			</div>

			<div class="relative z-20">
				<section class="h-screen flex items-center px-28">
					<h1
						ref="firstTitle"
						class="text-glitch text-9xl font-semibold relative"
						:data-text="firstTitle"
					>
						{{ firstTitle }}
					</h1>
				</section>

				<section
					class="min-h-screen flex flex-row justify-center items-center px-28"
				>
					<div class="flex flex-col justify-center items-center mr-20">
						<div
							class="w-48 h-48 rounded-full border-4 border-white bg-primary-900 mb-10"
						/>

						<a
							href=""
							class="font-semibold border-2 border-primary-900 rounded-3xl py-2 px-4"
							>Download resume</a
						>
					</div>

					<div
						class="text-xl text-justify w-full border-l-4 border-l-primary-900 py-5 px-20"
					>
						<p class="mb-10">A simple passionate developer .</p>

						<p class="mb-10">
							I like to develop stuff and it's a real pleasure to have positive
							feedback from my clients as well as from my users (The Nirvana) .
						</p>

						<p class="mb-10">
							I greatly admire & respect those who also develop and do great
							things from a few lines of code .
						</p>

						<p class="mb-10">
							As for work, I am pragmatic, I like to learn from others and I
							always try to do better than before .
						</p>

						<p class="">
							I adapt very quickly to a new work environment and I’m comfortable
							working in a team (I'm actually quite calm).
						</p>
					</div>

					<div class="flex flex-col">
						<div
							v-for="(item, index) in [1, 2, 3]"
							:key="index"
							class="flex h-10 w-10 rounded-full bg-primary-900 my-5"
						/>
					</div>
				</section>

				<section class="h-screen flex justify-end items-center px-28">
					<form class="p-10 border-r-4 border-r-primary-900 w-2/6">
						<label class="block mb-10">
							<span class="block font-medium text-white">Your name</span>
							<input
								type="text"
								class="mt-1 block w-full px-3 py-2 bg-transparent border-2 border-primary-900 ring-primary-900 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:right-1 focus:ring-primary-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
							/>
						</label>

						<label class="block mb-10">
							<span class="block font-medium text-white">Email</span>
							<input
								type="text"
								class="mt-1 block w-full px-3 py-2 bg-transparent border-2 border-primary-900 ring-primary-900 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:right-1 focus:ring-primary-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
							/>
						</label>

						<label class="block mb-10">
							<span class="block font-medium text-white">Message content</span>
							<textarea
								type="text"
								class="mt-1 block w-full px-3 py-2 bg-transparent border-2 border-primary-900 ring-primary-900 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:right-1 focus:ring-primary-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
							></textarea>
						</label>

						<button
							type="submit"
							href=""
							class="font-semibold border-2 border-primary-900 rounded-3xl py-2 px-4 w-full mb-10"
						>
							Send
						</button>

						<div class="flex flex-row justify-center">
							<div
								v-for="(item, index) in [1, 2, 3, 4, 5]"
								:key="index"
								class="p-5 mx-4 rounded-full bg-primary-900"
							/>
						</div>
					</form>
				</section>
			</div>
		</main>
	</div>
</template>

<script lang="ts">
import * as THREE from "three";
import GSAP from "gsap";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";

// TYPES
import type { initThreeResponseType } from "@/plugins/initThree.client";

export default {
	data() {
		let THREE_APP: initThreeResponseType | undefined;

		return {
			firstTitle: "I MAKE THINKS",
			homeThreeApp: THREE_APP,
		};
	},
	async mounted() {
		if (process.client && !this.homeThreeApp) {
			const homeThreeApp = this.$initHomePageThree();

			(this.$refs?.firstTitle as HTMLHeadingElement).addEventListener(
				"mouseover",
				() => {
					this.firstTitle = "I BREAK THINKS";
					homeThreeApp.postProcessing.GLITCH_PASS.enabled = true;
				}
			);
			(this.$refs?.firstTitle as HTMLHeadingElement).addEventListener(
				"mouseout",
				() => {
					this.firstTitle = "I MAKE THINKS";
					homeThreeApp.postProcessing.GLITCH_PASS.enabled = false;
					homeThreeApp.postProcessing.GLITCH_PASS.clear = true;
					homeThreeApp.postProcessing.GLITCH_PASS.curF = 0;
				}
			);
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

		if (this.homeThreeApp) {
			this.homeThreeApp.scene.remove();
			this.homeThreeApp = undefined;
		}
	},
};
</script>
