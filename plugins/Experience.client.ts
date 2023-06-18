import * as THREE from "three";
import QuickThree from "quick-threejs";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GUI from "lil-gui";
import GSAP from "gsap";
import Camera from "quick-threejs/lib/Camera";

export interface ExperienceProps {
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

export class Experience {
	app: QuickThree;
	mainGroup?: THREE.Group;
	gui?: GUI;
	loadingManager = new THREE.LoadingManager();
	isometricRoom?: THREE.Group;
	onConstruct?: () => unknown;
	onDestruct?: () => unknown;

	constructor(props: ExperienceProps) {
		this.app = new QuickThree(
			{
				enableControls: true,
				axesSizes: 5,
				gridSizes: 10,
				withMiniCamera: true,
				camera: "Perspective",
			},
			props.domElementRef
		);
		this.gui = this.app.debug?.ui?.addFolder(Experience.name);
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

			this.gui = this.app.debug?.ui?.addFolder(Experience.name);
			this.gui
				?.add({ function: () => this.construct() }, "function")
				.name("Enable");

			this.loadingManager.removeHandler(/onStart|onError|onProgress|onLoad/);

			if (this.app.updateCallbacks[Experience.name]) {
				delete this.app.updateCallbacks[Experience.name];
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

					(this.isometricRoom = glb.scene).position.set(0, -10, -15);
					(this.isometricRoom = glb.scene).rotation.set(0.3, -0.2, 0);

					this.mainGroup && this.mainGroup.add(this.isometricRoom);
				}
			);

			// CAMERA
			// @ts-ignore Proxy class error
			if (this.app.camera?.fov) this.app.camera.fov = 35;
			this.app.camera?.updateProjectionMatrix();
			this.app.camera?.position.set(0, 4, 20);

			// ADD TO SCENE
			this.mainGroup.add(AMBIENT_LIGHT, DIRECTIONAL_LIGHT);
			this.app.scene.add(this.mainGroup);

			// ANIMATIONS
			this.app.setUpdateCallback("root", () => this.animate());
		}
	}

	start() {
		const _DEFAULT_PROPS = {
			duration: 2.5,
			ease: "M0,0 C0.001,0.001 0.002,0.003 0.003,0.004 0.142,0.482 0.284,0.75 0.338,0.836 0.388,0.924 0.504,1 1,1 ",
		};
		if (this.mainGroup && this.isometricRoom) {
			GSAP.to(this.isometricRoom.rotation, {
				x: 0,
				y: 0,
				..._DEFAULT_PROPS,
			});
			GSAP.to(this.isometricRoom.position, {
				y: -2.5,
				z: 0,
				..._DEFAULT_PROPS,
			});
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
			Experience,
		},
	};
});
