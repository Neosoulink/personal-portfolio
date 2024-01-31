import {
	BufferGeometry,
	CameraHelper,
	Line,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	SphereGeometry,
	Vector3,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

// EXPERIENCE
import { HomeExperience } from ".";

// CONFIG
import { Config } from "~/config";

// MODELS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// STATIC
import { DESTRUCTED } from "~/static/event.static";

export class Debug extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appDebug = this._experience.app.debug;
	private readonly _appCamera = this._experience.app.camera;
	private readonly _camera = this._experience.camera;
	private readonly _cameraAnimation = this._experience.cameraAnimation;
	private readonly _interactions = this._experience.interactions;
	private readonly _ui = this._experience.ui;
	private readonly _worldCameraHelpers?: CameraHelper[] = [];

	private _gui?: GUI;
	private _targetIndicator?: Mesh;
	private _cameraCurvePathLine?: Line;

	construct() {
		if (!Config.DEBUG) {
			this._appDebug?.ui?.destroy();
			return;
		}

		if (this._gui) this.destruct();

		this._gui = this._experience.app.debug?.ui?.addFolder(HomeExperience.name);
		if (this._appDebug?.cameraControls) {
			this._appDebug.cameraControls.dispose();
			this._appDebug.cameraControls = undefined;
		}

		if (!this._gui || !this._experience.world) return;

		this._gui.close();

		this._targetIndicator = new Mesh(
			new SphereGeometry(0.1, 12, 12),
			new MeshBasicMaterial({ color: "#ff0040" })
		);
		this._targetIndicator.visible = false;
		this._camera?.cameras.forEach((item, id) => {
			const cameraHelper = new CameraHelper(item);
			this._worldCameraHelpers?.push(cameraHelper);
			this._experience.app.scene.add(cameraHelper);
		});

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

		this._cameraCurvePathLine = new Line(
			new BufferGeometry().setFromPoints(
				[...Array(3).keys()].map(() => new Vector3(0, 0, 0))
			),
			new LineBasicMaterial({
				color: 0xff0000,
			})
		);

		this._gui
			.add(
				{
					fn: () => {
						if (
							!(
								this._experience.app.camera.instance instanceof
								PerspectiveCamera
							)
						)
							return;

						this._experience.app.camera.instance.fov ===
						this._experience.camera?.initialCameraFov
							? this._experience.camera.cameraZoomIn()
							: this._experience.camera?.resetFov();
					},
				},
				"fn"
			)
			.name("Toggle camera zoom");

		this._gui
			.add(
				{
					fn: () => {
						if (this._cameraAnimation?.enabled === true)
							this._cameraAnimation.disable();
						else if (this._cameraAnimation?.enabled === false)
							this._cameraAnimation.enable();
					},
				},
				"fn"
			)
			.name("Toggle auto camera animation");

		this._gui
			.add(
				{
					fn: () => this._interactions?.leaveFocusMode(),
				},
				"fn"
			)
			.name("Leave focus mode");

		this._gui
			?.add(
				{
					fn: () => {
						if (!this._ui) return;

						if (!this._ui.markers.length) {
							this._ui.markers = [
								{
									position: new Vector3(2, 3, 0),
									title: "test 1",
									content: "test content",
								},
								{
									position: new Vector3(2, 2, 5),
									title: "test 2",
									content: "test content",
								},
							];
						}

						if (this._ui.isMarkersDisplayed) return this._ui.removeMarkers();
						this._ui.displayMarks();
					},
				},
				"fn"
			)
			.name("Toggle ui markers");

		this._experience.app.scene.add(
			this._cameraCurvePathLine,
			this._targetIndicator
		);
	}

	destruct() {
		if (!Config.DEBUG) return;

		~(() => {
			if (!this?._gui) return;
			this._gui.destroy();
			this._gui = undefined;
		})();

		~(() => {
			this._cameraCurvePathLine &&
				this._experience.app.scene.remove(this._cameraCurvePathLine);
			this._cameraCurvePathLine?.clear();
		})();

		// TODO: find a way to construct the project from `Debug` class
		// if (!this._experience.world) {
		// 	this._gui?.add(
		// 		{
		// 			construct_experience: () => {
		// 				this._experience?.construct();
		// 				this.construct();
		// 			},
		// 		},
		// 		"construct_experience"
		// 	);
		// }
		this.emit(DESTRUCTED);
		this.removeAllListeners();
	}

	update() {
		this._appCamera?.instance &&
			this._experience.camera &&
			this._targetIndicator?.position.copy(
				this._experience.camera.lookAtPosition
			);
	}
}
