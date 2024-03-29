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
	PlaneGeometry,
} from "three";
import { gsap } from "gsap";
import { HtmlMixerPlane } from "threex.htmlmixer-continued/lib/html-mixer";

// CONFIG
import { Config } from "~/config";

// BLUEPRINTS
import { SceneComponentBlueprint } from "../blueprints/scene-component.blueprint";

// MODELS
import type { Materials } from "~/common/models/experience-world.model";

// STATIC
import { events } from "~/static";

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
	private readonly _currentDayTimestamp = getTodayTimestamp();

	private _initialPcTopArticulation?: Object3D<Object3DEventMap>;
	private _uTime = 0;
	private _uTimestamps = 0;
	private _onComposerStarted = () => {
		if (
			!this.pcScreenMixerPlane ||
			!this._experience.composer?.passes ||
			(Object.keys(this._experience.composer.passes).length > 0 &&
				this._experience.interactions?.passName &&
				this._experience.composer.passes[
					this._experience.interactions.passName
				])
		)
			return;
		this.pcScreenMixerPlane.object3d.userData.visible =
			this.pcScreenMixerPlane.object3d.visible;
		this.pcScreenMixerPlane.object3d.visible = false;
	};
	private _onComposerEnded = () => {
		if (
			!this.pcScreenMixerPlane ||
			typeof this.pcScreenMixerPlane?.object3d?.userData.visible !== "boolean"
		)
			return;

		this.pcScreenMixerPlane.object3d.visible =
			this.pcScreenMixerPlane.object3d.userData.visible;
		this.pcScreenMixerPlane.object3d.userData.visible = undefined;
	};
	private _iframeUnloadCleanUp?: () => unknown;

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
				phone_screen_2: "phone_screen",
				watch_screen: "watch_screen",
				gamepad_led: "gamepad_led",
			},
			markers: [
				{
					icon: "❔",
					content: "...",
					position: new Vector3(-0.19, 2.52, 0.71),
				},
				{
					icon: "💡",
					content: "Twitter (not X)",
					position: new Vector3(1.62, 1.54, 1.55),
				},
				{
					icon: "💡",
					content: "Linkedin",
					position: new Vector3(-1.14, 0.8, -1.91),
				},
				{
					icon: "💡",
					content: "Discord",
					position: new Vector3(0.39, 1.88, 0.41),
				},
				{
					icon: "💡",
					content: "Github",
					position: new Vector3(1.33, 0.81, -0.97),
				},
			],
			onTraverseModelScene: (child: Object3D<Object3DEventMap>) => {
				this._setObjects(child);
			},
		});

		this._experience.loader?.on(events.LOADED, () => {
			if (!this._renderer?.mixerContext) return;
			if (this._renderer) this._renderer.enableCssRender = true;

			const pcScreenDomElement = document.createElement("iframe");
			pcScreenDomElement.setAttribute("seamless", "true");
			pcScreenDomElement.src = "/notes/about";
			pcScreenDomElement.style.border = "none";

			this.pcScreenMixerPlane = new HtmlMixerPlane(
				this._renderer.mixerContext,
				pcScreenDomElement,
				{ planeH: 2, planeW: 3, elementW: 1129 }
			);

			this._experience.app.scene?.add(this.pcScreenMixerPlane.object3d);
		});
	}

	protected _getAvailableMaterials() {
		const availableTextures = this._loader?.availableTextures;
		const availableMaterials: Materials = {};

		if (!availableTextures) return availableMaterials;

		// MATERIALS
		if (this._world?.commonMaterials.scene_container) {
			availableMaterials.scene_container =
				this._world?.commonMaterials.scene_container.clone();
			availableMaterials.scene_container.alphaTest = 1;
			availableMaterials.scene_container.depthWrite = false;
		}

		if (this._world?.commonMaterials.glass) {
			availableMaterials.glass = this._world?.commonMaterials.glass.clone();
			if (availableMaterials.glass instanceof MeshBasicMaterial) {
				availableMaterials.glass.alphaTest = 1;
				availableMaterials.glass.alphaMap = availableTextures.cloudAlphaMap;
			}
		}

		availableMaterials.scene_3 = new MeshBasicMaterial({
			alphaMap: availableTextures.cloudAlphaMap,
			alphaTest: 1,
			map: availableTextures.scene_3_baked_texture,
			side: DoubleSide,
		});

		availableMaterials.phone_screen = new ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uTimestamp: { value: 0 },
				uIcons: { value: availableTextures.phoneScreenshot },
			},
			fragmentShader: phoneScreenFragment,
			vertexShader: phoneScreenVertex,
			transparent: true,
			depthWrite: false,
		});

		availableMaterials.watch_screen = new ShaderMaterial({
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

		availableMaterials.gamepad_led = new ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
			},
			fragmentShader: gamepadLedFragment,
			vertexShader: gamepadLedVertex,
			transparent: true,
			depthWrite: false,
		});

		return availableMaterials;
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
			!this.pcScreen ||
			!this.pcScreenMixerPlane
		)
			return;

		const boundingBox = new Box3().setFromObject(this.pcScreen);
		const width = boundingBox.max.y - boundingBox.min.y - 0.075;
		const height = boundingBox.max.x - boundingBox.min.x - 0.076;

		this.pcScreenMixerPlane.object3d.removeFromParent();
		this.pcScreenMixerPlane.setObject3D(
			new Mesh(
				new PlaneGeometry(width, height),
				this.pcScreenMixerPlane.object3d.material
			)
		);
		this.pcScreenMixerPlane.opts.planeW = width;
		this.pcScreenMixerPlane.opts.planeH = height;
		this.pcScreenMixerPlane.correctSizes();
		this.pcScreenMixerPlane.setDomElementSize();
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

		this.pcScreen.removeFromParent();
		this.pcTopArticulation.add(this.pcScreenMixerPlane.object3d);
	}

	public get isPcOpen() {
		return (
			this.pcTopArticulation?.rotation.z !==
			this._initialPcTopArticulation?.rotation.z
		);
	}

	public initSelectableObjects() {
		const pcScreen = this.pcScreenMixerPlane?.object3d;
		const pcScreenPosition = new Vector3();
		const pcScreenFocusPoint = new Vector3();
		pcScreen?.localToWorld(pcScreenPosition);
		pcScreen?.position.add(new Vector3(0, -1.415, 0));
		pcScreen?.localToWorld(pcScreenFocusPoint);
		pcScreen?.position.add(new Vector3(0, 1.415, 0));

		this.selectableObjects = [
			...(pcScreen !== undefined
				? [
						{
							object: pcScreen,
							focusPoint: pcScreenFocusPoint,
							focusTarget: pcScreenPosition,
							focusFov: 25,
							focusRadius: 0.03,
							focusOffset: new Vector3(0, 0, Math.PI),
						},
				  ]
				: []),
			...(this.phoneScreen !== undefined
				? [
						{
							object: this.phoneScreen,
							focusPoint: this.phoneScreen
								.localToWorld(new Vector3())
								.add(new Vector3(0.225, 1, 0.1)),
							focusTarget: this.phoneScreen.localToWorld(new Vector3()),
							focusRadius: 0.03,
							focusOffset: new Vector3(2.2, 0, 2.1),
						},
				  ]
				: []),
			...(this.watchScreen !== undefined
				? [
						{
							object: this.watchScreen,
							focusPoint: this.watchScreen
								.localToWorld(new Vector3())
								.add(new Vector3(-0.2, 0.7, 0.028)),
							focusTarget: this.watchScreen.localToWorld(new Vector3()),
							focusRadius: 0.02,
							focusOffset: new Vector3(-2.2, -0.6, -2),
						},
				  ]
				: []),
			...(this.githubLogo !== undefined
				? [{ object: this.githubLogo, externalLink: Config.GITHUB_LINK }]
				: []),
			...(this.discordLogo !== undefined
				? [{ object: this.discordLogo, externalLink: Config.DISCORD_LINK }]
				: []),
			...(this.twitterLogo !== undefined
				? [{ object: this.twitterLogo, externalLink: Config.TWITTER_LINK }]
				: []),
			...(this.telegramLogo !== undefined
				? [{ object: this.telegramLogo, externalLink: Config.TELEGRAM_LINK }]
				: []),
			...(this.linkedinLogo !== undefined
				? [{ object: this.linkedinLogo, externalLink: Config.LINKEDIN_LINK }]
				: []),
		];
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
			: (this._initialPcTopArticulation?.rotation.z ?? 0) + 1.7;

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

	public construct(): void {
		super.construct();
		this._initPcScreenIframe();

		const matKeys = Object.keys(this._availableMaterials).slice(3);

		for (const key of matKeys) this._availableMaterials[key].visible = false;

		this._experience.composer?.on(events.STARTED, this._onComposerStarted);
		this._experience.composer?.on(events.ENDED, this._onComposerEnded);
	}

	public destruct(): void {
		super.destruct();
		this._iframeUnloadCleanUp?.();
	}

	public intro() {
		if (!this.modelScene) return this.timeline;

		this.modelScene.renderOrder = 1;

		const params = { alphaTest: 0 };
		const matKeys = Object.keys(this._availableMaterials);
		const alphaMatKeys = matKeys.slice(0, 3);
		const otherMatKeys = matKeys.slice(3);

		return this.togglePcOpening(1)
			?.add(
				gsap.to(params, {
					alphaTest: 1,
					duration: Config.GSAP_ANIMATION_DURATION,
					onUpdate: () => {
						for (const key of alphaMatKeys)
							this._availableMaterials[key].alphaTest = 1 - params.alphaTest;
					},
				}),
				"<"
			)
			.add(() => {
				if (this._renderer) this._renderer.enableCssRender = true;
				if (this.pcScreenMixerPlane)
					this.pcScreenMixerPlane.object3d.visible = true;
				for (const key of otherMatKeys)
					this._availableMaterials[key].visible = true;
			}, "<40%");
	}

	public outro() {
		if (!this.modelScene) return this.timeline;

		this.modelScene.renderOrder = 2;

		const params = { alphaTest: 0 };
		const matKeys = Object.keys(this._availableMaterials);
		const alphaMatKeys = matKeys.slice(0, 3);
		const otherMatKeys = matKeys.slice(3);

		return this.togglePcOpening(0)?.add(
			gsap.to(params, {
				alphaTest: 1,
				duration: Config.GSAP_ANIMATION_DURATION,
				onStart: () => {
					if (this._renderer) this._renderer.enableCssRender = false;
					if (this.pcScreenMixerPlane)
						this.pcScreenMixerPlane.object3d.visible = false;
					for (const key of otherMatKeys)
						this._availableMaterials[key].visible = false;
				},
				onUpdate: () => {
					for (const key of alphaMatKeys)
						this._availableMaterials[key].alphaTest = params.alphaTest;
				},
			}),
			"<"
		);
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
