import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import QuickThree from "quick-threejs";
import GUI from "lil-gui";
import GSAP from "gsap";

// CLASSES
import World from "./World";
import Preloader from "./Preloader";

export interface ExperienceProps {
	/**
	 * String dom element reference of the canvas
	 */
	domElementRef: string;
	/**
	 * Event triggered when the scene is construct
	 */
	onConstruct?: () => unknown;
	/**
	 * Event triggered when the scene is destructed
	 */
	onDestruct?: () => unknown;
}

export default class Experience {
	static instance?: Experience;
	/**
	 * Quick threejs library instance.
	 *
	 * [Quick three doc](https://www.npmjs.com/package/quick-threejs)
	 */
	app!: QuickThree;
	/**
	 * Group containing the experience.
	 */
	mainGroup?: THREE.Group;
	/**
	 * Graphic user interface of the experience instance
	 */
	gui?: GUI;
	/**
	 * Manager of all element to load in the experience
	 */
	loadingManager = new THREE.LoadingManager();
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
	cameraCurvePath = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 5.5, 21),
		new THREE.Vector3(12, 10, 12),
		new THREE.Vector3(21, 5.5, 0),
		new THREE.Vector3(12, 3.7, 12),
		new THREE.Vector3(0, 5.5, 21),
	]);
	cameraCurvePosition = new THREE.Vector3();
	cameraLookAtPosition = new THREE.Vector3(0, 2, 0);
	autoCameraAnimation = false;
	isGsapAnimating = false;
	back = false;
	cameraCurvePathProgress = {
		current: 0,
		target: 0,
		ease: 0.1,
	};
	world?: World;
	preloader?: Preloader;

	focusedElementPosition?: THREE.Vector3;
	focusedElementRadius = 2;
	focusedElementAngleX = 0;
	focusedElementAngleY = 0;

	onConstruct?: () => unknown;
	onDestruct?: () => unknown;

	constructor(props?: ExperienceProps) {
		if (Experience.instance) {
			return Experience.instance;
		}

		Experience.instance = this;

		this.app = new QuickThree(
			{
				enableDebug: window.location.hash === "#debug",
				axesSizes: window.location.hash === "#debug" ? 5 : undefined,
				gridSizes: window.location.hash === "#debug" ? 30 : undefined,
				withMiniCamera: window.location.hash === "#debug" ? true : undefined,
				camera: "Perspective",
			},
			props?.domElementRef
		);

		this.preloader = new Preloader();
		this.world = new World();

		if (this.app.debug?.cameraControls) {
			this.app.debug.cameraControls.enabled = false;
		}

		if (props?.onConstruct) this.onConstruct = props?.onConstruct;
		if (props?.onDestruct) this.onDestruct = props?.onDestruct;
	}

	destroy() {
		if (this.mainGroup) {
			this.mainGroup.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.geometry.dispose();

					for (const key in child.material) {
						const value = child.material[key];

						if (value && typeof value.dispose === "function") {
							value.dispose();
						}
					}
				}
			});

			this.app.scene.remove(this.mainGroup);

			this.mainGroup?.clear();
			this.mainGroup = undefined;

			if (this.gui) {
				this.gui.destroy();
				this.gui = undefined;
			}

			this.gui = this.app.debug?.ui?.addFolder(Experience.name);
			this.gui
				?.add({ function: () => this.construct() }, "function")
				.name("Enable");

			this.loadingManager.removeHandler(/onStart|onError|onProgress|onLoad/);

			if (this.app.updateCallbacks[Experience.name]) {
				delete this.app.updateCallbacks[Experience.name];
			}

			this.app.destroy();

			this.onDestruct && this.onDestruct();
		}
	}

	construct() {
		if (this.gui) {
			this.gui.destroy();
			this.gui = undefined;
		}

		if (this.mainGroup) {
			this.destroy();
		}

		if (!this.mainGroup && this.app.camera.instance) {
			this.mainGroup = new THREE.Group();

			// CAMERA
			if ((this.app.camera.instance as unknown as THREE.PerspectiveCamera).fov)
				(
					this.app.camera.instance as unknown as THREE.PerspectiveCamera
				).fov = 35;
			if (this.app.camera.instance?.far) this.app.camera.instance.far = 50;
			this.cameraCurvePath.getPointAt(0, this.app.camera.instance.position);
			this.app.camera.instance.position.y += 8;
			this.app.camera.instance.position.x -= 2;
			this.app.camera.instance.position.z += 10;

			this.app.camera.miniCamera?.position.set(10, 8, 30);
			if (this.app.debug?.cameraControls)
				this.app.debug.cameraControls.target = this.initialLookAtPosition;

			const CURVE_OBJECT = new THREE.Line(
				new THREE.BufferGeometry().setFromPoints(
					this.cameraCurvePath.getPoints(50)
				),
				new THREE.LineBasicMaterial({
					color: 0xff0000,
				})
			);

			this.setWheelEventListener();
			this.setMouseMoveEventListener();

			// ADD TO SCENE
			this.mainGroup.add(CURVE_OBJECT, this.cameraLookAtPointIndicator);

			this.app.scene.add(this.mainGroup);

			// ANIMATIONS
			this.app.setUpdateCallback("root", () => {
				if (this.autoCameraAnimation && !this.isGsapAnimating) {
					this.cameraCurvePathProgress.current = GSAP.utils.interpolate(
						this.cameraCurvePathProgress.current,
						this.cameraCurvePathProgress.target,
						this.cameraCurvePathProgress.ease
					);
					this.cameraCurvePathProgress.target =
						this.cameraCurvePathProgress.target +
						(this.back ? -0.0001 : 0.0001);

					if (this.cameraCurvePathProgress.target > 1) {
						setTimeout(() => {
							this.back = true;
						}, 1000);
					}

					if (this.cameraCurvePathProgress.target < 0) {
						setTimeout(() => {
							this.back = false;
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
					this.app.camera.instance?.position.copy(this.cameraCurvePosition);
				}

				if (
					this.app.camera.instance &&
					!this.autoCameraAnimation &&
					this.focusedElementPosition &&
					!this.isGsapAnimating
				) {
					this.cameraLookAtPosition.copy(
						this.getFocusedElementLookAtPosition()
					);
				}

				this.focusedElementAngleX +=
					(this.normalizedCursorPosition.x * Math.PI -
						this.focusedElementAngleX) *
					0.1;
				this.focusedElementAngleY +=
					(this.normalizedCursorPosition.y * Math.PI -
						this.focusedElementAngleY) *
					0.1;

				if (this.autoCameraAnimation || !this.isGsapAnimating)
					this.setCameraLookAt(this.cameraLookAtPosition);
			});

			// GUI
			this.setGui();
		}
	}

	setWheelEventListener() {
		window.addEventListener("wheel", (e) => {
			if (this.autoCameraAnimation === false) return;

			if (e.deltaY < 0) {
				this.cameraCurvePathProgress.target += 0.05;
				this.back = false;

				return;
			}

			this.cameraCurvePathProgress.target -= 0.05;
			this.back = true;
		});
	}

	setMouseMoveEventListener() {
		window.addEventListener("mousemove", (e) => {
			if (this.autoCameraAnimation) return;

			this.normalizedCursorPosition.x = e.clientX / this.app.sizes.width - 0.5;
			this.normalizedCursorPosition.y = e.clientY / this.app.sizes.height - 0.5;
		});
	}

	getFocusedElementLookAtPosition() {
		if (!(this.focusedElementPosition && this.app.camera.instance))
			return new THREE.Vector3();

		return new THREE.Vector3(
			this.focusedElementPosition.x -
				this.focusedElementRadius *
					Math.cos(
						this.focusedElementAngleX -
							this.app.camera.instance.rotation.y +
							Math.PI * 0.5
					),
			this.focusedElementPosition.y -
				this.focusedElementRadius * Math.sin(this.focusedElementAngleY),
			this.focusedElementPosition.z -
				this.focusedElementRadius *
					Math.sin(
						this.focusedElementAngleX -
							this.app.camera.instance.rotation.y +
							Math.PI * 0.5
					)
		);
	}

	getLerpedPosition(
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
		if (this.app.camera.instance) {
			this.focusedElementPosition = new THREE.Vector3().copy(
				cameraLookAtPosition
			);

			let _lerpProgress = 0;

			if (this.autoCameraAnimation) {
				GSAP.to(this.app.camera.instance.position, {
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
						const _LERPED_POSITION = this.getLerpedPosition(
							this.initialLookAtPosition,
							this.getFocusedElementLookAtPosition(),
							_lerpProgress
						);
						_lerpProgress += 0.015;

						this.cameraLookAtPosition.copy(_LERPED_POSITION);
						this.setCameraLookAt(_LERPED_POSITION);
					},
				});

				return;
			}

			const _FOCUSED_ELEMENT_POSITION = this.getFocusedElementLookAtPosition();

			GSAP.to(this.app.camera.instance.position, {
				...this.getGsapDefaultProps(),
				x: this.cameraCurvePosition.x,
				y: this.cameraCurvePosition.y,
				z: this.cameraCurvePosition.z,
				duration: 2,
				onUpdate: (e) => {
					const _LERPED_POSITION = this.getLerpedPosition(
						_FOCUSED_ELEMENT_POSITION,
						this.initialLookAtPosition,
						_lerpProgress
					);
					_lerpProgress += 0.01;

					this.cameraLookAtPosition.copy(_LERPED_POSITION);
					this.setCameraLookAt(_LERPED_POSITION);
				},
				onComplete: () => {
					this.getGsapDefaultProps().onComplete();
					this.autoCameraAnimation = true;
				},
			});
		}
	}

	/**
	 * Set the camera look at position
	 * @param v3 Vector 3 position where the the camera should look at
	 */
	setCameraLookAt(v3: THREE.Vector3) {
		this.app.camera.instance?.lookAt(v3);
		if (this.app.debug?.cameraControls)
			this.app.debug.cameraControls.target = v3;
		this.cameraLookAtPointIndicator.position.copy(v3);

		this.app.camera.instance?.updateProjectionMatrix();
	}

	/**
	 *
	 */
	setGui() {
		// GUI
		this.gui = this.app.debug?.ui?.addFolder(Experience.name);
		this.gui
			?.add(
				{
					fn: () => {
						const _POS_LOOK_AT = new THREE.Vector3().copy(
							this.world?.isometricRoom?.roomBoard?.position ??
								new THREE.Vector3()
						);
						const _POS = new THREE.Vector3()
							.copy(_POS_LOOK_AT)
							.set(
								_POS_LOOK_AT.x,
								_POS_LOOK_AT.y,
								_POS_LOOK_AT.z - _POS_LOOK_AT.z
							);

						this.focusedElementRadius = 0.5;
						this.toggleFocusMode(_POS, _POS_LOOK_AT);
					},
				},
				"fn"
			)
			.name("Focus Board");
		this.gui
			?.add(
				{
					fn: () => {
						const _POS_LOOK_AT = new THREE.Vector3().copy(
							this.world?.isometricRoom?.roomShelves?.position ??
								new THREE.Vector3()
						);
						const _POS = new THREE.Vector3().copy(_POS_LOOK_AT);
						_POS.x += 3;
						_POS.y += 0.2;
						this.focusedElementRadius = 0.5;

						this.toggleFocusMode(_POS, _POS_LOOK_AT);
					},
				},
				"fn"
			)
			.name("Room shelves");
		this.gui
			?.add(
				{
					fn: () => {
						const _POS_LOOK_AT = new THREE.Vector3().copy(
							this.world?.isometricRoom?.pcScreen?.position ??
								new THREE.Vector3()
						);
						this.focusedElementRadius = 2.5;
						const _POS = new THREE.Vector3()
							.copy(_POS_LOOK_AT)
							.set(0, _POS_LOOK_AT.y + 0.2, 0);

						this.toggleFocusMode(_POS, _POS_LOOK_AT);
					},
				},
				"fn"
			)
			.name("Focus desc");
	}
}
