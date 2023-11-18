import * as THREE from "three";
import GSAP from "gsap";

// CLASSES
import Experience from "..";

export default class Interactions {
	private experience = new Experience();
	rayCaster = new THREE.Raycaster();
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

	focusPointPositionIndex: number = 0;
	focusedPosition?: THREE.Vector3;
	focusedRadius = 2;
	focusedAngleX = 0;
	focusedAngleY = 0;

	mouseDowned = false;
	mouseOverBubble = false;
	lastMouseCoordinate = { x: 0, y: 0 };

	modelBubbles: {
		coordinates: THREE.Vector3;
		DOMelement: HTMLElement;
	}[] = [];

	constructor() {
		if (
			this.experience.app.camera.instance instanceof THREE.PerspectiveCamera
		) {
			this.cameraCurvePath.getPointAt(
				0,
				this.experience.app.camera.instance.position
			);
		}

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

		this.updateModelBubblesDomElements();

		this.focusedAngleX +=
			(this.normalizedCursorPosition.x * Math.PI - this.focusedAngleX) * 0.1;
		this.focusedAngleY +=
			(this.normalizedCursorPosition.y * Math.PI - this.focusedAngleY) * 0.1;

		if (this.autoCameraAnimation || !this.isGsapAnimating)
			this.setCameraLookAt(this.cameraLookAtPosition);
	}

