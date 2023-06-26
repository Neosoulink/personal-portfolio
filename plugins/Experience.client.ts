import * as THREE from "three";
import QuickThree from "quick-threejs";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GUI from "lil-gui";
import GSAP from "gsap";

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

export class Experience {
	app: QuickThree;
	mainGroup?: THREE.Group;
	gui?: GUI;
	loadingManager = new THREE.LoadingManager();

	cameraLookAtPOintIndicator = new THREE.Mesh(
		new THREE.SphereGeometry(0.1, 12, 12),
		new THREE.MeshBasicMaterial({ color: "#ff0040" })
	);

	isometricRoom?: THREE.Group;
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
	back = false;
	cameraCurvePathProgress = {
		current: 0,
		target: 0,
		ease: 0.1,
	};

	focusedElementPosition?: THREE.Vector3;
	focusedElementFollowCursor = false;
	focusedElementFollowCursorProgress = 0;
	monitor_a_screen?: THREE.Mesh;
	monitor_b_screen?: THREE.Mesh;
	phone_screen?: THREE.Mesh;
	pc_screen?: THREE.Mesh;

	onConstruct?: () => unknown;
	onDestruct?: () => unknown;

	constructor(props: ExperienceProps) {
		this.app = new QuickThree(
			{
				enableControls: false,
				axesSizes: 5,
				gridSizes: 30,
				withMiniCamera: true,
				camera: "Perspective",
			},
			props.domElementRef
		);
		if (this.app._camera.controls) {
			this.app._camera.controls.enabled = false;
		}

		this.gui = this.app.debug?.ui?.addFolder(Experience.name);
		this.gui?.add({ fn: () => this.construct() }, "fn").name("Enable");
		this.gui?.close();

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

		if (!this.mainGroup) {
			this.mainGroup = new THREE.Group();

			// LOADERS
			const DRACO_LOADER = new DRACOLoader();
			DRACO_LOADER.setDecoderPath("/decoders/draco/");
			const GLTF_LOADER = new GLTFLoader(this.loadingManager);
			GLTF_LOADER.setDRACOLoader(DRACO_LOADER);
			const TEXTURE_LOADER = new THREE.TextureLoader(this.loadingManager);

			// LIGHTS
			const DIRECTIONAL_LIGHT = new THREE.DirectionalLight(0xa33a12, 0.01);
			DIRECTIONAL_LIGHT.position.set(0, 0, 1);

			/**
			 * Texture
			 */
			const BAKED_TEXTURE = TEXTURE_LOADER.load(
				"/3d_models/isometric_room/baked-isometric-room.jpg"
			);
			BAKED_TEXTURE.flipY = false;
			BAKED_TEXTURE.colorSpace = THREE.SRGBColorSpace;

			/**
			 * Materials
			 */
			const BAKED_MATERIAL = new THREE.MeshBasicMaterial({
				map: BAKED_TEXTURE,
				side: THREE.DoubleSide,
			});

			// MODELS
			GLTF_LOADER.load(
				"/3d_models/isometric_room/isometric_room.glb",
				(glb) => {
					const _REG = new RegExp(/.*screen/);
					console.log("glb.scene", glb.scene);

					glb.scene.traverse((child) => {
						if (child instanceof THREE.Mesh && !_REG.test(child.name)) {
							child.material = BAKED_MATERIAL;
						}

						if (
							child instanceof THREE.Mesh &&
							child.name === "monitor-a-screen"
						) {
							this.monitor_a_screen = child;
						}
						if (
							child instanceof THREE.Mesh &&
							child.name === "monitor-b-screen"
						) {
							this.monitor_b_screen = child;
						}
						if (child instanceof THREE.Mesh && child.name === "phone-screen") {
							this.phone_screen = child;
						}
						if (child instanceof THREE.Mesh && child.name === "pc-screen") {
							this.pc_screen = child;
						}
					});

					(this.isometricRoom = glb.scene).position.set(0, -1.5, -6.5);
					(this.isometricRoom = glb.scene).rotation.set(0.3, -0.2, 0);

					this.mainGroup && this.mainGroup.add(this.isometricRoom);
				}
			);

			// CAMERA
			// @ts-ignore Proxy class error
			if (this.app.camera?.fov) this.app.camera.fov = 35;
			if (this.app.camera?.far) this.app.camera.far = 50;
			this.cameraCurvePath.getPointAt(0, this.app.camera?.position);

			this.app._camera.miniCamera?.position.set(10, 8, 30);
			if (this.app._camera.controls)
				this.app._camera.controls.target = this.cameraLookAtPosition;

			// HELPERS
			const CAMERA_HELPER = this.app.camera
				? new THREE.CameraHelper(this.app.camera)
				: undefined;

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
			this.mainGroup.add(
				DIRECTIONAL_LIGHT,
				CURVE_OBJECT,
				this.cameraLookAtPOintIndicator
			);
			CAMERA_HELPER && this.mainGroup.add(CAMERA_HELPER);

			this.app.scene.add(this.mainGroup);

			let modelsAngleX = 0;
			let modelsAngleY = 0;
			let modelsRadius = 1;

			// ANIMATIONS
			this.app.setUpdateCallback("root", () => {
				if (CAMERA_HELPER) {
					CAMERA_HELPER.matrixWorldNeedsUpdate = true;
					CAMERA_HELPER.update();
					this.app.camera?.position &&
						CAMERA_HELPER.position.copy(this.app.camera?.position);
					this.app.camera?.rotation &&
						CAMERA_HELPER.rotation.copy(this.app.camera?.rotation);
				}

				if (this.autoCameraAnimation && !this.focusedElementFollowCursor) {
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

					this.app.camera?.position.copy(this.cameraCurvePosition);
				}

				if (
					!this.autoCameraAnimation &&
					this.focusedElementPosition &&
					this.app.camera &&
					!this.focusedElementFollowCursor
				) {
					this.cameraLookAtPosition.set(
						this.focusedElementPosition.x -
							modelsRadius *
								Math.cos(
									modelsAngleX - this.app.camera.rotation.y + Math.PI * 0.5
								),
						this.focusedElementPosition.y -
							modelsRadius * Math.sin(modelsAngleY),
						this.focusedElementPosition.z -
							modelsRadius *
								Math.sin(
									modelsAngleX - this.app.camera.rotation.y + Math.PI * 0.5
								)
					);
				}

				if (
					this.focusedElementFollowCursor &&
					this.app.camera &&
					this.focusedElementPosition
				) {
					const _VECTOR = new THREE.Vector3(
						this.focusedElementPosition.x -
							modelsRadius *
								Math.cos(
									modelsAngleX - this.app.camera.rotation.y + Math.PI * 0.5
								),
						this.focusedElementPosition.y -
							modelsRadius * Math.sin(modelsAngleY),
						this.focusedElementPosition.z -
							modelsRadius *
								Math.sin(
									modelsAngleX - this.app.camera.rotation.y + Math.PI * 0.5
								)
					);

					this.cameraLookAtPosition.lerpVectors(
						this.initialLookAtPosition,
						_VECTOR,
						this.focusedElementFollowCursorProgress
					);

					this.focusedElementFollowCursorProgress += 0.015;

					if (this.focusedElementFollowCursorProgress >= 1) {
						this.focusedElementFollowCursor = false;
						this.focusedElementFollowCursorProgress = 0;
					}
				}

				this.setCameraLookAt(this.cameraLookAtPosition);

				modelsAngleX +=
					(this.normalizedCursorPosition.x * Math.PI - modelsAngleX) * 0.1;
				modelsAngleY +=
					(this.normalizedCursorPosition.y * Math.PI - modelsAngleY) * 0.1;
			});

			// GUI
			this.setGui();
		}
	}

