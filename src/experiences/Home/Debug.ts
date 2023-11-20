import * as THREE from "three";
import GSAP from "gsap";
import GUI from "lil-gui";

// CLASSES
import Experience from ".";

export default class Debug {
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

		this.setGui();
	}

	destruct() {
		if (!this?.gui) return;

		this.gui.destroy();
		this.gui = undefined;
	}

	/**
	 *
	 */
	setGui() {
		if (this.gui) this.destruct();

		this.gui = this.experience.app.debug?.ui?.addFolder(Experience.name);

		this.constructExperience();
		this.destructExperience();

		if (!this.gui || !this.experience.world) return;

		this.gui
			?.add(
				{
					fn: () => {
						const _INTERACTIONS = this.experience.world?.interactions;
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
						const _INTERACTIONS = this.experience.world?.interactions;
						if (_INTERACTIONS) _INTERACTIONS.cameraZoomOut();
					},
				},
				"fn"
			)
			.name("Camera zoom out");
	}

	constructExperience() {
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

	destructExperience() {
		if (this.experience.world) {
			this.gui?.add(
				{ destruct_experience: () => this.experience?.destruct() },
				"destruct_experience"
			);
		}
	}
}
