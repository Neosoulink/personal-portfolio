import { CatmullRomCurve3, MeshBasicMaterial, Vector3 } from "three";
import { gsap } from "gsap";

// BLUEPRINTS
import { SceneComponentBlueprint } from "../blueprints/scene-component.blueprint";

// MODELS
import type { Materials } from "~/common/models/experience-world.model";

// CONFIG
import { Config } from "~/config";

export class Scene2Component extends SceneComponentBlueprint {
	public readonly navigationLimits = {
		spherical: {
			radius: { min: 6.5, max: 12 },
			phi: { min: 0.01, max: Math.PI * 0.5 },
			theta: { min: 0, max: Math.PI * 0.5 },
			enabled: true,
			enabledPhi: true,
			enabledTheta: false,
		},
		target: {
			x: { min: -1.5, max: 1.5 },
			y: { min: 0, max: 1.5 },
			z: { min: -1.5, max: 1.5 },
			enabled: true,
		},
	};
	public cameraPath = new CatmullRomCurve3(
		[
			new Vector3(3.4, 4.5, -8.4),
			new Vector3(8.6, 2.6, 2.5),
			new Vector3(-1, 4.3, 8.4),
			new Vector3(-8.3, 5.5, -1.9),
			new Vector3(3, 4.65, -8.5),
		],
		true
	);
	public center = new Vector3(0, 1.7, 0);
	public timeline = gsap.timeline();

	constructor() {
		super({
			modelName: "scene_2",
			childrenMaterials: {
				scene_2_logos: "scene_2",
				scene_2_floor: "scene_container",
			},
		});
	}

	protected _getAvailableMaterials() {
		const availableTexture = this._loader?.availableTextures;
		const availableMaterials: Materials = {};

		if (!availableTexture) return availableMaterials;
		if (this._world?.commonMaterials.scene_container)
			availableMaterials.scene_container =
				this._world?.commonMaterials.scene_container.clone();
		availableMaterials.scene_container.alphaTest = 1;
		availableMaterials.scene_container.depthWrite = false;
		availableMaterials.scene_2 = new MeshBasicMaterial({
			alphaMap: availableTexture.cloudAlphaMap,
			alphaTest: 1,
			map: availableTexture.scene_2_baked_texture,
		});

		return availableMaterials;
	}

	public intro() {
		if (!this.modelScene) return this.timeline;
		const _PARAMS = { alphaTest: 0 };
		const _MAT_KEYS = Object.keys(this._availableMaterials);

		this.modelScene.renderOrder = 1;

		return this.timeline?.to(_PARAMS, {
			alphaTest: 1,
			duration: Config.GSAP_ANIMATION_DURATION,
			onUpdate: () => {
				for (const key of _MAT_KEYS)
					this._availableMaterials[key].alphaTest = 1 - _PARAMS.alphaTest;
			},
		});
	}

	public outro() {
		if (!this.modelScene) return this.timeline;

		const _PARAMS = { alphaTest: 0 };
		const _MAT_KEYS = Object.keys(this._availableMaterials);

		this.modelScene.renderOrder = 2;

		return this.timeline?.to(_PARAMS, {
			alphaTest: 1,
			duration: Config.GSAP_ANIMATION_DURATION,
			onUpdate: () => {
				for (const key of _MAT_KEYS)
					this._availableMaterials[key].alphaTest = _PARAMS.alphaTest;
			},
		});
	}
}