	setWheelEventListener() {
		window.addEventListener("wheel", (e) => {
			if (e.deltaY < 0) {
				this.cameraCurvePathProgress.target += 0.05;
				this.back = false;
			} else {
				this.cameraCurvePathProgress.target -= 0.05;
				this.back = true;
			}
		});
	}

	setMouseMoveEventListener() {
		window.addEventListener("mousemove", (e) => {
			if (!this.autoCameraAnimation) {
				this.normalizedCursorPosition.x =
					e.clientX / this.app.sizes.width - 0.5;
				this.normalizedCursorPosition.y =
					e.clientY / this.app.sizes.height - 0.5;
			}
		});
	}

	toggleFocusMode(position: THREE.Vector3) {
		if (this.app.camera) {
			this.focusedElementPosition = new THREE.Vector3().copy(position);

			if (this.autoCameraAnimation) {
				this.focusedElementFollowCursor = true;
				this.autoCameraAnimation = false;

				GSAP.to(this.app.camera.position, {
					x: this.initialLookAtPosition.x,
					y: position.y + 0.2,
					z: this.initialLookAtPosition.z,
					duration: 1.5,
				});

				return;
			}

			this.focusedElementFollowCursor = false;
			this.cameraLookAtPosition = new THREE.Vector3().copy(position);

			GSAP.to(this.cameraLookAtPosition, {
				x: this.initialLookAtPosition.x,
				y: this.initialLookAtPosition.y,
				z: this.initialLookAtPosition.z,
				duration: 2,
				onUpdate: () => {
					this.setCameraLookAt(this.cameraLookAtPosition);
				},
			});

			GSAP.to(this.app.camera.position, {
				x: this.cameraCurvePosition.x,
				y: this.cameraCurvePosition.y,
				z: this.cameraCurvePosition.z,
				duration: 2,
			}).then(() => {
				this.focusedElementPosition = undefined;
				this.autoCameraAnimation = true;
			});
		}
	}

