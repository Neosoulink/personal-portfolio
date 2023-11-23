import GUI from "lil-gui";

// EXPERIENCE
import Experience from ".";

// INTERFACES
import type BaseExperience from "@/interfaces/BaseExperience";

export default class Debug implements BaseExperience {
	private experience = new Experience();
	/**
	 * Graphic user interface of the experience instance
	 */
	gui?: GUI;
	/**
	 *
	 */
	debugMode = window?.location?.hash === "#debug";

	constructor() {}

	construct() {
		if (!this.debugMode) return;

		this.initDebugOptions();
	}

	destruct() {
		if (!this?.gui) return;

		this.gui.destroy();
		this.gui = undefined;
	}

	/**
	 * Initialize debug options
	 */
	private initDebugOptions() {
		if (this.gui) this.destruct();

		this.gui = this.experience.app.debug?.ui?.addFolder(Experience.name);

		this.constructExperience();
		this.destructExperience();

		if (!this.gui || !this.experience.world) return;

		this.gui
			?.add(
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
			?.add(
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

	private constructExperience() {
		if (!this.experience.world) {
			this.gui?.add(
				{
					construct_experience: () => {
						this.experience?.construct();
						this.construct();
					},
				},
				"construct_experience"
			);
		}
	}

	private destructExperience() {
		if (this.experience.world) {
			this.gui?.add(
				{ destruct_experience: () => this.experience?.destruct() },
				"destruct_experience"
			);
		}
	}
}
