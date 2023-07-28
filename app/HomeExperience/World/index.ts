import * as THREE from "three";
import EventEmitter from "events";
import QuickThree from "quick-threejs";

// CLASSES
import IsometricRoom from "./IsometricRoom";

export default class World extends EventEmitter {
	private app = new QuickThree();
	scene?: THREE.Group;
	isometricRoom?: IsometricRoom;

	constructor() {
		super();

		this.app.resources.on("ready", () => {
			this.scene = new THREE.Group();
			this.isometricRoom = new IsometricRoom();

			if (this.isometricRoom.scene) {
				this.scene.add(this.isometricRoom.scene);
			}

			this.app.scene.add(this.scene);

			this.emit("ready");
		});
	}

	resize() {}

	update() {}

	destroy() {}
}
