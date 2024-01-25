import { Spherical, Vector3 } from "three";
import normalizeWheel from "normalize-wheel";
import gsap from "gsap";

// EXPERIENCE
import { HomeExperience } from "./";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";

// MODELS
import type {
	NavigationView,
	ViewLimits,
} from "~/common/experiences/navigation.model";

// STATIC
import { ANIMATION_ENDED, ANIMATION_STARTED } from "~/static/event.static";

// CONFIG
import { Config } from "~/config";
import { errors } from "~/static";

/**
 * @original-author {@link @brunosimon} / https://github.com/brunonsimon
 *
 * @source  https://github.com/brunosimon/my-room-in-3d/blob/main/src/Experience/Navigation.js
 */
export class Navigation extends ExperienceBasedBlueprint {
	protected _experience = new HomeExperience();

	private readonly _targetElement =
		this._experience.app.renderer.instance.domElement;
	private readonly _appSizes = this._experience.app.sizes;
	private readonly _appTime = this._experience.app.time;
	private readonly _ui = this._experience.ui;
	private readonly _camera = this._experience.camera;
	private readonly _config = {
		smallestSide: 0,
		largestSide: 0,
	};
	private readonly _viewLimits: ViewLimits = {
		spherical: {
			radius: { min: 0, max: 0 },
			phi: { min: 0, max: 0 },
			theta: { min: 0, max: 0 },
			enabled: false,
			enabledPhi: false,
			enabledTheta: false,
		},
		target: {
			x: { min: 0, max: 0 },
			y: { min: 0, max: 0 },
			z: { min: 0, max: 0 },
			enabled: false,
		},
	} as const;
	private readonly _view: NavigationView = {
		enabled: true,
		controls: true,
		limits: true,
		center: new Vector3(),
		spherical: {
			value: new Spherical(),
			smoothed: new Spherical(),
			smoothing: 0.005,
			limits: this._viewLimits.spherical,
		},
		target: {
			value: new Vector3(0, 2, 0),
			smoothed: new Vector3(0, 2, 0),
			smoothing: 0.005,
			limits: this._viewLimits.target,
		},
		drag: {
			delta: { x: 0, y: 0 },
			previous: { x: 0, y: 0 },
			sensitivity: 1,
			alternative: false,
		},
		zoom: { sensitivity: 0.01, delta: 0 },
	};
	private readonly _timelinePrevStates = {
		limits: this._view.limits,
		controls: this._view.controls,
	};
	private readonly _timeline = gsap.timeline({
		onStart: () => {
			this._timelinePrevStates.limits = this._view.limits;
			this._timelinePrevStates.controls = this._view.controls;

			this._view.limits = false;
			this._view.controls = false;

			this.emit(ANIMATION_STARTED);
		},
		onComplete: (val: typeof this._timelinePrevStates) => {
			this._view.limits = val.limits;
			this._view.controls = val.controls;

			this._timeline.clear();
			this.emit(ANIMATION_ENDED);
		},
		onStartParams: [this._timelinePrevStates],
		onCompleteParams: [this._timelinePrevStates],
	});

	public get timeline() {
		return this._timeline;
	}

	public get view() {
		return this._view;
	}

	private _setConfig() {
		const boundingClient = this._targetElement.getBoundingClientRect();
		const width = boundingClient.width;
		const height = Number(boundingClient.height || this._appSizes?.width);

		this._config.smallestSide = Math.min(width, height);
		this._config.largestSide = Math.max(width, height);
	}

