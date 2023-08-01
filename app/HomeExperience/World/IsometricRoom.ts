import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

// CLASSES
import Experience from "..";

export default class IsometricRoom {
	private experience = new Experience();
	model?: GLTF;
	mainGroup?: THREE.Group;
	monitorAScreen?: THREE.Mesh;
	monitorBScreen?: THREE.Mesh;
	phoneScreen?: THREE.Mesh;
	pcScreen?: THREE.Mesh;
	roomShelves?: THREE.Mesh;
	roomBoard?: THREE.Mesh;
	frame1Content?: THREE.Mesh;
	frame2Content?: THREE.Mesh;
	frame3Content?: THREE.Mesh;

	constructor() {
		if ((this.experience.app.resources.items.isometric_room as GLTF).scene) {
			this.model = this.experience.app.resources.items.isometric_room as GLTF;
			this.mainGroup = this.model.scene;

			console.log("this.mainGroup ==>", this.mainGroup);

			this.mainGroup?.children.forEach((child) => {
				if (child instanceof THREE.Mesh && child.name === "floor") {
					this.experience.preloader?.texturesMeshBasicMaterials
						.baked_room_floor &&
						(child.material =
							this.experience.preloader.texturesMeshBasicMaterials.baked_room_floor);
				}
				if (child instanceof THREE.Mesh && child.name === "woods") {
					this.experience.preloader?.texturesMeshBasicMaterials
						.baked_room_woods &&
						(child.material =
							this.experience.preloader.texturesMeshBasicMaterials.baked_room_woods);
				}
				if (child instanceof THREE.Mesh && child.name === "walls") {
					this.experience.preloader?.texturesMeshBasicMaterials
						.baked_room_walls &&
						(child.material =
							this.experience.preloader.texturesMeshBasicMaterials.baked_room_walls);
				}
				if (child instanceof THREE.Mesh && child.name === "objects") {
					this.experience.preloader?.texturesMeshBasicMaterials
						.baked_room_objects &&
						(child.material =
							this.experience.preloader.texturesMeshBasicMaterials.baked_room_objects);
				}
				if (child instanceof THREE.Mesh && child.name === "scene-background") {
					this.experience.preloader?.texturesMeshBasicMaterials
						.baked_room_background &&
						(child.material =
							this.experience.preloader.texturesMeshBasicMaterials.baked_room_background);
				}

				if (child instanceof THREE.Mesh && child.name === "monitor-a-screen") {
					this.monitorAScreen = child;

					this.experience.preloader?.texturesMeshBasicMaterials
						.windows_10_lock_screen &&
						(this.monitorAScreen.material =
							this.experience.preloader.texturesMeshBasicMaterials.windows_10_lock_screen);
				}
				if (child instanceof THREE.Mesh && child.name === "monitor-b-screen") {
					this.monitorBScreen = child;

					this.experience.preloader?.texturesMeshBasicMaterials
						.github_screenshot &&
						(this.monitorBScreen.material =
							this.experience.preloader.texturesMeshBasicMaterials.github_screenshot);
				}
				if (child instanceof THREE.Mesh && child.name === "phone-screen001") {
					this.phoneScreen = child;

					this.experience.preloader?.texturesMeshBasicMaterials
						.github_screenshot &&
						(this.phoneScreen.material =
							this.experience.preloader.texturesMeshBasicMaterials.github_screenshot);
				}
				if (child instanceof THREE.Mesh && child.name === "pc-screen001") {
					this.pcScreen = child;

					this.experience.preloader?.texturesMeshBasicMaterials
						.windows_11_lock_screen &&
						(this.pcScreen.material =
							this.experience.preloader.texturesMeshBasicMaterials.windows_11_lock_screen);
				}
				if (child instanceof THREE.Mesh && child.name === "frame-1-content") {
					this.frame1Content = child;

					this.experience.preloader?.texturesMeshBasicMaterials
						.javascript_logo &&
						(this.frame1Content.material =
							this.experience.preloader.texturesMeshBasicMaterials.javascript_logo);
				}
				if (child instanceof THREE.Mesh && child.name === "frame-2-content") {
					this.frame2Content = child;

					this.experience.preloader?.texturesMeshBasicMaterials.profile_photo &&
						(this.frame2Content.material =
							this.experience.preloader.texturesMeshBasicMaterials.profile_photo);
				}
				if (child instanceof THREE.Mesh && child.name === "frame-3-content") {
					this.frame3Content = child;

					this.experience.preloader?.texturesMeshBasicMaterials
						.typescript_logo &&
						(this.frame3Content.material =
							this.experience.preloader.texturesMeshBasicMaterials.typescript_logo);
				}
			});
		}
	}
}
