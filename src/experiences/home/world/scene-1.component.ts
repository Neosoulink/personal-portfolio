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
	CatmullRomCurve3,
	PerspectiveCamera,
	Vector3,
	Box3,
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
	private readonly _renderer = this._experience.renderer;
	private readonly _appTime = this._experience.app.time;
	private readonly _camera = this._experience.camera;

	private _initialPcTopArticulation?: Object3D;
	private _initialPcScreenAspect = 0;

	public readonly colors = {
		monitor_a_screen: "#ffffff",
		monitor_b_screen: "#ffffff",
		pocketComputerScreen: "#b2e0ff",
		phoneScreen: "#50cdff",
		fixedComputerLed: "#50cdff",
		coffeeSteam: "#b7a08e",
	};
	public readonly lightsBakedTextureStrength = {
		r: 0.5,
		g: 1,
		b: 2,
	};
	public readonly woodsLightsBakedTextureStrength = {
		r: 1,
		g: 1,
		b: 1.5,
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
	public readonly cameraPath = new CatmullRomCurve3(
		[
			new Vector3(0, 5.5, 19),
			new Vector3(12, 10, 12),
			new Vector3(19, 5.5, 0),
			new Vector3(12, 3.7, 12),
			new Vector3(0, 4.2, 19),
		],
		false,
		"centripetal",
		1
	);
	public readonly center = new Vector3(0, 2.5, 0);

	public timeline = gsap.timeline();
	public pcScreenProjectedCamera =
		this._camera?.cameras[1] ?? new PerspectiveCamera();
	public keyboards?: Object3D;
	public fixedComputer?: Object3D;
	public pcTopArticulation?: Object3D;
	public pcScreenWebglTexture = new WebGLRenderTarget(1024, 1024);
	public pcScreen?: Mesh;
	public phoneScreen?: Mesh;
	public monitorAScreen?: Mesh;
	public monitorBScreen?: Mesh;
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
			onTraverseModelScene: (child) => {
				this._setSceneObjects(child);
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

	private _setSceneObjects(item: Object3D<Object3DEventMap>) {
		if (!this.modelScene || !this._model) return;

		if (item instanceof Object3D && item.name === "pc_top_articulation") {
			this._initialPcTopArticulation = item.clone();
			this.pcTopArticulation = item;
		}

		if (!(item instanceof Mesh)) return;

		if (item.name === "pc_top_screen") {
			this.pcScreen = item;

			const boundingBox = new Box3().setFromObject(this.pcScreen);
			const width = boundingBox.max.x - boundingBox.min.x;
			const height = boundingBox.max.y - boundingBox.min.y;
			this._initialPcScreenAspect = width / height;
		}
		if (item.name === "coffee_steam") this.coffeeSteam = item;
		if (item.name === "scene_1_phone_screen") this.phoneScreen = item;
		if (item.name === "monitor_a_screen") this.monitorAScreen = item;
		if (item.name === "monitor_b_screen") this.monitorBScreen = item;

		if (
			new RegExp(/^tree_cube_/, "ig").test(item.name) &&
			!new RegExp(/_clone$/, "ig").test(item.name)
		) {
			const clone = item.clone();
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
				uRedAccentStrength: { value: this.lightsBakedTextureStrength.r },

				uGreenAccent: { value: new Color(this.colors.monitor_b_screen) },
				uGreenAccentStrength: { value: this.lightsBakedTextureStrength.g },

				uBlueAccent: { value: new Color(this.colors.fixedComputerLed) },
				uBlueAccentStrength: { value: this.lightsBakedTextureStrength.b },
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

				uRedAccent: { value: new Color(this.colors.monitor_a_screen) },
				uRedAccentStrength: { value: this.woodsLightsBakedTextureStrength.r },

				uGreenAccent: { value: new Color(this.colors.monitor_b_screen) },
				uGreenAccentStrength: { value: this.woodsLightsBakedTextureStrength.g },

				uBlueAccent: { value: new Color(this.colors.phoneScreen) },
				uBlueAccentStrength: { value: this.woodsLightsBakedTextureStrength.b },
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
			(this.keyboards = new Object3D()).position.set(-1.5, 1.2, -1.1);
			(this.fixedComputer = new Object3D()).position.set(0, 1, -3);

			this.modelScene?.add(
				this.treeOutside,
				this.keyboards,
				this.fixedComputer
			);
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

		if (
			this._renderer?.renderPortalAssets &&
			!this._renderer.renderPortalAssets?.[`${Scene1Component.name}_pc_screen`]
		)
			this._renderer?.addPortalAssets(`${Scene1Component.name}_pc_screen`, {
				mesh: this.pcScreen,
				meshCamera: this.pcScreenProjectedCamera,
				meshWebGLTexture: this.pcScreenWebglTexture,
				aspect: this._initialPcScreenAspect,
			});

		if (this._experience.sound?.keyboard_typing_audio?.isPlaying === false)
			this._experience.sound.keyboard_typing_audio.play();

		if (!this.isPcOpen) {
			const blackColor = new Color(0x000000);
			const whiteColor = new Color(0xffffff);

			if (this.monitorAScreen?.material instanceof MeshBasicMaterial) {
				this.monitorAScreen.material.color = blackColor;
				this.woodsLightsBakedTextureStrength.r = 0;
			}
			if (this.monitorBScreen?.material instanceof MeshBasicMaterial) {
				this.monitorBScreen.material.color = blackColor;
				this.woodsLightsBakedTextureStrength.g = 0;
			}

			if (
				this._experience.sound?.computer_startup_audio &&
				this.fixedComputer
			) {
				this.fixedComputer.add(this._experience.sound.computer_startup_audio);
				this._experience.sound.computer_startup_audio.play();
			}

			if (this._experience.sound?.empty_room_audio && this.fixedComputer) {
				this.fixedComputer.add(this._experience.sound.empty_room_audio);
				this._experience.sound.empty_room_audio.play();
			}

			if (this._experience.sound?.keyboard_typing_audio && this.keyboards) {
				this.keyboards.add(this._experience.sound.keyboard_typing_audio);
			}

			gsap.fromTo(
				this.lightsBakedTextureStrength,
				{ b: 0 },
				{
					b: 2,
					duration: Config.GSAP_ANIMATION_DURATION / 2,
					onComplete: () => {
						if (this.monitorAScreen?.material instanceof MeshBasicMaterial) {
							this.monitorAScreen.material.needsUpdate = true;
							this.monitorAScreen.material.color = whiteColor;
							this.woodsLightsBakedTextureStrength.r = 0.7;
						}
						if (this.monitorBScreen?.material instanceof MeshBasicMaterial) {
							this.monitorBScreen.material.needsUpdate = true;
							this.monitorBScreen.material.color = whiteColor;
							this.woodsLightsBakedTextureStrength.g = 0.7;
						}
					},
				}
			);

			return this.togglePcOpening(1);
		}

		return this.timeline;
	}

	public outro() {
		this._experience.sound?.keyboard_typing_audio?.pause();
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
					onComplete: () => {
						if (this.pcTopArticulation?.rotation)
							this.pcTopArticulation.rotation.z = Number(nextValue);
					},
			  });
	}

	public update(): void {
		if (
			this._availableMaterials?.coffee_steam instanceof ShaderMaterial &&
			typeof this._availableMaterials?.coffee_steam.uniforms?.uTime.value ===
				"number"
		)
			this._availableMaterials.coffee_steam.uniforms.uTime.value =
				this._appTime.elapsed;

		if (
			this._availableMaterials?.room instanceof ShaderMaterial &&
			typeof this._availableMaterials?.room.uniforms?.uRedAccentStrength
				.value === "number"
		)
			this._availableMaterials.room.uniforms.uRedAccentStrength.value =
				this.lightsBakedTextureStrength.r;

		if (
			this._availableMaterials?.room instanceof ShaderMaterial &&
			typeof this._availableMaterials?.room.uniforms?.uGreenAccentStrength
				.value === "number"
		)
			this._availableMaterials.room.uniforms.uGreenAccentStrength.value =
				this.lightsBakedTextureStrength.g;

		if (
			this._availableMaterials?.room instanceof ShaderMaterial &&
			typeof this._availableMaterials?.room.uniforms?.uBlueAccentStrength
				.value === "number"
		)
			this._availableMaterials.room.uniforms.uBlueAccentStrength.value =
				this.lightsBakedTextureStrength.b +
				Math.sin(((this._appTime.elapsed * 0.01) % 2) - 0.5) * 0.1;

		if (
			this._availableMaterials?.wood instanceof ShaderMaterial &&
			typeof this._availableMaterials?.wood.uniforms?.uRedAccentStrength
				.value === "number"
		)
			this._availableMaterials.wood.uniforms.uRedAccentStrength.value =
				this.woodsLightsBakedTextureStrength.r;

		if (
			this._availableMaterials?.wood instanceof ShaderMaterial &&
			typeof this._availableMaterials?.wood.uniforms?.uGreenAccentStrength
				.value === "number"
		)
			this._availableMaterials.wood.uniforms.uGreenAccentStrength.value =
				this.woodsLightsBakedTextureStrength.g;

		if (
			this._availableMaterials?.wood instanceof ShaderMaterial &&
			typeof this._availableMaterials?.wood.uniforms?.uBlueAccentStrength
				.value === "number"
		)
			this._availableMaterials.wood.uniforms.uBlueAccentStrength.value =
				this.woodsLightsBakedTextureStrength.b;
	}
}
