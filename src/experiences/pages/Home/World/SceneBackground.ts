import { CatmullRomCurve3, Vector3 } from "three";

// EXPERIENCES
import { SceneBlueprint } from "@/experiences/blueprints/Scene.blueprint";

// MODELS
import { CONSTRUCTED, DESTRUCTED } from "~/experiences/common/Event.model";

export default class SceneBackground extends SceneBlueprint {
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
				modelName: "scene_background",
				modelChildrenTextures: [
					{
						childName: "scene_background",
						linkedTextureName: "scene_container_baked_texture",
					},
				],
			});
		} catch (error) {}
	}

	construct() {
		this.modelScene = this._model?.scene.clone();
		if (!this.modelScene) return;

		this._setModelMaterials();
		this.emit(CONSTRUCTED);
	}

	destruct() {
		this.modelScene?.clear();
		this.modelScene?.removeFromParent();
		this.emit(DESTRUCTED);
	}

	public intro(): void {}

	public outro(): void {}

	public update(): void {}
}
