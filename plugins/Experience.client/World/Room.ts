import * as THREE from "three";
import ThreeApp from "quick-threejs";

export default class Room {
	private app = new ThreeApp();
	isometric_room?: THREE.Mesh;

	constructor() {
		if (this.app.resources.items.isometric_room instanceof THREE.Mesh) {
			this.isometric_room = this.app.resources.items.isometric_room;
		}
	}
}
