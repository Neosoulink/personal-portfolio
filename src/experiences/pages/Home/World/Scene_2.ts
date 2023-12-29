import { CatmullRomCurve3, Mesh, MeshBasicMaterial, Vector3 } from "three";

// BLUEPRINTS
import { SceneBlueprint } from "~/experiences/blueprints/Scene.blueprint";

// INTERFACES
import type { Materials } from "~/interfaces/experienceWorld";

export class Scene_2 extends SceneBlueprint {
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
				modelName: "scene_2",
				childrenMaterials: {
					scene_2_logos: "scene_2",
					scene_2_floor: "scene_container",
				},
			});
		} catch (error) {}
	}

	protected _getAvailableMaterials() {
		const AVAILABLE_TEXTURE = this._loader?.availableTextures;
		const AVAILABLE_MATERIALS: Materials = {};

		if (!AVAILABLE_TEXTURE) return AVAILABLE_MATERIALS;
		if (this._world?.commonMaterials["scene_container"])
			AVAILABLE_MATERIALS["scene_container"] =
				this._world?.commonMaterials["scene_container"].clone();
		AVAILABLE_MATERIALS["scene_container"].alphaTest = 1;
		AVAILABLE_MATERIALS["scene_container"].depthWrite = false;
		AVAILABLE_MATERIALS["scene_2"] = new MeshBasicMaterial({
			alphaMap: AVAILABLE_TEXTURE["cloudAlphaMap"],
			alphaTest: 1,
			map: AVAILABLE_TEXTURE["scene_2_baked_texture"],
		});

		return AVAILABLE_MATERIALS;
	}
}
