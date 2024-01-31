// EXPERIENCES
import { UI } from "./ui";
import { Router } from "./router";
import { Loader } from "./loader";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Composer } from "./composer";
import { Navigation } from "./navigation";
import { CameraAnimation } from "./camera-animation";
import { Interactions } from "./interactions";
import { World } from "./world";
import { Debug } from "./debug";

// MODELS
import { ExperienceBlueprint } from "~/common/blueprints/experience.blueprint";

// CONFIG
import { Config } from "~/config";

// STATIC
import { events } from "~/static";

// ERROR
import { ErrorFactory } from "~/errors";

// MODELS
import type { ExperienceConstructorProps } from "~/common/models/experience.model";

/**
 * Experience class for Home page.
 * (Module root).
 */
export class HomeExperience extends ExperienceBlueprint {
	public readonly ui?: UI;
	public readonly router?: Router;
	public readonly loader?: Loader;
	public readonly camera?: Camera;
	public readonly renderer?: Renderer;
	public readonly composer?: Composer;
	public readonly navigation?: Navigation;
	public readonly cameraAnimation?: CameraAnimation;
	public readonly interactions?: Interactions;
	public readonly world?: World;
	public readonly debug?: Debug;

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
			this.renderer = new Renderer();
			this.composer = new Composer();
			this.navigation = new Navigation();
			this.cameraAnimation = new CameraAnimation();
			this.interactions = new Interactions();
			this.world = new World();
			this.debug = new Debug();
		} catch (err) {
			throw new ErrorFactory(err);
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
			this.renderer?.destruct();
			this.composer?.destruct();
			this.navigation?.destruct();
			this.cameraAnimation?.destruct();
			this.interactions?.destruct();
			this.world?.destruct();
			this.debug?.destruct();
			this.app.destroy();

			HomeExperience._self = undefined;
			this.emit?.(events.DESTRUCTED);
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}

	public construct() {
		try {
			this.ui?.construct();
			this.router?.construct();
			this.loader?.construct();
			this.camera?.construct();
			this.renderer?.construct();
			this.composer?.construct();
			this.navigation?.construct();
			this.cameraAnimation?.construct();
			this.interactions?.construct();
			this.ui?.on(events.LOADED, () => {
				try {
					this.world?.construct();
					this.debug?.construct();
					this.app?.setUpdateCallback(HomeExperience.name, () => this.update());
					this.emit?.(events.CONSTRUCTED);
				} catch (_) {
					throw new ErrorFactory(_);
				}
			});
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}

	public update() {
		try {
			this.ui?.update();
			this.router?.update();
			this.camera?.update();
			this.renderer?.update();
			this.composer?.update();
			this.navigation?.update();
			this.cameraAnimation?.update();
			this.interactions?.update();
			this.world?.update();
			this.debug?.update();
			this.emit?.(events.UPDATED);
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}
}
