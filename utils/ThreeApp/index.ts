import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// HELPERS
import Sizes, { sceneSizesType } from "./utils/Sizes";
import Time from "./utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Debug from "./utils/Debug";

let intense: ThreeApp;
let tickEvent: () => unknown | undefined;
let resizeEvent: () => unknown | undefined;

export interface initThreeProps {
	enableControls?: boolean;
	axesSizes?: number;
	sceneSizes?: sceneSizesType;
	autoSceneResize?: boolean;
	canvasSelector?: string;
}

export default class ThreeApp {
	viewPortSizes: sceneSizesType = {
		width: window.innerWidth,
		height: window.innerHeight,
	};
	sceneSizes!: sceneSizesType;
	scene!: THREE.Scene;
	canvas?: HTMLCanvasElement;
	camera!: Camera;
	renderer!: Renderer;
	control?: OrbitControls;
	sizes!: Sizes;
	time!: Time;
	debug?: Debug;
	updateCallbacks: { [key: string]: () => unknown } = {};

	constructor(props?: initThreeProps) {
		if (intense) {
			return intense;
		}

		intense = this;

		const DOM_APP = document.querySelector<HTMLCanvasElement>(
			props?.canvasSelector ?? "canvas#app"
		)!;
		const SCENE_SIZES = props?.sceneSizes ?? this.viewPortSizes;
		const SIZES_INSTANCE = new Sizes({
			height: SCENE_SIZES.height,
			width: SCENE_SIZES.width,
			listenResize: props?.autoSceneResize,
		});
		const timeInstance = new Time();

		// SETUP
		this.debug = new Debug();
		this.scene = new THREE.Scene();
		this.sizes = SIZES_INSTANCE;
		this.time = timeInstance;
		this.sceneSizes = {
			height: SIZES_INSTANCE.height,
			width: SIZES_INSTANCE.width,
		};
		this.canvas = DOM_APP;
		this.camera = new Camera({ enableControls: !!props?.enableControls });
		this.control = this.camera.controls;
		this.renderer = new Renderer();

		if (typeof props?.axesSizes === "number") {
			const AXES_HELPER = new THREE.AxesHelper(props?.axesSizes);
			this.scene.add(AXES_HELPER);
		}

		tickEvent = () => {
			this.update();
		};
		resizeEvent = () => {
			this.resize();
		};

		this.time.on("tick", tickEvent);
		this.sizes.on("resize", resizeEvent);
	}

	resize() {
		this.camera.resize();

		this.renderer.resize();
	}

	update() {
		this.camera.update();
		this.renderer.update();

		const UPDATE_CALLBACKS_KEYS = Object.keys(this.updateCallbacks);
		if (UPDATE_CALLBACKS_KEYS?.length) {
			UPDATE_CALLBACKS_KEYS.map((callbackKey) => {
				if (typeof this.updateCallbacks[callbackKey] === "function") {
					this.updateCallbacks[callbackKey]();
				}
			});
		}
	}

	destroy() {
		tickEvent && this.time.off("tick", tickEvent);
		resizeEvent && this.sizes.off("resize", resizeEvent);

		// Traverse the whole scene
		this.scene.traverse((child) => {
			// Test if it's a mesh
			if (child instanceof THREE.Mesh) {
				child.geometry.dispose();

				// Loop through the material properties
				for (const key in child.material) {
					const value = child.material[key];

					// Test if there is a dispose function
					if (value && typeof value.dispose === "function") {
						value.dispose();
					}
				}
			}
		});

		this.control?.dispose();
		this.rendererIntense.dispose();

		if (this.debug?.active) this.debug.ui?.destroy();
	}

	setUpdateCallback(key: string, callback: () => unknown) {
		this.updateCallbacks[key] = callback;
	}

	get cameraIntense() {
		return this.camera.intense;
	}

	get rendererIntense() {
		return this.renderer.intense;
	}
}
