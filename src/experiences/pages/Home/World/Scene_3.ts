import { CatmullRomCurve3, Vector3 } from "three";
// BLUEPRINTS
import { SceneBlueprint } from "@/experiences/blueprints/Scene.blueprint";

export default class Scene_3 extends SceneBlueprint {
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
				modelChildrenTextures: [
					{
						childName: "scene_2_logos",
						linkedTextureName: "scene_2_logos_baked_texture",
					},
					{
						childName: "scene_2_floor",
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
		this.emit("constructed");
	}

	destruct() {
		this.modelScene?.clear();
		this.modelScene?.removeFromParent();
		this.emit(this.eventListNames.destructed);
	}

	public intro(): void {}

	public outro(): void {}

	public update(): void {}
}
