import {
	BackSide,
	Color,
	Material,
	Mesh,
	MeshBasicMaterial,
	Object3D,
	ShaderMaterial,
	Vector2,
	WebGLRenderTarget,
	type Object3DEventMap,
	VideoTexture,
	LinearSRGBColorSpace,
	CatmullRomCurve3,
	PerspectiveCamera,
	Vector3,
} from "three";
import gsap from "gsap";

// BLUEPRINTS
import { SceneComponentBlueprint } from "../blueprints/scene-component.blueprint";

// SHADERS
import bakedTextureFragment from "./shaders/scene-1/lights/fragment.glsl";
import bakedTextureVertex from "./shaders/scene-1/lights/vertex.glsl";

import coffeeSteamFragment from "./shaders/scene-1/coffeeSteam/fragment.glsl";
import coffeeSteamVertex from "./shaders/scene-1/coffeeSteam/vertex.glsl";

// CONFIGS
import { Config } from "~/config";

// STATIC
import { DESTRUCTED } from "~/static/event.static";
import { pages } from "~/static";

// MODELS
import type {
	Materials,
	ModelChildrenMaterials,
} from "~/common/models/experience-world.model";
import type { ViewLimits } from "~/common/models/experience-navigation.model";

export class Scene1Component extends SceneComponentBlueprint {
	private _renderer = this._experience.renderer;
	private _appTime = this._experience.app.time;
	private _camera = this._experience.camera;
	private _initialPcTopArticulation?: Object3D;

	public readonly timeline = gsap.timeline();
	public readonly colors = {
		monitor_a_screen: "#ffffff",
		monitor_b_screen: "#888888",
		pocketComputerScreen: "#b2e0ff",
		phoneScreen: "#50cdff",
		fixedComputerLed: "#50cdff",
		coffeeSteam: "#b7a08e",
	};
	public readonly navigationLimits: ViewLimits = {
		spherical: {
			radius: { min: 10, max: 19.2 },
			phi: { min: 0.01, max: Math.PI * 0.5 },
			theta: { min: 0, max: Math.PI * 0.5 },
			enabled: true,
			enabledPhi: true,
			enabledTheta: true,
		},
		target: {
			x: { min: -1.5, max: 1.5 },
			y: { min: 0, max: 3.5 },
			z: { min: -1.5, max: 1.5 },
			enabled: true,
		},
	};
	public readonly cameraPath = new CatmullRomCurve3([
		new Vector3(0, 5.5, 19),
		new Vector3(12, 10, 12),
		new Vector3(19, 5.5, 0),
		new Vector3(12, 3.7, 12),
		new Vector3(0, 5.5, 19),
	]);
	public center = new Vector3(0, 3, 0);

	public pcTopArticulation?: Object3D;
	public pcScreenProjectedCamera =
		this._camera?.cameras[1] ?? new PerspectiveCamera();
	public pcScreenWebglTexture = new WebGLRenderTarget(1024, 1024);
	public pcScreen?: Mesh;
	public phoneScreen?: Mesh;
	public treeOutside?: Object3D;
	public coffeeSteam?: Mesh;

	constructor() {
		super({
			modelName: "scene_1",
			childrenMaterials: {
				scene_1_room: "room",
				chair_top: "room",
				pc_top: "room",
				scene_1_woods: "wood",
				coffee_steam: "coffee_steam",
				window_glasses: "glass",
				scene_1_floor: "scene_container",
				monitor_a_screen: "monitor_a",
				monitor_b_screen: "monitor_b",
				scene_1_phone_screen: "phone_screen",
				pc_top_screen: "pc_screen",
				tree: "tree",
				...(() => {
					const results: ModelChildrenMaterials = {};
					const keys = ["top", "front", "back", "left", "right"];
					for (let i = 0; i < keys.length; i++) {
						keys[i];
						results[`tree_cube_${keys[i]}`] = "tree";
						results[`tree_cube_${keys[i]}_clone`] = "tree_outside";
					}

					return results;
				})(),
			},
			onTraverseModelScene: (child: Object3D<Object3DEventMap>) => {
				this._setPcTopBone(child);
				this._setPcScreen(child);
				this._setCoffeeSteam(child);
				this._setPhoneScreen(child);
				this._setTreeOutSide(child);
			},
			markers: [{ title: "One", content: "two", position: new Vector3() }],
		});
	}

