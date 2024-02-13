import { events as quickEvents } from "quick-threejs/lib/static";

// BLUEPRINTS
import { ExperienceBlueprint } from "~/common/blueprints/experience.blueprint";

// MODELS
import type { ExperienceConstructorProps } from "~/common/models/experience.model";

// CONFIGS
import { Config } from "~/config";

// EXPERIENCES
import { UI } from "./ui";
import { Debug } from "./debug";
import { World } from "./world";
import { Camera } from "./camera";

// ERRORS
import { ErrorFactory } from "~/errors";
import { events } from "~/static";

export class LiquidBgExperience extends ExperienceBlueprint {
	public readonly world?: World;
	public readonly ui?: UI;
	public readonly debug?: Debug;
	public readonly camera?: Camera;

	constructor(_?: Omit<ExperienceConstructorProps, "debug">) {
		try {
			super(
				LiquidBgExperience._self ?? {
					..._,
					debug:  Config.DEBUG,
				}
			);
			if (LiquidBgExperience._self) return LiquidBgExperience._self;
			LiquidBgExperience._self = this;

			this.ui = new UI();
			this.camera = new Camera();
			this.world = new World();
			this.debug = new Debug();
		} catch (err) {
			throw new ErrorFactory(err);
		}
	}

	public construct() {
		try {
			this.ui?.construct();
			this.camera?.construct();
			this.world?.construct();
			this.debug?.construct();

			this.app?.on(quickEvents.UPDATED, () => this.update());
			this.emit?.(events.CONSTRUCTED);
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}

	public destruct() {
		this.ui?.destruct();
		this.camera?.destruct();
		this.world?.destruct();
		this.debug?.destruct();
		this.app.destruct();
		LiquidBgExperience._self = undefined;
		this.emit?.(events.DESTRUCTED);
		this.removeAllListeners();
	}

	public update() {
		this.camera?.update();
		this.world?.update();
		this.debug?.update();
	}
}
