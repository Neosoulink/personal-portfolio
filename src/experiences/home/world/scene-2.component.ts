import { CatmullRomCurve3, Material, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { gsap } from "gsap";

// BLUEPRINTS
import { SceneComponentBlueprint } from "~/blueprints/experiences/scene-component.blueprint";

// MODELS
import type { Materials } from "~/common/experiences/experience-world.model";
import { Config } from "~/config";

export class Scene2Component extends SceneComponentBlueprint {
	public readonly navigationLimits = {
		spherical: {
			radius: { min: 8, max: 15 },
			phi: { min: 0.01, max: Math.PI * 0.5 },
			theta: { min: 0, max: Math.PI * 0.5 },
			enabled: true,
			enabledPhi: true,
			enabledTheta: false,
		},
		target: {
			x: { min: -3, max: 3 },
			y: { min: 0, max: 3 },
			z: { min: -3, max: 3 },
			enabled: true,
		},
	};
	public cameraPath = new CatmullRomCurve3([
		new Vector3(0, 5.5, 21),
		new Vector3(12, 10, 12),
		new Vector3(21, 5.5, 0),
		new Vector3(12, 3.7, 12),
		new Vector3(0, 5.5, 21),
	]);
	public timeline = gsap.timeline();

	constructor() {
		try {
			super({
				modelName: "scene_2",
				childrenMaterials: {
					scene_2_logos: "scene_2",
					scene_2_floor: "scene_container",
				},
			});
		} catch (error) {}
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
		this.modelScene.renderOrder = 1;

		const _PARAMS = { alphaTest: 0 };
		const _MAT_KEYS = Object.keys(this._availableMaterials);

		return this.timeline?.to(_PARAMS, {
			alphaTest: 1,
			duration: Config.GSAP_ANIMATION_DURATION,
			onStart: () => {
				// if (!this._navigation?.timeline.isActive())
				// 	this._navigation?.setLimits(this.navigationLimits);
			},
			onUpdate: () => {
				for (const key of _MAT_KEYS)
					this._availableMaterials[key].alphaTest = 1 - _PARAMS.alphaTest;
			},
		});
	}

	public outro() {
		if (!this.modelScene) return this.timeline;

		this.modelScene.renderOrder = 2;

		const _PARAMS = { alphaTest: 0 };
		const _MAT_KEYS = Object.keys(this._availableMaterials);

		return this.timeline?.to(_PARAMS, {
			alphaTest: 1,
			duration: Config.GSAP_ANIMATION_DURATION,
			onStart: () => {
				// if (!this._navigation?.timeline.isActive())
				// 	this._navigation?.setLimits(this.navigationLimits);
			},
			onUpdate: () => {
				for (const key of _MAT_KEYS)
					this._availableMaterials[key].alphaTest = _PARAMS.alphaTest;
			},
		});
	}
}
