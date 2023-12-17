import { PerspectiveCamera, Vector3 } from "three";
import GSAP from "gsap";

// EXPERIENCES
import HomeExperience from ".";
import Debug from "./Debug";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "@/experiences/blueprints/ExperienceBased.blueprint";

// EVENTS
import { CONSTRUCTED, DESTRUCTED } from "@/experiences/common/Event.model";

// MODELS
import {
	CAMERA_UNAVAILABLE,
	WRONG_PARAM,
} from "@/experiences/common/error.model";

// CONFIG
import { Config } from "@/experiences/config/Config";

export class Camera extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _appDebug = this._experience.app.debug;
	protected _currentCameraIndex: number = 0;

	public readonly cameras: PerspectiveCamera[] = [
		(() =>
			this._appCamera.instance instanceof PerspectiveCamera
				? this._appCamera.instance.clone()
				: new PerspectiveCamera())(),
		(() =>
			this._appCamera.instance instanceof PerspectiveCamera
				? new PerspectiveCamera(
						this._appCamera.instance.fov,
						Config.FIXED_WINDOW_WIDTH / Config.FIXED_WINDOW_HEIGHT,
						this._appCamera.instance.near,
						this._appCamera.instance.far
				  )
				: new PerspectiveCamera())(),
	];

	public readonly initialCameraFov = 35;
	public lookAtPosition = new Vector3();

	constructor() {
		super();
	}

	public get currentCameraIndex() {
		return this._currentCameraIndex;
	}

	construct() {
		if (!Debug.enable && this._appDebug?.cameraHelper) {
			this._experience.app.scene.remove(this._appDebug?.cameraHelper);
			this._appDebug?.cameraHelper?.remove();
			this._appDebug?.cameraHelper?.dispose();
		}

		if (!(this._appCamera?.instance instanceof PerspectiveCamera)) return;

		this._appCamera.instance.fov = this.initialCameraFov;
		this._appCamera.instance.far = 500;
		this._appCamera.miniCamera?.position.set(10, 8, 30);

		if (this._appDebug?.cameraControls) {
			this._appDebug.cameraControls.target =
				this._experience.world?.manager?.initialLookAtPosition ?? new Vector3();
		}

		this.emit(CONSTRUCTED);
	}

	destruct() {
		this.emit(DESTRUCTED);
	}

	cameraZoomIn() {
		if (this._experience.app?.camera.instance instanceof PerspectiveCamera)
			GSAP.to(this._experience.app?.camera.instance, {
				fov: 25,
			});
	}

	cameraZoomOut() {
		if (this._experience.app?.camera.instance instanceof PerspectiveCamera)
			GSAP.to(this._experience.app?.camera.instance, {
				fov: this._experience.camera?.initialCameraFov ?? 0,
			});
	}

	/**
	 * Switch between available cameras
	 *
	 * @param cameraIndex The camera index to switch at
	 */
	public switchCamera(cameraIndex: number) {
		if (this.currentCameraIndex === cameraIndex) return;

		if (
			!(
				typeof cameraIndex === "number" &&
				cameraIndex >= 0 &&
				cameraIndex <= this.cameras.length - 1
			)
		)
			throw new Error("Camera index not available", { cause: WRONG_PARAM });
		if (!(this._appCamera.instance instanceof PerspectiveCamera))
			throw new Error(undefined, { cause: CAMERA_UNAVAILABLE });

		const currentCamera = this.cameras[this.currentCameraIndex];
		const nextCamera = this.cameras[cameraIndex];

		currentCamera.copy(this._appCamera.instance);
		this._appCamera.instance.copy(nextCamera);
		this._appCamera.instance.fov = currentCamera.fov;
		this._appCamera.instance.aspect = currentCamera.aspect;
		this._appCamera.instance.near = currentCamera.near;
		this._appCamera.instance.far = currentCamera.far;

		this._currentCameraIndex = cameraIndex;
	}

	/**
	 * Set the camera look at position
	 * @param v3 Vector 3 position where the the camera should look at
	 */
	setCameraLookAt(v3: THREE.Vector3) {
		this._appCamera?.instance?.lookAt(v3);

		if (this._appDebug?.cameraControls)
			this._appDebug.cameraControls.target = v3;

		this.lookAtPosition = v3;
	}

	update() {}
}
