import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GUI from "lil-gui";
import GSAP from "gsap";

// HELPERS
import ThreeApp from "quick-threejs";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export interface InitIsometricRoomSceneProps {
	/**
	 * String dom element reference of the canvas
	 */
	domElementRef: string;
	/**
	 * Event triggered when the scene is construct
	 */
	onConstruct?: () => unknown;
	/**
	 * Event triggered when the scene is destructed
	 */
	onDestruct?: () => unknown;
}

export class InitIsometricRoomScene {
	app: ThreeApp;
	mainGroup?: THREE.Group;
	gui?: GUI;
	loadingManager = new THREE.LoadingManager();
	isometricRoom?: THREE.Group;
	onConstruct?: () => unknown;
	onDestruct?: () => unknown;

	constructor(props: InitIsometricRoomSceneProps) {
		this.app = new ThreeApp({ enableControls: true }, props.domElementRef);
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

			this.loadingManager.removeHandler(/onStart|onError|onProgress|onLoad/);

			if (this.app.updateCallbacks[InitIsometricRoomScene.name]) {
				delete this.app.updateCallbacks[InitIsometricRoomScene.name];
			}

			this.app.destroy();

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
			const DRACO_LOADER = new DRACOLoader();
			DRACO_LOADER.setDecoderPath("/decoders/draco/");

			const GLTF_LOADER = new GLTFLoader(this.loadingManager);
			GLTF_LOADER.setDRACOLoader(DRACO_LOADER);

			const TEXTURE_LOADER = new THREE.TextureLoader(this.loadingManager);

			// LIGHTS
			const AMBIENT_LIGHT = new THREE.AmbientLight(0xffffff, 0);
			const DIRECTIONAL_LIGHT = new THREE.DirectionalLight(0xffffff, 0.1);
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

					glb.scene.traverse((child) => {
						if (child instanceof THREE.Mesh && !_REG.test(child.name)) {
							child.material = BAKED_MATERIAL;
						}
					});

					(this.isometricRoom = glb.scene).position.set(0, -10, -30);

					this.mainGroup && this.mainGroup.add(this.isometricRoom);
				}
			);

			// CAMERA
			this.app.camera.position.set(0, 6, 20);

			// ADD TO SCENE
			this.mainGroup.add(AMBIENT_LIGHT, DIRECTIONAL_LIGHT);
			this.app.scene.add(this.mainGroup);

			// ANIMATIONS
			this.app.setUpdateCallback("root", () => this.animate());
		}
	}

	start() {
		if (this.mainGroup && this.isometricRoom) {
			GSAP.to(this.isometricRoom.rotation, { y: -1.2, duration: 2 });
			GSAP.to(this.isometricRoom.position, { y: -2.5, z: 0, duration: 2 });
		}
	}

	animate() {
		if (this.mainGroup?.position) {
			// this.app.camera.lookAt(new THREE.Vector3(0, 0, 0));
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
