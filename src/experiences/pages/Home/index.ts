// EXPERIENCES
import Renderer from "./Renderer";
import Loader from "./Loader";
import { Camera } from "./Camera";
import World from "./World";
import UI from "./UI";
import Debug from "./Debug";

// FACTORIES
import {
	ExperienceBlueprint,
	type ExperienceProps,
} from "@/experiences/blueprints/Experience.blueprint";

export class HomeExperience extends ExperienceBlueprint {
	renderer?: Renderer;
	ui?: UI;
	loader?: Loader;
	camera?: Camera;
	world?: World;
	debug?: Debug;

	constructor(_?: Omit<ExperienceProps, "debug">) {
		super(
			HomeExperience._self ?? {
				..._,
				debug: Debug.enable,
			}
		);
		if (HomeExperience._self) return HomeExperience._self;
		HomeExperience._self = this;

		this.renderer = new Renderer();
		this.ui = new UI();
		this.loader = new Loader();
		this.camera = new Camera();
		this.world = new World();
		this.debug = new Debug();
	}

	public destruct() {
		this.app.updateCallbacks[HomeExperience.name] &&
			delete this.app.updateCallbacks[HomeExperience.name];

		this.renderer?.destruct();
		this.ui?.destruct();
		this.loader?.destruct();
		this.camera?.destruct();
		this.world?.destruct();
		this.debug?.destruct();
		this.app.destroy();

		HomeExperience._self = undefined;
		this._onDestruct && this._onDestruct();
	}

	public construct() {
		if (this.world?.currentSceneIndex !== undefined) this.destruct();

		this.renderer?.construct();
		this.ui?.construct();
		this.camera?.construct();
		this.loader?.on("load", () => {
			this.world?.construct();
			this.debug?.construct();
			this.app?.setUpdateCallback(HomeExperience.name, () => this.update());
			this._onConstruct && this._onConstruct();
		});
		this.loader?.construct();
	}

	public update() {
		this.world?.update();
		this.camera?.update();
		this.debug?.update();
	}
}

export default HomeExperience;
