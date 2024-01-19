// EXPERIENCES
import { SceneComponentBlueprint } from "~/blueprints/experiences/scene-component.blueprint";

// COMMONS
import type { Materials } from "~/common/experiences/experience-world.model";

export class SceneContainerComponent extends SceneComponentBlueprint {
	constructor() {
		super({
			modelName: "scene_container",
			childrenMaterials: {
				scene_container: "scene_container",
			},
		});
	}

	protected _getAvailableMaterials() {
		const AVAILABLE_MATERIALS: Materials = {};

		// MATERIALS
		if (this._world?.commonMaterials.scene_container)
			AVAILABLE_MATERIALS.scene_container =
				this._world?.commonMaterials.scene_container;

		return AVAILABLE_MATERIALS;
	}
}
