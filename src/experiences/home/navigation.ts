import { Spherical, Vector3 } from "three";
import normalizeWheel from "normalize-wheel";
import gsap from "gsap";

// EXPERIENCE
import { HomeExperience } from "./";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";

// MODELS
import type { NavigationView } from "~/common/experiences/navigation.model";

// STATIC
import { ANIMATION_ENDED, ANIMATION_STARTED } from "~/static/event.static";

// CONFIG
import { Config } from "~/config";

/**
 * @original-author {@link @brunosimon} / https://github.com/brunonsimon
 *
 * @source  https://github.com/brunosimon/my-room-in-3d/blob/main/src/Experience/Navigation.js
 */
export class Navigation extends ExperienceBasedBlueprint {
	protected _experience = new HomeExperience();

	private readonly _targetElement =
		this._experience.app.renderer.instance.domElement;
	private readonly _appCamera = this._experience.app.camera;
	private readonly _appSizes = this._experience.app.sizes;
	private readonly _camera = this._experience.camera;
	private readonly _time = this._experience.app.time;
	private readonly _config = {
		pixelRatio: 0,
		width: 0,
		height: 0,
		smallestSide: 0,
		largestSide: 0,
	};
	private readonly _timeline = gsap.timeline({
		onStart: () => {
			this._view.spherical?.limits &&
				(this._view.spherical.limits.enabled = false);
			this._view.target?.limits && (this._view.target.limits.enabled = false);
			this.emit(ANIMATION_STARTED);
		},
		onComplete: () => {
			setTimeout(() => {
				this._view.spherical?.limits &&
					(this._view.spherical.limits.enabled = true);
				this._view.target?.limits && (this._view.target.limits.enabled = true);
				this._timeline.clear();
				this.emit(ANIMATION_ENDED);
			}, 100);
		},
	});
	private readonly _viewLimits: {
		spherical: Exclude<NavigationView["spherical"], undefined>["limits"];
		target: Exclude<NavigationView["target"], undefined>["limits"];
	} = {
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
	} as const;

	private _view: NavigationView = {};