	public get isPcOpen() {
		return (
			this.pcTopArticulation?.rotation.z !==
			this._initialPcTopArticulation?.rotation.z
		);
	}

	private _setPcTopBone(item: Object3D<Object3DEventMap>) {
		if (
			!this.modelScene ||
			!this._model ||
			!(item instanceof Object3D) ||
			item.name !== "pc_top_articulation"
		)
			return;

		this._initialPcTopArticulation = item.clone();
		this.pcTopArticulation = item;
	}

	private _setPcScreen(item: Object3D<Object3DEventMap>) {
		if (
			!this.modelScene ||
			!this._model ||
			!(item instanceof Mesh) ||
			item.name !== "pc_top_screen"
		)
			return;

		this.pcScreen = item;
	}

	private _setCoffeeSteam(item: Object3D<Object3DEventMap>) {
		if (
			!this.modelScene ||
			!this._model ||
			!(item instanceof Mesh) ||
			item.name !== "coffee_steam"
		)
			return;

		this.coffeeSteam = item;
	}

	private _setPhoneScreen(item: Object3D<Object3DEventMap>) {
		if (
			!this.modelScene ||
			!this._model ||
			!(item instanceof Mesh) ||
			item.name !== "scene_1_phone_screen"
		)
			return;

		this.phoneScreen = item;
	}

	private _setTreeOutSide(child: Object3D<Object3DEventMap>) {
		if (
			child instanceof Mesh &&
			new RegExp(/^tree_cube_/, "ig").test(child.name) &&
			!new RegExp(/_clone$/, "ig").test(child.name)
		) {
			const clone = child.clone();
			clone.name = `${clone.name}_clone`;

			this.treeOutside?.add(clone);
		}
	}

