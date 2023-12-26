import { CatmullRomCurve3, Vector3 } from "three";

// EXPERIENCES
import { SceneBlueprint } from "~/experiences/blueprints/Scene.blueprint";

export class SceneContainer extends SceneBlueprint {
	constructor() {
		try {
			super({
				cameraPath: new CatmullRomCurve3([
					new Vector3(0, 5.5, 21),
					new Vector3(12, 10, 12),
					new Vector3(21, 5.5, 0),
					new Vector3(12, 3.7, 12),
					new Vector3(0, 5.5, 21),
				]),
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
