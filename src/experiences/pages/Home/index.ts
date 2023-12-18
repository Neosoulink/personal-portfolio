// EXPERIENCES
import UI from "./UI";
import { Navigation } from "./Navigation";
import Loader from "./Loader";
import Renderer from "./Renderer";
import { Camera } from "./Camera";
import World from "./World";
import Debug from "./Debug";

// BLUEPRINT
import {
	ExperienceBlueprint,
	type ExperienceProps,
} from "@/experiences/blueprints/Experience.blueprint";

// MODELS
import { LOADED } from "@/experiences/common/Event.model";
import { ErrorFactory } from "@/experiences/errors/Error.factory";

export class HomeExperience extends ExperienceBlueprint {
	ui?: UI;
	navigation?: Navigation;
	loader?: Loader;
	renderer?: Renderer;
	camera?: Camera;
	world?: World;
	debug?: Debug;

	constructor(_?: Omit<ExperienceProps, "debug">) {
		try {
			super(
				HomeExperience._self ?? {
					..._,
					debug: Debug.enable,
				}
			);
			if (HomeExperience._self) return HomeExperience._self;
			HomeExperience._self = this;

			this.ui = new UI();
			this.navigation = new Navigation();
			this.loader = new Loader();
			this.renderer = new Renderer();
			this.camera = new Camera();
			this.world = new World();
			this.debug = new Debug();
		} catch (_err) {
			throw new ErrorFactory(_err);
		}
	}

	public destruct() {
		try {
			this.app.updateCallbacks[HomeExperience.name] &&
				delete this.app.updateCallbacks[HomeExperience.name];

			this.ui?.destruct();
			this.navigation?.destruct();
			this.loader?.destruct();
			this.renderer?.destruct();
			this.camera?.destruct();
			this.world?.destruct();
			this.debug?.destruct();
			this.app.destroy();

			HomeExperience._self = undefined;
			this._onDestruct && this._onDestruct();
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}

	public construct() {
		try {
			this.ui?.construct();
			this.navigation?.destruct();
			this.renderer?.construct();
			this.loader?.on(LOADED, () => {
				try {
					this.camera?.construct();
					this.world?.construct();
					this.debug?.construct();
					this.app?.setUpdateCallback(HomeExperience.name, () => this.update());
					this._onConstruct && this._onConstruct();
				} catch (_) {
					throw new ErrorFactory(_);
				}
			});
			this.loader?.construct();
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}

	public update() {
		try {
			this.world?.update();
			this.camera?.update();
			this.debug?.update();
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}
}

export default HomeExperience;
