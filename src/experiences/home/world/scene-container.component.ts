// EXPERIENCES
import { SceneComponentBlueprint } from "~/blueprints/experiences/scene-component.blueprint";

export class SceneContainerComponent extends SceneComponentBlueprint {
	public readonly navigationLimits = undefined;

	constructor() {
		try {
			super({
				modelName: "scene_container",
				childrenMaterials: {
					scene_container: "scene_container",
				},
			});
		} catch (error) {}
	}

	protected _getAvailableMaterials() {
		return {};
	}
}
