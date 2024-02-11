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

export class ContentExperience extends ExperienceBlueprint {
	public readonly world?: World;
	public readonly ui?: UI;
	public readonly debug?: Debug;
	public readonly camera?: Camera;

	constructor(_?: Omit<ExperienceConstructorProps, "debug">) {
		try {
			super(
				ContentExperience._self ?? {
					..._,
					debug: !Config.DEBUG,
				}
			);
			if (ContentExperience._self) return ContentExperience._self;
			ContentExperience._self = this;

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

			this.app?.setUpdateCallback(ContentExperience.name, () => this.update());
			this.emit?.(events.CONSTRUCTED);
		} catch (_) {
			throw new ErrorFactory(_);
		}
	}

	public destruct() {
		this.app.updateCallbacks[ContentExperience.name] &&
			delete this.app.updateCallbacks[ContentExperience.name];

		this.ui?.destruct();
		this.camera?.destruct();
		this.world?.destruct();
		this.debug?.destruct();
		this.emit?.(events.DESTRUCTED);
		this.removeAllListeners();
		this.app.destroy();
		ContentExperience._self = undefined;
	}

	public update() {
		this.camera?.update();
		this.world?.update();
		this.debug?.update();
	}
}
