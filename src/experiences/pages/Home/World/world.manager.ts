import { CatmullRomCurve3, PerspectiveCamera, Raycaster, Vector3 } from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import GSAP, { Power0 } from "gsap";

// EXPERIENCES
import { HomeExperience } from "..";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "@/experiences/blueprints/ExperienceBased.blueprint";

// EVENTS
import { CHANGED, CONSTRUCTED } from "~/common/event.model";

// UTILS
import { lerpPosition } from "~/utils/three-utils";

// SHADERS
import camTransitionFrag from "./shaders/cameraTransition/fragment.glsl";
import camTransitionVert from "./shaders/cameraTransition/vertex.glsl";

export default class WorldManager extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _appResources = this._experience.app.resources;
	protected readonly _camera = this._experience.camera;
	protected readonly _world = this._experience.world;
	protected readonly _composer = this._experience.composer;
	protected readonly _renderer = this._experience.renderer;
	protected readonly _timeline = GSAP.timeline();

	public cameraTransitionShaderPass?: ShaderPass;
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
	// === ^

	public construct() {
		const currentCamera = this._camera?.cameras[0];
		const secondaryCamera = this._camera?.cameras[1];

		if (currentCamera instanceof PerspectiveCamera)
			this.cameraCurvePath.getPointAt(0, currentCamera.position);

		this._world?.scene1?.togglePcOpening()?.then(() => {
			if (
				this._world?.scene1?.modelScene &&
				this._world.scene1.pcScreen &&
				this._world.scene1.pcScreenWebglTexture &&
				secondaryCamera
			)
				this._renderer?.addPortalAssets(this._world.scene1 + "_pc_screen", {
					mesh: this._world.scene1.pcScreen,
					meshCamera: secondaryCamera,
					meshWebGLTexture: this._world.scene1.pcScreenWebglTexture,
				});
		});

		this._appCamera.instance?.position.copy(
			this._world?.scene1?.cameraPath.getPoint(0) ?? new Vector3()
		);

		this._camera?.setCameraLookAt(
			(this._world?.scene1?.modelScene?.position ?? new Vector3())
				.clone()
				.setY(2)
		);

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

		this.setScene();
		this._experience.navigation?.on(CHANGED, () => {
			this.setScene();
		});

		this.emit(CONSTRUCTED, this);
	}

	public destruct() {}

	public updateModelBubblesDomElements() {
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

	public setScene() {
		if (this._camera?.timeline.isActive()) this._camera.timeline.progress(1);
		if (this._timeline.isActive()) this._timeline.progress(1);

		const SCREEN_POSITION = (
			this._world?.scene1?.pcScreen?.localToWorld(new Vector3()) ??
			new Vector3()
		).clone();

		if (
			this._experience.navigation?.currentRoute === "index" &&
			this._camera?.currentCameraIndex !== 0
		) {
			this._camera?.switchCamera(0);

			this._camera?.setCameraLookAt(SCREEN_POSITION);
		}

		if (this._experience.navigation?.currentRoute !== "index") {
			if (this._camera?.currentCameraIndex !== 1) {
				this.cameraTransitionShaderPass = new ShaderPass({
					uniforms: {
						tDiffuse: { value: null },
						uStrength: { value: 0 },
						uDisplacementMap: {
							value: this._appResources.items["rocksAlphaMap"],
						},
					},
					vertexShader: camTransitionVert,
					fragmentShader: camTransitionFrag,
				});

				this._composer?.addPass(
					"cameraTransitionShaderPass",
					this.cameraTransitionShaderPass
				);

				this._camera
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
						if (!this.cameraTransitionShaderPass?.material.uniforms.uStrength)
							return;
						this._timeline.to(
							this.cameraTransitionShaderPass.material.uniforms.uStrength,
							{
								value: 0.175,
								duration: 0.3,
								ease: Power0.easeIn,
							}
						);
					}, "<87%")
					.then(() => {
						this._camera?.switchCamera(1);

						this._camera?.setCameraLookAt(
							(
								this._world?.scene2?.modelScene?.position ?? new Vector3()
							).clone()
						);

						if (!this.cameraTransitionShaderPass?.material.uniforms.uStrength)
							return;

						this._timeline
							.to(this.cameraTransitionShaderPass.material.uniforms.uStrength, {
								value: 0,
								duration: 0.3,
								ease: Power0.easeOut,
							})
							.then(() => {
								this.cameraTransitionShaderPass &&
									this._composer?.removePass("cameraTransitionShaderPass");
							});
					});
			}
		}
	}

	public update() {
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
