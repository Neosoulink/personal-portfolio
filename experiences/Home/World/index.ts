import * as THREE from "three";
import EventEmitter from "events";

// CLASSES
import Experience from "..";
import IsometricRoom from "./IsometricRoom";
import Interactions from "./Interactions";

export default class World extends EventEmitter {
	private experience = new Experience();
	/**
	 * Group containing the experience.
	 */
	scene?: THREE.Group;
	isometricRoom?: IsometricRoom;
	interactions?: Interactions;
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
			this.isometricRoom = new IsometricRoom();
			this.interactions = new Interactions();

			if (this.isometricRoom.modelGroup) {
				this.scene.add(this.isometricRoom.modelGroup);
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
					this.interactions.initialLookAtPosition;

			// ADD TO SCENE
			this.scene.add(
				this.interactions.curvePathLine,
				this.interactions.cameraLookAtPointIndicator
			);
			this.experience.app.scene.add(this.scene);
		}
	}

	update() {
		this.interactions?.update();
	}
}
