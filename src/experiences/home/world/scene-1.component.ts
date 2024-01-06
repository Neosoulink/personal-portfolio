import {
	AnimationMixer,
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

// ERROR
import { ErrorFactory } from "~/errors";

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
	private _mixer?: AnimationMixer;
	private _initialPcTopBone?: Object3D;

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

	public pcScreenWebglTexture = new WebGLRenderTarget(1024, 1024);
	public pcTopArticulation?: Object3D;
	public treeOutside?: Object3D;
	public pcScreen?: Mesh;
	public phoneScreen?: Mesh;
	public coffeeSteam?: Mesh;
	public phoneScreenVideo?: HTMLVideoElement;
	public monitorAScreenVideo?: HTMLVideoElement;
	public monitorBScreenVideo?: HTMLVideoElement;

	constructor() {
		try {
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
						const result: ModelChildrenMaterials = {};
						["top", "front", "back", "left", "right"].forEach((direction) => {
							result["tree_cube_" + direction] = "tree";
							result["tree_cube_" + direction + "_clone"] = "tree_outside";
						});
						return result;
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

			this;
		} catch (_err) {
			throw new ErrorFactory(_err);
		}
	}

	private _setPcTopBone(item: Object3D<Object3DEventMap>) {
		if (
			!this.modelScene ||
			!this._model ||
			!(item instanceof Object3D) ||
			item.name !== "pc_top_articulation"
		)
			return;

		this._initialPcTopBone = item.clone();
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
			clone.name = clone.name + "_clone";

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

		AVAILABLE_MATERIALS["pc_screen"] = new MeshBasicMaterial({
			map: this.pcScreenWebglTexture?.texture,
		});

		AVAILABLE_MATERIALS["phone_screen"] = new MeshBasicMaterial({
			map: PHONE_VIDEO_TEXTURE,
		});

		AVAILABLE_MATERIALS["monitor_a"] = new MeshBasicMaterial({
			map: MONITOR_A_VIDEO_TEXTURE,
		});

		AVAILABLE_MATERIALS["monitor_b"] = new MeshBasicMaterial({
			map: MONITOR_B_VIDEO_TEXTURE,
		});

		AVAILABLE_MATERIALS["tree"] = new MeshBasicMaterial({
			map: AVAILABLE_TEXTURE["scene_1_tree_baked_texture"],
			transparent: true,
		});

		AVAILABLE_MATERIALS["room"] = new ShaderMaterial({
			uniforms: {
				uBakedTexture: {
					value: AVAILABLE_TEXTURE["scene_1_no_lights_baked_texture"],
				},
				uBakedLightTexture: {
					value: AVAILABLE_TEXTURE["scene_1_lights_baked_texture"],
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

		AVAILABLE_MATERIALS["wood"] = new ShaderMaterial({
			uniforms: {
				uBakedTexture: {
					value: AVAILABLE_TEXTURE["scene_1_woods_no_lights_baked_texture"],
				},
				uBakedLightTexture: {
					value: AVAILABLE_TEXTURE["scene_1_woods_lights_baked_texture"],
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

		AVAILABLE_MATERIALS["coffee_steam"] = new ShaderMaterial({
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

		AVAILABLE_MATERIALS["tree_outside"] = new MeshBasicMaterial({
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
				this._renderer?.removePortalAssets(Scene1Component.name + "_screen_pc");
				this._mixer?.stopAllAction();
				this._mixer = undefined;

				this.emit(DESTRUCTED);
			},
		});
	}

	// public intro(): void {
	// 	const WorldManager = this._world?.manager;

	// 	if (
	// 		!(WorldManager && this._appCamera.instance instanceof PerspectiveCamera)
	// 	)
	// 		return;

	// 	const { x, y, z } = this.cameraPath.getPointAt(0);

	// 	gsap.to(this._appCamera.instance.position, {
	// 		...this._world?.manager?.getGsapDefaultProps(),
	// 		duration: Config.GSAP_ANIMATION_DURATION,
	// 		ease: Config.GSAP_ANIMATION_EASE,
	// 		x,
	// 		y,
	// 		z,
	// 		delay: Config.GSAP_ANIMATION_DURATION * 0.8,
	// 		onUpdate: () => {
	// 			// this._camera?.setCameraLookAt(WorldManager.initialLookAtPosition);
	// 		},
	// 		onComplete: () => {
	// 			setTimeout(() => {
	// 				if (this._world?.manager) {
	// 					WorldManager?.getGsapDefaultProps().onComplete();

	// 					this._world.manager.autoCameraAnimation = true;
	// 				}
	// 			}, 1000);
	// 		},
	// 	});
	// }

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
				this._initialPcTopBone?.rotation.z || state === 1;

		return this.timeline.to(this.pcTopArticulation.rotation, {
			z: isOpen
				? this.pcTopArticulation.rotation.z + 2.1
				: this._initialPcTopBone?.rotation.z ?? 0,
			duration: Config.GSAP_ANIMATION_DURATION,
			onUpdate: () => {},
			onComplete: () => {},
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
