import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// HELPERS
import ThreeApp from "quick-threejs";
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
	let isMessaging = false;

	// APP
	const APP = new ThreeApp({ enableControls: true }, "#home-three-app");
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

	// LIGHTS
	const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 0);

	/**
	 * Texture
	 */
	const BAKED_TEXTURE = TEXTURE_LOADER.load(
		"/3d_models/isometric_room/baked-isometric-room.jpg"
	);
	BAKED_TEXTURE.flipY = false;
	BAKED_TEXTURE.colorSpace = THREE.SRGBColorSpace;

	/**
	 * Materials
	 */
	const BAKED_MATERIAL = new THREE.MeshBasicMaterial({
		map: BAKED_TEXTURE,
		side: THREE.DoubleSide,
	});

	// MODELS
	GLTF_LOADER.load("/3d_models/isometric_room/isometric_room.glb", (glb) => {
		const _REG = new RegExp(/.*screen/);

		glb.scene.position.y = -2;
		glb.scene.traverse((child) => {
			if (child instanceof THREE.Mesh && !_REG.test(child.name)) {
				child.material = BAKED_MATERIAL;
			}
		});

		APP.scene.add(glb.scene);
	});

	// CAMERA
	APP.camera.position.set(4, 2, 20);

	// ADD TO SCENE
	APP_GROUP.add(AMBIENT_LIGHT);
	APP.scene.add(APP_GROUP);

	// ANIMATIONS
	APP.setUpdateCallback("root", () => {
		const ELAPSED_TIME = ANIMATION_CLOCK.getElapsedTime();
		const DELTA_TIME = ELAPSED_TIME - previewsElapseTime;
		previewsElapseTime = ELAPSED_TIME;
	});

	return {
		app: APP,
		clear: () => {},
	};
};

export default defineNuxtPlugin(() => {
	return {
		provide: {
			initHomePageThree,
		},
	};
});
