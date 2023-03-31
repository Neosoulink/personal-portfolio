import * as THREE from "three";
import GSAP from "gsap";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

// HELPERS
import { initThree } from "./initThree.client";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// LOCAL FUNCTIONS
const gsapRotationSpinAnimation = (object: THREE.Object3D<THREE.Event>) => {
	GSAP.to(object.rotation, {
		duration: 1.5,
		ease: "power2.inOut",
		x: "+=" + Math.PI * 2,
		y: "+=" + Math.PI * 2,
		z: "+=" + Math.PI * 2,
	});
};

const updateAllChildMeshEnvMap = (group: THREE.Object3D) => {
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
	const SCROLL_BASED_DOM_BODY = document.querySelector("body");
	const CURSOR_LOCATION = {
		x: 0,
		y: 0,
	};
	const COMMON_PARAMS = {
		materialColor: "#ffeded",
		objectsDistance: 4,
	};

	let pageHeight = document.body.clientHeight - window.innerHeight;
	let windowScrollPosition = SCROLL_BASED_DOM_BODY?.scrollTop ?? 0;
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

	GLTF_LOADER.load("/3d_models/notebook/notebook.glb", (glb) => {
		const NOTE_BOOK_GROUP = glb.scene;

		NOTE_BOOK_GROUP.scale.set(0.5, 0.5, 0.5);
		NOTE_BOOK_GROUP.position.set(2, -COMMON_PARAMS.objectsDistance * 0, 0);

		APP.scene.add(NOTE_BOOK_GROUP);

		GLTF_LOADER.load("/3d_models/i_phone/i_phone.glb", (glb) => {
			glb.scene.scale.set(0.365, 0.365, 0.365);
			glb.scene.position.set(NOTE_BOOK_GROUP.position.x + 0.5, 0, 0);

			NOTE_BOOK_GROUP.add(glb.scene);
		});

		GLTF_LOADER.load("/3d_models/mouse/mouse.glb", (glb) => {
			glb.scene.scale.set(0.635, 0.635, 0.635);
			glb.scene.position.set(NOTE_BOOK_GROUP.position.x * -1.5, 0, 0);

			NOTE_BOOK_GROUP.add(glb.scene);
		});

		GLTF_LOADER.load("/3d_models/keyboard/keyboard.glb", (glb) => {
			glb.scene.scale.set(0.2, 0.2, 0.2);
			glb.scene.position.set(NOTE_BOOK_GROUP.position.x * -1.5, 0, 0);

			NOTE_BOOK_GROUP.add(glb.scene);
		});

		SECTION_MESHES_LIST[0] = NOTE_BOOK_GROUP;
		APP.scene.add(NOTE_BOOK_GROUP);
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

		SECTION_MESHES_LIST[2] && updateAllChildMeshEnvMap(SECTION_MESHES_LIST[2]);
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
	let rgbShift = new ShaderPass(RGBShiftShader);

	rgbShift.uniforms.amount.value = 0.003;
	rgbShift.uniforms.angle.value = Math.PI * 2;

	COMPOSER.addPass(rgbShift);

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

	let angle = 0;
	let radius = 2.5;
	APP.animate(() => {
		const ELAPSED_TIME = ANIMATION_CLOCK.getElapsedTime();
		const DELTA_TIME = ELAPSED_TIME - previewsElapseTime;
		previewsElapseTime = ELAPSED_TIME;

		for (let i = 0; i < SECTION_MESHES_LIST.length; i++) {
			const SCROLL_BASED_MESH = SECTION_MESHES_LIST[i];

			if (SCROLL_BASED_MESH) {
				if (i !== 2) {
					SCROLL_BASED_MESH.rotation.y += DELTA_TIME * 0.1;
					SCROLL_BASED_MESH.rotation.x += DELTA_TIME * 0.12;
				}

				if (i === 0) {
					if (SCROLL_BASED_MESH.children[1]) {
						SCROLL_BASED_MESH.children[1].position.x =
							SCROLL_BASED_MESH.position.x + radius * Math.cos(angle) - 2.5;
						SCROLL_BASED_MESH.children[1].position.y =
							SCROLL_BASED_MESH.position.y - radius * Math.sin(angle) + 1;
						SCROLL_BASED_MESH.children[1].position.z =
							SCROLL_BASED_MESH.position.y - radius * Math.sin(angle);

						SCROLL_BASED_MESH.children[1].rotation.x =
							SCROLL_BASED_MESH.position.x + radius * Math.cos(angle) - 2.5;
						SCROLL_BASED_MESH.children[1].rotation.y =
							SCROLL_BASED_MESH.position.y - radius * Math.sin(angle) + 1;
					}

					if (SCROLL_BASED_MESH.children[2]) {
						SCROLL_BASED_MESH.children[2].position.x =
							SCROLL_BASED_MESH.position.x - radius * Math.cos(angle) - 2.5;
						SCROLL_BASED_MESH.children[2].position.y =
							SCROLL_BASED_MESH.position.y + radius * Math.sin(angle) + 1;
						SCROLL_BASED_MESH.children[2].position.z =
							SCROLL_BASED_MESH.position.y + radius * Math.sin(angle);

						SCROLL_BASED_MESH.children[2].rotation.x =
							SCROLL_BASED_MESH.position.x - radius * Math.cos(angle) - 2.5;
						SCROLL_BASED_MESH.children[2].rotation.y =
							SCROLL_BASED_MESH.position.y + radius * Math.sin(angle) + 1;
					}

					if (SCROLL_BASED_MESH.children[3]) {
						SCROLL_BASED_MESH.children[3].position.x =
							SCROLL_BASED_MESH.position.x - radius * Math.sin(angle) - 2.5;
						SCROLL_BASED_MESH.children[3].position.y =
							SCROLL_BASED_MESH.position.y - radius * Math.cos(angle) + 1;
						SCROLL_BASED_MESH.children[3].position.z =
							SCROLL_BASED_MESH.position.y - radius * Math.cos(angle);

						SCROLL_BASED_MESH.children[3].rotation.x =
							SCROLL_BASED_MESH.position.x - radius * Math.cos(angle) - 2.5;
						SCROLL_BASED_MESH.children[3].rotation.y =
							SCROLL_BASED_MESH.position.y - radius * Math.sin(angle) + 1;
					}

					angle += 0.01;
				}
			}
		}

		APP.camera.position.y =
			(-windowScrollPosition / APP.sceneSizes.height) *
			COMMON_PARAMS.objectsDistance;

		if (!lastSectionReached) {
			APP.camera.rotation.y = (windowScrollPosition / pageHeight) * Math.PI;
		}

		APP_GROUP_CAMERA.position.x +=
			(CURSOR_LOCATION.x * 0.5 - APP_GROUP_CAMERA.position.x) * 5 * DELTA_TIME;
		APP_GROUP_CAMERA.position.y +=
			(-CURSOR_LOCATION.y * 0.5 - APP_GROUP_CAMERA.position.y) * 5 * DELTA_TIME;

		COMPOSER.render();
	}, false);

	SCROLL_BASED_DOM_BODY?.addEventListener("mousemove", (e) => {
		CURSOR_LOCATION.x = e.clientX / APP.sceneSizes.width - 0.5;
		CURSOR_LOCATION.y = e.clientY / APP.sceneSizes.height - 0.5;
	});

	const tmpObj = SECTION_MESHES_LIST[currentScrollSection];
	if (tmpObj) {
		gsapRotationSpinAnimation(tmpObj);
	}

	// WINDOW EVENTS
	window?.addEventListener("scroll", () => {
		windowScrollPosition = window.scrollY;

		const _CURRENT_NEW_SECTION = Math.round(
			windowScrollPosition / APP.sceneSizes.height
		);

		if (_CURRENT_NEW_SECTION !== currentScrollSection) {
			const _LAST_SECTION = Math.round(pageHeight / APP.sceneSizes.height);

			currentScrollSection = _CURRENT_NEW_SECTION;
			let groupe3dScene = SECTION_MESHES_LIST[currentScrollSection];

			if (groupe3dScene) {
				if (currentScrollSection === 0) {
					gsapRotationSpinAnimation(groupe3dScene.children[1]);
					gsapRotationSpinAnimation(groupe3dScene.children[2]);
					gsapRotationSpinAnimation(groupe3dScene.children[3]);
				}
			}

			if (currentScrollSection === _LAST_SECTION) {
				lastSectionReached = true;
				rgbShift.enabled = false;
				DIRECTIONAL_LIGHT.visible = false;

				GSAP.to(APP.camera.rotation, {
					duration: 1,
					ease: "power2.inOut",
					y: "+=" + (APP.camera.rotation.y - Math.PI) * -1,
				}).then(() => (APP.camera.rotation.y = Math.PI));
			} else if (lastSectionReached) {
				GSAP.to(APP.camera.rotation, {
					duration: 1,
					ease: "power2.inOut",
					y:
						"-=" +
						(APP.camera.rotation.y -
							((windowScrollPosition + 50) / pageHeight) * Math.PI),
				}).then(() => {
					lastSectionReached = false;
					rgbShift.enabled = true;
					DIRECTIONAL_LIGHT.visible = true;
				});
			}
		}
	});

	window.addEventListener("resize", () => {
		COMPOSER.setSize(window.innerWidth, window.innerHeight);
		pageHeight = window.innerHeight - document.body.clientHeight;
	});

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
