import * as THREE from "three";
import GSAP from "gsap";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";

// HELPERS
import { initThree } from "./initThree.client";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const gsapRotationSpinAnimation = (object: THREE.Object3D<THREE.Event>) => {
	GSAP.to(object.rotation, {
		duration: 1.5,
		ease: "power2.inOut",
		x: "+=" + Math.PI * 2,
		y: "+=" + Math.PI * 2,
		z: "+=" + Math.PI * 2,
	});
};

const initHomePageThree = () => {
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
	const WINDOW_HEIGHT = window.innerHeight;
	const DOCUMENT_HEIGHT = document.body.clientHeight;

	let windowClientY = SCROLL_BASED_DOM_BODY?.scrollTop ?? 0;
	let currentScrollSection = 0;
	let previewsElapseTime = 0;
	let lastSectionReached = false;

	// APP
	const APP = initThree({
		appDom: "#home-three-app",
	});

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

	// TEXTURE LOADER
	const TEXTURE_LOADER = new THREE.TextureLoader(LOADING_MANAGER);

	// GROUPS
	const GROUP_APP_CAMERA = new THREE.Group();
	const SCROLL_BASED_GROUP = new THREE.Group();

	// CLOCK
	const ANIMATION_CLOCK = new THREE.Clock();

	// APP
	APP.camera.position.z = 6;
	APP.camera.fov = 35;
	APP.camera.updateProjectionMatrix();

	// Lights
	const DIRECTIONAL_LIGHT = new THREE.DirectionalLight(0xffffff, 3);
	DIRECTIONAL_LIGHT.position.set(-4, -4, 10);
	DIRECTIONAL_LIGHT.rotation.set(4, 0, 3);

	const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 0.2);

	// Textures
	const SCROLL_BASED_GRADIENT_TEXTURE = TEXTURE_LOADER.load(
		"/textures/home-particle.png"
	);
	SCROLL_BASED_GRADIENT_TEXTURE.magFilter = THREE.NearestFilter;

	// FORMS
	const SCROLL_BASED_MESHES_LIST: (THREE.Object3D | null)[] = [
		null,
		null,
		null,
	];
	let SCROLL_BASED_NOTE_BOOK: THREE.Group;

	GLTF_LOADER.load("/3d_models/notebook/notebook.glb", (glb) => {
		glb.scene.scale.set(0.5, 0.5, 0.5);
		glb.scene.position.set(2, -SCROLL_BASED_PARAMS.objectsDistance * 0, 0);

		SCROLL_BASED_NOTE_BOOK = glb.scene;

		SCROLL_BASED_MESHES_LIST[0] = SCROLL_BASED_NOTE_BOOK;

		console.log(SCROLL_BASED_MESHES_LIST[0]);

		APP.scene.add(SCROLL_BASED_NOTE_BOOK);

		GLTF_LOADER.load("/3d_models/i_phone/i_phone.glb", (glb) => {
			glb.scene.scale.set(0.365, 0.365, 0.365);
			glb.scene.position.set(SCROLL_BASED_NOTE_BOOK.position.x + 0.5, 0, 0);

			SCROLL_BASED_NOTE_BOOK.add(glb.scene);
		});

		GLTF_LOADER.load("/3d_models/mouse/mouse.glb", (glb) => {
			glb.scene.scale.set(0.635, 0.635, 0.635);
			glb.scene.position.set(SCROLL_BASED_NOTE_BOOK.position.x * -1.5, 0, 0);

			SCROLL_BASED_NOTE_BOOK.add(glb.scene);
		});

		GLTF_LOADER.load("/3d_models/keyboard/keyboard.glb", (glb) => {
			glb.scene.scale.set(0.2, 0.2, 0.2);
			glb.scene.position.set(SCROLL_BASED_NOTE_BOOK.position.x * -1.5, 0, 0);

			SCROLL_BASED_NOTE_BOOK.add(glb.scene);
		});

		APP.scene.add(SCROLL_BASED_NOTE_BOOK);
	});

	GLTF_LOADER.load("/3d_models/isometric_room/isometric_room.glb", (glb) => {
		glb.scene.scale.set(0.35, 0.375, 0.35);
		glb.scene.position.set(1, -SCROLL_BASED_PARAMS.objectsDistance * 2.19, 12);
		glb.scene.rotation.y = Math.PI + 0.1;
		// glb.scene.rotation.x = -0.2;
		// glb.scene.rotation.z = -0.5;

		SCROLL_BASED_MESHES_LIST[2] = glb.scene;

		const SPOT_LIGHT = new THREE.SpotLight(0xffffff, 10, 5);
		SPOT_LIGHT.position.x = SCROLL_BASED_MESHES_LIST[2].position.x - 2;
		SPOT_LIGHT.position.y = SCROLL_BASED_MESHES_LIST[2].position.y + 0.5;
		SPOT_LIGHT.position.z = SCROLL_BASED_MESHES_LIST[2].position.z + 2;
		// SPOT_LIGHT.lookAt(SCROLL_BASED_MESHES_LIST[2].position);
		APP.scene.add(SCROLL_BASED_MESHES_LIST[2], SPOT_LIGHT);
	});

	// PARTICLES
	const SCROLL_BASED_PARTICLES_COUNT = 300;
	const SCROLL_BASED_PARTICLES_POSITIONS = new Float32Array(
		SCROLL_BASED_PARTICLES_COUNT * 3
	);

	for (let i = 0; i < SCROLL_BASED_PARTICLES_COUNT; i++) {
		SCROLL_BASED_PARTICLES_POSITIONS[i * 3 + 0] = (Math.random() - 0.65) * 10;
		SCROLL_BASED_PARTICLES_POSITIONS[i * 3 + 1] =
			SCROLL_BASED_PARAMS.objectsDistance * 0.5 -
			Math.random() *
				SCROLL_BASED_PARAMS.objectsDistance *
				(SCROLL_BASED_MESHES_LIST.length - 0.8);
		SCROLL_BASED_PARTICLES_POSITIONS[i * 3 + 2] = (Math.random() - 0.35) * 10;
	}

	const SCROLL_BASED_PARTICLES_GEOMETRY = new THREE.BufferGeometry();
	SCROLL_BASED_PARTICLES_GEOMETRY.setAttribute(
		"position",
		new THREE.BufferAttribute(SCROLL_BASED_PARTICLES_POSITIONS, 3)
	);

	const SCROLL_BASED_PARTICLES_MATERIAL = new THREE.PointsMaterial({
		color: SCROLL_BASED_PARAMS.materialColor,
		alphaMap: SCROLL_BASED_GRADIENT_TEXTURE,
		depthWrite: false,
		transparent: true,
		size: 0.09,
		sizeAttenuation: true,
	});

	const SCROLL_BASED_PARTICLES_POINTS = new THREE.Points(
		SCROLL_BASED_PARTICLES_GEOMETRY,
		SCROLL_BASED_PARTICLES_MATERIAL
	);

	// POSTPROCESSING
	const COMPOSER = new EffectComposer(APP.renderer);
	COMPOSER.addPass(new RenderPass(APP.scene, APP.camera));

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

	// RENDERER
	APP.renderer.shadowMap.enabled = true;
	APP.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	APP.renderer.physicallyCorrectLights = true;
	APP.renderer.outputEncoding = THREE.sRGBEncoding;

	// ADD TO SCENE
	GROUP_APP_CAMERA.add(APP.camera);
	APP.scene.add(GROUP_APP_CAMERA, SCROLL_BASED_GROUP);

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

	SCROLL_BASED_GROUP.add(
		DIRECTIONAL_LIGHT,
		AMBIENT_LIGHT,
		SCROLL_BASED_PARTICLES_POINTS
	);

	let angle = 0;
	let radius = 2.5;
	APP.animate(() => {
		const ELAPSED_TIME = ANIMATION_CLOCK.getElapsedTime();
		const DELTA_TIME = ELAPSED_TIME - previewsElapseTime;
		previewsElapseTime = ELAPSED_TIME;

		for (let i = 0; i < SCROLL_BASED_MESHES_LIST.length; i++) {
			const SCROLL_BASED_MESH = SCROLL_BASED_MESHES_LIST[i];

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
			(-windowClientY / APP.sceneSizes.height) *
			SCROLL_BASED_PARAMS.objectsDistance;

		if (!lastSectionReached) {
			APP.camera.rotation.y =
				(windowClientY / (DOCUMENT_HEIGHT - WINDOW_HEIGHT)) * Math.PI;
		}

		GROUP_APP_CAMERA.position.x +=
			(CURSOR_POS.x * 0.5 - GROUP_APP_CAMERA.position.x) * 5 * DELTA_TIME;
		GROUP_APP_CAMERA.position.y +=
			(-CURSOR_POS.y * 0.5 - GROUP_APP_CAMERA.position.y) * 5 * DELTA_TIME;

		COMPOSER.render();
	}, false);

	SCROLL_BASED_DOM_BODY?.addEventListener("mousemove", (e) => {
		CURSOR_POS.x = e.clientX / APP.sceneSizes.width - 0.5;
		CURSOR_POS.y = e.clientY / APP.sceneSizes.height - 0.5;
	});

	const tmpObj = SCROLL_BASED_MESHES_LIST[currentScrollSection];
	if (tmpObj) {
		gsapRotationSpinAnimation(tmpObj);
	}

	// WINDOW EVENTS
	window?.addEventListener("scroll", () => {
		windowClientY = window.scrollY;

		const _CURRENT_NEW_SECTION = Math.round(
			windowClientY / APP.sceneSizes.height
		);

		if (_CURRENT_NEW_SECTION !== currentScrollSection) {
			const _LAST_SECTION = Math.round(
				(DOCUMENT_HEIGHT - WINDOW_HEIGHT) / APP.sceneSizes.height
			);

			currentScrollSection = _CURRENT_NEW_SECTION;
			let groupe3dScene = SCROLL_BASED_MESHES_LIST[currentScrollSection];

			if (groupe3dScene) {
				if (currentScrollSection === 0) {
					gsapRotationSpinAnimation(groupe3dScene.children[1]);
					gsapRotationSpinAnimation(groupe3dScene.children[2]);
					gsapRotationSpinAnimation(groupe3dScene.children[3]);
				}
			}

			if (currentScrollSection === _LAST_SECTION) {
				lastSectionReached = true;

				GSAP.to(APP.camera.rotation, {
					duration: 1,
					ease: "power2.inOut",
					y: "+=" + (APP.camera.rotation.y - Math.PI) * -1,
				}).then(() => (APP.camera.rotation.y = Math.PI));
			} else if (lastSectionReached) {
				GSAP.to(APP.camera.rotation, {
					duration: 0.65,
					ease: "power2.inOut",
					y: "-=" + Math.PI * 0.3,
				}).then(() => (lastSectionReached = false));
			}
		}
	});

	window.addEventListener("resize", () => {
		COMPOSER.setSize(window.innerWidth, window.innerHeight);
	});

	return {
		app: APP,
		forms: {},
		postProcessing: {
			COMPOSER,
			GLITCH_PASS,
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
