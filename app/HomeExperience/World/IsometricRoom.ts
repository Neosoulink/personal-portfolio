import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import ThreeApp from "quick-threejs";

export default class IsometricRoom {
	private app = new ThreeApp();
	model?: GLTF;
	mainGroup?: THREE.Group;
	monitorAScreen?: THREE.Mesh;
	monitorBScreen?: THREE.Mesh;
	phoneScreen?: THREE.Mesh;
	pcScreen?: THREE.Mesh;
	roomShelves?: THREE.Mesh;
	roomBoard?: THREE.Mesh;

	constructor() {
		if ((this.app.resources.items.isometric_room as GLTF).scene) {
			this.model = this.app.resources.items.isometric_room as GLTF;
			this.mainGroup = this.model.scene;

			// MATERIALS
			const BAKED_MATERIAL_FLOOR = new THREE.MeshBasicMaterial({
				map: this.app.resources.items.baked_room_floor as THREE.Texture,
			});
			const BAKED_MATERIAL_WOODS = new THREE.MeshBasicMaterial({
				map: this.app.resources.items.baked_room_woods as THREE.Texture,
			});
			const BAKED_MATERIAL_WALLS = new THREE.MeshBasicMaterial({
				map: this.app.resources.items.baked_room_walls as THREE.Texture,
			});
			const BAKED_MATERIAL_OBJECTS = new THREE.MeshBasicMaterial({
				map: this.app.resources.items.baked_room_objects as THREE.Texture,
			});
			const BAKED_MATERIAL_BACKGROUND = new THREE.MeshBasicMaterial({
				map: this.app.resources.items.baked_room_background as THREE.Texture,
			});

			this.mainGroup?.children.forEach((child) => {
				if (child instanceof THREE.Mesh && child.name === "floor") {
					child.material = BAKED_MATERIAL_FLOOR;
				}
				if (child instanceof THREE.Mesh && child.name === "woods") {
					child.material = BAKED_MATERIAL_WOODS;
				}
				if (child instanceof THREE.Mesh && child.name === "walls") {
					child.material = BAKED_MATERIAL_WALLS;
				}
				if (child instanceof THREE.Mesh && child.name === "objects") {
					child.material = BAKED_MATERIAL_OBJECTS;
				}
				if (child instanceof THREE.Mesh && child.name === "scene-background") {
					child.material = BAKED_MATERIAL_BACKGROUND;
				}

				if (child instanceof THREE.Mesh && child.name === "monitor-screen-a") {
					this.monitorAScreen = child;
				}
				if (child instanceof THREE.Mesh && child.name === "monitor-screen-b") {
					this.monitorBScreen = child;
				}
				if (child instanceof THREE.Mesh && child.name === "phone-screen") {
					this.phoneScreen = child;
				}
				if (child instanceof THREE.Mesh && child.name === "pc-screen001") {
					this.pcScreen = child;
				}
			});
		}
	}
}
