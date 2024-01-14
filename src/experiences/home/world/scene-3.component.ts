import {
	Object3D,
	type Object3DEventMap,
	MeshBasicMaterial,
	Box3,
	Mesh,
	ShaderMaterial,
	DoubleSide,
} from "three";
import gsap from "gsap";
import { HtmlMixerPlane } from "threex.htmlmixer-continued/lib/html-mixer";

// CONFIG
import { Config } from "~/config";

// BLUEPRINTS
import { SceneComponentBlueprint } from "~/blueprints/experiences/scene-component.blueprint";

// MODELS
import type { Materials } from "~/common/experiences/experience-world.model";

// SHADERS
import phoneScreenFragment from "./shaders/scene-3/phone-screen/fragment.glsl";
import phoneScreenVertex from "./shaders/scene-3/phone-screen/vertex.glsl";
import watchScreenFragment from "./shaders/scene-3/watch-screen/fragment.glsl";
import watchScreenVertex from "./shaders/scene-3/watch-screen/vertex.glsl";
import gamepadLedFragment from "./shaders/scene-3/gamepad_led/fragment.glsl";
import gamepadLedVertex from "./shaders/scene-3/gamepad_led/vertex.glsl";

export class Scene3Component extends SceneComponentBlueprint {
	private _appTime = this._experience.app.time;
	private _renderer = this._experience.renderer;
	private _initialPcTopArticulation?: Object3D<Object3DEventMap>;
	private _pcScreenMixerPlane?: HtmlMixerPlane;
	private _pcScreenDomElement?: HTMLIFrameElement;
	private _phoneScreen?: Mesh;
	private _watchScreen?: Mesh;
	private _gamepadLed?: Mesh;
	private _currentDayTimestamp = (() => {
		const currentDate = new Date();
		const startOfDay = new Date(currentDate);
		startOfDay.setHours(0, 0, 0, 0);

		return currentDate.getTime() - startOfDay.getTime();
	})();
	private _uTime = 0;
	private _uTimestamps = 0;

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
	public pcScreen?: Mesh;

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
				phone_screen_2: "phone_screen",
				watch_screen: "watch_screen",
				gamepad_led: "gamepad_led",
			},
			onTraverseModelScene: (child: Object3D<Object3DEventMap>) => {
				this._setPcTopArticulation(child);
				this._setPcScreen(child);
				this._setPhoneScreen(child);
				this._setWatchScreen(child);
				this._setGamepadLed(child);
			},
		});
	}

	private _setPcTopArticulation(item: Object3D<Object3DEventMap>) {
		if (!(item instanceof Object3D) || item.name !== "pc_top_articulation_2")
			return;

		this._initialPcTopArticulation = item.clone();
		this.pcTopArticulation = item;
	}

	private _setPcScreen(item: Object3D<Object3DEventMap>) {
		if (!(item instanceof Mesh) || item.name !== "pc_top_screen_2") return;

		this.pcScreen = item;
	}

	private _setPhoneScreen(item: Object3D<Object3DEventMap>) {
		if (!(item instanceof Mesh) || item.name !== "phone_screen_2") return;

		this._phoneScreen = item;
	}

	private _setWatchScreen(item: Object3D<Object3DEventMap>) {
		if (!(item instanceof Mesh) || item.name !== "watch_screen") return;

		this._watchScreen = item;
	}

	private _setGamepadLed(item: Object3D<Object3DEventMap>) {
		if (!(item instanceof Mesh) || item.name !== "gamepad_led") return;

		this._gamepadLed = item;
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
			side: DoubleSide,
		});

		AVAILABLE_MATERIALS.phone_screen = new ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uTimestamp: { value: 0 },
			},
			fragmentShader: phoneScreenFragment,
			vertexShader: phoneScreenVertex,
			transparent: true,
			depthWrite: false,
		});

		AVAILABLE_MATERIALS.watch_screen = new ShaderMaterial({
			uniforms: {
				uSec: { value: 0 },
				uTimestamp: { value: 0 },
				uTime: { value: 0 },
			},
			fragmentShader: watchScreenFragment,
			vertexShader: watchScreenVertex,
			transparent: true,
			depthWrite: false,
		});

		AVAILABLE_MATERIALS.gamepad_led = new ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
			},
			fragmentShader: gamepadLedFragment,
			vertexShader: gamepadLedVertex,
			transparent: true,
			depthWrite: false,
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
			typeof state === "number"
				? state === 1
				: this.pcTopArticulation.rotation.z !==
				  this._initialPcTopArticulation?.rotation.z;

		const _NEXT_VALUE = isOpen
			? this._initialPcTopArticulation?.rotation.z ?? 0
			: this.pcTopArticulation.rotation.z + 1.7;

		return this.timeline.to(this.pcTopArticulation.rotation, {
			z: _NEXT_VALUE,
			duration: Config.GSAP_ANIMATION_DURATION,
			onUpdate: () => {},
			onComplete: () => {
				if (this.pcTopArticulation?.rotation)
					this.pcTopArticulation.rotation.z = Number(_NEXT_VALUE);
			},
		});
	}

	public construct(): void {
		super.construct();

		~(() => {
			if (!this._renderer) return;

			this._renderer.enableCssRender = true;
		})();

		~(() => {
			if (
				!this._renderer?.mixerContext ||
				!this.pcTopArticulation ||
				!this.pcScreen
			)
				return;

			const boundingBox = new Box3().setFromObject(this.pcScreen);
			const _WIDTH = boundingBox.max.y - boundingBox.min.y - 0.075;
			const _HEIGHT = boundingBox.max.x - boundingBox.min.x - 0.076;

			this._pcScreenDomElement = document.createElement("iframe");
			this._pcScreenDomElement.src = "http://threejs.org/";
			this._pcScreenDomElement.style.border = "none";

			this._pcScreenMixerPlane = new HtmlMixerPlane(
				this._renderer.mixerContext,
				this._pcScreenDomElement,
				{ planeH: _HEIGHT, planeW: _WIDTH }
			);
			this._pcScreenMixerPlane.object3d.position.set(
				this.pcScreen.position.x,
				0.01,
				this.pcScreen.position.z
			);
			this._pcScreenMixerPlane.object3d.rotation.set(-4.71, 0, -1.57);

			this.pcTopArticulation.add(this._pcScreenMixerPlane.object3d);
		})();
	}

	public intro(): void {
		this.togglePcOpening();
	}

	public update() {
		this._uTime = this._appTime.elapsed * 0.001;
		this._uTimestamps = this._currentDayTimestamp * 0.001 + this._uTime;

		if (
			this._phoneScreen?.material instanceof ShaderMaterial &&
			typeof this._phoneScreen?.material.uniforms?.uTime?.value === "number"
		)
			this._phoneScreen.material.uniforms.uTime.value = this._uTime;
		if (
			this._phoneScreen?.material instanceof ShaderMaterial &&
			typeof this._phoneScreen?.material.uniforms?.uTimestamp?.value ===
				"number"
		)
			this._phoneScreen.material.uniforms.uTimestamp.value = this._uTimestamps;

		if (
			this._watchScreen?.material instanceof ShaderMaterial &&
			typeof this._watchScreen?.material.uniforms?.uTime?.value === "number"
		)
			this._watchScreen.material.uniforms.uTime.value = this._uTime;

		if (
			this._watchScreen?.material instanceof ShaderMaterial &&
			typeof this._watchScreen?.material.uniforms?.uSec?.value === "number"
		)
			this._watchScreen.material.uniforms.uSec.value = Math.round(this._uTime);

		if (
			this._watchScreen?.material instanceof ShaderMaterial &&
			typeof this._watchScreen?.material.uniforms?.uTimestamp?.value ===
				"number"
		)
			this._watchScreen.material.uniforms.uTimestamp.value = this._uTimestamps;

		if (
			this._gamepadLed?.material instanceof ShaderMaterial &&
			typeof this._gamepadLed?.material.uniforms?.uTime?.value === "number"
		)
			this._gamepadLed.material.uniforms.uTime.value = this._uTime;
	}
}
