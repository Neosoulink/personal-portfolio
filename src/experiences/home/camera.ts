import { PerspectiveCamera, Vector3 } from "three";
import gsap from "gsap";

// EXPERIENCES
import { HomeExperience } from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";

// STATIC
import { events, errors } from "~/static";

// CONFIG
import { Config } from "~/config";

export class Camera extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appCamera = this._experience.app.camera;
	private readonly _router = this._experience.router;
	private readonly _appCameraInstance = this._experience.app.camera.instance;
	private readonly _appDebug = this._experience.app.debug;
	private readonly _timeline = gsap.timeline({
		onStart: () => {
			this.emit(events.ANIMATION_STARTED);
		},
		onComplete: () => {
			this._timeline.clear();
			this.emit(events.ANIMATION_ENDED);
		},
	});

	private _lookAtPosition = new Vector3();
	private _currentCameraIndex = 0;
	private _prevCameraProps = {
		fov: 0,
		aspect: 0,
		near: 0,
		far: 0,
	};
	private _onRouteChange?: () => void;

	public readonly initialCameraFov = 45;
	public readonly initialCameraPosition = new Vector3(0, 10, 20);
	public readonly cameras = [
		(() =>
			this._appCameraInstance instanceof PerspectiveCamera
				? new PerspectiveCamera().copy(this._appCameraInstance)
				: new PerspectiveCamera())(),
		(() =>
			this._appCameraInstance instanceof PerspectiveCamera
				? new PerspectiveCamera(
						this._appCameraInstance.fov,
						Config.FIXED_WINDOW_WIDTH / Config.FIXED_WINDOW_HEIGHT,
						this._appCameraInstance.near,
						this._appCameraInstance.far
				  )
				: new PerspectiveCamera())(),
	] as const;

	public get currentCameraIndex() {
		return this._currentCameraIndex;
	}

	public get lookAtPosition() {
		return this._lookAtPosition.clone();
	}

	public get timeline() {
		return this._timeline;
	}

	public get currentCamera() {
		return this.cameras[this.currentCameraIndex];
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

		this.correctAspect();
		this._appCamera.miniCamera?.position.set(10, 8, 30);
		this._appCameraInstance.position.copy(this.initialCameraPosition);
		this._prevCameraProps = {
			fov: this._appCameraInstance.fov,
			aspect: this._appCameraInstance.aspect,
			near: this._appCameraInstance.near,
			far: this._appCameraInstance.far,
		};
		this._onRouteChange = () => {
			this.resetFov();
		};

		this._router?.on(events.CHANGED, this._onRouteChange);
		this.emit(events.CONSTRUCTED);
	}

	public destruct() {
		if (this._onRouteChange)
			this._router?.off(events.CHANGED, this._onRouteChange);
		this.emit(events.DESTRUCTED);
	}

	public cameraZoomIn() {
		if (!(this.instance instanceof PerspectiveCamera)) return;
		if (this._timeline.isActive()) this.timeline.progress(1);

		this._timeline.to(this.instance, {
			fov: 25,
			duration: Config.GSAP_ANIMATION_DURATION,
		});
	}

	public updateCameraFov(fov: number, duration?: number) {
		if (!(this.instance instanceof PerspectiveCamera)) return;
		if (this._timeline.isActive()) this.timeline.progress(1);

		this._timeline.to(this.instance, {
			fov: Number(fov),
			duration: Number(duration) ?? Config.GSAP_ANIMATION_DURATION,
		});
	}

	public resetFov() {
		if (!(this.instance instanceof PerspectiveCamera)) return;
		if (this._timeline.isActive()) this.timeline.progress(1);

		this._timeline.to(this.instance, {
			fov: this.initialCameraFov,
			duration: Config.GSAP_ANIMATION_DURATION,
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
			throw new Error("Camera index not available", {
				cause: errors.WRONG_PARAM,
			});
		if (!(this._appCameraInstance instanceof PerspectiveCamera))
			throw new Error(undefined, { cause: errors.CAMERA_UNAVAILABLE });

		const currentCamera = this.cameras[this.currentCameraIndex];
		const nextCamera = this.cameras[cameraIndex];

		currentCamera.copy(this._appCameraInstance);
		currentCamera.fov = nextCamera.fov;
		currentCamera.aspect = nextCamera.aspect;
		currentCamera.near = nextCamera.near;
		currentCamera.far = nextCamera.far;

		this.currentCamera.userData.lookAt = this._lookAtPosition;

		this._appCameraInstance.copy(nextCamera);

		this._appCameraInstance.fov = this._prevCameraProps.fov;
		this._appCameraInstance.aspect = this._prevCameraProps.aspect;
		this._appCameraInstance.near = this._prevCameraProps.near;
		this._appCameraInstance.far = this._prevCameraProps.far;

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
	 * Set the camera look at position.
	 * @param v3 The {@link Vector3} position where the the camera will look at.
	 */
	public setCameraPosition(v3 = new Vector3()) {
		return this._appCameraInstance?.position.copy(v3);
	}

	/**
	 * Set the camera look at position.
	 *
	 * @param v3 The {@link Vector3} position where the the camera will look at.
	 */
	public setCameraLookAt(v3 = new Vector3()) {
		const V3 = v3.clone();

		if (this._appCameraInstance) {
			this._appCameraInstance.lookAt(V3);
			this._appCameraInstance.userData.lookAt = V3;
		}

		this.currentCamera.userData.lookAt = V3;

		this._lookAtPosition = V3;

		return this._lookAtPosition;
	}

	/** Correct the aspect ration of the camera. */
	public correctAspect() {
		if (!(this._appCameraInstance instanceof PerspectiveCamera)) return;

		this._appCameraInstance.fov = this.initialCameraFov;
		this._appCameraInstance.far = 500;
		this._appCamera.resize();

		return this._appCamera;
	}

	public update() {}
}
