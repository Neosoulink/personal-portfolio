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

		if (this.experience.app.debug?.cameraControls)
			this.experience.app.debug.cameraControls.enabled = false;

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

						if (_INTERACTIONS) _INTERACTIONS.nextFocusPoint();
					},
				},
				"fn"
			)
			.name("Next focus position");

		this.gui
			?.add(
				{
					fn: () => {
						const _INTERACTIONS = this.experience.world?.interactions;

						if (_INTERACTIONS) _INTERACTIONS.prevFocusPoint();
					},
				},
				"fn"
			)
			.name("Prev focus position");

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

		this.gui
			?.add(
				{ fn: () => this.experience?.world?.interactions?.unFocusPoint() },
				"fn"
			)
			.name("Out focus mode");

		this.gui
			?.add(
				{
					fn: () => {
						if (
							this.experience.world?.isometricRoom?.modelMeshes?.monitorAScreen
								?.material instanceof THREE.MeshBasicMaterial
						) {
							GSAP.to(
								this.experience.world.isometricRoom.modelMeshes.monitorAScreen
									?.material.color,
								{
									duration: 0.1,
									r: this.experience.world.isometricRoom.modelMeshes
										.monitorAScreen?.material.color.r
										? 0
										: 1,
									g: this.experience.world.isometricRoom.modelMeshes
										.monitorAScreen?.material.color.r
										? 0
										: 1,
									b: this.experience.world.isometricRoom.modelMeshes
										.monitorAScreen?.material.color.r
										? 0
										: 1,
								}
							);
						}
					},
				},
				"fn"
			)
			.name("Toggle screen A size");
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
