import * as THREE from "three";
import normalizeWheel from "normalize-wheel";

// EXPERIENCE
import { HomeExperience } from "./";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/experiences/blueprints/experience-based.blueprint";

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
	private readonly _config: { [name: string]: any } = {};
	private readonly _time = this._experience.app.time;
	private _view: {
		spherical?: { [name: string]: any };
		target?: { [name: string]: any };
		drag?: { [name: string]: any };
		zoom?: { [name: string]: any };
		down?: (x: number, y: number) => unknown;
		move?: (x: number, y: number) => unknown;
		up?: () => unknown;
		zoomIn?: (delta: number) => unknown;
		onMouseDown?: (event: MouseEvent) => unknown;
		onMouseUp?: (this: Window, ev: MouseEvent) => unknown;
		onMouseMove?: (this: Window, ev: MouseEvent) => unknown;
		onTouchStart?: (event: TouchEvent) => unknown;
		onTouchEnd?: (event: TouchEvent) => unknown;
		onTouchMove?: (event: TouchEvent) => unknown;
		onContextMenu?: (event: MouseEvent) => unknown;
		onWheel?: (event: Event) => unknown;
	} = {};

	private _setView() {
		this._view.spherical = {};
		this._view.spherical.value = new THREE.Spherical(
			30,
			Math.PI * 0.35,
			-Math.PI * 0.25
		);
		// this._view.spherical.value.radius = 5
		this._view.spherical.smoothed = this._view.spherical.value.clone();
		this._view.spherical.smoothing = 0.005;
		this._view.spherical.limits = {};
		this._view.spherical.limits.radius = { min: 10, max: 50 };
		this._view.spherical.limits.phi = { min: 0.01, max: Math.PI * 0.5 };
		this._view.spherical.limits.theta = { min: -Math.PI * 0.5, max: 0 };

		this._view.target = {};
		this._view.target.value = new THREE.Vector3(0, 2, 0);
		// this._view.target.value.set(0, 3, -3)
		this._view.target.smoothed = this._view.target.value.clone();
		this._view.target.smoothing = 0.005;
		this._view.target.limits = {};
		this._view.target.limits.x = { min: -4, max: 4 };
		this._view.target.limits.y = { min: 1, max: 6 };
		this._view.target.limits.z = { min: -4, max: 4 };

		this._view.drag = {};
		this._view.drag.delta = {};
		this._view.drag.delta.x = 0;
		this._view.drag.delta.y = 0;
		this._view.drag.previous = {};
		this._view.drag.previous.x = 0;
		this._view.drag.previous.y = 0;
		this._view.drag.sensitivity = 1;
		this._view.drag.alternative = false;

		this._view.zoom = {};
		this._view.zoom.sensitivity = 0.01;
		this._view.zoom.delta = 0;

		/**
		 * Methods
		 */
		this._view.down = (_x, _y) => {
			if (!this._view?.drag) return;

			this._view.drag.previous.x = _x;
			this._view.drag.previous.y = _y;
		};

		this._view.move = (_x, _y) => {
			if (!this._view?.drag) return;

			this._view.drag.delta.x += _x - this._view.drag.previous.x;
			this._view.drag.delta.y += _y - this._view.drag.previous.y;

			this._view.drag.previous.x = _x;
			this._view.drag.previous.y = _y;
		};

		this._view.up = () => {};

		this._view.zoomIn = (_delta) => {
			if (!this._view.zoom) return;

			this._view.zoom.delta += _delta;
		};

		/**
		 * Mouse events
		 */
		this._view.onMouseDown = (_event) => {
			_event.preventDefault();

			if (
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

		/**
		 * Touch events
		 */
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

		/**
		 * Context menu
		 */
		this._view.onContextMenu = (_event) => {
			_event.preventDefault();
		};

		window.addEventListener("contextmenu", this._view.onContextMenu);

		/**
		 * Wheel
		 */
		this._view.onWheel = (_event) => {
			_event.preventDefault();

			if (!this._view.zoomIn || !this._view.onWheel) return;

			const normalized = normalizeWheel(_event);
			this._view.zoomIn(normalized.pixelY);
		};

		window.addEventListener("mousewheel", this._view.onWheel, {
			passive: false,
		});
		window.addEventListener("wheel", this._view.onWheel, { passive: false });
	}

	private _setConfig() {
		// Pixel ratio
		this._config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

		// Width and height
		const boundings = this._targetElement.getBoundingClientRect();
		this._config.width = boundings.width;
		this._config.height = boundings.height || window.innerHeight;
		this._config.smallestSide = Math.min(
			this._config.width,
			this._config.height
		);
		this._config.largestSide = Math.max(
			this._config.width,
			this._config.height
		);

		// Debug
		// this.config.debug = window.location.hash === '#debug'
		this._config.debug = this._config.width > 420;
	}

	public construct() {
		this._setConfig();
		this._setView();
	}

	public destruct() {}

	public update() {
		if (
			!this._view.spherical ||
			!this._view.zoom ||
			!this._view.drag ||
			!this._view.target ||
			!this._appCamera.instance
		)
			return;

		/**
		 * View
		 */
		// Zoom
		this._view.spherical.value.radius +=
			this._view.zoom.delta * this._view.zoom.sensitivity;

		// Apply limits
		this._view.spherical.value.radius = Math.min(
			Math.max(
				this._view.spherical.value.radius,
				this._view.spherical.limits.radius.min
			),
			this._view.spherical.limits.radius.max
		);

		// Drag
		if (this._view.drag.alternative) {
			const up = new THREE.Vector3(0, 1, 0);
			const right = new THREE.Vector3(-1, 0, 0);

			up.applyQuaternion(this._appCamera.instance.quaternion);
			right.applyQuaternion(this._appCamera.instance.quaternion);

			up.multiplyScalar(this._view.drag.delta.y * 0.01);
			right.multiplyScalar(this._view.drag.delta.x * 0.01);

			this._view.target.value.add(up);
			this._view.target.value.add(right);

			// Apply limits
			this._view.target.value.x = Math.min(
				Math.max(this._view.target.value.x, this._view.target.limits.x.min),
				this._view.target.limits.x.max
			);
			this._view.target.value.y = Math.min(
				Math.max(this._view.target.value.y, this._view.target.limits.y.min),
				this._view.target.limits.y.max
			);
			this._view.target.value.z = Math.min(
				Math.max(this._view.target.value.z, this._view.target.limits.z.min),
				this._view.target.limits.z.max
			);
		} else {
			this._view.spherical.value.theta -=
				(this._view.drag.delta.x * this._view.drag.sensitivity) /
				this._config.smallestSide;
			this._view.spherical.value.phi -=
				(this._view.drag.delta.y * this._view.drag.sensitivity) /
				this._config.smallestSide;

			// Apply limits
			this._view.spherical.value.theta = Math.min(
				Math.max(
					this._view.spherical.value.theta,
					this._view.spherical.limits.theta.min
				),
				this._view.spherical.limits.theta.max
			);
			this._view.spherical.value.phi = Math.min(
				Math.max(
					this._view.spherical.value.phi,
					this._view.spherical.limits.phi.min
				),
				this._view.spherical.limits.phi.max
			);
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

		const viewPosition = new THREE.Vector3();
		viewPosition.setFromSpherical(this._view.spherical.smoothed);
		viewPosition.add(this._view.target.smoothed);

		this._appCamera.instance.position.copy(viewPosition);
		this._appCamera.instance.lookAt(this._view.target.smoothed);
	}
}
