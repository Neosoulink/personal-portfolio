import QuickThree from "quick-threejs";

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

class HomeExperience {
	static self?: HomeExperience;
	/**
	 * `quick-threejs` library instance.
	 *
	 * [Doc](https://www.npmjs.com/package/quick-threejs)
	 */
	app!: QuickThree;
	experienceDebug?: Debug;
	world?: World;
	preloader?: Preloader;

	onConstruct?: () => unknown;
	onDestruct?: () => unknown;

	constructor(props?: ExperienceProps) {
		if (HomeExperience.self) {
			return HomeExperience.self;
		}

		HomeExperience.self = this;

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
		this.construct();
		this.experienceDebug.construct();

		this.onConstruct = props?.onConstruct;
		this.onDestruct = props?.onDestruct;

		this.app.setUpdateCallback(HomeExperience.name, () => this.update());
	}

	destruct() {
		this.app.updateCallbacks[HomeExperience.name] &&
			delete this.app.updateCallbacks[HomeExperience.name];
		this.preloader?.destruct();
		this.world?.destruct();
		this.experienceDebug?.destruct();
		HomeExperience.self = undefined;
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

export default HomeExperience;
