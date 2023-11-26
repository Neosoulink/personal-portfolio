import { CatmullRomCurve3, PerspectiveCamera, Vector3 } from "three";
import GSAP from "gsap";

// EXPERIENCES
import HomeExperience from ".";
import Debug from "./Debug";

// CONSTANTS
import { GSAP_DEFAULT_INTRO_PROPS } from "./../../constants/ANIMATION";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

export class Camera implements ExperienceBase {
	private readonly experience = new HomeExperience();
	private readonly appCamera = this.experience.app.camera;

	initialCameraFov = 35;

	constructor() {}

	construct() {
		if (!Debug.debugMode && this.experience.app.debug?.cameraHelper) {
			this.experience.app.scene.remove(this.experience.app.debug?.cameraHelper);
			this.experience.app.debug?.cameraHelper?.remove();
			this.experience.app.debug?.cameraHelper?.dispose();
		}

		this.experience.loader?.on("load", () => {
			if (!(this.appCamera?.instance instanceof PerspectiveCamera)) return;

			this.appCamera.instance.fov = this.initialCameraFov;
			this.appCamera.instance.far = 50;
			this.appCamera.miniCamera?.position.set(10, 8, 30);

			if (this.experience.app.debug?.cameraControls) {
				this.experience.app.debug.cameraControls.target =
					this.experience.world?.controls?.initialLookAtPosition ??
					new Vector3();
			}
		});
	}

	destruct() {}

	update() {}
}
