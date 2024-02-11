import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

// EXPERIENCE
import { ContentExperience } from ".";

// CONFIG
import { Config } from "~/config";

// MODELS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// STATIC
import { DESTRUCTED } from "~/static/event.static";
import { events } from "~/static";

export class Debug extends ExperienceBasedBlueprint {
	protected readonly _experience = new ContentExperience();

	private readonly _appScene = this._experience.app.scene;
	private readonly _appDebug = this._experience.app.debug;
	private readonly _camera = this._experience.camera;

	private _gui?: GUI;
	private _targetIndicator?: Mesh;

	construct() {
		if (!Config.DEBUG) {
			this._appDebug?.ui?.destroy();
			return;
		}

		this._gui = this._experience.app.debug?.ui?.addFolder(
			ContentExperience.name
		);

		if (!this._gui || !this._experience.world) return;

		this._gui.close();

		this._targetIndicator = new Mesh(
			new SphereGeometry(0.1, 12, 12),
			new MeshBasicMaterial({ color: "#ff0040" })
		);
		this._targetIndicator.visible = false;

		this._gui
			.add(
				{
					fn: () => {
						if (this._targetIndicator)
							this._targetIndicator.visible = !this._targetIndicator.visible;
					},
				},
				"fn"
			)
			.name("Toggle Target indicator");

		this._appScene.add(this._targetIndicator);

		this.emit(events.CONSTRUCTED);
	}

	destruct() {
		if (!Config.DEBUG) return;

		if (this?._gui) {
			this._gui.destroy();
			this._gui = undefined;
		}

		this.emit(DESTRUCTED);
		this.removeAllListeners();
	}

	update() {
		this._camera && this._targetIndicator?.position.copy(this._camera.target);
	}
}
