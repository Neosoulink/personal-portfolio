import { PerspectiveCamera, Vector3 } from "three";
import gsap from "gsap";

// EXPERIENCES
import { ContentExperience } from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// STATIC
import { events } from "~/static";

// CONFIG
import { Config } from "~/config";

/**
 * [`quick-threejs#Camera`](https://www.npmjs.com/package/quick-threejs)
 * Subset module. In charge of managing camera states.
 */
export class Camera extends ExperienceBasedBlueprint {
	protected readonly _experience = new ContentExperience();

	private readonly _appCamera = this._experience.app.camera;
	private readonly _appCameraControls =
		this._experience.app.debug?.cameraControls;
	private readonly _appCameraInstance = this._experience.app.camera.instance;
	private readonly _appDebug = this._experience.app.debug;
	private readonly _ui = this._experience.ui;

	private readonly _timeline = gsap.timeline({
		onStart: () => {
			this.emit(events.ANIMATION_STARTED);
		},
		onComplete: () => {
			this._timeline.clear();
			this.emit(events.ANIMATION_ENDED);
		},
	});
	private _target = new Vector3();

	public readonly initialFov = 30;
	public readonly initialPosition = new Vector3(0, 0, 0.6);
	public readonly initialTargetPosition = new Vector3();

	public get target() {
		return this._target;
	}

	public get timeline() {
		return this._timeline;
	}

	public get instance(): PerspectiveCamera {
		if (this._appCamera.instance instanceof PerspectiveCamera)
			return this._appCamera.instance;

		return new PerspectiveCamera();
	}

	public construct() {
		if (!Config.DEBUG && this._appDebug?.cameraHelper) {
			this._experience.app.scene.remove(this._appDebug?.cameraHelper);
			this._appDebug?.cameraHelper?.remove();
			this._appDebug?.cameraHelper?.dispose();
		}

		if (!(this._appCameraInstance instanceof PerspectiveCamera)) return;

		this._appCamera.miniCamera?.position.set(1, 1, 2);

		this.setCameraLookAt(this.initialTargetPosition);
		this.setCameraPosition(this.initialPosition);
		this.correctAspect();

		this.emit(events.CONSTRUCTED);
	}

	public destruct() {
		this.emit(events.DESTRUCTED);
		this.removeAllListeners();
	}

	public cameraZoomIn() {
		if (!(this.instance instanceof PerspectiveCamera)) this._timeline;
		if (this._timeline.isActive()) this.timeline.progress(1);

		return this._timeline.to(this.instance, {
			fov: 25,
			duration: Config.GSAP_ANIMATION_DURATION,
			onComplete: () => {
				this.emit(events.CAMERA_FOV_CHANGED);
				this.emit(events.CHANGED);
			},
		});
	}

	public resetFov() {
		return (this.instance.fov = this.initialFov);
	}

	/**
	 * Set the camera look at position.
	 * @param v3 The {@link Vector3} position where the the camera will look at.
	 */
	public setCameraPosition(v3 = new Vector3()) {
		this._appCameraInstance?.position.copy(v3);
	}

	/**
	 * Set the camera look at position.
	 *
	 * @param v3 The {@link Vector3} position where the the camera will look at.
	 */
	public setCameraLookAt(v3 = new Vector3()) {
		this._target = v3.clone();

		return this._target;
	}

	/** Correct the aspect ration of the camera. */
	public correctAspect() {
		if (!(this._appCameraInstance instanceof PerspectiveCamera)) return;

		this._appCameraInstance.fov = this.initialFov;
		this._appCameraInstance.far = 500;
		this._appCamera.resize();

		return this._appCamera;
	}
}
