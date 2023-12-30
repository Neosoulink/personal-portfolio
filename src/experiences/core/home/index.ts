// EXPERIENCES
import { UI } from "./ui";
import { Navigation } from "./navigation";
import { Loader } from "./loader";
import { Renderer } from "./renderer";
import { Composer } from "./composer";
import { Camera } from "./camera";
import { World } from "./world";
import { Debug } from "./debug";

// BLUEPRINT
import {
	ExperienceBlueprint,
	type ExperienceProps,
} from "~/experiences/blueprints/experience.blueprint";

// MODELS
import { LOADED } from "~/common/event.model";

// ERRORS
import { ErrorFactory } from "~/experiences/errors/error.factory";
import { Config } from "~/experiences/config";

export class HomeExperience extends ExperienceBlueprint {
	ui?: UI;
	navigation?: Navigation;
	loader?: Loader;
	renderer?: Renderer;
	composer?: Composer;
	camera?: Camera;
	world?: World;
	debug?: Debug;

	constructor(_?: Omit<ExperienceProps, "debug">) {
		try {
			super(
				HomeExperience._self ?? {
					..._,
					debug: Config.DEBUG,
				}
			);
			if (HomeExperience._self) return HomeExperience._self;
			HomeExperience._self = this;

			this.ui = new UI();
			this.navigation = new Navigation();
			this.loader = new Loader();
			this.renderer = new Renderer();
			this.composer = new Composer();
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
			this.composer?.destruct();
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
			this.composer?.construct();
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
			this.composer?.update();
			this.debug?.update();
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}
}
