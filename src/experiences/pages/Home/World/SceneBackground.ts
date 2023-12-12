import { CatmullRomCurve3, PerspectiveCamera, Vector3 } from "three";
import GSAP from "gsap";

// EXPERIENCES
import { SceneBlueprint } from "@/experiences/blueprints/Scene.blueprint";

// CONFIGS
import { Config } from "@/experiences/config/Config";

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
		this.emit("constructed");
	}

	destruct() {
		this.modelScene?.clear();
		this.modelScene?.removeFromParent();
		this.emit(this.eventListNames.destructed);
	}

	public intro(): void {
		const WORLD_CONTROLS = this._experience.world?.controls;

		if (
			!(WORLD_CONTROLS && this._appCamera.instance instanceof PerspectiveCamera)
		)
			return;

		const { x, y, z } = this.cameraPath.getPointAt(0);

		GSAP.to(this._appCamera.instance.position, {
			...this._experience.world?.controls?.getGsapDefaultProps(),
			duration: Config.GSAP_ANIMATION_DURATION,
			ease: Config.GSAP_ANIMATION_EASE,
			x,
			y,
			z,
			delay: Config.GSAP_ANIMATION_DURATION * 0.8,
			onUpdate: () => {
				WORLD_CONTROLS?.setCameraLookAt(WORLD_CONTROLS.initialLookAtPosition);
			},
			onComplete: () => {
				setTimeout(() => {
					if (this._experience.world?.controls) {
						WORLD_CONTROLS?.getGsapDefaultProps().onComplete();

						this._experience.world.controls.autoCameraAnimation = true;

						console.log(this._appCamera.instance?.position);
					}
				}, 1000);
			},
		});
	}

	public outro(): void {}

	public update(): void {}
}
