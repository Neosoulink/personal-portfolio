import * as THREE from "three";
import EventEmitter from "events";

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

	/** `Represent the Threejs `Group` containing the experience. */
	scene?: THREE.Group;

	scene_1?: Scene_1;
	scene_2?: Scene_2;
	scene_3?: Scene_3;

	initialCameraFov = 35;

	constructor() {
		super();

		this.setEvents();
	}

	setEvents() {
		this.experience.app.resources.on("ready", () => {
			this.emit("ready");
		});
	}

	resize() {}

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

			this.experience.app.destroy();
		}
	}

	construct() {
		if (
			this.experience.app.camera.instance instanceof THREE.PerspectiveCamera
		) {
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
		}
	}

	update() {
		// this.controls?.update();
	}
}
