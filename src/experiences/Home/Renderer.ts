import * as THREE from "three";

// EXPERIENCE
import HomeExperience from ".";

// INTERFACES
import type BaseExperience from "@/interfaces/BaseExperience";

/** Renderer */
export default class Renderer implements BaseExperience {
	private readonly experience = new HomeExperience();

	constructor() {}

	construct() {
		this.experience.app.renderer.instance.useLegacyLights = true;
		this.experience.app.renderer.instance.outputColorSpace =
			THREE.SRGBColorSpace;
		this.experience.app.renderer.instance.toneMapping = THREE.NoToneMapping;
		this.experience.app.renderer.instance.toneMappingExposure = 1;
		this.experience.app.renderer.instance.shadowMap.enabled = false;
		this.experience.app.renderer.instance.shadowMap.type = THREE.PCFShadowMap;
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
