import QuickThree from "quick-threejs";
import GUI from "lil-gui";

// CLASSES
import World from "./World";
import Preloader from "./Preloader";
import Debug from "./Debug";

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
	static self?: Experience;
	/**
	 * Quick threejs library instance.
	 *
	 * [Quick three doc](https://www.npmjs.com/package/quick-threejs)
	 */
	app!: QuickThree;
	experienceDebug?: Debug;
	world?: World;
	preloader?: Preloader;

	onConstruct?: () => unknown;
	onDestruct?: () => unknown;

	constructor(props?: ExperienceProps) {
		if (Experience.self) {
			return Experience.self;
		}

		Experience.self = this;

		this.experienceDebug = new Debug();
		this.app = new QuickThree(
			{
				enableDebug: this.experienceDebug.debugMode,
				axesSizes: this.experienceDebug.debugMode ? 5 : undefined,
				gridSizes: this.experienceDebug.debugMode ? 30 : undefined,
				withMiniCamera: this.experienceDebug.debugMode,
				camera: "Perspective",
			},
			props?.domElementRef
		);
		this.experienceDebug.construct();

		this.onConstruct = props?.onConstruct;
		this.onDestruct = props?.onDestruct;

		this.app.setUpdateCallback(Experience.name, () => this.update());
	}

	destruct() {
		this.app.updateCallbacks[Experience.name] &&
			delete this.app.updateCallbacks[Experience.name];
		this.preloader?.destruct();
		this.world?.destruct();
		this.experienceDebug?.destruct();
		Experience.self = undefined;
		this.onDestruct && this.onDestruct();
	}

	construct() {
		if (this.world?.scene) {
			this.destruct();
		}

		this.preloader = new Preloader();
		this.world = new World();
		this.preloader?.construct();
		this.onConstruct && this.onConstruct();
	}

	update() {
		this.world?.update();
	}
}
