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

	constructor() {
		if (!Debug.debugMode) return;

		this.gui = this.experience.app.debug?.ui?.addFolder(Experience.name);
	}

	construct() {
		if (this.gui) this.destruct();

		if (!this.gui || !this.experience.world) return;

		this.gui.add(
			{ destruct_experience: () => this.experience?.destruct() },
			"destruct_experience"
		);

		this.gui
			.add(
				{
					fn: () => {
						const _INTERACTIONS = this.experience.world?.controls;
						if (_INTERACTIONS) _INTERACTIONS.cameraZoomIn();
					},
				},
				"fn"
			)
			.name("Camera zoom in");

		this.gui
			.add(
				{
					fn: () => {
						const _INTERACTIONS = this.experience.world?.controls;
						if (_INTERACTIONS) _INTERACTIONS.cameraZoomOut();
					},
				},
				"fn"
			)
			.name("Camera zoom out");
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
