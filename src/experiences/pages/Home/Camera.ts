import { PerspectiveCamera, Vector3 } from "three";
import GSAP from "gsap";

// EXPERIENCES
import HomeExperience from ".";
import Debug from "./Debug";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "@/experiences/blueprints/ExperienceBased.blueprint";
import {
	CONSTRUCTED,
	DESTRUCTED,
	UPDATED,
} from "@/experiences/common/Event.model";

export class Camera extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _appDebug = this._experience.app.debug;

	public readonly initialCameraFov = 35;
	public lookAtPosition = new Vector3();

	constructor() {
		super();
	}

	construct() {
		if (!Debug.enable && this._appDebug?.cameraHelper) {
			this._experience.app.scene.remove(this._appDebug?.cameraHelper);
			this._appDebug?.cameraHelper?.remove();
			this._appDebug?.cameraHelper?.dispose();
		}

		this._experience.loader?.on("load", () => {
			if (!(this._appCamera?.instance instanceof PerspectiveCamera)) return;

			this._appCamera.instance.fov = this.initialCameraFov;
			this._appCamera.instance.far = 500;
			this._appCamera.miniCamera?.position.set(10, 8, 30);

			if (this._appDebug?.cameraControls) {
				this._appDebug.cameraControls.target =
					this._experience.world?.controls?.initialLookAtPosition ??
					new Vector3();
			}
		});

		this.emit(CONSTRUCTED);
	}

	destruct() {
		this.emit(DESTRUCTED);
	}

	update() {
		this.emit(UPDATED);
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
