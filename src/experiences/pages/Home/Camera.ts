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
	protected _currentCameraIndex = 0;
	protected _prevCameraProps = {
		fov: 0,
		aspect: 0,
		near: 0,
		far: 0,
	};
	public readonly initialCameraFov = 35;

	public readonly cameras: PerspectiveCamera[] = [
		(() =>
			this._appCamera.instance instanceof PerspectiveCamera
				? new PerspectiveCamera().copy(this._appCamera.instance)
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

		this.correctAspect();
		this._appCamera.miniCamera?.position.set(10, 8, 30);
		this._prevCameraProps = {
			fov: this._appCamera.instance.fov,
			aspect: this._appCamera.instance.aspect,
			near: this._appCamera.instance.near,
			far: this._appCamera.instance.far,
		};

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

		// TODO: 🚧 Improvement required. Correctly get the previous camera properties.
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
		currentCamera.fov = nextCamera.fov;
		currentCamera.aspect = nextCamera.aspect;
		currentCamera.near = nextCamera.near;
		currentCamera.far = nextCamera.far;

		this._appCamera.instance.copy(nextCamera);

		this._appCamera.instance.fov = this._prevCameraProps.fov;
		this._appCamera.instance.aspect = this._prevCameraProps.aspect;
		this._appCamera.instance.near = this._prevCameraProps.near;
		this._appCamera.instance.far = this._prevCameraProps.far;

		this.correctAspect();
		currentCamera.updateProjectionMatrix();

		this._prevCameraProps = {
			fov: nextCamera.fov,
			aspect: nextCamera.aspect,
			near: nextCamera.near,
			far: nextCamera.far,
		};
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

	public correctAspect() {
		if (!(this._appCamera.instance instanceof PerspectiveCamera)) return;

		this._appCamera.instance.fov = this.initialCameraFov;
		this._appCamera.instance.far = 500;
		this._appCamera.resize();
	}
}
