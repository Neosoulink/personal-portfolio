import { PerspectiveCamera } from "three";
import QuickThree from "quick-threejs";

// EXPERIENCES
import Renderer from "./Renderer";
import Loader from "./Loader";
import { Camera } from "./Camera";
import World from "./World";
import UI from "./UI";
import Debug from "./Debug";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

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

class HomeExperience implements ExperienceBase {
	/** HomExperience object */
	static self?: HomeExperience;
	/**
	 * `quick-threejs` library instance.
	 *
	 * [Doc](https://www.npmjs.com/package/quick-threejs)
	 */
	app!: QuickThree;
	renderer?: Renderer;
	ui?: UI;
	loader?: Loader;
	camera?: Camera;
	world?: World;
	debug?: Debug;

	private onConstruct?: () => unknown;
	private onDestruct?: () => unknown;

	constructor(props?: ExperienceProps) {
		if (HomeExperience.self) return HomeExperience.self;

		HomeExperience.self = this;

		this.app = new QuickThree(
			{
				enableDebug: true,
				axesSizes: Debug.debugMode ? 5 : undefined,
				gridSizes: Debug.debugMode ? 30 : undefined,
				withMiniCamera: Debug.debugMode,
				camera: "Perspective",
			},
			props?.domElementRef
		);
		this.renderer = new Renderer();
		this.ui = new UI();
		this.loader = new Loader();
		this.camera = new Camera();
		this.world = new World();
		this.debug = new Debug();

		this.onConstruct = props?.onConstruct;
		this.onDestruct = props?.onDestruct;
	}

	destruct() {
		this.app.updateCallbacks[HomeExperience.name] &&
			delete this.app.updateCallbacks[HomeExperience.name];

		this.renderer?.destruct();
		this.ui?.destruct();
		this.loader?.destruct();
		this.camera?.destruct();
		this.world?.destruct();
		this.debug?.destruct();
		this.app.destroy();

		HomeExperience.self = undefined;

		this.onDestruct && this.onDestruct();
	}

	construct() {
		if (this.world?.scene) this.destruct();

		this.renderer?.construct();
		this.ui?.construct();
		this.loader?.construct();
		this.camera?.construct();
		this.world?.construct();
		this.debug?.construct();

		this.app?.setUpdateCallback(HomeExperience.name, () => this.update());

		this.onConstruct && this.onConstruct();
	}

	update() {
		this.world?.update();
	}
}

export default HomeExperience;