	public construct() {
		if (!this._camera)
			throw new Error("Camera class not initialized", {
				cause: errors.WRONG_PARAM,
			});

		this._setConfig();

		// Init view
		~(() => {
			this._view.spherical.value = new Spherical().setFromVector3(
				this._camera?.instance.position ?? new Vector3()
			);
			this._view.spherical.smoothed = new Spherical().setFromVector3(
				this._camera?.instance.position ?? new Vector3()
			);
		})();

		// Init mouse events
		~(() => {
			this._view.down = (_x, _y) => {
				if (!this._view.drag?.previous) return;

				this._view.drag.previous.x = _x;
				this._view.drag.previous.y = _y;
			};
			this._view.move = (_x, _y) => {
				if (!this._view.controls || !this._view.enabled) return;

				this._view.drag.delta.x += _x - this._view.drag.previous.x;
				this._view.drag.delta.y += _y - this._view.drag.previous.y;

				this._view.drag.previous.x = _x;
				this._view.drag.previous.y = _y;
			};
			this._view.up = () => {};
			this._view.zooming = (_delta) => {
				if (typeof this._view.zoom?.delta !== "number") return;

				this._view.zoom.delta += _delta;
			};

			this._view.onMouseDown = (_event) => {
				_event.preventDefault();

				if (
					!this._view.controls ||
					!this._view.enabled ||
					!this._view.drag ||
					!this._view.down ||
					!this._view.onMouseUp ||
					!this._view.onMouseMove ||
					this._experience.cameraAnimation?.enabled
				)
					return;

				this._view.drag.alternative =
					_event.button === 2 ||
					_event.button === 1 ||
					_event.ctrlKey ||
					_event.shiftKey;

				if (this._view.drag.alternative) {
					const viewPosition = new Vector3();
					viewPosition.setFromSpherical(this._view.spherical.smoothed);
					viewPosition.add(this._view.target.smoothed);
				}

				this._view?.down(_event.clientX, _event.clientY);

				this._ui?.targetElement?.addEventListener(
					"mouseup",
					this._view.onMouseUp
				);
				this._ui?.targetElement?.addEventListener(
					"mousemove",
					this._view.onMouseMove
				);
			};

			this._view.onMouseMove = (_event) => {
				_event.preventDefault();
				if (!this._view.move) return;

				this._view.move(_event.clientX, _event.clientY);
			};

			this._view.onMouseUp = (_event) => {
				_event.preventDefault();

				if (!this._view?.up || !this._view.onMouseUp || !this._view.onMouseMove)
					return;

				this._view.up();

				this._ui?.targetElement?.removeEventListener(
					"mouseup",
					this._view.onMouseUp
				);
				this._ui?.targetElement?.removeEventListener(
					"mousemove",
					this._view.onMouseMove
				);
			};

			this._view.onTouchStart = (_event) => {
				_event.preventDefault();

				if (
					!this._view.down ||
					!this._view.onTouchEnd ||
					!this._view.onTouchMove ||
					this._experience.cameraAnimation?.enabled
				)
					return;

				this._view.drag.alternative = _event.touches.length > 1;
				this._view.down(_event.touches[0].clientX, _event.touches[0].clientY);

				this._ui?.targetElement?.addEventListener(
					"touchend",
					this._view.onTouchEnd
				);
				this._ui?.targetElement?.addEventListener(
					"touchmove",
					this._view.onTouchMove,
					{ passive: false }
				);
			};

			this._view.onTouchMove = (_event) => {
				_event.preventDefault();

				if (!this._view.move) return;

				this._view.move(_event.touches[0].clientX, _event.touches[0].clientY);
			};
			this._view.onTouchEnd = (_event) => {
				_event.preventDefault();

				if (!this._view.up || !this._view.onTouchEnd || !this._view.onTouchMove)
					return;

				this._view.up();

				this._ui?.targetElement?.removeEventListener(
					"touchend",
					this._view.onTouchEnd
				);
				this._ui?.targetElement?.removeEventListener(
					"touchmove",
					this._view.onTouchMove
				);
			};

			this._view.onContextMenu = (_event) => {
				_event.preventDefault();
			};

			this._view.onWheel = (_event) => {
				_event.preventDefault();

				if (
					!this._view.controls ||
					!this._view.enabled ||
					!this._view.zooming ||
					!this._view.onWheel
				)
					return;

				const normalized = normalizeWheel(_event);
				this._view.zooming(normalized.pixelY);
			};

			this._view.onLeave = (_event) => {
				if (this._view.onMouseMove)
					this._ui?.targetElement?.removeEventListener(
						"mousemove",
						this._view.onMouseMove
					);
			};

			this._ui?.targetElement?.addEventListener(
				"mousedown",
				this._view.onMouseDown
			);
			this._ui?.targetElement?.addEventListener(
				"touchstart",
				this._view.onTouchStart,
				{ passive: false }
			);
			this._ui?.targetElement?.addEventListener(
				"contextmenu",
				this._view.onContextMenu
			);
			this._ui?.targetElement?.addEventListener(
				"mousewheel",
				this._view.onWheel,
				{ passive: false }
			);
			this._ui?.targetElement?.addEventListener("wheel", this._view.onWheel, {
				passive: false,
			});
			this._ui?.targetElement?.addEventListener(
				"mouseleave",
				this._view.onLeave
			);
			this._ui?.targetElement?.addEventListener(
				"mouseenter",
				this._view.onLeave
			);
		})();

		this._appSizes.on("resize", () => this._setConfig());
	}

