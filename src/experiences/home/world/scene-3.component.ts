import { Object3D, type Object3DEventMap, MeshBasicMaterial } from "three";

// BLUEPRINTS
import { SceneComponentBlueprint } from "~/blueprints/experiences/scene-component.blueprint";

// MODELS
import type { Materials } from "~/common/experiences/experience-world.model";

export class Scene3Component extends SceneComponentBlueprint {
	private _initialPcTopBone?: Object3D<Object3DEventMap>;

	public pcTopBone?: Object3D<Object3DEventMap>;

	constructor() {
		try {
			super({
				modelName: "scene_3",
				childrenMaterials: {
					scene_3_objects: "scene_3",
					github_logo_2: "scene_3",
					twitter_x_logo: "scene_3",
					discord_logo: "scene_3",
					telegram_logo: "scene_3",
					stackoverflow_logo: "scene_3",
					linkedin_logo: "scene_3",
					pc_top_2: "scene_3",
					"eye-glass_glass": "glass",
					scene_3_floor: "scene_container",
				},
				onTraverseModelScene: (child: Object3D<Object3DEventMap>) => {
					this._setPcTopBone(child);
				},
			});
		} catch (error) {}
	}

	private _setPcTopBone(item: Object3D<Object3DEventMap>) {
		if (!(item instanceof Object3D) || item.name !== "pc_top_articulation")
			return;

		this._initialPcTopBone = item.clone();
		this.pcTopBone = item;
	}

	protected _getAvailableMaterials() {
		const AVAILABLE_TEXTURE = this._loader?.availableTextures;
		const AVAILABLE_MATERIALS: Materials = {};

		if (!AVAILABLE_TEXTURE) return AVAILABLE_MATERIALS;

		if (this._world?.commonMaterials["scene_container"]) {
			AVAILABLE_MATERIALS["scene_container"] =
				this._world?.commonMaterials["scene_container"].clone();
			AVAILABLE_MATERIALS["scene_container"].alphaTest = 1;
			AVAILABLE_MATERIALS["scene_container"].depthWrite = false;
		}

		if (this._world?.commonMaterials["glass"])
			AVAILABLE_MATERIALS["glass"] =
				this._world?.commonMaterials["glass"].clone();

		AVAILABLE_MATERIALS["scene_3"] = new MeshBasicMaterial({
			alphaMap: AVAILABLE_TEXTURE["cloudAlphaMap"],
			alphaTest: 1,
			map: AVAILABLE_TEXTURE["scene_3_baked_texture"],
		});

		return AVAILABLE_MATERIALS;
	}
}