	setGui() {
		// GUI
		this.gui = this.app.debug?.ui?.addFolder(Experience.name);
		this.gui
			?.add(
				{
					fn: () => {
						this.toggleFocusMode(
							this.monitor_a_screen?.position ?? new THREE.Vector3()
						);
					},
				},
				"fn"
			)
			.name("Toggle monitor A focus");
		this.gui
			?.add(
				{
					fn: () => {
						this.toggleFocusMode(
							this.monitor_b_screen?.position ?? new THREE.Vector3()
						);
					},
				},
				"fn"
			)
			.name("Toggle monitor B focus");
		this.gui
			?.add(
				{
					fn: () => {
						this.toggleFocusMode(
							this.phone_screen?.position ?? new THREE.Vector3()
						);
					},
				},
				"fn"
			)
			.name("Toggle monitor Phone screen");
		this.gui
			?.add(
				{
					fn: () => {
						this.toggleFocusMode(
							this.pc_screen?.position ?? new THREE.Vector3()
						);
					},
				},
				"fn"
			)
			.name("Toggle monitor PC screen");
	}

	setCameraLookAt(v: THREE.Vector3) {
		this.app.camera?.lookAt(v);
		this.app.camera?.updateProjectionMatrix();

		if (this.app._camera.controls) this.app._camera.controls.target = v;

		this.cameraLookAtPOintIndicator.position.copy(this.cameraLookAtPosition);
	}

	start() {
		const _DEFAULT_PROPS = {
			duration: 2.5,
			ease: "M0,0 C0.001,0.001 0.002,0.003 0.003,0.004 0.142,0.482 0.284,0.75 0.338,0.836 0.388,0.924 0.504,1 1,1 ",
		};

		if (this.mainGroup && this.isometricRoom) {
			GSAP.to(this.isometricRoom.rotation, {
				x: 0,
				y: 0,
				..._DEFAULT_PROPS,
			});
			GSAP.to(this.isometricRoom.position, {
				y: 0,
				z: 0,
				..._DEFAULT_PROPS,
			});

			setTimeout(() => {
				this.autoCameraAnimation = true;
			}, (_DEFAULT_PROPS.duration + 0.5) * 1000);
		}

		if (this.cameraCurvePathProgress.target < 0) {
			this.cameraCurvePathProgress.target = 1;
		}
	}
}

export default defineNuxtPlugin(() => {
	return {
		provide: {
			Experience,
		},
	};
});