	public destruct() {
		this._view.onMouseDown &&
			this._ui?.targetElement?.removeEventListener(
				"mousedown",
				this._view.onMouseDown
			);
		this._view.onMouseUp &&
			this._ui?.targetElement?.removeEventListener(
				"mouseup",
				this._view.onMouseUp
			);
		this._view.onMouseMove &&
			this._ui?.targetElement?.removeEventListener(
				"mousemove",
				this._view.onMouseMove
			);
		this._view.onTouchEnd &&
			this._ui?.targetElement?.removeEventListener(
				"touchend",
				this._view.onTouchEnd
			);
		this._view.onTouchMove &&
			this._ui?.targetElement?.removeEventListener(
				"touchmove",
				this._view.onTouchMove
			);
		this._view.onTouchStart &&
			this._ui?.targetElement?.removeEventListener(
				"touchstart",
				this._view.onTouchStart
			);
		this._view.onContextMenu &&
			this._ui?.targetElement?.removeEventListener(
				"contextmenu",
				this._view.onContextMenu
			);
		this._view.onWheel &&
			this._ui?.targetElement?.removeEventListener(
				"mousewheel",
				this._view.onWheel
			);
		this._view.onWheel &&
			this._ui?.targetElement?.removeEventListener("wheel", this._view.onWheel);
		this._view.onLeave &&
			this._ui?.targetElement?.removeEventListener(
				"mouseleave",
				this._view.onLeave
			);
		this._view.onLeave &&
			this._ui?.targetElement?.removeEventListener(
				"mouseenter",
				this._view.onLeave
			);

		this._appSizes.off("resize", () => this._setConfig());
	}

	/**
	 * Disable horizontal free rotation.
	 *
	 * @param limits Set the min & max limits (Optional)
	 */
	public disableAzimuthRotation(limits?: { min: number; max: number }) {
		this._view.spherical.limits.enabledTheta = true;
		if (limits) this._view.spherical.limits.theta = limits;
	}

	public disablePolarRotation(limits?: { min: number; max: number }) {
		this._view.spherical.limits.enabledPhi = true;
		if (limits) this._view.spherical.limits.phi = limits;
	}

	public enableAzimuthRotation() {
		if (this._view.spherical?.limits)
			this._view.spherical.limits.enabledTheta = false;
	}

	public enablePolarRotation() {
		if (this._view.spherical?.limits)
			this._view.spherical.limits.enabledPhi = false;
	}

	public setViewCenter(v3 = new Vector3()) {
		this._view.center = v3;
	}

	/**
	 * Set the camera look at position.
	 * @param v3 The {@link Vector3} position where the the camera will look at.
	 */
	public setTargetPosition(v3 = new Vector3()) {
		this._view.target.value = v3.clone();
		this._view.target.smoothed = v3.clone();

		return this._view.target;
	}

	/**
	 * Set the camera look at position.
	 * @param v3 The {@link Vector3} position where the the camera will look at.
	 */
	public setPositionInSphere(v3 = new Vector3()) {
		const SAFE_V3 = v3
			.clone()
			.add(
				new Vector3(
					-this._view.target.smoothed.x,
					-this._view.target.smoothed.y,
					-this._view.target.smoothed.z
				)
			);

		this._view.spherical?.smoothed?.setFromVector3(SAFE_V3);
		this._view.spherical?.value?.setFromVector3(SAFE_V3);

		return this._view.spherical;
	}

	/**
	 * Move the camera position with transition from
	 * the origin position to the passed position and,
	 * update the lookAt position using the passed target position.
	 *
	 * @param toPosition The new camera position.
	 * @param target Where the camera will look at.
	 * @param duration Animation duration.
	 */
	public updateCameraPosition(
		toPosition = new Vector3(),
		lookAt = new Vector3(),
		// TODO: Change it to TimelineVars instead.
		duration = Config.GSAP_ANIMATION_DURATION
	) {
		if (!this._camera) return this._timeline;

		const targetA = this._view.target?.value?.clone();
		const targetB = lookAt.clone();
		const currentCamPosition = this._camera.instance.position.clone();

		if (!targetA || !targetB || !currentCamPosition) return this._timeline;
		if (this._timeline.isActive()) this._timeline.progress(1);

		return this._timeline
			.to(targetA, {
				x: targetB.x,
				y: targetB.y,
				z: targetB.z,
				duration: duration * 0.55,
				ease: Config.GSAP_ANIMATION_EASE,
				onUpdate: () => {
					this.setTargetPosition(targetA);
				},
				onComplete: () => {
					this.setTargetPosition(targetB);
				},
			})
			.add(
				gsap.to(currentCamPosition, {
					x: toPosition.x,
					y: toPosition.y,
					z: toPosition.z,
					duration,
					ease: Config.GSAP_ANIMATION_EASE,
					onUpdate: () => {
						this.setPositionInSphere(currentCamPosition);
					},
					onComplete: () => {
						this.setPositionInSphere(currentCamPosition);
						this.setTargetPosition(targetB);
					},
				}),
				"<"
			);
	}

