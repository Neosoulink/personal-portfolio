import * as THREE from "three";
import QuickThree from "quick-threejs";
import GUI from "lil-gui";
import GSAP from "gsap";

// CLASSES
import World from "./World";
import Preloader from "./Preloader";

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

export default class Experience {
	static instance?: Experience;
	/**
	 * Quick threejs library instance.
	 *
	 * [Quick three doc](https://www.npmjs.com/package/quick-threejs)
	 */
	app!: QuickThree;
	world?: World;
	preloader?: Preloader;

	onConstruct?: () => unknown;
	onDestruct?: () => unknown;

	constructor(props?: ExperienceProps) {
		if (Experience.instance) {
			return Experience.instance;
		}

		Experience.instance = this;

		this.app = new QuickThree(
			{
				enableDebug: window.location.hash === "#debug",
				axesSizes: window.location.hash === "#debug" ? 5 : undefined,
				gridSizes: window.location.hash === "#debug" ? 30 : undefined,
				withMiniCamera: window.location.hash === "#debug" ? true : undefined,
				camera: "Perspective",
			},
			props?.domElementRef
		);

		this.preloader = new Preloader();
		this.world = new World();

		if (this.app.debug?.cameraControls) {
			this.app.debug.cameraControls.enabled = false;
		}

		if (props?.onConstruct) this.onConstruct = props?.onConstruct;
		if (props?.onDestruct) this.onDestruct = props?.onDestruct;
	}

	destroy() {
		if (this.world?.scene) {
			this.world.scene.traverse((child) => {
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

			this.app.scene.remove(this.world.scene);

			this.world.scene?.clear();
			this.world.scene = undefined;

			if (this.world.gui) {
				this.world.gui.destroy();
				this.world.gui = undefined;
			}

			this.world.gui = this.app.debug?.ui?.addFolder(Experience.name);
			this.world.gui
				?.add({ function: () => this.construct() }, "function")
				.name("Enable");

			this.app.resources.loadingManager.removeHandler(
				/onStart|onError|onProgress|onLoad/
			);

			if (this.app.updateCallbacks[Experience.name]) {
				delete this.app.updateCallbacks[Experience.name];
			}

			this.app.destroy();

			this.onDestruct && this.onDestruct();
		}
	}

	construct() {
		if (this.world?.gui) {
			this.world.gui.destroy();
			this.world.gui = undefined;
		}

		if (this.world?.scene) {
			this.destroy();
		}
	}
}
