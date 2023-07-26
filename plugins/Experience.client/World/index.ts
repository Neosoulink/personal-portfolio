import * as THREE from "three";
import EventEmitter from "events";
import QuickThree from "quick-threejs";

// CLASSES
import Room from "./Room";

export default class World extends EventEmitter {
	private app = new QuickThree();
	room?: Room;
	world?: THREE.Group;

	constructor() {
		super();

		this.app.resources.on("ready", () => {
			this.room = new Room();

			this.emit("ready");
		});
	}

	resize() {}

	update() {}
}
