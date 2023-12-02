import { ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace } from "three";

// EXPERIENCE
import HomeExperience from ".";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

/** Renderer */
export default class Renderer implements ExperienceBase {
	protected readonly _experience = new HomeExperience();
	protected readonly _appRenderer = this._experience.app.renderer;

	constructor() {}

	construct() {
		this._appRenderer.instance.useLegacyLights = true;
		this._appRenderer.instance.outputColorSpace = SRGBColorSpace;
		this._appRenderer.instance.toneMapping = ACESFilmicToneMapping;
		this._appRenderer.instance.toneMappingExposure = 1;
		this._appRenderer.instance.shadowMap.enabled = false;
		this._appRenderer.instance.shadowMap.type = PCFShadowMap;
		this._appRenderer.instance.setClearColor("#211d20");
		this._appRenderer.instance.setSize(
			this._experience.app.sizes.width,
			this._experience.app.sizes.height
		);
		this._appRenderer.instance.setPixelRatio(
			this._experience.app.sizes.pixelRatio
		);
		this._appRenderer.instance.localClippingEnabled = true
	}

	destruct() {}
}
