// EXPERIENCES
import { SceneComponentBlueprint } from "~/experiences/blueprints/scene-component.blueprint";

export class SceneContainerComponent extends SceneComponentBlueprint {
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
