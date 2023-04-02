import * as THREE from "three";
import GSAP from "gsap";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";

// HELPERS
import { initThree } from "./initThree.client";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// LOCAL FUNCTIONS
export const updateAllChildMeshEnvMap = (group: THREE.Object3D) => {
	group?.traverse((child) => {
		if (
			child instanceof THREE.Mesh &&
			child.material instanceof THREE.MeshStandardMaterial
		) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
};

export const initHomePageThree = () => {
	// DATA
	const SCROLL_DOM_BODY = document.querySelector("body");
	const CURSOR_LOCATION = {
		x: 0,
		y: 0,
	};
	const COMMON_PARAMS = {
		materialColor: "#ffeded",
		objectsDistance: 4,
	};

	let pageHeight = document.body.clientHeight - window.innerHeight;
	let windowScrollPosition = SCROLL_DOM_BODY?.scrollTop ?? 0;
	let currentScrollSection = 0;
	let previewsElapseTime = 0;
	let lastSectionReached = false;

	// APP
	const APP = initThree({
		appDom: "#home-three-app",
	});
	APP.camera.position.z = 6;
	APP.camera.fov = 35;
	APP.camera.updateProjectionMatrix();

	// LOADERS
	const LOADING_MANAGER = new THREE.LoadingManager();
	LOADING_MANAGER.onStart = () => {
		console.log("on start loading");
	};
	LOADING_MANAGER.onError = (url) => {
		console.log("on error", url);
	};
	LOADING_MANAGER.onProgress = (url, loaded) => {
		console.log("on progress", url, loaded);
	};
	LOADING_MANAGER.onLoad = () => {
		console.log("on loaded");
	};

	const DRACO_LOADER = new DRACOLoader();
	DRACO_LOADER.setDecoderPath("/decoders/draco/");

	const GLTF_LOADER = new GLTFLoader(LOADING_MANAGER);
	GLTF_LOADER.setDRACOLoader(DRACO_LOADER);

	const TEXTURE_LOADER = new THREE.TextureLoader(LOADING_MANAGER);

	// CLOCK
	const ANIMATION_CLOCK = new THREE.Clock();

	// GROUPS
	const APP_GROUP = new THREE.Group();
	const APP_GROUP_CAMERA = new THREE.Group();

	// LIGHTS
	const DIRECTIONAL_LIGHT = new THREE.DirectionalLight(0xffffff, 4);
	DIRECTIONAL_LIGHT.position.set(0, 0, 1);

	const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 0.2);

	// TEXTURES
	const SCROLL_BASED_GRADIENT_TEXTURE = TEXTURE_LOADER.load(
		"/textures/home-particle.png"
	);
	SCROLL_BASED_GRADIENT_TEXTURE.magFilter = THREE.NearestFilter;

	// FORMS
	const SECTION_MESHES_LIST: (THREE.Object3D | null)[] = [
		...Array(3).map(() => null),
	];

	GLTF_LOADER.load("/3d_models/code/code.glb", (glb) => {
		const CODE_GROUP = new THREE.Group();

		glb.scene.scale.set(0.18, 0.18, 0.18);

		CODE_GROUP.add(glb.scene);
		CODE_GROUP.position.set(2, -COMMON_PARAMS.objectsDistance * 0.1, 0);

		GLTF_LOADER.load("/3d_models/ts/ts.glb", (glb) => {
			glb.scene.scale.set(0.365, 0.365, 0.365);
			glb.scene.position.set(CODE_GROUP.position.x + 0.5, 0, 0);

			CODE_GROUP.add(glb.scene);
		});

		GLTF_LOADER.load("/3d_models/react/react.glb", (glb) => {
			glb.scene.scale.set(0.12, 0.12, 0.12);
			glb.scene.position.set(CODE_GROUP.position.x * -1.5, 0, 0);

			CODE_GROUP.add(glb.scene);
		});

		GLTF_LOADER.load("/3d_models/vue/vue.glb", (glb) => {
			glb.scene.scale.set(1, 1, 1);
			glb.scene.position.set(CODE_GROUP.position.x * -1.5, 0, 0);

			CODE_GROUP.add(glb.scene);
		});

		GLTF_LOADER.load("/3d_models/php/php.glb", (glb) => {
			glb.scene.scale.set(0.365, 0.365, 0.365);
			glb.scene.position.set(CODE_GROUP.position.x + 0.5, 0, 0);

			CODE_GROUP.add(glb.scene);
		});

		SECTION_MESHES_LIST[0] = CODE_GROUP;

		APP.scene.add(CODE_GROUP);
	});

	GLTF_LOADER.load("/3d_models/isometric_room/isometric_room.glb", (glb) => {
		SECTION_MESHES_LIST[2] = glb.scene;
		SECTION_MESHES_LIST[2].scale.set(0.35, 0.375, 0.35);
		SECTION_MESHES_LIST[2].position.set(
			1,
			-COMMON_PARAMS.objectsDistance * 2.19,
			12
		);
		SECTION_MESHES_LIST[2].rotation.y = Math.PI + 0.1;

		const OBJ_POS = {
			x: SECTION_MESHES_LIST[2].position.x,
			y: SECTION_MESHES_LIST[2].position.y,
			z: SECTION_MESHES_LIST[2].position.z,
		};
		const SHELVES_LIGHT_PARAMS = [0xd93700, 400, 0.689, 0.0275];

		const RECT_AREA_TOP_LIGHT = new THREE.RectAreaLight(0xffffff, 6, 1.5, 1.5);
		RECT_AREA_TOP_LIGHT.position.set(
			OBJ_POS.x - 1.5,
			OBJ_POS.y + 14,
			OBJ_POS.z - 12
		);
		RECT_AREA_TOP_LIGHT.lookAt(
			new THREE.Vector3(OBJ_POS.x - 1.5, OBJ_POS.y, OBJ_POS.z - 12)
		);

		const RECT_AREA_SHELVE_1_LIGHT = new THREE.RectAreaLight(
			...SHELVES_LIGHT_PARAMS
		);
		RECT_AREA_SHELVE_1_LIGHT.position.set(
			OBJ_POS.x - 5.242,
			OBJ_POS.y + 12.015,
			OBJ_POS.z - 10.82
		);
		RECT_AREA_SHELVE_1_LIGHT.lookAt(
			new THREE.Vector3(OBJ_POS.x, OBJ_POS.y + 4, OBJ_POS.z - 10.82)
		);

		const RECT_AREA_SHELVE_2_LIGHT = new THREE.RectAreaLight(
			...SHELVES_LIGHT_PARAMS
		);
		RECT_AREA_SHELVE_2_LIGHT.position.set(
			OBJ_POS.x - 5.242,
			OBJ_POS.y + 11.57,
			OBJ_POS.z - 12.7
		);
		RECT_AREA_SHELVE_2_LIGHT.lookAt(
			new THREE.Vector3(OBJ_POS.x, OBJ_POS.y + 5, OBJ_POS.z - 12.7)
		);

		const RECT_AREA_SHELVE_3_LIGHT = new THREE.RectAreaLight(
			...SHELVES_LIGHT_PARAMS
		);
		RECT_AREA_SHELVE_3_LIGHT.position.set(
			OBJ_POS.x + 1.05,
			OBJ_POS.y + 12.9,
			OBJ_POS.z - 16.095
		);
		RECT_AREA_SHELVE_3_LIGHT.lookAt(
			new THREE.Vector3(OBJ_POS.x + 1.05, OBJ_POS.y + 5, OBJ_POS.z)
		);

		SECTION_MESHES_LIST[2].add(
			RECT_AREA_TOP_LIGHT,
			RECT_AREA_SHELVE_1_LIGHT,
			RECT_AREA_SHELVE_2_LIGHT,
			RECT_AREA_SHELVE_3_LIGHT
		);

		APP.scene.add(SECTION_MESHES_LIST[2]);
	});

	// PARTICLES
	const PARTICLES_COUNT = 300;
	const PARTICLES_POSITIONS = new Float32Array(PARTICLES_COUNT * 3);

	for (let i = 0; i < PARTICLES_COUNT; i++) {
		PARTICLES_POSITIONS[i * 3 + 0] = (Math.random() - 0.65) * 10;
		PARTICLES_POSITIONS[i * 3 + 1] =
			COMMON_PARAMS.objectsDistance * 0.5 -
			Math.random() *
				COMMON_PARAMS.objectsDistance *
				(SECTION_MESHES_LIST.length - 0.8);
		PARTICLES_POSITIONS[i * 3 + 2] = (Math.random() - 0.35) * 10;
	}

	const PARTICLES_GEOMETRY = new THREE.BufferGeometry();
	PARTICLES_GEOMETRY.setAttribute(
		"position",
		new THREE.BufferAttribute(PARTICLES_POSITIONS, 3)
	);

	const PARTICLES_MATERIAL = new THREE.PointsMaterial({
		color: COMMON_PARAMS.materialColor,
		alphaMap: SCROLL_BASED_GRADIENT_TEXTURE,
		depthWrite: false,
		transparent: true,
		size: 0.09,
		sizeAttenuation: true,
	});

	const PARTICLES_POINTS = new THREE.Points(
		PARTICLES_GEOMETRY,
		PARTICLES_MATERIAL
	);

	// POSTPROCESSING
	const COMPOSER = new EffectComposer(APP.renderer);
	COMPOSER.addPass(new RenderPass(APP.scene, APP.camera));

	const GLITCH_PASS = new GlitchPass();
	GLITCH_PASS.enabled = false;
	COMPOSER.addPass(GLITCH_PASS);

	// SHADERS
	const RGB_SHIFT = new ShaderPass(RGBShiftShader);
	COMPOSER.addPass(RGB_SHIFT);

	// RENDERER
	APP.renderer.shadowMap.enabled = true;
	APP.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	APP.renderer.physicallyCorrectLights = true;
	APP.renderer.outputEncoding = THREE.sRGBEncoding;

	// ADD TO SCENE
	APP_GROUP.add(DIRECTIONAL_LIGHT, AMBIENT_LIGHT, PARTICLES_POINTS);
	APP_GROUP_CAMERA.add(APP.camera);
	APP.scene.add(APP_GROUP_CAMERA, APP_GROUP);

	// ANIMATIONS
	GSAP.fromTo(
		RGB_SHIFT.uniforms.angle,
		{ value: 0 },
		{ repeat: -1, duration: 4, value: Math.PI * 2, ease: "none" }
	);

	GSAP.fromTo(
		RGB_SHIFT.uniforms.amount,
		{ value: -0.002 },
		{ duration: 2, value: 0.0024, ease: "easeInOut" }
	);

	let firstSectionModelsAngle = 0;
	let firstSectionModelsRadius = 1.7;
	APP.animate(() => {
		const ELAPSED_TIME = ANIMATION_CLOCK.getElapsedTime();
		const DELTA_TIME = ELAPSED_TIME - previewsElapseTime;
		previewsElapseTime = ELAPSED_TIME;

		APP.camera.position.y =
			(-windowScrollPosition / APP.sceneSizes.height) *
			COMMON_PARAMS.objectsDistance;

		APP.camera.rotation.y = (windowScrollPosition / pageHeight) * Math.PI;

		if (SECTION_MESHES_LIST[0]) {
			SECTION_MESHES_LIST[0].rotation.y += DELTA_TIME * 0.1;
			SECTION_MESHES_LIST[0].rotation.x += DELTA_TIME * 0.12;

			const children = SECTION_MESHES_LIST[0].children;
			const child1 = children[1];
			const child2 = children[2];
			const child3 = children[3];
			const child4 = children[4];
			const cosAngle = Math.cos(firstSectionModelsAngle);
			const sinAngle = Math.sin(firstSectionModelsAngle);

			if (child1) {
				child1.position.set(
					SECTION_MESHES_LIST[0].position.x +
						firstSectionModelsRadius * cosAngle -
						firstSectionModelsRadius,
					SECTION_MESHES_LIST[0].position.y -
						firstSectionModelsRadius * sinAngle +
						1,
					SECTION_MESHES_LIST[0].position.z -
						firstSectionModelsRadius * sinAngle
				);

				child1.rotation.x =
					SECTION_MESHES_LIST[0].position.x +
					firstSectionModelsRadius * cosAngle -
					firstSectionModelsRadius;
				child1.rotation.y =
					SECTION_MESHES_LIST[0].position.y -
					firstSectionModelsRadius * sinAngle +
					1;
			}

			if (child2) {
				child2.position.set(
					SECTION_MESHES_LIST[0].position.x -
						firstSectionModelsRadius * cosAngle -
						firstSectionModelsRadius,
					SECTION_MESHES_LIST[0].position.y +
						firstSectionModelsRadius * sinAngle +
						1,
					SECTION_MESHES_LIST[0].position.z +
						firstSectionModelsRadius * sinAngle
				);

				child2.rotation.x =
					SECTION_MESHES_LIST[0].position.x -
					firstSectionModelsRadius * cosAngle -
					firstSectionModelsRadius;
				child2.rotation.y =
					SECTION_MESHES_LIST[0].position.y +
					firstSectionModelsRadius * sinAngle +
					1;
			}

			if (child3) {
				child3.position.set(
					SECTION_MESHES_LIST[0].position.x -
						firstSectionModelsRadius * sinAngle -
						firstSectionModelsRadius,
					SECTION_MESHES_LIST[0].position.y -
						firstSectionModelsRadius * cosAngle +
						1,
					SECTION_MESHES_LIST[0].position.z -
						firstSectionModelsRadius * cosAngle
				);

				child3.rotation.x =
					SECTION_MESHES_LIST[0].position.x -
					firstSectionModelsRadius * cosAngle -
					firstSectionModelsRadius;
				child3.rotation.y =
					SECTION_MESHES_LIST[0].position.y -
					firstSectionModelsRadius * sinAngle +
					1;
			}

			if (child4) {
				child4.position.set(
					SECTION_MESHES_LIST[0].position.x +
						firstSectionModelsRadius * sinAngle -
						firstSectionModelsRadius,
					SECTION_MESHES_LIST[0].position.y +
						firstSectionModelsRadius * cosAngle +
						1,
					SECTION_MESHES_LIST[0].position.z +
						firstSectionModelsRadius * cosAngle
				);

				child4.rotation.y =
					SECTION_MESHES_LIST[0].position.x +
					firstSectionModelsRadius * cosAngle -
					firstSectionModelsRadius;
				child4.rotation.y =
					SECTION_MESHES_LIST[0].position.y +
					firstSectionModelsRadius * sinAngle +
					1;
			}

			firstSectionModelsAngle += 0.01;
		}

		if (SECTION_MESHES_LIST[2]) {
			const _DIRECTION = new THREE.Vector3();
			APP.camera.getWorldDirection(_DIRECTION);

			const _ADJUST_CAMERA_POSITION = APP.camera.position
				.clone()
				.add(_DIRECTION.multiplyScalar(6.5));

			SECTION_MESHES_LIST[2].position.x = _ADJUST_CAMERA_POSITION.x;
			SECTION_MESHES_LIST[2].position.z = _ADJUST_CAMERA_POSITION.z;
		}

		APP_GROUP_CAMERA.position.x +=
			(CURSOR_LOCATION.x * 0.5 - APP_GROUP_CAMERA.position.x) * 5 * DELTA_TIME;
		APP_GROUP_CAMERA.position.y +=
			(-CURSOR_LOCATION.y * 0.5 - APP_GROUP_CAMERA.position.y) * 5 * DELTA_TIME;

		COMPOSER.render();
	}, false);

	// EVENTS
	SCROLL_DOM_BODY?.addEventListener("mousemove", (e) => {
		CURSOR_LOCATION.x = e.clientX / APP.sceneSizes.width - 0.5;
		CURSOR_LOCATION.y = e.clientY / APP.sceneSizes.height - 0.5;
	});

	const onWindowScroll = () => {
		windowScrollPosition = window.scrollY;

		const _CURRENT_NEW_SECTION = Math.round(
			windowScrollPosition / APP.sceneSizes.height
		);

		if (_CURRENT_NEW_SECTION !== currentScrollSection) {
			const _LAST_SECTION = Math.round(pageHeight / APP.sceneSizes.height);

			currentScrollSection = _CURRENT_NEW_SECTION;

			if (currentScrollSection === _LAST_SECTION) {
				lastSectionReached = true;
				DIRECTIONAL_LIGHT.visible = false;
				RGB_SHIFT.enabled = false;

				// if (SECTION_MESHES_LIST[2]) {
				// 	GSAP.fromTo(
				// 		SECTION_MESHES_LIST[2].position,
				// 		{ y: -COMMON_PARAMS.objectsDistance * 2.19 - 5 },
				// 		{
				// 			duration: 1,
				// 			ease: "power2.inOut",
				// 			y: "+=" + 5,
				// 		}
				// 	);
				// }
			} else if (lastSectionReached) {
				lastSectionReached = false;
				DIRECTIONAL_LIGHT.visible = true;
				RGB_SHIFT.enabled = true;

				// if (SECTION_MESHES_LIST[2]) {
				// 	GSAP.fromTo(
				// 		SECTION_MESHES_LIST[2].position,
				// 		{
				// 			y: -COMMON_PARAMS.objectsDistance * 2.19,
				// 		},
				// 		{
				// 			duration: 1,
				// 			ease: "power2.inOut",
				// 			y: "-=" + 5,
				// 		}
				// 	);
				// }
			}
		}
	};

	window.addEventListener("load", () => {
		onWindowScroll();
	});
	window?.addEventListener("scroll", onWindowScroll);

	return {
		app: APP,
		forms: {},
		postProcessing: {
			COMPOSER,
			GLITCH_PASS,
		},
		clear: () => {
			window.removeEventListener("scroll", () => {});
			window.removeEventListener("resize", () => {});
		},
	};
};

export default defineNuxtPlugin(() => {
	return {
		provide: {
			initHomePageThree,
		},
	};
});
