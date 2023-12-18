import GSAP from "gsap";
import { CatmullRomCurve3, PerspectiveCamera, Raycaster, Vector3 } from "three";

// EXPERIENCE
import Experience from "..";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "@/experiences/blueprints/ExperienceBased.blueprint";
import type { SceneBlueprint } from "@/experiences/blueprints/Scene.blueprint";

// EVENTS
import { CONSTRUCTED } from "@/experiences/common/Event.model";

export default class WorldManager extends ExperienceBasedBlueprint {
	protected readonly _experience = new Experience();
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _camera = this._experience.camera;
	protected readonly _world = this._experience.world;
	protected readonly _renderer = this._experience.renderer;

	public currentSceneIndex = 0;
	public availableScenes: SceneBlueprint[] = [];

	// TODO: Reorder properties
	public rayCaster = new Raycaster();
	public normalizedCursorPosition = { x: 0, y: 0 };
	public initialLookAtPosition = new Vector3(0, 2, 0);
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
	 * Where the camera will look at.
	 */
	public cameraLookAtPosition = new Vector3(0, 2, 0);
	/**
	 * Enable auto curve path animation
	 */
	public autoCameraAnimation = false;
	/**
	 * GSAP animation watcher. If GSAP is currently animating
	 */
	public isGsapAnimating = false;
	/**
	 * Curve path backward animation
	 */
	public backwardCurveAnimation = false;
	public focusPointPositionIndex: number = 0;
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

	constructor() {
		super();

		this._world?.scene1 && this.availableScenes.push(this._world?.scene1);
		this._world?.scene2 && this.availableScenes.push(this._world?.scene2);
		// this._world?.scene3 && this.availableScenes.push(this._world?.scene3);

		// No more camera movements triggered by the mouse | Using Orbit control
		// this.setWheelEventListener();
		// this.setMouseMoveEventListener();
		// this.setMouseDownEventListener();
		// this.setMouseUpEventListener();
	}

	construct() {
		const currentCamera = this._camera?.cameras[0];
		const secondaryCamera = this._camera?.cameras[1];

		if (
			this._world?.scene1?.modelScene &&
			this._world?.scene1.pcScreen &&
			this._world?.scene1.pcScreenWebglTexture &&
			secondaryCamera
		) {
			if (currentCamera instanceof PerspectiveCamera)
				this.cameraCurvePath.getPointAt(0, currentCamera.position);

			this._renderer?.addPortalAssets(this._world?.scene1 + "_pc_screen", {
				mesh: this._world?.scene1.pcScreen,
				meshCamera: secondaryCamera,
				meshWebGLTexture: this._world?.scene1.pcScreenWebglTexture,
			});

			this._world.group?.add(this._world?.scene1.modelScene);
		}

		if (this._world?.scene2?.modelScene) {
			this._world?.scene2.modelScene.position.setX(40);

			this._world.group?.add(this._world?.scene2.modelScene);
		}

		if (this._world?.sceneBackground?.modelScene) {
			const scene_2_background =
				this._world?.sceneBackground.modelScene.clone();

			scene_2_background.position.copy(
				this._world?.scene2?.modelScene?.position ?? new Vector3()
			);
			this._world.group?.add(
				this._world?.sceneBackground.modelScene,
				scene_2_background
			);
		}

		secondaryCamera?.position.copy(
			this._world?.scene2?.modelScene?.position ?? new Vector3()
		);
		secondaryCamera?.position.set(
			this._world?.scene2?.modelScene?.position.x ?? 0,
			8,
			20
		);
		secondaryCamera?.lookAt(
			this._world?.scene2?.modelScene?.position ?? new Vector3()
		);

		this.emit(CONSTRUCTED, this);
	}

	destruct() {}

