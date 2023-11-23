import QuickThree from "quick-threejs";

// EXPERIENCES
import Renderer from "./Renderer";
import Loader from "./Loader";
import World from "./World";
import UI from "./UI";
import Debug from "./Debug";

// INTERFACES
import type BaseExperience from "@/interfaces/BaseExperience";

export interface ExperienceProps {
	/**
	 * String dom element reference of the canvas
	 */
	domElementRef: string;
	/**
	 * Event triggered when the scene is constructed
	 */
	onConstruct?: () => unknown;
	/**
	 * Event triggered when the scene is destructed
	 */
	onDestruct?: () => unknown;
}

class HomeExperience implements BaseExperience {
	/** HomExperience object */
	static self?: HomeExperience;
	/**
	 * `quick-threejs` library instance.
	 *
	 * [Doc](https://www.npmjs.com/package/quick-threejs)
	 */
	app!: QuickThree;
	renderer?: Renderer;
	loader?: Loader;
	debug?: Debug;
	world?: World;
	ui?: UI;

	private onConstruct?: () => unknown;
	private onDestruct?: () => unknown;

	constructor(props?: ExperienceProps) {
		if (HomeExperience.self) {
			return HomeExperience.self;
		}

		HomeExperience.self = this;

		this.debug = new Debug();
		this.app = new QuickThree(
			{
				enableDebug: this.debug.debugMode,
				axesSizes: this.debug.debugMode ? 5 : undefined,
				gridSizes: this.debug.debugMode ? 30 : undefined,
				withMiniCamera: this.debug.debugMode,
				camera: "Perspective",
			},
			props?.domElementRef
		);
		this.construct();
		this.debug.construct();

		this.onConstruct = props?.onConstruct;
		this.onDestruct = props?.onDestruct;

		this.app.setUpdateCallback(HomeExperience.name, () => this.update());
	}

	destruct() {
		this.app.updateCallbacks[HomeExperience.name] &&
			delete this.app.updateCallbacks[HomeExperience.name];

		this.loader?.destruct();
		this.world?.destruct();
		this.debug?.destruct();
		this.app.destroy();

		this.onDestruct && this.onDestruct();

		HomeExperience.self = undefined;
	}

	construct() {
		if (this.world?.scene) this.destruct();

		this.renderer = new Renderer();
		this.loader = new Loader();
		this.world = new World();
		this.ui = new UI();
		this.loader?.construct();
		this.onConstruct && this.onConstruct();
	}

	update() {
		this.world?.update();
	}
}

export default HomeExperience;
