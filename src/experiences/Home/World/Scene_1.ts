import { type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

// ---
import Experience from "..";

// Interfaces
import type Base from "@/interfaces/BaseExperience";

export default class Scene_1 implements Base {
	private experience = new Experience();
	model?: GLTF;
	modelGroup?: THREE.Group;
	modelMeshes: { [name: string]: THREE.Mesh | undefined } = {};

	constructor() {
		const _ISOMETRIC_ROOM = this.experience.app.resources.items.scene_1_room as
			| GLTF
			| undefined;

		if (_ISOMETRIC_ROOM?.scene) {
			this.model = _ISOMETRIC_ROOM;
			this.modelGroup = this.model.scene;

			this.setModelMeshes();
		}
	}

	construct() {}
	destruct() {}

	private setModelMeshes() {
		const _TEXTURES_MESH_BASIC_MATERIALS =
			this.experience.loader?.texturesMeshBasicMaterials;

		if (!_TEXTURES_MESH_BASIC_MATERIALS) return;

		console.log(
			"this.modelGroup?.children ==>",
			this.modelGroup?.children,
			_TEXTURES_MESH_BASIC_MATERIALS
		);

		this.modelGroup?.children.forEach((child) => {
			// Applying baked texture to Model
			if (
				child instanceof THREE.Mesh &&
				child.name === "scene_1_room" &&
				_TEXTURES_MESH_BASIC_MATERIALS.scene_1_room_baked_texture
			) {
				~(child.material =
					_TEXTURES_MESH_BASIC_MATERIALS.scene_1_room_baked_texture);
			}

			// Applying custom texture to Models objects
			if (
				child instanceof THREE.Mesh &&
				child.name === "pc-screen" &&
				_TEXTURES_MESH_BASIC_MATERIALS.typescript_logo
			) {
				~((this.modelMeshes["pcScreen"] = child).material =
					_TEXTURES_MESH_BASIC_MATERIALS.typescript_logo);
			}
		});
	}
}
