import { PerspectiveCamera, Vector3 } from "three";
import GSAP from "gsap";

// EXPERIENCES
import HomeExperience from ".";
import Debug from "./Debug";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

export class Camera implements ExperienceBase {
	private readonly _experience = new HomeExperience();
	private readonly _appCamera = this._experience.app.camera;
	private readonly _appDebug = this._experience.app.debug;
	public lookAtPosition = new Vector3();

	initialCameraFov = 35;

	constructor() {}

	construct() {
		if (!Debug.enable && this._appDebug?.cameraHelper) {
			this._experience.app.scene.remove(this._appDebug?.cameraHelper);
			this._appDebug?.cameraHelper?.remove();
			this._appDebug?.cameraHelper?.dispose();
		}

		this._experience.loader?.on("load", () => {
			if (!(this._appCamera?.instance instanceof PerspectiveCamera)) return;

			this._appCamera.instance.fov = this.initialCameraFov;
			this._appCamera.instance.far = 50;
			this._appCamera.miniCamera?.position.set(10, 8, 30);

			if (this._appDebug?.cameraControls) {
				this._appDebug.cameraControls.target =
					this._experience.world?.controls?.initialLookAtPosition ??
					new Vector3();
			}
		});
	}

	destruct() {}

	update() {}

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
	 * Set the camera look at position
	 * @param v3 Vector 3 position where the the camera should look at
	 */
	setCameraLookAt(v3: THREE.Vector3) {
		this._appCamera?.instance?.lookAt(v3);

		if (this._appDebug?.cameraControls)
			this._appDebug.cameraControls.target = v3;

		this.lookAtPosition = v3;
	}
}
