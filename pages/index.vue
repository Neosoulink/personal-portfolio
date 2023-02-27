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
	mounted() {
		if (process.client && !this.homeThreeApp) {
			const LOADING_MANAGER = new THREE.LoadingManager();
			LOADING_MANAGER.onStart = () => {
				console.log("on start loading");
			};

			// TEXTURE LOADER
			const TEXTURE_LOADER = new THREE.TextureLoader(LOADING_MANAGER);

			// GROUPS
			const GROUP_APP_CAMERA = new THREE.Group();
			const SCROLL_BASED_GROUP = new THREE.Group();

			// CLOCK
			const ANIMATION_CLOCK = new THREE.Clock();

			// DATA
			const SCROLL_BASED_DOM_BODY = document.querySelector("body");
			const SCROLL_BASED_PARAMS = {
				materialColor: "#ffeded",
				objectsDistance: 4,
			};
			const CURSOR_POS = {
				x: 0,
				y: 0,
			};

			let windowClientY = SCROLL_BASED_DOM_BODY?.scrollTop ?? 0;
			let scrollBasedCurrentSection = 0;
			let previewsElapseTime = 0;

			// APP
			const HOME_THREE_APP = this.$initThree({
				appDom: "#home-three-app",
			});
			HOME_THREE_APP.camera.position.z = 6;
			HOME_THREE_APP.camera.fov = 35;
			HOME_THREE_APP.camera.updateProjectionMatrix();

			// Lights
			const SCROLL_BASED_DIRECTIONAL_LIGHT = new THREE.DirectionalLight(
				"#ffffff",
				1
			);
			SCROLL_BASED_DIRECTIONAL_LIGHT.position.set(1, 1, 0);

			// Textures
			const SCROLL_BASED_GRADIENT_TEXTURE = TEXTURE_LOADER.load(
				"@/assets/img/textures/shadow-gradient.jpg"
			);
			SCROLL_BASED_GRADIENT_TEXTURE.magFilter = THREE.NearestFilter;

			// Material
			const SCROLL_BASED_MATERIAL = new THREE.MeshToonMaterial({
				color: SCROLL_BASED_PARAMS.materialColor,
				// gradientMap: SCROLL_BASED_GRADIENT_TEXTURE,
			});

			// Meshes
			const SCROLL_BASED_MESH1 = new THREE.Mesh(
				new THREE.TorusGeometry(1, 0.4, 16, 60),
				SCROLL_BASED_MATERIAL
			);
			const SCROLL_BASED_MESH2 = new THREE.Mesh(
				new THREE.ConeGeometry(1, 2, 32),
				SCROLL_BASED_MATERIAL
			);
			const SCROLL_BASED_MESH3 = new THREE.Mesh(
				new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
				SCROLL_BASED_MATERIAL
			);

			const SCROLL_BASED_MESHES_LIST = [
				SCROLL_BASED_MESH1,
				SCROLL_BASED_MESH2,
				SCROLL_BASED_MESH3,
			];

			SCROLL_BASED_MESH1.position.y = -SCROLL_BASED_PARAMS.objectsDistance * 0;
			SCROLL_BASED_MESH2.position.y = -SCROLL_BASED_PARAMS.objectsDistance * 1;
			SCROLL_BASED_MESH3.position.y = -SCROLL_BASED_PARAMS.objectsDistance * 2;
			SCROLL_BASED_MESH1.position.x = 2;
			SCROLL_BASED_MESH2.position.x = 0;
			SCROLL_BASED_MESH3.position.x = -2;

			// Geometry
			const SCROLL_BASED_PARTICLES_COUNT = 300;
			const SCROLL_BASED_PARTICLES_POSITIONS = new Float32Array(
				SCROLL_BASED_PARTICLES_COUNT * 3
			);

			for (let i = 0; i < SCROLL_BASED_PARTICLES_COUNT; i++) {
				SCROLL_BASED_PARTICLES_POSITIONS[i * 3 + 0] =
					(Math.random() - 0.5) * 10;
				SCROLL_BASED_PARTICLES_POSITIONS[i * 3 + 1] =
					SCROLL_BASED_PARAMS.objectsDistance * 0.5 -
					Math.random() *
						SCROLL_BASED_PARAMS.objectsDistance *
						SCROLL_BASED_MESHES_LIST.length;
				SCROLL_BASED_PARTICLES_POSITIONS[i * 3 + 2] =
					(Math.random() - 0.5) * 10;
			}

			const SCROLL_BASED_PARTICLES_GEOMETRY = new THREE.BufferGeometry();
			SCROLL_BASED_PARTICLES_GEOMETRY.setAttribute(
				"position",
				new THREE.BufferAttribute(SCROLL_BASED_PARTICLES_POSITIONS, 3)
			);

			const SCROLL_BASED_PARTICLES_MATERIAL = new THREE.PointsMaterial({
				color: SCROLL_BASED_PARAMS.materialColor,
				sizeAttenuation: true,
				size: 0.03,
			});

			const SCROLL_BASED_PARTICLES_POINTS = new THREE.Points(
				SCROLL_BASED_PARTICLES_GEOMETRY,
				SCROLL_BASED_PARTICLES_MATERIAL
			);

			// POSTPROCESSING
			const COMPOSER = new EffectComposer(HOME_THREE_APP.renderer);
			COMPOSER.addPass(
				new RenderPass(HOME_THREE_APP.scene, HOME_THREE_APP.camera)
			);

			const GLITCH_PASS = new GlitchPass();
			GLITCH_PASS.enabled = false;
			COMPOSER.addPass(GLITCH_PASS);

			var EFFECT_COPY = new ShaderPass(CopyShader);
			EFFECT_COPY.renderToScreen = true;
			COMPOSER.addPass(EFFECT_COPY);

			// SHADERS
			let rgbShift = new ShaderPass(RGBShiftShader);

			rgbShift.uniforms.amount.value = 0.003;
			rgbShift.uniforms.angle.value = Math.PI * 2;
			rgbShift.enabled = true;

			COMPOSER.addPass(rgbShift);

			GSAP.fromTo(
				rgbShift.uniforms.angle,
				{},
				{
					repeat: -1,
					duration: 4,
					value: 0,
					ease: "none",
				}
			);

			GSAP.fromTo(
				rgbShift.uniforms.amount,
				{},
				{ repeat: -1, duration: 4, value: 0.004, ease: "none" }
			);

			GROUP_APP_CAMERA.add(HOME_THREE_APP.camera);

			SCROLL_BASED_GROUP.add(
				SCROLL_BASED_DIRECTIONAL_LIGHT,
				SCROLL_BASED_MESH1,
				// SCROLL_BASED_MESH2,
				SCROLL_BASED_MESH3,
				SCROLL_BASED_PARTICLES_POINTS
			);

			HOME_THREE_APP.scene.add(GROUP_APP_CAMERA, SCROLL_BASED_GROUP);

			HOME_THREE_APP.animate(() => {
				const ELAPSED_TIME = ANIMATION_CLOCK.getElapsedTime();
				const DELTA_TIME = ELAPSED_TIME - previewsElapseTime;
				previewsElapseTime = ELAPSED_TIME;

				for (const SCROLL_BASED_MESH of SCROLL_BASED_MESHES_LIST) {
					SCROLL_BASED_MESH.rotation.y += DELTA_TIME * 0.1;
					SCROLL_BASED_MESH.rotation.x += DELTA_TIME * 0.12;
				}

				HOME_THREE_APP.camera.position.y =
					(-windowClientY / HOME_THREE_APP.sceneSizes.height) *
					SCROLL_BASED_PARAMS.objectsDistance;
				GROUP_APP_CAMERA.position.x +=
					(CURSOR_POS.x * 0.5 - GROUP_APP_CAMERA.position.x) * 5 * DELTA_TIME;
				GROUP_APP_CAMERA.position.y +=
					(-CURSOR_POS.y * 0.5 - GROUP_APP_CAMERA.position.y) * 5 * DELTA_TIME;

				COMPOSER.render();
			}, false);

			SCROLL_BASED_DOM_BODY?.addEventListener("mousemove", (e) => {
				CURSOR_POS.x = e.clientX / HOME_THREE_APP.sceneSizes.width - 0.5;
				CURSOR_POS.y = e.clientY / HOME_THREE_APP.sceneSizes.height - 0.5;
			});

			GSAP.to(SCROLL_BASED_MESHES_LIST[scrollBasedCurrentSection].rotation, {
				duration: 1.5,
				ease: "power2.inOut",
				x: "+=6",
				y: "+=3",
				z: "+=1.5",
			});

			window?.addEventListener("scroll", () => {
				windowClientY = window.scrollY ?? 0;

				const SCROLL_BASED_NEW_SECTION = Math.round(
					windowClientY / HOME_THREE_APP.sceneSizes.height
				);

				if (SCROLL_BASED_NEW_SECTION != scrollBasedCurrentSection) {
					scrollBasedCurrentSection = SCROLL_BASED_NEW_SECTION;

					GSAP.to(
						SCROLL_BASED_MESHES_LIST[scrollBasedCurrentSection].rotation,
						{
							duration: 1.5,
							ease: "power2.inOut",
							x: "+=6",
							y: "+=3",
							z: "+=1.5",
						}
					);
				}
			});

			window.addEventListener("resize", () => {
				COMPOSER.setSize(window.innerWidth, window.innerHeight);
			});

			(this.$refs?.firstTitle as HTMLHeadingElement).addEventListener(
				"mouseover",
				() => {
					this.firstTitle = "I BREAK THINKS";
					GLITCH_PASS.enabled = true;
					// GLITCH_PASS.goWild = true;
				}
			);
			(this.$refs?.firstTitle as HTMLHeadingElement).addEventListener(
				"mouseout",
				() => {
					this.firstTitle = "I MAKE THINKS";
					GLITCH_PASS.enabled = false;
					// GLITCH_PASS.goWild = false;
				}
			);

			this.homeThreeApp = HOME_THREE_APP;
		}
	},
	created() {},
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
