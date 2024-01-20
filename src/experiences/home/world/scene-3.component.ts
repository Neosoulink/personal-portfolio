import {
	Object3D,
	type Object3DEventMap,
	MeshBasicMaterial,
	Box3,
	Mesh,
	ShaderMaterial,
	DoubleSide,
	CatmullRomCurve3,
	Vector3,
} from "three";
import { gsap } from "gsap";
import { HtmlMixerPlane } from "threex.htmlmixer-continued/lib/html-mixer";

// CONFIG
import { Config } from "~/config";

// BLUEPRINTS
import { SceneComponentBlueprint } from "~/blueprints/experiences/scene-component.blueprint";

// MODELS
import type { Materials } from "~/common/experiences/experience-world.model";

// UTILS
import { getTodayTimestamp } from "~/utils/common-utils";

// SHADERS
import phoneScreenFragment from "./shaders/scene-3/phone-screen/fragment.glsl";
import phoneScreenVertex from "./shaders/scene-3/phone-screen/vertex.glsl";
import watchScreenFragment from "./shaders/scene-3/watch-screen/fragment.glsl";
import watchScreenVertex from "./shaders/scene-3/watch-screen/vertex.glsl";
import gamepadLedFragment from "./shaders/scene-3/gamepad_led/fragment.glsl";
import gamepadLedVertex from "./shaders/scene-3/gamepad_led/vertex.glsl";

export class Scene3Component extends SceneComponentBlueprint {
	private readonly _appTime = this._experience.app.time;
	private readonly _renderer = this._experience.renderer;
	private readonly _interactions = this._experience.interactions;
	private readonly _currentDayTimestamp = getTodayTimestamp();

