import {
	Object3D,
	type Object3DEventMap,
	MeshBasicMaterial,
	PerspectiveCamera,
} from "three";
import gsap from "gsap";
import { HtmlMixerPlane } from "threex.htmlmixer-continued/lib/html-mixer";

// CONFIG
import { Config } from "~/config";

// BLUEPRINTS
import { SceneComponentBlueprint } from "~/blueprints/experiences/scene-component.blueprint";

// MODELS
import type { Materials } from "~/common/experiences/experience-world.model";

export class Scene3Component extends SceneComponentBlueprint {
	private _renderer = this._experience.renderer;
	private _initialPcTopArticulation?: Object3D<Object3DEventMap>;
	private _pcScreenMixerPlane?: HtmlMixerPlane;

	public readonly timeline = gsap.timeline();
	public readonly navigationLimits = {
		spherical: {
			radius: { min: 4, max: 8 },
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

	public pcTopArticulation?: Object3D<Object3DEventMap>;

	constructor() {
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
	}

	private _setPcTopBone(item: Object3D<Object3DEventMap>) {
		if (!(item instanceof Object3D) || item.name !== "pc_top_articulation_2")
			return;

		this._initialPcTopArticulation = item.clone();
		this.pcTopArticulation = item;
	}

	protected _getAvailableMaterials() {
		const AVAILABLE_TEXTURE = this._loader?.availableTextures;
		const AVAILABLE_MATERIALS: Materials = {};

		if (!AVAILABLE_TEXTURE) return AVAILABLE_MATERIALS;

		if (this._world?.commonMaterials.scene_container) {
			AVAILABLE_MATERIALS.scene_container =
				this._world?.commonMaterials.scene_container.clone();
			AVAILABLE_MATERIALS.scene_container.alphaTest = 1;
			AVAILABLE_MATERIALS.scene_container.depthWrite = false;
		}

		if (this._world?.commonMaterials.glass)
			AVAILABLE_MATERIALS.glass = this._world?.commonMaterials.glass.clone();

		AVAILABLE_MATERIALS.scene_3 = new MeshBasicMaterial({
			alphaMap: AVAILABLE_TEXTURE.cloudAlphaMap,
			alphaTest: 1,
			map: AVAILABLE_TEXTURE.scene_3_baked_texture,
		});

		return AVAILABLE_MATERIALS;
	}

	/**
	 * Toggle the state of the pc between open and close
	 *
	 * @param state Force the state of the pc (0 = "close" & 1 = "open")
	 * @returns
	 */
	public togglePcOpening(state?: 0 | 1) {
		if (!this._model || !this.modelScene || !this.pcTopArticulation) return;
		const isOpen =
			this.pcTopArticulation.rotation.z ===
				this._initialPcTopArticulation?.rotation.z || state === 1;

		return this.timeline.to(this.pcTopArticulation.rotation, {
			z: isOpen
				? this.pcTopArticulation.rotation.z + 1.7
				: this._initialPcTopArticulation?.rotation.z ?? 0,
			duration: Config.GSAP_ANIMATION_DURATION,
			onUpdate: () => {},
			onComplete: () => {},
		});
	}

	public construct(): void {
		super.construct();

		~(() => {
			if (!this._renderer?.mixerContext) return;

			const domElement = document.createElement("iframe");
			domElement.src = "http://threejs.org/";
			domElement.style.border = "none";

			this._pcScreenMixerPlane = new HtmlMixerPlane(
				this._renderer.mixerContext,
				domElement
			);
			this._pcScreenMixerPlane.object3d.position.y += 3;
			this._pcScreenMixerPlane.object3d.scale.multiplyScalar(2);

			// document.querySelector("#css")?.appendChild(css3dElement);
			this._experience.app.scene?.add(this._pcScreenMixerPlane.object3d);
		})();
	}

	public intro(): void {
		this.togglePcOpening();
	}

	public update() {}
}