	updateModelBubblesDomElements() {
		const _CAMERA = this._experience.app?.camera.instance;
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

	setWheelEventListener() {
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

	setMouseMoveEventListener() {
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

	setMouseDownEventListener() {
		window.addEventListener("mousedown", () => {
			this.mouseDowned = true;
			if (this.focusedPosition && !this.mouseOverBubble)
				this._experience.camera?.cameraZoomIn();
		});
	}

	setMouseUpEventListener() {
		window.addEventListener("mouseup", () => {
			this.mouseDowned = false;
			if (this.focusedPosition && !this.mouseOverBubble)
				this._experience.camera?.cameraZoomOut();
		});
	}

	getFocusedLookAtPosition(position = this.focusedPosition) {
		if (!(position && this._experience.app?.camera.instance))
			return new Vector3();

		return new Vector3(
			position.x -
				this.focusedRadius *
					Math.cos(
						this.focusedAngleX -
							this._experience.app?.camera.instance.rotation.y +
							Math.PI * 0.5
					),
			position.y - this.focusedRadius * Math.sin(this.focusedAngleY),
			position.z -
				this.focusedRadius *
					Math.sin(
						this.focusedAngleX -
							this._experience.app?.camera.instance.rotation.y +
							Math.PI * 0.5
					)
		);
	}

	getLerpPosition(vec3_start: Vector3, vec3_end: Vector3, progress = 0) {
		const _VEC3_START = vec3_start.clone();
		const _VEC3_END = vec3_end.clone();

		return _VEC3_START.lerpVectors(
			_VEC3_START,
			_VEC3_END,
			GSAP.utils.clamp(0, 1, progress)
		);
	}

	getGsapDefaultProps() {
		return {
			onStart: () => {
				this.isGsapAnimating = true;
			},
			onComplete: () => {
				this.isGsapAnimating = false;
			},
		};
	}

	/**
	 * Move the camera position with transition from
	 * the origin position to the passed position and enable the camera movement
	 *
	 * @param cameraToPosition The camera position
	 * @param whereToLookAt The camera position where to look at
	 * @param fromWhereToLooAt From where the camera will start looking at
	 */
	focusPoint(
		cameraToPosition = new Vector3(),
		whereToLookAt = new Vector3(),
		fromWhereToLooAt = this.initialLookAtPosition
	) {
		if (this._experience.app?.camera.instance) {
			let _lerpProgress = 0;

			this.focusedPosition = new Vector3().copy(whereToLookAt);

			// GSAP.to(this._experience.app?.camera.instance.position, {
			// 	...this.getGsapDefaultProps(),
			// 	x: cameraToPosition.x,
			// 	y: cameraToPosition.y,
			// 	z: cameraToPosition.z,
			// 	duration: 1.5,
			// 	onStart: () => {
			// 		this.getGsapDefaultProps().onStart();
			// 		this.autoCameraAnimation = false;
			// 	},
			// 	onUpdate: () => {
			// 		const _LERP_POSITION = this.getLerpPosition(
			// 			fromWhereToLooAt,
			// 			this.getFocusedLookAtPosition(),
			// 			_lerpProgress
			// 		);
			// 		_lerpProgress += 0.015;

			// 		this.cameraLookAtPosition.copy(_LERP_POSITION);
			// 		this.setCameraLookAt(_LERP_POSITION);
			// 	},
			// 	onComplete: () => {
			// 		this.getGsapDefaultProps().onComplete();
			// 	},
			// });
		}
	}

	public nextScene() {
		const nextSceneIndex =
			this.currentSceneIndex + 1 > this.availableScenes.length - 1
				? 0
				: this.currentSceneIndex + 1;

		this._camera?.switchCamera(nextSceneIndex > 0 ? 1 : 0);
		this._camera?.setCameraLookAt(
			nextSceneIndex > 0
				? this.availableScenes[nextSceneIndex]?.modelScene?.position.clone() ??
						new Vector3()
				: (this._world?.scene1?.pcScreen?.position ?? new Vector3()).clone()
		);
		this.currentSceneIndex = nextSceneIndex;
	}

	public prevScene() {}

	public setScene(sceneIndex: number) {}

	update() {
		if (this.autoCameraAnimation && !this.isGsapAnimating) {
			this.cameraCurvePathProgress.current = GSAP.utils.interpolate(
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
			this.cameraCurvePathProgress.target = GSAP.utils.clamp(
				0,
				1,
				this.cameraCurvePathProgress.target
			);
			this.cameraCurvePathProgress.current = GSAP.utils.clamp(
				0,
				1,
				this.cameraCurvePathProgress.current
			);
			this.cameraCurvePath.getPointAt(
				this.cameraCurvePathProgress.current,
				this.cameraCurvePosition
			);
			this._experience.app?.camera.instance?.position.copy(
				this.cameraCurvePosition
			);
		}

		if (
			this._experience.app?.camera.instance &&
			!this.autoCameraAnimation &&
			this.focusedPosition &&
			!this.isGsapAnimating
		) {
			this.cameraLookAtPosition.copy(this.getFocusedLookAtPosition());
		}

		this.updateModelBubblesDomElements();

		this.focusedAngleX +=
			(this.normalizedCursorPosition.x * Math.PI - this.focusedAngleX) * 0.1;
		this.focusedAngleY +=
			(this.normalizedCursorPosition.y * Math.PI - this.focusedAngleY) * 0.1;

		// if (this.autoCameraAnimation || !this.isGsapAnimating)
		// 	this._experience.camera?.setCameraLookAt(this.cameraLookAtPosition);
	}
}
