import * as THREE from "three";
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

		if (!this.gui || !this.experience.world) {
			return;
		}

		this.gui
			?.add(
				{
					fn: () => {
						const _POS_LOOK_AT = new THREE.Vector3().copy(
							this.experience.world?.isometricRoom?.roomBoard?.position ??
								new THREE.Vector3()
						);
						const _POS = new THREE.Vector3()
							.copy(_POS_LOOK_AT)
							.set(
								_POS_LOOK_AT.x,
								_POS_LOOK_AT.y,
								_POS_LOOK_AT.z - _POS_LOOK_AT.z
							);

						if (this.experience.world?.interactions) {
							this.experience.world.interactions.focusedElementRadius = 0.5;
							this.experience.world.interactions.toggleFocusMode(
								_POS,
								_POS_LOOK_AT
							);
						}
					},
				},
				"fn"
			)
			.name("Focus Board");
		this.gui
			?.add(
				{
					fn: () => {
						const _POS_LOOK_AT = new THREE.Vector3().copy(
							this.experience.world?.isometricRoom?.roomShelves?.position ??
								new THREE.Vector3()
						);
						const _POS = new THREE.Vector3().copy(_POS_LOOK_AT);
						_POS.x += 3;
						_POS.y += 0.2;

						if (this.experience.world?.interactions) {
							this.experience.world.interactions.focusedElementRadius = 0.5;
							this.experience.world.interactions.toggleFocusMode(
								_POS,
								_POS_LOOK_AT
							);
						}
					},
				},
				"fn"
			)
			.name("Room shelves");
		this.gui
			?.add(
				{
					fn: () => {
						const _POS_LOOK_AT = new THREE.Vector3().copy(
							this.experience.world?.isometricRoom?.pcScreen?.position ??
								new THREE.Vector3()
						);

						if (this.experience.world?.interactions) {
							this.experience.world.interactions.focusedElementRadius = 2.5;
							const _POS = new THREE.Vector3()
								.copy(_POS_LOOK_AT)
								.set(0, _POS_LOOK_AT.y + 0.2, 0);

							this.experience.world.interactions.toggleFocusMode(
								_POS,
								_POS_LOOK_AT
							);
						}
					},
				},
				"fn"
			)
			.name("Focus desc");
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