	private _setView() {
		this._view.enabled = true;

		this._view.center = new Vector3();

		this._view.spherical = {
			value: new Spherical(20, Math.PI * 0.5, 0),
			smoothed: new Spherical(20, Math.PI * 0.5, 0),
			smoothing: 0.005,
			limits: this._viewLimits.spherical,
		};

		this._view.target = {
			value: new Vector3(0, 2, 0),
			smoothed: new Vector3(0, 2, 0),
			smoothing: 0.005,
			limits: this._viewLimits.target,
		};

		this._view.drag = {
			delta: { x: 0, y: 0 },
			previous: { x: 0, y: 0 },
			sensitivity: 1,
			alternative: false,
		};

		this._view.zoom = { sensitivity: 0.01, delta: 0 };

		this._view.down = (_x, _y) => {
			if (!this._view.drag?.previous) return;

			this._view.drag.previous.x = _x;
			this._view.drag.previous.y = _y;
		};
		this._view.move = (_x, _y) => {
			if (
				!this._view.enabled ||
				!this._view?.drag?.delta ||
				!this._view.drag.previous
			)
				return;

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

		/**
		 * Mouse events
		 */
		this._view.onMouseDown = (_event) => {
			_event.preventDefault();

			if (
				!this._view.enabled ||
				!this._view.drag ||
				!this._view.down ||
				!this._view.onMouseUp ||
				!this._view.onMouseMove
			)
				return;

			this._view.drag.alternative =
				_event.button === 2 ||
				_event.button === 1 ||
				_event.ctrlKey ||
				_event.shiftKey;

			this._view?.down(_event.clientX, _event.clientY);

			window.addEventListener("mouseup", this._view.onMouseUp);
			window.addEventListener("mousemove", this._view.onMouseMove);
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

			window.removeEventListener("mouseup", this._view.onMouseUp);
			window.removeEventListener("mousemove", this._view.onMouseMove);
		};

		this._targetElement?.addEventListener("mousedown", this._view.onMouseDown);

		this._view.onTouchStart = (_event) => {
			_event.preventDefault();

			if (
				!this._view.drag ||
				!this._view.down ||
				!this._view.onTouchEnd ||
				!this._view.onTouchMove
			)
				return;

			this._view.drag.alternative = _event.touches.length > 1;

			this._view.down(_event.touches[0].clientX, _event.touches[0].clientY);

			window.addEventListener("touchend", this._view.onTouchEnd);
			window.addEventListener("touchmove", this._view.onTouchMove);
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

			window.removeEventListener("touchend", this._view.onTouchEnd);
			window.removeEventListener("touchmove", this._view.onTouchMove);
		};

		window.addEventListener("touchstart", this._view.onTouchStart);

		this._view.onContextMenu = (_event) => {
			_event.preventDefault();
		};

		this._targetElement?.addEventListener(
			"contextmenu",
			this._view.onContextMenu
		);

		this._view.onWheel = (_event) => {
			_event.preventDefault();

			if (!this._view.enabled || !this._view.zooming || !this._view.onWheel)
				return;

			const normalized = normalizeWheel(_event);
			this._view.zooming(normalized.pixelY);
		};

		window.addEventListener("mousewheel", this._view.onWheel, {
			passive: false,
		});
		window.addEventListener("wheel", this._view.onWheel, { passive: false });
	}

	private _setConfig() {
		this._config.pixelRatio = this._experience.app.sizes.pixelRatio;

		const boundingClient = this._targetElement.getBoundingClientRect();
		this._config.width = boundingClient.width;
		this._config.height = boundingClient.height || window.innerHeight;
		this._config.smallestSide = Math.min(
			this._config.width,
			this._config.height
		);
		this._config.largestSide = Math.max(
			this._config.width,
			this._config.height
		);
	}

	public get timeline() {
		return this._timeline;
	}

	public get view() {
		return this._view;
	}

	public construct() {
		this._setConfig();
		this._setView();

		this._appSizes.on("resize", () => this._setConfig());
	}

	public destruct() {}

	public disableFreeAzimuthRotation(limits?: { min: number; max: number }) {
		if (this._view.spherical?.limits) {
			this._view.spherical.limits.enabledTheta = true;
			limits && (this._view.spherical.limits.theta = limits);
		}
	}

	public disableFreePolarRotation(limits?: { min: number; max: number }) {
		if (this._view.spherical?.limits) {
			this._view.spherical.limits.enabledPhi = true;
			limits && (this._view.spherical.limits.phi = limits);
		}
	}

	public enableFreeAzimuthRotation() {
		this._view.spherical?.limits &&
			(this._view.spherical.limits.enabledTheta = false);
	}

	public enableFreePolarRotation() {
		this._view.spherical?.limits &&
			(this._view.spherical.limits.enabledPhi = false);
	}

	public setViewCenter(v3 = new Vector3()) {
		this._view.center = v3;
	}

	/**
	 * Set the camera look at position.
	 * @param v3 The {@link Vector3} position where the the camera will look at.
	 */
	public setTargetPosition(v3 = new Vector3()) {
		const V3 = v3.clone();
		this._view.target?.value?.copy(V3);
		this._view.target?.smoothed?.copy(V3);

		return this._view.target;
	}

	/**
	 * Set the camera look at position.
	 * @param v3 The {@link Vector3} position where the the camera will look at.
	 */
	public setPositionInSphere(v3 = new Vector3()) {
		if (
			!this._view.spherical?.smoothed ||
			!this._view.spherical.value ||
			!this._view.target?.smoothed
		)
			return;
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
	 * update the lookAt position using the passed lookAt position.
	 *
	 * @param toPosition The new camera position.
	 * @param lookAt Where the camera will look at.
	 */
	public updateCameraPosition(
		toPosition = new Vector3(),
		lookAt = new Vector3(),
		onStart: gsap.Callback = () => {},
		onUpdate: gsap.Callback = () => {},
		onComplete: gsap.Callback = () => {}
	) {
		if (!this._appCamera.instance) return this._timeline;

		const lookAtA = this._view.target?.value?.clone();
		const lookAtB = lookAt.clone();
		const currentCamPosition = this._appCamera.instance?.position.clone();

		if (!lookAtA || !lookAtB || !currentCamPosition) return this._timeline;

		return this._timeline.to(currentCamPosition, {
			x: toPosition.x,
			y: toPosition.y,
			z: toPosition.z,
			duration: Config.GSAP_ANIMATION_DURATION,
			ease: Config.GSAP_ANIMATION_EASE,
			onStart: () => {
				gsap.to(lookAtA, {
					x: lookAtB.x,
					y: lookAtB.y,
					z: lookAtB.z,
					duration: Config.GSAP_ANIMATION_DURATION * 0.55,
					ease: Config.GSAP_ANIMATION_EASE,
					onUpdate: () => {
						this?.setTargetPosition(lookAtA);
						onUpdate();
					},
				});

				onStart();
			},
			onUpdate: () => {
				if (
					!this._view.spherical?.value ||
					!this._view.spherical.smoothed ||
					!this._view.spherical.smoothing
				)
					return;
				this.setPositionInSphere(currentCamPosition);
			},
			onComplete,
		});
	}

	/**
	 * Set navigation limits. use default config limits if not parameter was passed.
	 *
	 * @param _ Limits `spherical` and `target`
	 */
	public setLimits(_?: {
		spherical?: Exclude<NavigationView["spherical"], undefined>["limits"];
		target?: Exclude<NavigationView["target"], undefined>["limits"];
	}) {
		if (!_) {
			this._view.spherical &&
				(this._view.spherical.limits = this._viewLimits.spherical);
			this._view.target && (this._view.target.limits = this._viewLimits.target);

			return;
		}

		if (_.spherical)
			this._view.spherical && (this._view.spherical.limits = _.spherical);
		if (_.target) this._view.target && (this._view.target.limits = _.target);
	}

	public update() {
		if (
			!this._view.enabled ||
			!this._view.spherical ||
			!this._view.zoom ||
			!this._view.drag ||
			!this._view.target ||
			!this._view.center ||
			!this._appCamera.instance
		)
			return;

		// Zoom
		this._view.spherical.value.radius +=
			Number(this._view.zoom.delta) * Number(this._view.zoom.sensitivity);

		// Drag
		if (this._view.drag.alternative) {
			const up = new Vector3(0, 1, 0);
			const right = new Vector3(-1, 0, 0);

			up.applyQuaternion(this._appCamera.instance.quaternion);
			right.applyQuaternion(this._appCamera.instance.quaternion);

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

		if (!this.timeline.isActive()) {
			// Apply limits
			if (this._view.spherical.limits.enabled)
				this._view.spherical.value.radius = Math.min(
					Math.max(
						this._view.spherical.value.radius,
						this._view.spherical.limits.radius.min
					),
					this._view.spherical.limits.radius.max
				);

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
			this._time.delta;
		this._view.spherical.smoothed.phi +=
			(this._view.spherical.value.phi - this._view.spherical.smoothed.phi) *
			this._view.spherical.smoothing *
			this._time.delta;
		this._view.spherical.smoothed.theta +=
			(this._view.spherical.value.theta - this._view.spherical.smoothed.theta) *
			this._view.spherical.smoothing *
			this._time.delta;

		this._view.target.smoothed.x +=
			(this._view.target.value.x - this._view.target.smoothed.x) *
			this._view.target.smoothing *
			this._time.delta;
		this._view.target.smoothed.y +=
			(this._view.target.value.y - this._view.target.smoothed.y) *
			this._view.target.smoothing *
			this._time.delta;
		this._view.target.smoothed.z +=
			(this._view.target.value.z - this._view.target.smoothed.z) *
			this._view.target.smoothing *
			this._time.delta;

		const viewPosition = new Vector3();
		viewPosition.setFromSpherical(this._view.spherical.smoothed);
		viewPosition.add(this._view.target.smoothed);

		this._camera?.setCameraPosition(viewPosition);
		this._camera?.setCameraLookAt(this._view.target.smoothed);
	}
}
