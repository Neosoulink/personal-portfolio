import * as THREE from "three";
import EventEmitter from "events";
import GSAP from "gsap";

// EXPERIENCE
import Experience from "..";
import Controls from "./Controls";
import Scene_1 from "./Scene_1";
import Scene_2 from "./Scene_2";
import Scene_3 from "./Scene_3";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

// CONSTANTS
import { GSAP_DEFAULT_INTRO_PROPS } from "@/constants/ANIMATION";

export default class World extends EventEmitter implements ExperienceBase {
	private readonly experience = new Experience();
	controls?: Controls;

	/** `Represent the Threejs `Group` containing the experience. */
	scene?: THREE.Group;

	scene_1?: Scene_1;
	scene_2?: Scene_2;
	scene_3?: Scene_3;

	initialCameraFov = 35;

	constructor() {
		super();
	}

	destruct() {
		if (this.scene) {
			this.scene.traverse((child) => {
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

			this.experience.app.scene.remove(this.scene);

			this.scene?.clear();
			this.scene = undefined;
		}
	}

	construct() {
		this.experience.loader?.on("load", () => {
			if (
				!(
					this.experience.app.camera.instance instanceof THREE.PerspectiveCamera
				)
			)
				return;

			this.scene = new THREE.Group();
			this.scene_1 = new Scene_1();
			this.scene_2 = new Scene_2();
			this.scene_3 = new Scene_3();
			this.controls = new Controls();

			if (this.scene_1.modelGroup) {
				this.scene.add(this.scene_1.modelGroup);
			}

			// CAMERA
			this.experience.app.camera.instance.fov = this.initialCameraFov;
			this.experience.app.camera.instance.far = 50;
			this.experience.app.camera.instance.position.y += 8;
			this.experience.app.camera.instance.position.x -= 2;
			this.experience.app.camera.instance.position.z += 10;
			this.experience.app.camera.miniCamera?.position.set(10, 8, 30);

			if (this.experience.app.debug?.cameraControls)
				this.experience.app.debug.cameraControls.target =
					this.controls.initialLookAtPosition;

			// ADD TO SCENE
			this.scene.add(
				this.controls.curvePathLine,
				this.controls.cameraLookAtPointIndicator
			);
			this.experience.app.scene.add(this.scene);
		});

		this.experience.ui?.on("ready", () => {
			this.intro();
		});
	}

	update() {
		this.controls?.update();
	}

	intro() {
		if (
			!(
				this.controls &&
				this.experience.app.camera.instance instanceof THREE.PerspectiveCamera
			)
		)
			return;

		const { x, y, z } = this.controls.cameraCurvePath.getPointAt(0);

		GSAP.to(this.experience.app.camera.instance.position, {
			...this.experience.world?.controls?.getGsapDefaultProps(),
			...GSAP_DEFAULT_INTRO_PROPS,
			x,
			y,
			z,
			delay: GSAP_DEFAULT_INTRO_PROPS.duration * 0.8,
			onUpdate: () => {
				this.controls?.setCameraLookAt(this.controls.initialLookAtPosition);
			},
			onComplete: () => {
				setTimeout(() => {
					if (this.experience.world?.controls) {
						this.controls?.getGsapDefaultProps().onComplete();

						this.experience.world.controls.autoCameraAnimation = true;
					}
				}, 1000);
			},
		});
	}
}
