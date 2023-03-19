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

const gsapRotationSpinAnimation = (object: THREE.Object3D<THREE.Event>) => {
	GSAP.to(object.rotation, {
		duration: 1.5,
		ease: "power2.inOut",
		x: "+=6",
		y: "+=3",
		z: "+=1.5",
	});
};

export const initHomePageThree = () => {
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

	const GLTF_LOADER = new GLTFLoader(LOADING_MANAGER);

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

	APP.camera.position.z = 6;
	APP.camera.fov = 35;
	APP.camera.updateProjectionMatrix();

	// Lights
	const DIRECTIONAL_LIGHT = new THREE.DirectionalLight(0xffffff, 1);
	DIRECTIONAL_LIGHT.position.set(1, 1, 0);

	const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 0.05);

	// Textures
	const SCROLL_BASED_GRADIENT_TEXTURE = TEXTURE_LOADER.load(
		"/textures/shadow-gradient.jpg"
	);
	SCROLL_BASED_GRADIENT_TEXTURE.magFilter = THREE.NearestFilter;

	// Material
	const SCROLL_BASED_MATERIAL = new THREE.MeshToonMaterial({
		color: SCROLL_BASED_PARAMS.materialColor,
	});

	// FORMS
	let SCROLL_BASED_NOTE_BOOK: THREE.Group;
	const SCROLL_BASED_TORUS = new THREE.Mesh(
		new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
		SCROLL_BASED_MATERIAL
	);

	const SCROLL_BASED_MESHES_LIST: (THREE.Object3D | null)[] = [
		null,
		null,
		SCROLL_BASED_TORUS,
	];

	SCROLL_BASED_TORUS.position.x = -2;
	SCROLL_BASED_TORUS.position.y = -SCROLL_BASED_PARAMS.objectsDistance * 2;

	GLTF_LOADER.load("/3d_models/notebook/notebook.glb", (glb) => {
		console.log(glb);

		glb.scene.scale.set(0.7, 0.7, 0.7);
		glb.scene.position.set(2, -SCROLL_BASED_PARAMS.objectsDistance * 0, 0);

		SCROLL_BASED_NOTE_BOOK = glb.scene;
		SCROLL_BASED_MESHES_LIST[0] = SCROLL_BASED_NOTE_BOOK;

		APP.scene.add(SCROLL_BASED_NOTE_BOOK);
	});

	// PARTICLES
	const SCROLL_BASED_PARTICLES_COUNT = 300;
	const SCROLL_BASED_PARTICLES_POSITIONS = new Float32Array(
		SCROLL_BASED_PARTICLES_COUNT * 3
	);

	for (let i = 0; i < SCROLL_BASED_PARTICLES_COUNT; i++) {
		SCROLL_BASED_PARTICLES_POSITIONS[i * 3 + 0] = (Math.random() - 0.5) * 10;
		SCROLL_BASED_PARTICLES_POSITIONS[i * 3 + 1] =
			SCROLL_BASED_PARAMS.objectsDistance * 0.5 -
			Math.random() *
				SCROLL_BASED_PARAMS.objectsDistance *
				SCROLL_BASED_MESHES_LIST.length;
		SCROLL_BASED_PARTICLES_POSITIONS[i * 3 + 2] = (Math.random() - 0.5) * 10;
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
	const COMPOSER = new EffectComposer(APP.renderer);
	COMPOSER.addPass(new RenderPass(APP.scene, APP.camera));

	const GLITCH_PASS = new GlitchPass();
	GLITCH_PASS.enabled = false;
	GLITCH_PASS.renderToScreen = false;
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
		SCROLL_BASED_TORUS,
		SCROLL_BASED_PARTICLES_POINTS
	);

	APP.animate(() => {
		const ELAPSED_TIME = ANIMATION_CLOCK.getElapsedTime();
		const DELTA_TIME = ELAPSED_TIME - previewsElapseTime;
		previewsElapseTime = ELAPSED_TIME;

		for (const SCROLL_BASED_MESH of SCROLL_BASED_MESHES_LIST) {
			if (SCROLL_BASED_MESH) {
				SCROLL_BASED_MESH.rotation.y += DELTA_TIME * 0.1;
				SCROLL_BASED_MESH.rotation.x += DELTA_TIME * 0.12;
			}
		}

		APP.camera.position.y =
			(-windowClientY / APP.sceneSizes.height) *
			SCROLL_BASED_PARAMS.objectsDistance;
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

	const tmpObj = SCROLL_BASED_MESHES_LIST[scrollBasedCurrentSection];
	if (tmpObj) {
		gsapRotationSpinAnimation(tmpObj);
	}

	// WINDOW EVENTS
	window?.addEventListener("scroll", () => {
		windowClientY = window.scrollY ?? 0;

		const SCROLL_BASED_NEW_SECTION = Math.round(
			windowClientY / APP.sceneSizes.height
		);

		if (SCROLL_BASED_NEW_SECTION != scrollBasedCurrentSection) {
			scrollBasedCurrentSection = SCROLL_BASED_NEW_SECTION;
			let object = SCROLL_BASED_MESHES_LIST[scrollBasedCurrentSection];
			if (object) {
				gsapRotationSpinAnimation(object);
			}
		}
	});

	window.addEventListener("resize", () => {
		COMPOSER.setSize(window.innerWidth, window.innerHeight);
	});

	return {
		app: APP,
		forms: {
			SCROLL_BASED_TORUS,
		},
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
