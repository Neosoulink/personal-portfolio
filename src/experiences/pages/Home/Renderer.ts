import { ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace } from "three";

// EXPERIENCE
import HomeExperience from ".";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

/** Renderer */
export default class Renderer implements ExperienceBase {
	private readonly experience = new HomeExperience();

	constructor() {}

	construct() {
		this.experience.app.renderer.instance.useLegacyLights = true;
		this.experience.app.renderer.instance.outputColorSpace = SRGBColorSpace;
		this.experience.app.renderer.instance.toneMapping = ACESFilmicToneMapping;
		this.experience.app.renderer.instance.toneMappingExposure = 1;
		this.experience.app.renderer.instance.shadowMap.enabled = false;
		this.experience.app.renderer.instance.shadowMap.type = PCFShadowMap;
		this.experience.app.renderer.instance.setClearColor("#211d20");
		this.experience.app.renderer.instance.setSize(
			this.experience.app.sizes.width,
			this.experience.app.sizes.height
		);
		this.experience.app.renderer.instance.setPixelRatio(
			this.experience.app.sizes.pixelRatio
		);
	}

	destruct() {}
}
