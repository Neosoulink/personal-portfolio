import { CatmullRomCurve3, Vector3 } from "three";

// EXPERIENCES
import { SceneBlueprint } from "~/experiences/blueprints/Scene.blueprint";

export class SceneContainer extends SceneBlueprint {
	constructor() {
		try {
			super({
				cameraPath: new CatmullRomCurve3([]),
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
