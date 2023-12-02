import { ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace } from "three";

// EXPERIENCE
import HomeExperience from ".";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

/** Renderer */
export default class Renderer implements ExperienceBase {
	protected readonly _experience = new HomeExperience();

	constructor() {}

	construct() {
		this._experience.app.renderer.instance.useLegacyLights = true;
		this._experience.app.renderer.instance.outputColorSpace = SRGBColorSpace;
		this._experience.app.renderer.instance.toneMapping = ACESFilmicToneMapping;
		this._experience.app.renderer.instance.toneMappingExposure = 1;
		this._experience.app.renderer.instance.shadowMap.enabled = false;
		this._experience.app.renderer.instance.shadowMap.type = PCFShadowMap;
		this._experience.app.renderer.instance.setClearColor("#211d20");
		this._experience.app.renderer.instance.setSize(
			this._experience.app.sizes.width,
			this._experience.app.sizes.height
		);
		this._experience.app.renderer.instance.setPixelRatio(
			this._experience.app.sizes.pixelRatio
		);
	}

	destruct() {}
}
