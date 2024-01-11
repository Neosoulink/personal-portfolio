import { MeshBasicMaterial } from "three";

// BLUEPRINTS
import { SceneComponentBlueprint } from "~/blueprints/experiences/scene-component.blueprint";

// MODELS
import type { Materials } from "~/common/experiences/experience-world.model";

export class Scene2Component extends SceneComponentBlueprint {
	public readonly navigationLimits = {
		spherical: {
			radius: { min: 8, max: 15 },
			phi: { min: 0.01, max: Math.PI * 0.5 },
			theta: { min: 0, max: Math.PI * 0.5 },
			enabled: true,
			enabledPhi: true,
			enabledTheta: false,
		},
		target: {
			x: { min: -3, max: 3 },
			y: { min: 0, max: 3 },
			z: { min: -3, max: 3 },
			enabled: true,
		},
	};

	constructor() {
		try {
			super({
				modelName: "scene_2",
				childrenMaterials: {
					scene_2_logos: "scene_2",
					scene_2_floor: "scene_container",
				},
			});
		} catch (error) {}
	}

	protected _getAvailableMaterials() {
		const availableTexture = this._loader?.availableTextures;
		const availableMaterials: Materials = {};

		if (!availableTexture) return availableMaterials;
		if (this._world?.commonMaterials.scene_container)
			availableMaterials.scene_container =
				this._world?.commonMaterials.scene_container.clone();
		availableMaterials.scene_container.alphaTest = 1;
		availableMaterials.scene_container.depthWrite = false;
		availableMaterials.scene_2 = new MeshBasicMaterial({
			alphaMap: availableTexture.cloudAlphaMap,
			alphaTest: 1,
			map: availableTexture.scene_2_baked_texture,
		});

		return availableMaterials;
	}
}
