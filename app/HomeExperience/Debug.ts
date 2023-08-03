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
						if (_INTERACTIONS) {
							const _CURRENT_INDEX =
								_INTERACTIONS.focusedPosition &&
								_INTERACTIONS.positionsToFocus.length - 1 >
									_INTERACTIONS.currentFocusedPositionIndex
									? _INTERACTIONS.currentFocusedPositionIndex + 1
									: 0;
							const CURRENT_FOCUSED_POSITION =
								_INTERACTIONS.positionsToFocus[_CURRENT_INDEX];
							const _PREV_LOOK_AT_POINT = _INTERACTIONS.focusedPosition
								? _CURRENT_INDEX - 1 < 0
									? _INTERACTIONS.getFocusedLookAtPosition(
											_INTERACTIONS.positionsToFocus[
												_INTERACTIONS.positionsToFocus.length - 1
											].point
									  )
									: _INTERACTIONS.getFocusedLookAtPosition(
											_INTERACTIONS.positionsToFocus[_CURRENT_INDEX - 1].point
									  )
								: _INTERACTIONS.initialLookAtPosition;

							_INTERACTIONS.focusedRadius = _CURRENT_INDEX === 0 ? 2.5 : 0.8;
							_INTERACTIONS.currentFocusedPositionIndex = _CURRENT_INDEX;

							console.log(
								"POINTS ==>",
								CURRENT_FOCUSED_POSITION.point,
								_PREV_LOOK_AT_POINT
							);

							_INTERACTIONS.focusPoint(
								CURRENT_FOCUSED_POSITION.cameraPosition,
								CURRENT_FOCUSED_POSITION.point,
								_PREV_LOOK_AT_POINT
							);
						}
					},
				},
				"fn"
			)
			.name("Focus mode");

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
							this.experience.world?.isometricRoom?.monitorAScreen &&
							this.experience.world.isometricRoom.monitorAScreen
								.material instanceof THREE.MeshBasicMaterial
						) {
							if (
								this.experience.world.isometricRoom.monitorAScreen.material
									.opacity != 0
							) {
								GSAP.to(
									this.experience.world.isometricRoom.monitorAScreen.material,
									{
										duration: 1,
										opacity: 0,
									}
								);
							} else {
								GSAP.to(
									this.experience.world.isometricRoom.monitorAScreen.material,
									{
										duration: 1,
										opacity: 1,
									}
								);
							}
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
