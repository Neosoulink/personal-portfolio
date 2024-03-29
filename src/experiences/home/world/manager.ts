import { Vector3 } from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import gsap, { Power0 } from "gsap";

// EXPERIENCES
import { HomeExperience } from "..";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// STATIC
import { errors, events, pages } from "~/static";

// UTILS
import { lerpPosition } from "~/utils/three-utils";

// SHADERS
import camTransitionFrag from "./shaders/glass-effect/fragment.glsl";
import camTransitionVert from "./shaders/glass-effect/vertex.glsl";

// CONFIGS
import { Config } from "~/config";
import type { SceneComponentBlueprint } from "../blueprints/scene-component.blueprint";

export class WorldManager extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appResources = this._experience.app.resources;
	private readonly _router = this._experience.router;
	private readonly _ui = this._experience.ui;
	private readonly _camera = this._experience.camera;
	private readonly _cameraAnimation = this._experience.cameraAnimation;
	private readonly _navigation = this._experience.navigation;
	private readonly _composer = this._experience.composer;
	private readonly _interactions = this._experience.interactions;
	private readonly _transitionEffectDefault = {
		duration: 0.3,
		ease: Power0.easeIn,
	};

	private _world: typeof this._experience.world;
	private _currentScene?: SceneComponentBlueprint;
	private _prevSceneKey?: string;
	private _prevProjectedSceneKey?: string;
	private _onUiReady = async () => {
		await this._intro();
		this._setScene();

		this._router?.on(events.CHANGED, this._onRouterChange);
		this._cameraAnimation?.on(events.CHANGED, this._onCameraAnimationChange);
		this._cameraAnimation?.on(events.STARTED, this._onCameraAnimationStart);
		this._cameraAnimation?.on(events.ENDED, this._onCameraAnimationEnd);
		this.emit(events.CONSTRUCTED, this);
	};
	private _onRouterChange = () => this._setScene();
	private _onCameraAnimationStart = () => {
		this._interactions?.stop();
	};
	private _onCameraAnimationEnd = () => {
		if (!this._world || typeof this._router?.currentRouteKey !== "string")
			return;

		this._currentScene =
			this._world.availablePageScenes[this._router.currentRouteKey];

		this._currentScene.initSelectableObjects();
		this._interactions?.start(
			this._currentScene.selectableObjects,
			this._currentScene.modelScene
		);
	};
	private _onCameraAnimationChange = () => {
		if (this._world?.manager?.timeline.isActive())
			this._world.manager.timeline.progress(1);
	};

	public readonly timeline = gsap.timeline({
		onStart: () => {},
		onComplete: () => {
			this.timeline.clear();
		},
	});

	private get _supportedPageKeys() {
		if (!this._world?.availablePageScenes) return [];

		return Object.keys(this._world.availablePageScenes);
	}

	/** Launch a screen composer effect. */
	private _triggerTransitionEffect() {
		if (!this._composer) return this.timeline;
		if (this.timeline.isActive()) this.timeline.progress(1);

		let shaderPass: ShaderPass | undefined = new ShaderPass({
			uniforms: {
				tDiffuse: { value: null },
				uStrength: { value: 0 },
				uDisplacementMap: {
					value: this._appResources.items.rocksAlphaMap,
				},
			},
			vertexShader: camTransitionVert,
			fragmentShader: camTransitionFrag,
		});

		shaderPass.clear = true;
		shaderPass.uniforms.uStrength.value = 0;

		this._composer.addPass(`${WorldManager.name}_shaderPass`, shaderPass);

		return this.timeline
			.to(shaderPass.material.uniforms.uStrength, {
				...this._transitionEffectDefault,
				value: 0.175,
			})
			.to(shaderPass.material.uniforms.uStrength, {
				...this._transitionEffectDefault,
				value: 0,
				ease: Power0.easeOut,
			})
			.add(() => {
				this._composer?.removePass(`${WorldManager.name}_shaderPass`);
				shaderPass?.dispose();
				shaderPass = undefined;
			}, ">");
	}

	/** Set the current scene depending to the current `Router` state */
	private _setScene() {
		if (
			typeof this._router?.currentRouteKey !== "string" ||
			this._supportedPageKeys.indexOf(this._router.currentRouteKey) === -1
		)
			throw new Error("Page not supported", { cause: errors.WRONG_PARAM });

		if (!this._world)
			throw new Error("World not initialized", {
				cause: errors.WRONG_PARAM,
			});

		if (!this._camera?.cameras || this._camera?.cameras.length < 2)
			throw new Error("No enough camera found", {
				cause: errors.WRONG_PARAM,
			});

		if (!this._cameraAnimation)
			throw new Error("No cameraAnimation module found", {
				cause: errors.WRONG_PARAM,
			});

		if (!this._navigation)
			throw new Error("No navigation module found", {
				cause: errors.WRONG_PARAM,
			});

		const prevScene = this?._prevSceneKey
			? this._world.availablePageScenes[this._prevSceneKey]
			: undefined;
		this._currentScene =
			this._world.availablePageScenes[this._router.currentRouteKey];

		if (this._camera?.timeline.isActive()) this._camera.timeline.progress(1);
		if (this._navigation?.timeline.isActive())
			this._navigation.timeline.progress(1);
		if (this.timeline.isActive()) this.timeline.progress(1);
		if (prevScene?.timeline?.isActive()) prevScene.timeline.progress(1);
		if (this._currentScene.timeline?.isActive())
			this._currentScene.timeline.progress(1);

		const scene1PcScreenPosition =
			this._world.scene1?.pcScreen?.localToWorld(new Vector3()) ??
			new Vector3();
		const isSwitchingMain = !!(
			this._prevSceneKey &&
			this._router?.currentRouteKey === this._world.mainSceneKey
		);
		const isSwitchingProjected =
			this._router.currentRouteKey !== this._world.mainSceneKey &&
			this._camera?.currentCameraIndex === 0;
		const updateCameraToCurrentScene = (fast = true) => {
			if (!this._currentScene) return;

			if (this._navigation?.timeline.isActive())
				this._navigation.timeline.progress(1);

			return this._navigation
				?.updateCameraPosition(
					this._currentScene.cameraPath?.getPoint(0),
					this._currentScene.center,
					fast ? 0.84 : undefined
				)
				.add(() => {
					if (this._navigation) this._navigation.view.limits = true;
				});
		};

		if (this?._prevSceneKey !== this._world.mainSceneKey && !isSwitchingMain)
			prevScene?.outro();
		if (this._prevProjectedSceneKey !== this._router?.currentRouteKey) {
			this._currentScene.intro();

			if (this._prevProjectedSceneKey && isSwitchingProjected) {
				this._world.availablePageScenes[this._prevProjectedSceneKey]?.outro();
				this._prevProjectedSceneKey = undefined;
			}
		}

		this._navigation.setLimits(this._currentScene.navigationLimits);
		this._navigation.setViewCenter(this._currentScene.center);
		this._cameraAnimation.cameraPath = this._currentScene.cameraPath;

		this._cameraAnimation.progressCurrent = 0;
		this._cameraAnimation.progressTarget = 0;
		this._cameraAnimation.enable(true);

		if (this._experience.ui)
			this._experience.ui.markers = this._currentScene.markers;

		if (isSwitchingMain || isSwitchingProjected)
			this._navigation.view.limits = false;

		if (isSwitchingMain) {
			this._prevProjectedSceneKey = this._prevSceneKey;
			this._triggerTransitionEffect().add(() => {
				if (!this._navigation || !this._camera) return;

				this._camera.switchCamera(0);
				this._navigation.setTargetPosition(scene1PcScreenPosition);
				updateCameraToCurrentScene(false);
			}, `-=${this._transitionEffectDefault.duration}`);
		}

		if (isSwitchingProjected)
			this._navigation
				?.updateCameraPosition(
					lerpPosition(
						new Vector3(0, scene1PcScreenPosition.y, 0),
						scene1PcScreenPosition,
						0.84
					),
					scene1PcScreenPosition
				)
				.add(() => {
					this._triggerTransitionEffect()
						.add(() => {
							if (!this._navigation || !this._camera) return;

							this._camera.switchCamera(1);
							this._navigation.setTargetPosition(
								this._camera.currentCamera.userData.lookAt
							);
							this._navigation.setPositionInSphere(
								this._camera.currentCamera.position
							);
						}, `-=${this._transitionEffectDefault.duration}`)
						.add(() => {
							(
								prevScene ??
								this._world?.availablePageScenes[this._world.mainSceneKey]
							)?.outro();

							updateCameraToCurrentScene();
						});
				}, "<87%");

		if (!isSwitchingMain && !isSwitchingProjected) updateCameraToCurrentScene();

		if (this._prevProjectedSceneKey === this._router?.currentRouteKey)
			this._prevProjectedSceneKey = undefined;
		this._prevSceneKey = this._router?.currentRouteKey;
	}

	/** Initialize the main scene and launch it intro */
	private async _intro() {
		if (
			!(
				this._world?.scene1?.pcScreen &&
				this._world?.scene1.pcScreenWebglTexture &&
				this._world?.scene1.pcScreenProjectedCamera &&
				this._cameraAnimation
			)
		)
			throw new Error("Wrong intro configs", {
				cause: errors.WRONG_PARAM,
			});

		this._prevProjectedSceneKey = pages.SKILL_PAGE;
		const mainScene = this._world.scene1;
		const projectedScene =
			this._world.availablePageScenes[this._prevProjectedSceneKey];

		projectedScene.intro();
		projectedScene.cameraPath.getPoint(
			0,
			mainScene.pcScreenProjectedCamera.position
		);

		mainScene.pcScreenProjectedCamera.lookAt(projectedScene.center);
		mainScene.pcScreenProjectedCamera.userData.lookAt = projectedScene.center;
		mainScene.intro();
		await this._navigation?.updateCameraPosition(
			mainScene.cameraPath?.getPoint(0),
			mainScene.center,
			Config.GSAP_ANIMATION_DURATION + 1
		);
	}

	public async construct() {
		this._world = this._experience.world;

		if (this._supportedPageKeys.length < 2)
			throw new Error("Unable to display the projected scene.", {
				cause: errors.WRONG_PARAM,
			});

		if (!this._camera?.cameras || this._camera?.cameras.length < 2)
			throw new Error("No enough camera found.", {
				cause: errors.WRONG_PARAM,
			});

		if (!this._world)
			throw new Error("World not initialized.", {
				cause: errors.WRONG_PARAM,
			});

		this._ui?.on(events.LOADED, this._onUiReady);
	}

	public destruct() {
		this.emit(events.DESTRUCTED);
		this.removeAllListeners();
	}

	public update(): void {
		this._currentScene?.update();
	}
}