	/**
	 * Set navigation limits. use default config limits if not parameter was passed.
	 *
	 * @param limits Limits `spherical` and `target` (Optional)
	 */
	public setLimits(limits?: {
		spherical?: Exclude<NavigationView["spherical"], undefined>["limits"];
		target?: Exclude<NavigationView["target"], undefined>["limits"];
	}) {
		if (!limits) {
			if (this._view.spherical)
				this._view.spherical.limits = this._viewLimits.spherical;
			if (this._view.target) this._view.target.limits = this._viewLimits.target;

			return;
		}

		if (limits.spherical)
			if (this._view.spherical) this._view.spherical.limits = limits.spherical;
		if (limits.target) this._view.target.limits = limits.target;
	}

	public update() {
		if (
			!this._view.enabled ||
			!this._camera?.instance ||
			this._experience.interactions?.focusedObject
		)
			return;

		// Zoom
		this._view.spherical.value.radius +=
			Number(this._view.zoom.delta) * Number(this._view.zoom.sensitivity);

		// Drag
		if (this._view.drag.alternative) {
			const up = new Vector3(0, 1, 0);
			const right = new Vector3(-1, 0, 0);

			up.applyQuaternion(this._camera.instance.quaternion);
			right.applyQuaternion(this._camera.instance.quaternion);

			up.multiplyScalar(Number(this._view.drag.delta?.y) * 0.01);
			right.multiplyScalar(Number(this._view.drag.delta?.x) * 0.01);

			this._view.target.value?.add(up);
			this._view.target.value?.add(right);
		} else {
			this._view.spherical.value.theta -=
				(this._view.drag.delta.x * this._view.drag.sensitivity) /
				this._config.smallestSide;
			this._view.spherical.value.phi -=
				(this._view.drag.delta.y * this._view.drag.sensitivity) /
				this._config.smallestSide;
		}

		if (!this._timeline.isActive() && this._view.limits) {
			// Apply limits
			if (this._view.spherical.limits.enabled) {
				this._view.spherical.value.radius = Math.min(
					Math.max(
						this._view.spherical.value.radius,
						this._view.spherical.limits.radius.min
					),
					this._view.spherical.limits.radius.max
				);
			}

			if (this._view.target.limits.enabled) {
				this._view.target.value.x = Math.min(
					Math.max(
						this._view.target.value.x,
						this._view.target.limits.x.min + this._view.center.x
					),
					this._view.target.limits.x.max + this._view.center.x
				);

				this._view.target.value.y = Math.min(
					Math.max(
						this._view.target.value.y,
						this._view.target.limits.y.min + this._view.center.y
					),
					this._view.target.limits.y.max + this._view.center.y
				);

				this._view.target.value.z = Math.min(
					Math.max(
						this._view.target.value.z,
						this._view.target.limits.z.min + this._view.center.z
					),
					this._view.target.limits.z.max + this._view.center.z
				);
			}

			if (this._view.spherical.limits.enabled) {
				if (this._view.spherical.limits.enabledPhi)
					this._view.spherical.value.phi = Math.min(
						Math.max(
							this._view.spherical.value.phi,
							this._view.spherical.limits.phi.min
						),
						this._view.spherical.limits.phi.max
					);

				if (this._view.spherical.limits.enabledTheta)
					this._view.spherical.value.theta = Math.min(
						Math.max(
							this._view.spherical.value.theta,
							this._view.spherical.limits.theta.min
						),
						this._view.spherical.limits.theta.max
					);
			}
		}

		this._view.drag.delta.x = 0;
		this._view.drag.delta.y = 0;
		this._view.zoom.delta = 0;

		// Smoothing
		this._view.spherical.smoothed.radius +=
			(this._view.spherical.value.radius -
				this._view.spherical.smoothed.radius) *
			this._view.spherical.smoothing *
			this._appTime.delta;
		this._view.spherical.smoothed.phi +=
			(this._view.spherical.value.phi - this._view.spherical.smoothed.phi) *
			this._view.spherical.smoothing *
			this._appTime.delta;
		this._view.spherical.smoothed.theta +=
			(this._view.spherical.value.theta - this._view.spherical.smoothed.theta) *
			this._view.spherical.smoothing *
			this._appTime.delta;

		this._view.target.smoothed.x +=
			(this._view.target.value.x - this._view.target.smoothed.x) *
			this._view.target.smoothing *
			this._appTime.delta;
		this._view.target.smoothed.y +=
			(this._view.target.value.y - this._view.target.smoothed.y) *
			this._view.target.smoothing *
			this._appTime.delta;
		this._view.target.smoothed.z +=
			(this._view.target.value.z - this._view.target.smoothed.z) *
			this._view.target.smoothing *
			this._appTime.delta;

		const viewPosition = new Vector3();
		viewPosition.setFromSpherical(this._view.spherical.smoothed);
		viewPosition.add(this._view.target.smoothed);

		this._camera?.setCameraPosition(viewPosition);
		this._camera?.setCameraLookAt(this._view.target.smoothed);
	}
}
