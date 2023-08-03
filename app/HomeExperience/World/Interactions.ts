import * as THREE from "three";
import GSAP from "gsap";

// CLASSES
import Experience from "..";

export default class Interactions {
	private experience = new Experience();
	/**
	 * Indicate where the camera is looking at.
	 *
	 * @deprecated Should remove in prod.
	 */
	cameraLookAtPointIndicator = new THREE.Mesh(
		new THREE.SphereGeometry(0.1, 12, 12),
		new THREE.MeshBasicMaterial({ color: "#ff0040" })
	);
	normalizedCursorPosition = { x: 0, y: 0 };
	initialLookAtPosition = new THREE.Vector3(0, 2, 0);

	/**
	 * The curve path of the camera
	 */
	cameraCurvePath = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 5.5, 21),
		new THREE.Vector3(12, 10, 12),
		new THREE.Vector3(21, 5.5, 0),
		new THREE.Vector3(12, 3.7, 12),
		new THREE.Vector3(0, 5.5, 21),
	]);
	/**
	 * Current curve path position of the camera.
	 */
	cameraCurvePosition = new THREE.Vector3();
	cameraCurvePathProgress = {
		current: 0,
		target: 0,
		ease: 0.1,
	};
	curvePathLine = new THREE.Line(
		new THREE.BufferGeometry().setFromPoints(
			this.cameraCurvePath.getPoints(50)
		),
		new THREE.LineBasicMaterial({
			color: 0xff0000,
		})
	);
	/**
	 * Where the camera will look at.
	 */
	cameraLookAtPosition = new THREE.Vector3(0, 2, 0);
	/**
	 * Enable auto curve path animation
	 */
	autoCameraAnimation = false;
	/**
	 * GSAP animation watcher. If GSAP is currently animating
	 */
	isGsapAnimating = false;
	/**
	 * Curve path backward animation
	 */
	backwardCurveAnimation = false;
	positionsToFocus: {
		cameraPosition: THREE.Vector3;
		point: THREE.Vector3;
	}[] = [];
	currentFocusedPositionIndex: number = 0;
	focusedPosition?: THREE.Vector3;
	focusedRadius = 2;
	focusedAngleX = 0;
	focusedAngleY = 0;

	mouseDowned = false;
	lastMouseCoordinate = { x: 0, y: 0 };

	constructor() {
		if (
			this.experience.app.camera.instance instanceof THREE.PerspectiveCamera
		) {
			this.cameraCurvePath.getPointAt(
				0,
				this.experience.app.camera.instance.position
			);
		}

		this.setPositionsToFocus();
		this.setWheelEventListener();
		this.setMouseMoveEventListener();
		this.setMouseDownEventListener();
		this.setMouseUpEventListener();
	}

	destroy() {}

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
			this.experience.app.camera.instance?.position.copy(
				this.cameraCurvePosition
			);
		}

		if (
			this.experience.app.camera.instance &&
			!this.autoCameraAnimation &&
			this.focusedPosition &&
			!this.isGsapAnimating
		) {
			this.cameraLookAtPosition.copy(this.getFocusedLookAtPosition());
		}

		this.focusedAngleX +=
			(this.normalizedCursorPosition.x * Math.PI - this.focusedAngleX) * 0.1;
		this.focusedAngleY +=
			(this.normalizedCursorPosition.y * Math.PI - this.focusedAngleY) * 0.1;

		if (this.autoCameraAnimation || !this.isGsapAnimating)
			this.setCameraLookAt(this.cameraLookAtPosition);
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
				} else {
					this.cameraCurvePathProgress.target -= 0.002;
					this.backwardCurveAnimation = true;
				}
			}

			if (!this.autoCameraAnimation) {
				this.normalizedCursorPosition.x =
					e.clientX / this.experience.app.sizes.width - 0.5;
				this.normalizedCursorPosition.y =
					e.clientY / this.experience.app.sizes.height - 0.5;
			}

			this.lastMouseCoordinate = { x: e.clientX, y: e.clientY };
		});
	}

	setMouseDownEventListener() {
		window.addEventListener("mousedown", () => {
			this.mouseDowned = true;
			if (this.focusedPosition) this.cameraZoomIn();
		});
	}

	setMouseUpEventListener() {
		window.addEventListener("mouseup", () => {
			this.mouseDowned = false;
			if (this.focusedPosition) this.cameraZoomOut();
		});
	}

	cameraZoomIn() {
		if (this.experience.app.camera.instance instanceof THREE.PerspectiveCamera)
			GSAP.to(this.experience.app.camera.instance, {
				fov: 25,
			});
	}

	cameraZoomOut() {
		if (this.experience.app.camera.instance instanceof THREE.PerspectiveCamera)
			GSAP.to(this.experience.app.camera.instance, {
				fov: this.experience.world?.initialCameraFov ?? 0,
			});
	}

	getFocusedLookAtPosition(position = this.focusedPosition) {
		if (!(position && this.experience.app.camera.instance))
			return new THREE.Vector3();

		return new THREE.Vector3(
			position.x -
				this.focusedRadius *
					Math.cos(
						this.focusedAngleX -
							this.experience.app.camera.instance.rotation.y +
							Math.PI * 0.5
					),
			position.y - this.focusedRadius * Math.sin(this.focusedAngleY),
			position.z -
				this.focusedRadius *
					Math.sin(
						this.focusedAngleX -
							this.experience.app.camera.instance.rotation.y +
							Math.PI * 0.5
					)
		);
	}

	getLerpPosition(
		vec3_start: THREE.Vector3,
		vec3_end: THREE.Vector3,
		progress = 0
	) {
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
	 * Toggle the camera position with transition from
	 * the origin position to the passed position
	 *
	 * @param cameraToPosition The camera position
	 * @param cameraLookAtPosition The camera position where to loo at
	 */
	toggleFocusMode(
		cameraToPosition = new THREE.Vector3(),
		cameraLookAtPosition = new THREE.Vector3()
	) {
		if (this.experience.app.camera.instance) {
			this.focusedPosition = new THREE.Vector3().copy(cameraLookAtPosition);

			let _lerpProgress = 0;

			if (this.autoCameraAnimation) {
				GSAP.to(this.experience.app.camera.instance.position, {
					...this.getGsapDefaultProps(),
					x: cameraToPosition.x,
					y: cameraToPosition.y,
					z: cameraToPosition.z,
					duration: 1.5,
					onStart: () => {
						this.getGsapDefaultProps().onStart();
						this.autoCameraAnimation = false;
					},
					onUpdate: () => {
						const _LERP_POSITION = this.getLerpPosition(
							this.initialLookAtPosition,
							this.getFocusedLookAtPosition(),
							_lerpProgress
						);
						_lerpProgress += 0.015;

						this.cameraLookAtPosition.copy(_LERP_POSITION);
						this.setCameraLookAt(_LERP_POSITION);
					},
				});

				return;
			}

			const _FOCUSED_POSITION = this.getFocusedLookAtPosition();

			GSAP.to(this.experience.app.camera.instance.position, {
				...this.getGsapDefaultProps(),
				x: this.cameraCurvePosition.x,
				y: this.cameraCurvePosition.y,
				z: this.cameraCurvePosition.z,
				duration: 2,
				onUpdate: (e) => {
					const _LERP_POSITION = this.getLerpPosition(
						_FOCUSED_POSITION,
						this.initialLookAtPosition,
						_lerpProgress
					);
					_lerpProgress += 0.01;

					this.cameraLookAtPosition.copy(_LERP_POSITION);
					this.setCameraLookAt(_LERP_POSITION);
				},
				onComplete: () => {
					this.getGsapDefaultProps().onComplete();
					this.autoCameraAnimation = true;
				},
			});
		}
	}

	/**
	 * Move the camera position with transition from
	 * the origin position to the passed position and enable the camera movement
	 *
	 * @param cameraToPosition The camera position
	 * @param pointToFocus The camera position where to loo at
	 */
	focusPoint(
		cameraToPosition = new THREE.Vector3(),
		pointToFocus = new THREE.Vector3(),
		prevLookAtPoint = this.initialLookAtPosition
	) {
		if (this.experience.app.camera.instance) {
			let _lerpProgress = 0;

			this.focusedPosition = new THREE.Vector3().copy(pointToFocus);

			GSAP.to(this.experience.app.camera.instance.position, {
				...this.getGsapDefaultProps(),
				x: cameraToPosition.x,
				y: cameraToPosition.y,
				z: cameraToPosition.z,
				duration: 1.5,
				onStart: () => {
					this.getGsapDefaultProps().onStart();
					this.autoCameraAnimation = false;
				},
				onUpdate: () => {
					const _LERP_POSITION = this.getLerpPosition(
						prevLookAtPoint,
						this.getFocusedLookAtPosition(),
						_lerpProgress
					);
					_lerpProgress += 0.015;

					this.cameraLookAtPosition.copy(_LERP_POSITION);
					this.setCameraLookAt(_LERP_POSITION);
				},
				onComplete: () => {
					this.getGsapDefaultProps().onComplete();
					if (
						this.experience.app.camera.instance instanceof
						THREE.PerspectiveCamera
					)
						this.experience.app.camera.instance.fov =
							this.experience.world?.initialCameraFov ?? 0;
				},
			});
		}
	}

	unFocusPoint() {
		if (this.experience.app.camera.instance && this.focusedPosition) {
			let _lerpProgress = 0;
			const _FOCUSED_POSITION = this.getFocusedLookAtPosition();

			GSAP.to(this.experience.app.camera.instance.position, {
				...this.getGsapDefaultProps(),
				x: this.cameraCurvePosition.x,
				y: this.cameraCurvePosition.y,
				z: this.cameraCurvePosition.z,
				duration: 2,
				onUpdate: (e) => {
					const _LERP_POSITION = this.getLerpPosition(
						_FOCUSED_POSITION,
						this.initialLookAtPosition,
						_lerpProgress
					);
					_lerpProgress += 0.01;

					this.cameraLookAtPosition.copy(_LERP_POSITION);
					this.setCameraLookAt(_LERP_POSITION);
				},
				onComplete: () => {
					this.getGsapDefaultProps().onComplete();
					this.autoCameraAnimation = true;
					this.focusedPosition = undefined;
				},
			});
		}
	}

	/**
	 * Set the camera look at position
	 * @param v3 Vector 3 position where the the camera should look at
	 */
	setCameraLookAt(v3: THREE.Vector3) {
		this.experience.app.camera.instance?.lookAt(v3);

		if (this.experience.app.debug?.cameraControls)
			this.experience.app.debug.cameraControls.target = v3;

		this.cameraLookAtPointIndicator.position.copy(v3);
	}

	setPositionsToFocus() {
		const _DESK_POSITION =
			this.experience.world?.isometricRoom?.pcScreen?.position ??
			new THREE.Vector3();
		const _SHELVES_POSITION = new THREE.Vector3(-3, 1.4, 3);
		const _BOARD_POSITION = new THREE.Vector3(-1.2, 3.8, -4.1);
		const _SUPPORTS_POSITION = new THREE.Vector3(-3, 4, 1.85);

		this.positionsToFocus = [
			{
				cameraPosition: _DESK_POSITION
					.clone()
					.set(0, _DESK_POSITION.y + 0.2, 0),
				point: _DESK_POSITION,
			},
			{
				cameraPosition: _SHELVES_POSITION
					.clone()
					.set(
						_SHELVES_POSITION.x + 3,
						_SHELVES_POSITION.y + 0.8,
						_SHELVES_POSITION.z
					),
				point: _SHELVES_POSITION,
			},
			{
				cameraPosition: _BOARD_POSITION
					.clone()
					.set(_BOARD_POSITION.x, _BOARD_POSITION.y, _BOARD_POSITION.z + 3.2),
				point: _BOARD_POSITION,
			},
			{
				cameraPosition: _SUPPORTS_POSITION
					.clone()
					.set(
						_SUPPORTS_POSITION.x + 3,
						_SUPPORTS_POSITION.y + 0.8,
						_SUPPORTS_POSITION.z
					),
				point: _SUPPORTS_POSITION,
			},
		];
	}
}
