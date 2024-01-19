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
import { SceneComponentBlueprint } from "~/blueprints/experiences/scene-component.blueprint";

// SHADERS
import bakedTextureFragment from "./shaders/scene-1/lights/fragment.glsl";
import bakedTextureVertex from "./shaders/scene-1/lights/vertex.glsl";

import coffeeSteamFragment from "./shaders/scene-1/coffeeSteam/fragment.glsl";
import coffeeSteamVertex from "./shaders/scene-1/coffeeSteam/vertex.glsl";

// CONFIGS
import { Config } from "~/config";

// STATICS
import { DESTRUCTED } from "~/static/event.static";

// MODELS
import type {
	Materials,
	ModelChildrenMaterials,
} from "~/common/experiences/experience-world.model";

// ASSETS
import monitor_a_screen_recording from "~/assets/videos/monitor_a_screen_recording.webm?url";
import monitor_b_screen_recording from "~/assets/videos/monitor_b_screen_recording.webm?url";
import phone_screen_recording from "~/assets/videos/phone_screen_recording.webm";

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
	public readonly navigationLimits = {
		spherical: {
			radius: { min: 5, max: 20 },
			phi: { min: 0.01, max: Math.PI * 0.5 },
			theta: { min: 0, max: Math.PI * 0.5 },
			enabled: true,
			enabledPhi: true,
			enabledTheta: true,
		},
		target: {
			x: { min: -3, max: 3 },
			y: { min: 2, max: 6 },
			z: { min: -2.5, max: 4 },
			enabled: true,
		},
	};
	public readonly cameraPath = new CatmullRomCurve3([
		new Vector3(0, 5.5, 21),
		new Vector3(12, 10, 12),
		new Vector3(21, 5.5, 0),
		new Vector3(12, 3.7, 12),
		new Vector3(0, 5.5, 21),
	]);
	public center = new Vector3(0, 3, 0);

	public pcTopArticulation?: Object3D;
	public pcScreenProjectedCamera =
		this._camera?.cameras[1] ?? new PerspectiveCamera();
	public pcScreenWebglTexture = new WebGLRenderTarget(1024, 1024);
	public pcScreen?: Mesh;
	public phoneScreen?: Mesh;
	public phoneScreenVideo?: HTMLVideoElement;
	public treeOutside?: Object3D;
	public coffeeSteam?: Mesh;
	public monitorAScreenVideo?: HTMLVideoElement;
	public monitorBScreenVideo?: HTMLVideoElement;

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
					const _RESULTS: ModelChildrenMaterials = {};
					const _KEYS = ["top", "front", "back", "left", "right"];
					for (let i = 0; i < _KEYS.length; i++) {
						_KEYS[i];
						_RESULTS[`tree_cube_${_KEYS[i]}`] = "tree";
						_RESULTS[`tree_cube_${_KEYS[i]}_clone`] = "tree_outside";
					}

					return _RESULTS;
				})(),
			},
			onTraverseModelScene: (child: Object3D<Object3DEventMap>) => {
				this._setPcTopBone(child);
				this._setPcScreen(child);
				this._setCoffeeSteam(child);
				this._setPhoneScreen(child);
				this._setTreeOutSide(child);
			},
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

	private _initScreesVideos() {
		this.phoneScreenVideo = this._createVideoElement(phone_screen_recording);

		this.monitorAScreenVideo = this._createVideoElement(
			monitor_a_screen_recording
		);
		this.monitorBScreenVideo = this._createVideoElement(
			monitor_b_screen_recording
		);
	}

	private _createVideoElement(source: string) {
		const ELEMENT = document.createElement("video");

		ELEMENT.muted = true;
		ELEMENT.loop = true;
		ELEMENT.controls = true;
		ELEMENT.playsInline = true;
		ELEMENT.autoplay = true;
		ELEMENT.src = source;
		ELEMENT.play();

		return ELEMENT;
	}

	protected _getAvailableMaterials(): Materials {
		const AVAILABLE_TEXTURE = this._loader?.availableTextures;
		const AVAILABLE_MATERIALS: Materials = {};

		if (!AVAILABLE_TEXTURE) return AVAILABLE_MATERIALS;

		// TEXTURES
		const PHONE_VIDEO_TEXTURE = new VideoTexture(
			this.phoneScreenVideo ?? document.createElement("video")
		);
		PHONE_VIDEO_TEXTURE.colorSpace = LinearSRGBColorSpace;

		const MONITOR_A_VIDEO_TEXTURE = new VideoTexture(
			this.monitorAScreenVideo ?? document.createElement("video")
		);
		MONITOR_A_VIDEO_TEXTURE.colorSpace = LinearSRGBColorSpace;

		const MONITOR_B_VIDEO_TEXTURE = new VideoTexture(
			this.monitorBScreenVideo ?? document.createElement("video")
		);
		MONITOR_B_VIDEO_TEXTURE.colorSpace = LinearSRGBColorSpace;

		// MATERIALS
		if (this._world?.commonMaterials.scene_container)
			AVAILABLE_MATERIALS.scene_container =
				this._world?.commonMaterials.scene_container;
		if (this._world?.commonMaterials.scene_container)
			AVAILABLE_MATERIALS.glass = this._world?.commonMaterials.glass;

		AVAILABLE_MATERIALS.pc_screen = new MeshBasicMaterial({
			map: this.pcScreenWebglTexture?.texture,
		});
		AVAILABLE_MATERIALS.phone_screen = new MeshBasicMaterial({
			map: PHONE_VIDEO_TEXTURE,
		});
		AVAILABLE_MATERIALS.monitor_a = new MeshBasicMaterial({
			map: MONITOR_A_VIDEO_TEXTURE,
		});
		AVAILABLE_MATERIALS.monitor_b = new MeshBasicMaterial({
			map: MONITOR_B_VIDEO_TEXTURE,
		});
		AVAILABLE_MATERIALS.tree = new MeshBasicMaterial({
			map: AVAILABLE_TEXTURE.scene_1_tree_baked_texture,
			transparent: true,
		});
		AVAILABLE_MATERIALS.room = new ShaderMaterial({
			uniforms: {
				uBakedTexture: {
					value: AVAILABLE_TEXTURE.scene_1_no_lights_baked_texture,
				},
				uBakedLightTexture: {
					value: AVAILABLE_TEXTURE.scene_1_lights_baked_texture,
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
		AVAILABLE_MATERIALS.wood = new ShaderMaterial({
			uniforms: {
				uBakedTexture: {
					value: AVAILABLE_TEXTURE.scene_1_woods_no_lights_baked_texture,
				},
				uBakedLightTexture: {
					value: AVAILABLE_TEXTURE.scene_1_woods_lights_baked_texture,
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
		AVAILABLE_MATERIALS.coffee_steam = new ShaderMaterial({
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
		AVAILABLE_MATERIALS.tree_outside = new MeshBasicMaterial({
			colorWrite: false,
			side: BackSide,
		});

		return AVAILABLE_MATERIALS;
	}

	public construct() {
		super.construct(() => {
			this.treeOutside = new Object3D();
			this.modelScene?.add(this.treeOutside);
			this._initScreesVideos();
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

		const _NEXT_VALUE = isOpen
			? this._initialPcTopArticulation?.rotation.z ?? 0
			: (this._initialPcTopArticulation?.rotation.z ?? 0) + 2.1;

		return this.pcTopArticulation.rotation.z === _NEXT_VALUE
			? this.timeline
			: this.timeline.to(this.pcTopArticulation.rotation, {
					z: _NEXT_VALUE,
					duration: Config.GSAP_ANIMATION_DURATION,
					onUpdate: () => {},
					onComplete: () => {
						if (this.pcTopArticulation?.rotation)
							this.pcTopArticulation.rotation.z = Number(_NEXT_VALUE);
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
