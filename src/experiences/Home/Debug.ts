import { PerspectiveCamera } from "three";
import GUI from "lil-gui";

// EXPERIENCE
import Experience from ".";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

export default class Debug implements ExperienceBase {
	private experience = new Experience();
	/** Graphic user interface of the experience instance */
	gui?: GUI;
	/** Running experience in debug mode*/
	static debugMode = (() => {
		try {
			return window?.location?.hash === "#debug";
		} catch (_) {
			return false;
		}
	})();

	constructor() {}

	construct() {
		if (this.gui) this.destruct();

		this.gui = this.experience.app.debug?.ui?.addFolder(Experience.name);

		if (!this.gui || !this.experience.world) return;

		this.gui.add(
			{ destruct_experience: () => this.experience?.destruct() },
			"destruct_experience"
		);

		this.gui
			.add(
				{
					fn: () => {
						const WORLD_CONTROLS = this.experience.world?.controls;
						if (
							!(
								WORLD_CONTROLS &&
								this.experience.app.camera.instance instanceof PerspectiveCamera
							)
						)
							return;

						this.experience.app.camera.instance.fov ===
						this.experience.camera?.initialCameraFov
							? WORLD_CONTROLS.cameraZoomIn()
							: WORLD_CONTROLS.cameraZoomOut();
					},
				},
				"fn"
			)
			.name("Toggle camera zoom");

		this.gui
			.add(
				{
					fn: () => {
						const WORLD_CONTROLS = this.experience.world?.controls;
						if (WORLD_CONTROLS)
							WORLD_CONTROLS.autoCameraAnimation =
								!WORLD_CONTROLS.autoCameraAnimation;
					},
				},
				"fn"
			)
			.name("Toggle auto camera animation");
	}

	destruct() {
		if (!this?.gui) return;

		this.gui.destroy();
		this.gui = undefined;

		// TODO: find a way to construct the project from `Debug` class
		// if (!this.experience.world) {
		// 	this.gui?.add(
		// 		{
		// 			construct_experience: () => {
		// 				this.experience?.construct();
		// 				this.construct();
		// 			},
		// 		},
		// 		"construct_experience"
		// 	);
		// }
	}
}