	protected _getAvailableMaterials(): Materials {
		const availableTextures = this._loader?.availableTextures;
		const availableMaterials: Materials = {};

		if (!availableTextures) return availableMaterials;

		// MATERIALS
		if (this._world?.commonMaterials.scene_container)
			availableMaterials.scene_container =
				this._world?.commonMaterials.scene_container;
		if (this._world?.commonMaterials.scene_container)
			availableMaterials.glass = this._world?.commonMaterials.glass;

		availableMaterials.pc_screen = new MeshBasicMaterial({
			map: this.pcScreenWebglTexture?.texture,
		});
		availableMaterials.phone_screen = new MeshBasicMaterial({
			map: availableTextures.phone_screen_record,
		});
		availableMaterials.monitor_a = new MeshBasicMaterial({
			map: availableTextures.monitor_a_screen_record,
		});
		availableMaterials.monitor_b = new MeshBasicMaterial({
			map: availableTextures.monitor_b_screen_record,
		});
		availableMaterials.tree = new MeshBasicMaterial({
			map: availableTextures.scene_1_tree_baked_texture,
			transparent: true,
		});
		availableMaterials.room = new ShaderMaterial({
			uniforms: {
				uBakedTexture: {
					value: availableTextures.scene_1_no_lights_baked_texture,
				},
				uBakedLightTexture: {
					value: availableTextures.scene_1_lights_baked_texture,
				},

				uRedAccent: { value: new Color(this.colors.pocketComputerScreen) },
				uRedAccentStrength: { value: 0.5 },

				uGreenAccent: { value: new Color(this.colors.monitor_b_screen) },
				uGreenAccentStrength: { value: 1 },

				uBlueAccent: { value: new Color(this.colors.fixedComputerLed) },
				uBlueAccentStrength: { value: 2 },
			},
			fragmentShader: bakedTextureFragment,
			vertexShader: bakedTextureVertex,
		});
		availableMaterials.wood = new ShaderMaterial({
			uniforms: {
				uBakedTexture: {
					value: availableTextures.scene_1_woods_no_lights_baked_texture,
				},
				uBakedLightTexture: {
					value: availableTextures.scene_1_woods_lights_baked_texture,
				},

				uRedAccent: { value: new Color(this.colors.pocketComputerScreen) },
				uRedAccentStrength: { value: 2 },

				uGreenAccent: { value: new Color(this.colors.monitor_b_screen) },
				uGreenAccentStrength: { value: 2 },

				uBlueAccent: { value: new Color(this.colors.phoneScreen) },
				uBlueAccentStrength: { value: 3 },
			},
			fragmentShader: bakedTextureFragment,
			vertexShader: bakedTextureVertex,
		});
		availableMaterials.coffee_steam = new ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uTimeFrequency: { value: 0.0005 },
				uUvFrequency: { value: new Vector2(4, 5) },
				uColor: { value: new Color(this.colors.coffeeSteam) },
			},
			fragmentShader: coffeeSteamFragment,
			vertexShader: coffeeSteamVertex,
			transparent: true,
			depthWrite: false,
		});
		availableMaterials.tree_outside = new MeshBasicMaterial({
			colorWrite: false,
			side: BackSide,
		});

		return availableMaterials;
	}

	public construct() {
		super.construct(() => {
			this.treeOutside = new Object3D();
			this.modelScene?.add(this.treeOutside);
		});
	}

	public destruct() {
		if (!this.modelScene) return;

		gsap.to((this.modelScene.children[0] as Mesh).material as Material, {
			duration: Config.GSAP_ANIMATION_DURATION,
			ease: Config.GSAP_ANIMATION_EASE,
			opacity: 0,
			onUpdate: () => {},
			onComplete: () => {
				this.modelScene?.clear();
				this.modelScene?.removeFromParent();
				this._renderer?.removePortalAssets(`${Scene1Component.name}_screen_pc`);

				this.emit(DESTRUCTED);
			},
		});
	}

	public initSelectableObjects() {
		const router = useRouter();
		let nextPage: string | undefined;

		for (let i = 0; i < router.getRoutes().length; i++) {
			const route = router.getRoutes()[i];

			if (route.meta.key === pages.SKILL_PAGE) {
				nextPage = route.path;
				break;
			}
		}

		this.selectableObjects = [
			...(this.pcScreen && nextPage
				? [
						{
							object: this.pcScreen,
							link: nextPage,
						},
				  ]
				: []),
		];
	}

	public intro() {
		if (!(this?.modelScene && this.pcScreen && this.pcScreenWebglTexture))
			return;

		this._renderer?.addPortalAssets(`${Scene1Component.name}_pc_screen`, {
			mesh: this.pcScreen,
			meshCamera: this.pcScreenProjectedCamera,
			meshWebGLTexture: this.pcScreenWebglTexture,
		});

		if (!this.isPcOpen) return this.togglePcOpening(1);

		return this.timeline;
	}

	public outro() {
		this._renderer?.removePortalAssets(`${Scene1Component.name}_pc_screen`);

		return this.timeline;
	}

	/**
	 * Toggle the state of the pc between open and close
	 *
	 * @param forceState Force the state of the pc (0 = "close" & 1 = "open")
	 * @returns
	 */
	public togglePcOpening(force?: 0 | 1) {
		if (!this._model || !this.modelScene || !this.pcTopArticulation)
			return this.timeline;

		const isOpen = typeof force === "number" ? force !== 1 : this.isPcOpen;

		const nextValue = isOpen
			? this._initialPcTopArticulation?.rotation.z ?? 0
			: (this._initialPcTopArticulation?.rotation.z ?? 0) + 2.1;

		return this.pcTopArticulation.rotation.z === nextValue
			? this.timeline
			: this.timeline.to(this.pcTopArticulation.rotation, {
					z: nextValue,
					duration: Config.GSAP_ANIMATION_DURATION,
					onUpdate: () => {},
					onComplete: () => {
						if (this.pcTopArticulation?.rotation)
							this.pcTopArticulation.rotation.z = Number(nextValue);
					},
			  });
	}

	public update(): void {
		if (
			this.coffeeSteam?.material instanceof ShaderMaterial &&
			typeof this.coffeeSteam?.material.uniforms?.uTime.value === "number"
		) {
			this.coffeeSteam.material.uniforms.uTime.value = this._appTime.elapsed;
		}
	}
}
