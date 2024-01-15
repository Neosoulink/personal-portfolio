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

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";

// STATIC
import { DESTRUCTED } from "~/static/event.static";

export class Debug extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();
	protected readonly _appDebug = this._experience.app.debug;
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _camera = this._experience.camera;
	protected readonly _cameraAnimation = this._experience.cameraAnimation;
	protected readonly _worldCameraHelpers?: CameraHelper[] = [];

	protected _gui?: GUI;
	/** Indicate where the camera is looking at. */
	protected cameraLookAtPointIndicator?: Mesh;
	protected _cameraCurvePathLine?: Line;

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

		this.cameraLookAtPointIndicator = new Mesh(
			new SphereGeometry(0.1, 12, 12),
			new MeshBasicMaterial({ color: "#ff0040" })
		);
		this.cameraLookAtPointIndicator.visible = false;
		this._camera?.cameras.forEach((item, id) => {
			const cameraHelper = new CameraHelper(item);
			this._worldCameraHelpers?.push(cameraHelper);
			this._experience.app.scene.add(cameraHelper);
		});

		this._gui
			.add(
				{
					fn: () => {
						if (this.cameraLookAtPointIndicator)
							this.cameraLookAtPointIndicator.visible =
								!this.cameraLookAtPointIndicator.visible;
					},
				},
				"fn"
			)
			.name("Toggle LookAt indicator visibility");

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
							: this._experience.camera?.cameraZoomOut();
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

		this._experience.app.scene.add(
			this._cameraCurvePathLine,
			this.cameraLookAtPointIndicator
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
	}

	update() {
		this._appCamera?.instance &&
			this._experience.camera &&
			this.cameraLookAtPointIndicator?.position.copy(
				this._experience.camera.lookAtPosition
			);
	}
}
