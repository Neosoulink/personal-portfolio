// BLUEPRINTS
import { SceneComponentBlueprint } from "../blueprints/scene-component.blueprint";

// COMMONS
import type { Materials } from "~/common/models/experience-world.model";

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
		const availableMaterials: Materials = {};

		// MATERIALS
		if (this._world?.commonMaterials.scene_container)
			availableMaterials.scene_container =
				this._world?.commonMaterials.scene_container;

		return availableMaterials;
	}
}
