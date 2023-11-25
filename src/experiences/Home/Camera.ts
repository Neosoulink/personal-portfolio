import { type ExperienceBase } from "@/interfaces/experienceBase";

// EXPERIENCES
import HomeExperience from ".";
import Debug from "./Debug";

export class Camera implements ExperienceBase {
	private readonly experience = new HomeExperience();

	constructor() {}

	construct() {
		if (!Debug.debugMode && this.experience.app.debug?.cameraHelper) {
			this.experience.app.scene.remove(this.experience.app.debug?.cameraHelper);
			this.experience.app.debug?.cameraHelper?.remove();
			this.experience.app.debug?.cameraHelper?.dispose();
		}
	}

	destruct() {}

	update() {}
}
