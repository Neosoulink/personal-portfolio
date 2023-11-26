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

export default class World extends EventEmitter implements ExperienceBase {
	private readonly experience = new Experience();
	controls?: Controls;

	/** Represent the Threejs `Group` containing the experience. */
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

			// ADD TO SCENE
			this.scene.add(
				this.controls.curvePathLine,
				this.controls.cameraLookAtPointIndicator
			);
			this.experience.app.scene.add(this.scene);
		});
	}

	update() {
		this.controls?.update();
	}
}