	private _initialPcTopArticulation?: Object3D<Object3DEventMap>;
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
			x: { min: -1.5, max: 1.5 },
			y: { min: 0, max: 1.5 },
			z: { min: -1.5, max: 1.5 },
			enabled: true,
		},
	};

	public cameraPath = new CatmullRomCurve3(
		[
			new Vector3(5.8, 2.8, -4.6),
			new Vector3(5, 4.2, 5),
			new Vector3(-5.3, 2.2, 4.6),
			new Vector3(-4.6, 2, -5.3),
			new Vector3(4.2, 2.7, -5),
		],
		true
	);
	public center = new Vector3(0, 1.3, 0);
	public pcScreenMixerPlane?: HtmlMixerPlane;
	public pcScreenDomElement?: HTMLIFrameElement;
	public phoneScreen?: Mesh;
	public watchScreen?: Mesh;
	public gamepadLed?: Mesh;
	public pcTopArticulation?: Object3D<Object3DEventMap>;
	public pcScreen?: Mesh;
	public pcTop?: Mesh;
	public linkedinLogo?: Mesh;
	public githubLogo?: Mesh;
	public twitterLogo?: Mesh;
	public discordLogo?: Mesh;
	public telegramLogo?: Mesh;
	public stackoverflowLogo?: Mesh;

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
				pc_top_screen_2: "glass",
				phone_screen_2: "phone_screen",
				watch_screen: "watch_screen",
				gamepad_led: "gamepad_led",
			},
			onTraverseModelScene: (child: Object3D<Object3DEventMap>) => {
				this._setObjects(child);
			},
		});
	}

	protected _getAvailableMaterials() {
		const AVAILABLE_TEXTURE = this._loader?.availableTextures;
		const AVAILABLE_MATERIALS: Materials = {};

		if (!AVAILABLE_TEXTURE) return AVAILABLE_MATERIALS;

		// MATERIALS
		if (this._world?.commonMaterials.scene_container) {
			AVAILABLE_MATERIALS.scene_container =
				this._world?.commonMaterials.scene_container.clone();
			AVAILABLE_MATERIALS.scene_container.alphaTest = 1;
			AVAILABLE_MATERIALS.scene_container.depthWrite = false;
		}

		if (this._world?.commonMaterials.glass) {
			AVAILABLE_MATERIALS.glass = this._world?.commonMaterials.glass.clone();
			if (AVAILABLE_MATERIALS.glass instanceof MeshBasicMaterial) {
				AVAILABLE_MATERIALS.glass.alphaTest = 1;
				AVAILABLE_MATERIALS.glass.alphaMap = AVAILABLE_TEXTURE.cloudAlphaMap;
			}
		}

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

	private _setObjects(object: Object3D<Object3DEventMap>) {
		if (
			object instanceof Object3D &&
			object.name === "pc_top_articulation_2" &&
			!this._initialPcTopArticulation
		) {
			this._initialPcTopArticulation = object.clone();
			this.pcTopArticulation = object;
		}

		if (!(object instanceof Mesh)) return;
		if (object.name === "pc_top_2" && !this.pcTop) this.pcTop = object;
		if (object.name === "pc_top_screen_2" && !this.pcScreen)
			this.pcScreen = object;
		if (object.name === "phone_screen_2" && !this.phoneScreen)
			this.phoneScreen = object;
		if (object.name === "watch_screen" && !this.watchScreen)
			this.watchScreen = object;
		if (object.name === "gamepad_led" && !this.gamepadLed)
			this.gamepadLed = object;
		if (object.name === "linkedin_logo" && !this.linkedinLogo)
			this.linkedinLogo = object;
		if (object.name === "github_logo_2" && !this.githubLogo)
			this.githubLogo = object;
		if (object.name === "twitter_x_logo" && !this.twitterLogo)
			this.twitterLogo = object;
		if (object.name === "discord_logo" && !this.discordLogo)
			this.discordLogo = object;
		if (object.name === "telegram_logo" && !this.telegramLogo)
			this.telegramLogo = object;
		if (object.name === "stackoverflow_logo" && !this.stackoverflowLogo)
			this.stackoverflowLogo = object;
	}

	private _initPcScreenIframe() {
		if (
			!this._renderer?.mixerContext ||
			!this.pcTopArticulation ||
			!this.pcScreen
		)
			return;

		const boundingBox = new Box3().setFromObject(this.pcScreen);
		const _WIDTH = boundingBox.max.y - boundingBox.min.y - 0.075;
		const _HEIGHT = boundingBox.max.x - boundingBox.min.x - 0.076;

		this.pcScreenDomElement = document.createElement("iframe");
		this.pcScreenDomElement.src = "http://threejs.org";
		this.pcScreenDomElement.style.border = "none";

		this.pcScreenMixerPlane = new HtmlMixerPlane(
			this._renderer.mixerContext,
			this.pcScreenDomElement,
			{ planeH: _HEIGHT, planeW: _WIDTH, elementW: 1129 }
		);
		this.pcScreenMixerPlane.object3d.position
			.copy(this.pcScreen.position)
			.add(new Vector3(0, -0.005, 0));
		this.pcScreenMixerPlane.object3d.rotation.set(
			Math.PI * 0.5,
			0.0055,
			Math.PI * -0.5
		);
		this.pcScreenMixerPlane.object3d.visible = false;
		this.pcScreenMixerPlane.object3d.name = "pc_screen";

		this.pcScreen.position.setY(-1.415);
		this.pcScreen.removeFromParent();

		this.pcTopArticulation.add(this.pcScreenMixerPlane.object3d);
	}

	public get isPcOpen() {
		return (
			this.pcTopArticulation?.rotation.z !==
			this._initialPcTopArticulation?.rotation.z
		);
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
			: (this._initialPcTopArticulation?.rotation.z ?? 0) + 1.7;

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

	public construct(): void {
		super.construct();

		this._initPcScreenIframe();

		~(() => {
			const _MAT_KEYS = Object.keys(this._availableMaterials).slice(3);

			for (const key of _MAT_KEYS)
				this._availableMaterials[key].visible = false;
		})();
	}

	public intro() {
		if (!this.modelScene) return this.timeline;

		this.modelScene.renderOrder = 1;

		const _PARAMS = { alphaTest: 0 };
		const _MAT_KEYS = Object.keys(this._availableMaterials);
		const _ALPHA_MAT_KEYS = _MAT_KEYS.slice(0, 3);
		const _OTHER_MAT_KEYS = _MAT_KEYS.slice(3);

		return this.togglePcOpening(1)
			?.add(
				gsap.to(_PARAMS, {
					alphaTest: 1,
					duration: Config.GSAP_ANIMATION_DURATION,
					onUpdate: () => {
						for (const key of _ALPHA_MAT_KEYS)
							this._availableMaterials[key].alphaTest = 1 - _PARAMS.alphaTest;
					},
				}),
				"<"
			)
			.add(() => {
				if (this._renderer) this._renderer.enableCssRender = true;
				if (this.pcScreenMixerPlane)
					this.pcScreenMixerPlane.object3d.visible = true;
				for (const key of _OTHER_MAT_KEYS)
					this._availableMaterials[key].visible = true;
			}, "<40%")
			.add(() => {
				const pcScreen = this.pcScreenMixerPlane?.object3d;
				const pcScreenPosition = new Vector3();
				const pcScreenFocusPoint = new Vector3();
				pcScreen?.localToWorld(pcScreenPosition);
				pcScreen?.position.add(new Vector3(0, -1.415, 0));
				pcScreen?.localToWorld(pcScreenFocusPoint);
				pcScreen?.position.add(new Vector3(0, 1.415, 0));

				this._interactions?.start(
					[
						...(this.phoneScreen !== undefined
							? [
									{
										object: this.phoneScreen,
									},
							  ]
							: []),
						...(this.watchScreen !== undefined
							? [{ object: this.watchScreen }]
							: []),
						...(this.githubLogo !== undefined
							? [{ object: this.githubLogo, link: "https://github.com" }]
							: []),
						...(this.discordLogo !== undefined
							? [{ object: this.discordLogo }]
							: []),
						...(this.twitterLogo !== undefined
							? [{ object: this.twitterLogo }]
							: []),
						...(this.telegramLogo !== undefined
							? [{ object: this.telegramLogo }]
							: []),
						...(this.linkedinLogo !== undefined
							? [{ object: this.linkedinLogo }]
							: []),
						...(this.stackoverflowLogo !== undefined
							? [{ object: this.stackoverflowLogo }]
							: []),
						...(pcScreen !== undefined
							? [
									{
										object: pcScreen,
										focusPoint: pcScreenFocusPoint,
										focusTarget: pcScreenPosition,
										focusFov: 25,
									},
							  ]
							: []),
					],
					this.modelScene
				);
			});
	}

	public outro() {
		if (!this.modelScene) return this.timeline;

		this.modelScene.renderOrder = 2;

		const _PARAMS = { alphaTest: 0 };
		const _MAT_KEYS = Object.keys(this._availableMaterials);
		const _ALPHA_MAT_KEYS = _MAT_KEYS.slice(0, 3);
		const _OTHER_MAT_KEYS = _MAT_KEYS.slice(3);

		return this.togglePcOpening(0)
			?.add(
				gsap.to(_PARAMS, {
					alphaTest: 1,
					duration: Config.GSAP_ANIMATION_DURATION,
					onStart: () => {
						if (this._renderer) this._renderer.enableCssRender = false;
						if (this.pcScreenMixerPlane)
							this.pcScreenMixerPlane.object3d.visible = false;
						for (const key of _OTHER_MAT_KEYS)
							this._availableMaterials[key].visible = false;
					},
					onUpdate: () => {
						for (const key of _ALPHA_MAT_KEYS)
							this._availableMaterials[key].alphaTest = _PARAMS.alphaTest;
					},
				}),
				"<"
			)
			.add(() => {
				this._interactions?.stop();
			});
	}
	public update() {
		this._uTime = this._appTime.elapsed * 0.001;
		this._uTimestamps = this._currentDayTimestamp * 0.001 + this._uTime;

		if (
			this.phoneScreen?.material instanceof ShaderMaterial &&
			typeof this.phoneScreen?.material.uniforms?.uTime?.value === "number"
		)
			this.phoneScreen.material.uniforms.uTime.value = this._uTime;
		if (
			this.phoneScreen?.material instanceof ShaderMaterial &&
			typeof this.phoneScreen?.material.uniforms?.uTimestamp?.value === "number"
		)
			this.phoneScreen.material.uniforms.uTimestamp.value = this._uTimestamps;

		if (
			this.watchScreen?.material instanceof ShaderMaterial &&
			typeof this.watchScreen?.material.uniforms?.uTime?.value === "number"
		)
			this.watchScreen.material.uniforms.uTime.value = this._uTime;

		if (
			this.watchScreen?.material instanceof ShaderMaterial &&
			typeof this.watchScreen?.material.uniforms?.uSec?.value === "number"
		)
			this.watchScreen.material.uniforms.uSec.value = Math.round(this._uTime);

		if (
			this.watchScreen?.material instanceof ShaderMaterial &&
			typeof this.watchScreen?.material.uniforms?.uTimestamp?.value === "number"
		)
			this.watchScreen.material.uniforms.uTimestamp.value = this._uTimestamps;

		if (
			this.gamepadLed?.material instanceof ShaderMaterial &&
			typeof this.gamepadLed?.material.uniforms?.uTime?.value === "number"
		)
			this.gamepadLed.material.uniforms.uTime.value = this._uTime;
	}
}
