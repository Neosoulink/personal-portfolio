// EXPERIENCES
import { UI } from "./ui";
import { Router } from "./router";
import { Loader } from "./loader";
import { Renderer } from "./renderer";
import { Composer } from "./composer";
import { Camera } from "./camera";
import { World } from "./world";
import { Navigation } from "./navigation";
import { Interactions } from "./interactions";
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
import { CameraAnimation } from "./camera-animation";
import { Vector3 } from "three";

export class HomeExperience extends ExperienceBlueprint {
	public ui?: UI;
	public router?: Router;
	public loader?: Loader;
	public composer?: Composer;
	public camera?: Camera;
	public renderer?: Renderer;
	public world?: World;
	public cameraAnimation?: CameraAnimation;
	public navigation?: Navigation;
	public interactions?: Interactions;
	public debug?: Debug;

	constructor(_?: Omit<ExperienceConstructorProps, "debug">) {
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
			this.router = new Router();
			this.loader = new Loader();
			this.camera = new Camera();
			this.composer = new Composer();
			this.renderer = new Renderer();
			this.navigation = new Navigation();
			this.cameraAnimation = new CameraAnimation();
			this.interactions = new Interactions();
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
			this.router?.destruct();
			this.loader?.destruct();
			this.camera?.destruct();
			this.composer?.destruct();
			this.renderer?.destruct();
			this.navigation?.destruct();
			this.cameraAnimation?.destruct();
			this.interactions?.destruct();
			this.world?.destruct();
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
			this.loader?.construct();
			this.router?.construct();
			this.camera?.construct();
			this.composer?.construct();
			this.renderer?.construct();
			this.navigation?.construct();
			this.cameraAnimation?.construct();
			this.interactions?.construct();
			this.ui?.on(events.LOADED, () => {
				try {
					this.world?.construct();
					this.debug?.construct();
					this.app?.setUpdateCallback(HomeExperience.name, () => this.update());
					this._onConstruct?.();
				} catch (_) {
					throw new ErrorFactory(_);
				}
			});

			this.camera?.setCameraLookAt(new Vector3(0, 2, 0));
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}

	public update() {
		try {
			this.ui?.update();
			this.world?.update();
			this.camera?.update();
			this.cameraAnimation?.update();
			this.navigation?.update();
			this.composer?.update();
			this.interactions?.update();
			this.renderer?.update();
			this.debug?.update();
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}
}