	updateModelBubblesDomElements() {
		const _CAMERA = this.experience.app.camera.instance;
		if (!(_CAMERA instanceof THREE.PerspectiveCamera)) return;

		for (const bubble of this.modelBubbles) {
			if (bubble.DOMelement) {
				const screenPosition = bubble.coordinates.clone();
				screenPosition.project(_CAMERA);

				const translateX =
					screenPosition.x * this.experience.app.sizes.width * 0.5;
				const translateY = -(
					screenPosition.y *
					this.experience.app.sizes.height *
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
			if (this.focusedPosition && !this.mouseOverBubble) this.cameraZoomIn();
		});
	}

	setMouseUpEventListener() {
		window.addEventListener("mouseup", () => {
			this.mouseDowned = false;
			if (this.focusedPosition && !this.mouseOverBubble) this.cameraZoomOut();
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
	 * Move the camera position with transition from
	 * the origin position to the passed position and enable the camera movement
	 *
	 * @param cameraToPosition The camera position
	 * @param whereToLookAt The camera position where to look at
	 * @param fromWhereToLooAt From where the camera will start looking at
	 */
	focusPoint(
		cameraToPosition = new THREE.Vector3(),
		whereToLookAt = new THREE.Vector3(),
		fromWhereToLooAt = this.initialLookAtPosition
	) {
		if (this.experience.app.camera.instance) {
			let _lerpProgress = 0;

			this.focusedPosition = new THREE.Vector3().copy(whereToLookAt);

			GSAP.to(this.experience.app.camera.instance.position, {
				...this.getGsapDefaultProps(),
				x: cameraToPosition.x,
				y: cameraToPosition.y,
				z: cameraToPosition.z,
				duration: 1.5,
				onStart: () => {
					this.getGsapDefaultProps().onStart();
					this.autoCameraAnimation = false;
					const _MODEL_BUBBLE_CONTAINER_DOM =
						this.experience.preloader?.modelBubbleContainerDom;
					if (_MODEL_BUBBLE_CONTAINER_DOM) {
						this.modelBubbles = [];
						_MODEL_BUBBLE_CONTAINER_DOM.innerHTML = "";
					}
				},
				onUpdate: () => {
					const _LERP_POSITION = this.getLerpPosition(
						fromWhereToLooAt,
						this.getFocusedLookAtPosition(),
						_lerpProgress
					);
					_lerpProgress += 0.015;

					this.cameraLookAtPosition.copy(_LERP_POSITION);
					this.setCameraLookAt(_LERP_POSITION);
				},
				onComplete: () => {
					this.getGsapDefaultProps().onComplete();
					const _ISOMETRIC_ROOM = this.experience.world?.isometricRoom;
					const _MODEL_BUBBLE_CONTAINER_DOM =
						this.experience.preloader?.modelBubbleContainerDom;

					if (_ISOMETRIC_ROOM && _MODEL_BUBBLE_CONTAINER_DOM) {
						const _CURRENT_FOCUS_POINT_POSITION =
							_ISOMETRIC_ROOM.focusPointPositions[this.focusPointPositionIndex];

						_CURRENT_FOCUS_POINT_POSITION.bubbles?.map((bubble, index) => {
							const _BUBBLE_DOM_ELEMENT = document.createElement("div");
							const _BUBBLE_TITLE_DOM_ELEMENT = document.createElement("span");
							const _BUBBLE_CONTENT_DOM_ELEMENT =
								document.createElement("span");

							_BUBBLE_DOM_ELEMENT.className = `model-bubble model-bubble-${index}`;
							_BUBBLE_DOM_ELEMENT.onmouseenter = () =>
								(this.mouseOverBubble = true);
							_BUBBLE_DOM_ELEMENT.onmouseleave = () =>
								(this.mouseOverBubble = false);
							_BUBBLE_TITLE_DOM_ELEMENT.className = "title";
							_BUBBLE_TITLE_DOM_ELEMENT.textContent = bubble.label;
							_BUBBLE_CONTENT_DOM_ELEMENT.className = "content";
							_BUBBLE_CONTENT_DOM_ELEMENT.textContent = bubble.content;

							_BUBBLE_DOM_ELEMENT.appendChild(_BUBBLE_TITLE_DOM_ELEMENT);
							_BUBBLE_DOM_ELEMENT.appendChild(_BUBBLE_CONTENT_DOM_ELEMENT);

							setTimeout(
								() => _BUBBLE_DOM_ELEMENT.classList.add("visible"),
								index * 80
							);

							this.modelBubbles.push({
								coordinates: bubble.coordinates,
								DOMelement: _BUBBLE_DOM_ELEMENT,
							});
							_MODEL_BUBBLE_CONTAINER_DOM.appendChild(_BUBBLE_DOM_ELEMENT);
						});
					}
				},
			});
		}
	}

	/**
	 * Focus switcher, will move the camera and the position of the camera where to look at.
	 *
	 * @param focusPointPositionIndex The index of the point to focus
	 * @param fromWhereToLooAt From where the camera will start looking at
	 */
	focusPointSwitch(
		focusPointPositionIndex = 0,
		fromWhereToLooAt = this.initialLookAtPosition
	) {
		const _ISOMETRIC_ROOM = this.experience.world?.isometricRoom;

		if (_ISOMETRIC_ROOM) {
			const _CURRENT_FOCUS_POINT_POSITION =
				_ISOMETRIC_ROOM.focusPointPositions[focusPointPositionIndex];

			this.focusedRadius = focusPointPositionIndex === 0 ? 2.5 : 0.8;
			this.focusPointPositionIndex = focusPointPositionIndex;

			this.focusPoint(
				_CURRENT_FOCUS_POINT_POSITION.camera,
				_CURRENT_FOCUS_POINT_POSITION.point,
				fromWhereToLooAt
			);
		}
	}

	nextFocusPoint() {
		const _ISOMETRIC_ROOM = this.experience.world?.isometricRoom;

		if (!_ISOMETRIC_ROOM) return;

		const _NEXT_INDEX =
			this.focusedPosition &&
			_ISOMETRIC_ROOM.focusPointPositions.length - 1 >
				this.focusPointPositionIndex
				? this.focusPointPositionIndex + 1
				: 0;
		const _PREV_LOOK_AT_POSITION = this.focusedPosition
			? this.getFocusedLookAtPosition(
					_ISOMETRIC_ROOM.focusPointPositions[this.focusPointPositionIndex]
						.point
			  )
			: this.initialLookAtPosition;

		this.focusPointSwitch(_NEXT_INDEX, _PREV_LOOK_AT_POSITION);
	}

	prevFocusPoint() {
		const _ISOMETRIC_ROOM = this.experience.world?.isometricRoom;

		if (!_ISOMETRIC_ROOM) return;

		const _NEXT_INDEX = this.focusedPosition
			? this.focusPointPositionIndex - 1 >= 0
				? this.focusPointPositionIndex - 1
				: _ISOMETRIC_ROOM.focusPointPositions.length - 1
			: 0;
		const _PREV_LOOK_AT_POSITION = this.focusedPosition
			? this.getFocusedLookAtPosition(
					_ISOMETRIC_ROOM.focusPointPositions[this.focusPointPositionIndex]
						.point
			  )
			: this.initialLookAtPosition;

		this.focusPointSwitch(_NEXT_INDEX, _PREV_LOOK_AT_POSITION);
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
				onStart: () => {
					this.getGsapDefaultProps().onStart();
					const _MODEL_BUBBLE_CONTAINER_DOM =
						this.experience.preloader?.modelBubbleContainerDom;

					if (_MODEL_BUBBLE_CONTAINER_DOM) {
						this.modelBubbles = [];
						_MODEL_BUBBLE_CONTAINER_DOM.innerHTML = "";
					}
				},
				onUpdate: () => {
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
					if (
						this.experience.app.camera.instance instanceof
						THREE.PerspectiveCamera
					)
						this.cameraZoomOut();
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
}
