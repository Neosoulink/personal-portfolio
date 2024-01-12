import {
	CatmullRomCurve3,
	Material,
	Mesh,
	PerspectiveCamera,
	Raycaster,
	Vector3,
} from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import gsap, { Power0 } from "gsap";

// EXPERIENCES
import { HomeExperience } from "..";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";

// CONFIG
import { Config } from "~/config";

// STATIC
import { errors, events, pages } from "~/static";

// ERROR
import { ErrorFactory } from "~/errors";

// UTILS
import { lerpPosition } from "~/utils/three-utils";

// SHADERS
import camTransitionFrag from "./shaders/glass-effect/fragment.glsl";
import camTransitionVert from "./shaders/glass-effect/vertex.glsl";

export class WorldManager extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appCamera = this._experience.app.camera;
	private readonly _appCameraInstance = this._appCamera.instance;
	private readonly _appResources = this._experience.app.resources;
	private readonly _router = this._experience.router;
	private readonly _camera = this._experience.camera;
	private readonly _navigation = this._experience.navigation;
	private readonly _composer = this._experience.composer;
	private readonly _renderer = this._experience.renderer;
	private readonly _timeline = gsap.timeline();

	private _world: typeof this._experience.world;
	private _config: {
		prevSceneKey?: string;
		cameraTransitionPass: ShaderPass;
		glassEffectDefault: { duration: number; ease: gsap.EaseFunction };
	} = {
		cameraTransitionPass: new ShaderPass({
			uniforms: {
				tDiffuse: { value: null },
				uStrength: { value: 0 },
				uDisplacementMap: {
					value: this._appResources.items.rocksAlphaMap,
				},
			},
			vertexShader: camTransitionVert,
			fragmentShader: camTransitionFrag,
		}),
		glassEffectDefault: { duration: 0.3, ease: Power0.easeIn },
	};

	// TODO: Reorder properties
	public rayCaster = new Raycaster();
	public normalizedCursorPosition = { x: 0, y: 0 };
	/**
	 * The curve path of the camera
	 */
	public cameraCurvePath = new CatmullRomCurve3([
		new Vector3(0, 5.5, 21),
		new Vector3(12, 10, 12),
		new Vector3(21, 5.5, 0),
		new Vector3(12, 3.7, 12),
		new Vector3(0, 5.5, 21),
	]);
	/**
	 * Current curve path position of the camera.
	 */
	public cameraCurvePosition = new Vector3();
	public cameraCurvePathProgress = {
		current: 0,
		target: 0,
		ease: 0.1,
	};
	/**
	 * Enable auto curve path animation
	 */
	public autoCameraAnimation = false;
	/**
	 * gsap animation watcher. If gsap is currently animating
	 */
	public isGsapAnimating = false;
	/**
	 * Curve path backward animation
	 */
	public backwardCurveAnimation = false;
	public focusPointPositionIndex = 0;
	public focusedPosition?: Vector3;
	public focusedRadius = 2;
	public focusedAngleX = 0;
	public focusedAngleY = 0;
	public mouseDowned = false;
	public mouseOverBubble = false;
	public lastMouseCoordinate = { x: 0, y: 0 };
	public modelBubbles: {
		coordinates: Vector3;
		DOMelement: HTMLElement;
	}[] = [];
	// === ^

	private get _supportedPageKeys() {
		if (!this._world?.availablePageScenes) return [];

		return Object.keys(this._world.availablePageScenes);
	}

	public get timeline() {
		return this._timeline;
	}

	/** Initialize the the default scenes states. */
	private async _initScenes() {
		if (this._supportedPageKeys.length < 2)
			throw new ErrorFactory(
				new Error("Unable to display the projected scene ", {
					cause: errors.WRONG_PARAM,
				})
			);

		if (
			!this._appCameraInstance ||
			!this._camera?.cameras ||
			this._camera?.cameras.length < 2
		)
			throw new ErrorFactory(
				new Error("No enough camera found", {
					cause: errors.WRONG_PARAM,
				})
			);

		if (!this._world)
			throw new ErrorFactory(
				new Error("World not initialized", {
					cause: errors.WRONG_PARAM,
				})
			);

		const CURRENT_CAMERA = this._camera.cameras[0];
		const SECONDARY_CAMERA = this._camera.cameras[1];

		let projectedScene =
			this._world.availablePageScenes[this._supportedPageKeys[1]];

		this._world.mainSceneConfig.cameraPath.getPointAt(
			0,
			CURRENT_CAMERA.position
		);
		this._world.mainSceneConfig.cameraPath.getPointAt(
			0,
			this._appCameraInstance.position
		);

		this._camera.setCameraLookAt(
			(this._world?.scene1?.modelScene?.position ?? new Vector3())
				.clone()
				.setY(2)
		);

		if (
			typeof this._router?.currentRouteKey === "string" &&
			this._router.currentRouteKey !== this._world?.mainSceneKey &&
			this._router.currentRouteKey !== this._supportedPageKeys[1]
		)
			projectedScene =
				this._world?.availablePageScenes[this._router.currentRouteKey];

		projectedScene.modelScene?.children.forEach((child) => {
			if (child instanceof Mesh) child.material.alphaTest = 0;
		});

		if (
			this._world.scene1?.modelScene &&
			this._world.scene1.pcScreen &&
			this._world.scene1.pcScreenWebglTexture &&
			SECONDARY_CAMERA
		) {
			await this._world.scene1.togglePcOpening();

			this._renderer?.addPortalAssets(`${this._world.scene1}_pc_screen`, {
				mesh: this._world.scene1.pcScreen,
				meshCamera: SECONDARY_CAMERA,
				meshWebGLTexture: this._world.scene1.pcScreenWebglTexture,
			});

			this._world.projectedSceneConfig.cameraPath.getPoint(
				0,
				SECONDARY_CAMERA.position
			);
			SECONDARY_CAMERA.lookAt(this._world.projectedSceneConfig.center);
			SECONDARY_CAMERA.userData.lookAt =
				this._world.projectedSceneConfig.center;
		}

		this._setScene();
	}

	/** Launch a screen glass effect. */
	private _triggerGlassTransitionEffect() {
		if (
			!this._config.cameraTransitionPass.uniforms.uStrength ||
			!this._composer
		)
			return this._timeline;
		if (this._timeline.isActive()) this._timeline.progress(1);

		this._config.cameraTransitionPass.clear = true;
		this._config.cameraTransitionPass.uniforms.uStrength.value = 0;

		this._composer.addPass(
			"cameraTransitionPass",
			this._config.cameraTransitionPass
		);

		return this._timeline
			.to(this._config.cameraTransitionPass.material.uniforms.uStrength, {
				...this._config.glassEffectDefault,
				value: 0.175,
			})
			.to(this._config.cameraTransitionPass.material.uniforms.uStrength, {
				...this._config.glassEffectDefault,
				value: 0,
				ease: Power0.easeOut,
			})
			.add(
				() =>
					this._config.cameraTransitionPass &&
					this._composer?.removePass("cameraTransitionPass"),
				">"
			);
	}

	/**
	 * Transition between projected scenes.
	 *
	 * @param nextSceneKey The incoming scene key.
	 */
	private _changeProjectedScene(nextSceneKey?: string) {
		const CURRENT_SCENE = this._world?.availablePageScenes[nextSceneKey ?? ""];

		if (
			CURRENT_SCENE?.modelScene &&
			nextSceneKey !== this._world?.mainSceneKey &&
			nextSceneKey !== this._config.prevSceneKey
		) {
			const PARAMS = { alphaTest: 0 };
			CURRENT_SCENE.modelScene.renderOrder = 1;

			this._timeline.to(PARAMS, {
				alphaTest: 1,
				duration: Config.GSAP_ANIMATION_DURATION,
				onStart: () => {
					if (!this._navigation?.timeline.isActive())
						this._navigation?.setLimits(CURRENT_SCENE.navigationLimits);
				},
				onUpdate: () => {
					this._supportedPageKeys.slice(1).forEach((supportedPageKey) => {
						const SCENE = this._world?.availablePageScenes[supportedPageKey];
						if (
							supportedPageKey === this._world?.mainSceneKey ||
							!SCENE?.modelScene
						)
							return;

						SCENE?.modelScene?.traverse((child) => {
							if (
								!(child instanceof Mesh) ||
								!(child.material instanceof Material) ||
								(nextSceneKey === supportedPageKey &&
									child.material.alphaTest === 0) ||
								(nextSceneKey !== supportedPageKey &&
									child.material.alphaTest === 1)
							)
								return;

							child.material.alphaTest =
								nextSceneKey === supportedPageKey
									? 1 - PARAMS.alphaTest
									: PARAMS.alphaTest;
						});
					});
				},
				onComplete: () => {
					CURRENT_SCENE.intro();
				},
			});
		}
	}

	/** Set the current scene depending to the current `Navigation` state */
	private _setScene() {
		if (
			typeof this._experience.router?.currentRouteKey !== "string" ||
			this._supportedPageKeys.indexOf(
				this._experience.router.currentRouteKey
			) === -1
		)
			throw new ErrorFactory(
				new Error("Page not supported", { cause: errors.WRONG_PARAM })
			);

		if (!this._world)
			throw new ErrorFactory(
				new Error("World not initialized", {
					cause: errors.WRONG_PARAM,
				})
			);

		if (
			!this._appCameraInstance ||
			!this._camera?.cameras ||
			this._camera?.cameras.length < 2
		)
			throw new ErrorFactory(
				new Error("No enough camera found", {
					cause: errors.WRONG_PARAM,
				})
			);

		if (this._camera?.timeline.isActive()) this._camera.timeline.progress(1);
		if (this._navigation?.timeline.isActive())
			this._navigation.timeline.progress(1);
		if (this._timeline.isActive()) this._timeline.progress(1);

		const CURRENT_SCENE =
			this._world.availablePageScenes[this._experience.router.currentRouteKey];
		const SCREEN_POSITION =
			this._world.scene1?.pcScreen?.localToWorld(new Vector3()) ??
			new Vector3();

		if (
			this._config.prevSceneKey &&
			(this._experience.router?.currentRouteKey === this._world.mainSceneKey ||
				CURRENT_SCENE === undefined)
		) {
			this._triggerGlassTransitionEffect().add(() => {
				if (!this._world?.mainSceneConfig) return;

				this._camera?.switchCamera(0);
				this._navigation?.setLimits(CURRENT_SCENE.navigationLimits);
				this._navigation?.setViewCenter(new Vector3());
				this._navigation?.setTargetPosition(SCREEN_POSITION);
				this._navigation?.updateCameraPosition(
					this._world.mainSceneConfig.cameraPath.getPoint(0),
					this._world.mainSceneConfig.center
				);
			}, `-=${this._config.glassEffectDefault.duration}`);
		}

		if (
			this._experience.router.currentRouteKey !== this._world?.mainSceneKey &&
			this._camera?.currentCameraIndex !== 1
		) {
			this._navigation
				?.updateCameraPosition(
					lerpPosition(
						new Vector3(0, SCREEN_POSITION.y, 0),
						SCREEN_POSITION,
						0.84
					),
					SCREEN_POSITION,
					() => {}
				)
				.add(() => {
					this._triggerGlassTransitionEffect().add(() => {
						if (!this._world?.projectedSceneConfig.center) return;

						this._camera?.switchCamera(1);
						this._navigation?.setLimits(CURRENT_SCENE.navigationLimits);
						this._navigation?.setViewCenter(
							this._world?.projectedSceneConfig.center
						);
						this._navigation?.setTargetPosition(
							this._camera?.currentCamera.userData.lookAt
						);
						this._navigation?.setPositionInSphere(
							this._camera?.currentCamera.position
						);
					}, `-=${this._config.glassEffectDefault.duration}`);
				}, "<87%");
		}

		this._changeProjectedScene(this._experience.router.currentRouteKey);
		this._config.prevSceneKey = this._experience.router?.currentRouteKey;
	}

	public construct() {
		this._world = this._experience.world;
		this._initScenes();
		this._experience.router?.on(events.CHANGED, () => this._setScene());
		this.emit(events.CONSTRUCTED, this);
	}

	public destruct() {}

	public updateModelBubblesDomElements() {
		const _CAMERA = this._appCameraInstance;
		if (!(_CAMERA instanceof PerspectiveCamera)) return;

		for (const bubble of this.modelBubbles) {
			if (bubble.DOMelement) {
				const screenPosition = bubble.coordinates.clone();
				screenPosition.project(_CAMERA);

				const translateX =
					screenPosition.x * this._experience.app.sizes.width * 0.5;
				const translateY = -(
					screenPosition.y *
					this._experience.app.sizes.height *
					0.5
				);
				bubble.DOMelement.style.transform = `translate(${translateX}px, ${translateY}px)`;
			}
		}
	}

	public setWheelEventListener() {
		window.addEventListener("wheel", (e) => {
			if (this.autoCameraAnimation === false) return;

			if (e.deltaY < 0) {
				this.cameraCurvePathProgress.target += 0.05;
				this.backwardCurveAnimation = false;

				return;
			}

			this.cameraCurvePathProgress.target -= 0.05;
			this.backwardCurveAnimation = true;
		});
	}

	public setMouseMoveEventListener() {
		window.addEventListener("mousemove", (e) => {
			if (this.autoCameraAnimation === true && this.mouseDowned) {
				if (e.clientX < this.lastMouseCoordinate.x) {
					this.cameraCurvePathProgress.target += 0.002;
					this.backwardCurveAnimation = false;
				} else if (e.clientX > this.lastMouseCoordinate.x) {
					this.cameraCurvePathProgress.target -= 0.002;
					this.backwardCurveAnimation = true;
				}
			}

			if (!this.autoCameraAnimation) {
				this.normalizedCursorPosition.x =
					e.clientX / this._experience.app?.sizes.width - 0.5;
				this.normalizedCursorPosition.y =
					e.clientY / this._experience.app?.sizes.height - 0.5;
			}

			this.lastMouseCoordinate = { x: e.clientX, y: e.clientY };
		});
	}

	public setMouseDownEventListener() {
		window.addEventListener("mousedown", () => {
			this.mouseDowned = true;
			if (this.focusedPosition && !this.mouseOverBubble)
				this._experience.camera?.cameraZoomIn();
		});
	}

	public setMouseUpEventListener() {
		window.addEventListener("mouseup", () => {
			this.mouseDowned = false;
			if (this.focusedPosition && !this.mouseOverBubble)
				this._experience.camera?.cameraZoomOut();
		});
	}

	public getFocusedLookAtPosition(position = this.focusedPosition) {
		if (!(position && this._appCameraInstance)) return new Vector3();

		return new Vector3(
			position.x -
				this.focusedRadius *
					Math.cos(
						this.focusedAngleX -
							this._appCameraInstance.rotation.y +
							Math.PI * 0.5
					),
			position.y - this.focusedRadius * Math.sin(this.focusedAngleY),
			position.z -
				this.focusedRadius *
					Math.sin(
						this.focusedAngleX -
							this._appCameraInstance.rotation.y +
							Math.PI * 0.5
					)
		);
	}

	public getGsapDefaultProps() {
		return {
			onStart: () => {
				this.isGsapAnimating = true;
			},
			onComplete: () => {
				this.isGsapAnimating = false;
			},
		};
	}

	public update() {
		if (this.autoCameraAnimation && !this.isGsapAnimating) {
			this.cameraCurvePathProgress.current = gsap.utils.interpolate(
				this.cameraCurvePathProgress.current,
				this.cameraCurvePathProgress.target,
				this.cameraCurvePathProgress.ease
			);
			this.cameraCurvePathProgress.target =
				this.cameraCurvePathProgress.target +
				(this.backwardCurveAnimation ? -0.0001 : 0.0001);

			if (this.cameraCurvePathProgress.target > 1) {
				setTimeout(() => {
					this.backwardCurveAnimation = true;
				}, 1000);
			}

			if (this.cameraCurvePathProgress.target < 0) {
				setTimeout(() => {
					this.backwardCurveAnimation = false;
				}, 1000);
			}
			this.cameraCurvePathProgress.target = gsap.utils.clamp(
				0,
				1,
				this.cameraCurvePathProgress.target
			);
			this.cameraCurvePathProgress.current = gsap.utils.clamp(
				0,
				1,
				this.cameraCurvePathProgress.current
			);
			this.cameraCurvePath.getPointAt(
				this.cameraCurvePathProgress.current,
				this.cameraCurvePosition
			);
			this._appCameraInstance?.position.copy(this.cameraCurvePosition);
		}

		if (
			this._appCameraInstance &&
			!this.autoCameraAnimation &&
			this.focusedPosition &&
			!this.isGsapAnimating
		)
			this._camera?.setCameraLookAt(this.getFocusedLookAtPosition());

		this.updateModelBubblesDomElements();

		if (this.autoCameraAnimation || !this.isGsapAnimating)
			this._experience.camera?.setCameraLookAt(
				this._camera?.lookAtPosition ?? new Vector3()
			);

		this.focusedAngleX +=
			(this.normalizedCursorPosition.x * Math.PI - this.focusedAngleX) * 0.1;
		this.focusedAngleY +=
			(this.normalizedCursorPosition.y * Math.PI - this.focusedAngleY) * 0.1;
	}
}
