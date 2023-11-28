import {
	BufferGeometry,
	Line,
	LineBasicMaterial,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	SphereGeometry,
	Vector3,
} from "three";
import GUI from "lil-gui";

// EXPERIENCE
import Experience from ".";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

export default class Debug implements ExperienceBase {
	protected readonly _experience = new Experience();
	protected readonly _appDebug = this._experience.app.debug;
	protected readonly _appCamera = this._experience.app.camera;

	/** Graphic user interface of the experience instance */
	protected _gui?: GUI;
	/** Indicate where the camera is looking at. */
	protected cameraLookAtPointIndicator?: Mesh;
	/** Running experience in debug mode */
	static readonly enable = (() => {
		try {
			return useRuntimeConfig().public.env === "development";
		} catch (_) {
			return false;
		}
	})();

	protected _cameraCurvePathLine?: Line;

	constructor() {}

	construct() {
		if (!Debug.enable) {
			this._appDebug?.ui?.destroy();
			return;
		}

		if (this._gui) this.destruct();

		this._gui = this._experience.app.debug?.ui?.addFolder(Experience.name);

		if (!this._gui || !this._experience.world) return;

		// this._gui.add(
		// 	{ destruct_experience: () => this._experience?.destruct() },
		// 	"destruct_experience"
		// );

		this._gui
			.add(
				{
					fn: () => {
						const WORLD_CONTROLS = this._experience.world?.controls;
						if (
							!(
								WORLD_CONTROLS &&
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
						const WORLD_CONTROLS = this._experience.world?.controls;
						if (WORLD_CONTROLS)
							WORLD_CONTROLS.autoCameraAnimation =
								!WORLD_CONTROLS.autoCameraAnimation;
					},
				},
				"fn"
			)
			.name("Toggle auto camera animation");

		this._gui
			.add(
				{
					fn: () => {
						this._experience.world?.nextScene();
					},
				},
				"fn"
			)
			.name("Next Scene");

		this.cameraLookAtPointIndicator = new Mesh(
			new SphereGeometry(0.1, 12, 12),
			new MeshBasicMaterial({ color: "#ff0040" })
		);
		this._cameraCurvePathLine = new Line(
			new BufferGeometry().setFromPoints(
				[...Array(3).keys()].map(() => new Vector3(0, 0, 0))
			),
			new LineBasicMaterial({
				color: 0xff0000,
			})
		);

		this._experience.app.scene.add(
			this._cameraCurvePathLine,
			this.cameraLookAtPointIndicator
		);
	}

	destruct() {
		if (!Debug.enable) return;

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
	}

	update() {
		this._appCamera?.instance &&
			this._experience.camera &&
			this.cameraLookAtPointIndicator?.position.copy(
				this._experience.camera.lookAtPosition
			);
	}
}
