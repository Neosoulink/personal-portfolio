// EXPERIENCES
import { UI } from "./ui";
import { Router } from "./router";
import { Loader } from "./loader";
import { Renderer } from "./renderer";
import { Composer } from "./composer";
import { Camera } from "./camera";
import { World } from "./world";
import { Navigation } from "./navigation";
import { Debug } from "./debug";

// BLUEPRINTS
import { ExperienceBlueprint } from "~/blueprints/experiences/experience.blueprint";

// CONFIG
import { Config } from "~/config";

// STATIC
import { events } from "~/static";

// ERROR
import { ErrorFactory } from "~/errors";

// MODELS
import type { ExperienceConstructorProps } from "~/common/experiences/experience.model";

export class HomeExperience extends ExperienceBlueprint {
	public ui?: UI;
	public router?: Router;
	public loader?: Loader;
	public renderer?: Renderer;
	public composer?: Composer;
	public camera?: Camera;
	public world?: World;
	public navigation?: Navigation;
	public debug?: Debug;

	constructor(_?: Omit<ExperienceConstructorProps, "debug">) {
		try {
			super(
				HomeExperience._self ?? {
					..._,
					debug: Config.DEBUG,
				},
			);
			if (HomeExperience._self) return HomeExperience._self;
			HomeExperience._self = this;

			this.ui = new UI();
			this.router = new Router();
			this.loader = new Loader();
			this.renderer = new Renderer();
			this.composer = new Composer();
			this.camera = new Camera();
			this.world = new World();
			this.navigation = new Navigation();
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
			this.router?.destruct();
			this.loader?.destruct();
			this.renderer?.destruct();
			this.composer?.destruct();
			this.camera?.destruct();
			this.world?.destruct();
			this.navigation?.destruct();
			this.debug?.destruct();
			this.app.destroy();

			HomeExperience._self = undefined;
			this._onDestruct?.();
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}

	public construct() {
		try {
			this.ui?.construct();
			this.router?.construct();
			this.loader?.on(events.LOADED, () => {
				try {
					this.camera?.construct();
					this.composer?.construct();
					this.renderer?.construct();
					this.world?.construct();
					this.navigation?.construct();
					this.debug?.construct();
					this.app?.setUpdateCallback(HomeExperience.name, () => this.update());
					this._onConstruct?.();
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
			this.navigation?.update();
			this.composer?.update();
			this.debug?.update();
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}
}
