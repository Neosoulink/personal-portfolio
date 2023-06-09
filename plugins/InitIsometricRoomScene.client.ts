import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GUI from "lil-gui";

// HELPERS
import ThreeApp from "quick-threejs";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export interface InitIsometricRoomSceneProps {
	onConstruct?: () => unknown;
	onDestruct?: () => unknown;
}

export class InitIsometricRoomScene {
	app = new ThreeApp({ enableControls: true }, "#home-three-app");
	mainGroup?: THREE.Group;
	gui?: GUI;
	/**
	 * Event triggered when the scene is construct
	 */
	onConstruct?: () => unknown;
	/**
	 * Event triggered when the scene is destructed
	 */
	onDestruct?: () => unknown;

	constructor(props?: InitIsometricRoomSceneProps) {
		this.gui = this.app.debug?.ui?.addFolder(InitIsometricRoomScene.name);
		this.gui?.add({ fn: () => this.construct() }, "fn").name("Enable");
		this.gui?.close();

		if (props?.onConstruct) this.onConstruct = props?.onConstruct;
		if (props?.onDestruct) this.onDestruct = props?.onDestruct;
	}

	destroy() {
		if (this.mainGroup) {
			this.mainGroup.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.geometry.dispose();

					for (const key in child.material) {
						const value = child.material[key];

						if (value && typeof value.dispose === "function") {
							value.dispose();
						}
					}
				}
			});

			this.app.scene.remove(this.mainGroup);

			this.mainGroup?.clear();
			this.mainGroup = undefined;

			if (this.gui) {
				this.gui.destroy();
				this.gui = undefined;
			}

			this.gui = this.app.debug?.ui?.addFolder(InitIsometricRoomScene.name);
			this.gui
				?.add({ function: () => this.construct() }, "function")
				.name("Enable");

			if (this.app.updateCallbacks[InitIsometricRoomScene.name]) {
				delete this.app.updateCallbacks[InitIsometricRoomScene.name];
			}

			this.onDestruct && this.onDestruct();
		}
	}

	async construct() {
		if (this.gui) {
			this.gui.destroy();
			this.gui = undefined;
		}

		if (this.mainGroup) {
			this.destroy();
		}

		if (!this.mainGroup) {
			this.mainGroup = new THREE.Group();

			// APP
			this.app.camera.fov = 35;
			this.app.camera.updateProjectionMatrix();

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

			// LIGHTS
			const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 0);
			const DIRECTIONAL_LIGHT = new THREE.DirectionalLight(0xffffff, 0.2);
			DIRECTIONAL_LIGHT.position.set(0, 0, 1);

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
			GLTF_LOADER.load(
				"/3d_models/isometric_room/isometric_room.glb",
				(glb) => {
					const _REG = new RegExp(/.*screen/);

					glb.scene.position.y = -2;
					glb.scene.traverse((child) => {
						if (child instanceof THREE.Mesh && !_REG.test(child.name)) {
							child.material = BAKED_MATERIAL;
						}
					});

					this.mainGroup && this.mainGroup.add(glb.scene);
				}
			);

			// CAMERA
			this.app.camera.position.set(4, 2, 20);

			// ADD TO SCENE
			this.mainGroup.add(AMBIENT_LIGHT, DIRECTIONAL_LIGHT);
			this.app.scene.add(this.mainGroup);

			// ANIMATIONS
			this.app.setUpdateCallback("root", () => {});
		}
	}
}

export default defineNuxtPlugin(() => {
	return {
		provide: {
			InitIsometricRoomScene,
		},
	};
});
