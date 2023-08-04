import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

// CLASSES
import Experience from "..";

export default class IsometricRoom {
	private experience = new Experience();
	model?: GLTF;
	modelGroup?: THREE.Group;
	modelMeshes: { [name: string]: THREE.Mesh | undefined } = {};
	focusPointPositions: {
		camera: THREE.Vector3;
		point: THREE.Vector3;
		bubbles: {
			point: THREE.Vector3;
			domElement: HTMLDivElement | null;
		}[];
	}[] = [];
	elementsPoints: {
		position: THREE.Vector3;
		element: HTMLDivElement | null;
	}[] = [
		{
			position: new THREE.Vector3(-2.8, 1.4, 3),
			element: document.querySelector(".point-0"),
		},
	];

	constructor() {
		const _ISOMETRIC_ROOM = this.experience.app.resources.items
			.isometric_room as GLTF | undefined;
		if ((_ISOMETRIC_ROOM as GLTF).scene) {
			this.model = _ISOMETRIC_ROOM as GLTF;
			this.modelGroup = this.model.scene;

			this.setModelMeshes();
		}

		this.setFocusPointPositions();
	}

	setModelMeshes() {
		const _TEXTURES_MESH_BASIC_MATERIALS =
			this.experience.preloader?.texturesMeshBasicMaterials;

		if (!_TEXTURES_MESH_BASIC_MATERIALS) return;

		this.modelGroup?.children.forEach((child) => {
			if (
				child instanceof THREE.Mesh &&
				child.name === "floor" &&
				_TEXTURES_MESH_BASIC_MATERIALS.baked_room_floor
			)
				child.material = _TEXTURES_MESH_BASIC_MATERIALS.baked_room_floor;
			if (
				child instanceof THREE.Mesh &&
				child.name === "woods" &&
				_TEXTURES_MESH_BASIC_MATERIALS.baked_room_woods
			)
				child.material = _TEXTURES_MESH_BASIC_MATERIALS.baked_room_woods;
			if (
				child instanceof THREE.Mesh &&
				child.name === "walls" &&
				_TEXTURES_MESH_BASIC_MATERIALS.baked_room_walls
			)
				child.material = _TEXTURES_MESH_BASIC_MATERIALS.baked_room_walls;
			if (
				child instanceof THREE.Mesh &&
				child.name === "objects" &&
				_TEXTURES_MESH_BASIC_MATERIALS.baked_room_objects
			)
				child.material = _TEXTURES_MESH_BASIC_MATERIALS.baked_room_objects;
			if (
				child instanceof THREE.Mesh &&
				child.name === "scene-background" &&
				_TEXTURES_MESH_BASIC_MATERIALS.baked_room_background
			)
				child.material = _TEXTURES_MESH_BASIC_MATERIALS.baked_room_background;
			if (child instanceof THREE.Mesh && child.name === "monitor-a-screen") {
				this.modelMeshes["monitorAScreen"] = child;

				_TEXTURES_MESH_BASIC_MATERIALS.windows_10_lock_screen &&
					(this.modelMeshes["monitorAScreen"].material =
						_TEXTURES_MESH_BASIC_MATERIALS.windows_10_lock_screen);
			}
			if (child instanceof THREE.Mesh && child.name === "monitor-b-screen") {
				this.modelMeshes["monitorBScreen"] = child;

				_TEXTURES_MESH_BASIC_MATERIALS.github_screenshot &&
					(this.modelMeshes["monitorBScreen"].material =
						_TEXTURES_MESH_BASIC_MATERIALS.github_screenshot);
			}
			if (child instanceof THREE.Mesh && child.name === "phone-screen001") {
				this.modelMeshes["phoneScreen"] = child;

				_TEXTURES_MESH_BASIC_MATERIALS.github_screenshot &&
					(this.modelMeshes["phoneScreen"].material =
						_TEXTURES_MESH_BASIC_MATERIALS.github_screenshot);
			}
			if (child instanceof THREE.Mesh && child.name === "pc-screen001") {
				this.modelMeshes["pcScreen"] = child;

				_TEXTURES_MESH_BASIC_MATERIALS.windows_11_lock_screen &&
					(this.modelMeshes["pcScreen"].material =
						_TEXTURES_MESH_BASIC_MATERIALS.windows_11_lock_screen);
			}
			if (child instanceof THREE.Mesh && child.name === "frame-1-content") {
				this.modelMeshes["frame1Content"] = child;

				_TEXTURES_MESH_BASIC_MATERIALS.javascript_logo &&
					(this.modelMeshes["frame1Content"].material =
						_TEXTURES_MESH_BASIC_MATERIALS.javascript_logo);
			}
			if (child instanceof THREE.Mesh && child.name === "frame-2-content") {
				this.modelMeshes["frame2Content"] = child;

				_TEXTURES_MESH_BASIC_MATERIALS.profile_photo &&
					(this.modelMeshes["frame2Content"].material =
						_TEXTURES_MESH_BASIC_MATERIALS.profile_photo);
			}
			if (child instanceof THREE.Mesh && child.name === "frame-3-content") {
				this.modelMeshes["frame3Content"] = child;

				_TEXTURES_MESH_BASIC_MATERIALS.typescript_logo &&
					(this.modelMeshes["frame3Content"].material =
						_TEXTURES_MESH_BASIC_MATERIALS.typescript_logo);
			}
		});
	}

	setFocusPointPositions() {
		const _DESK_POSITION =
			this.modelMeshes["pcScreen"]?.position ?? new THREE.Vector3();
		const _SHELVES_POSITION = new THREE.Vector3(-3, 1.4, 3);
		const _BOARD_POSITION = new THREE.Vector3(-1.2, 3.8, -4.1);
		const _SUPPORTS_POSITION = new THREE.Vector3(-3, 4, 1.85);

		this.focusPointPositions = [
			{
				camera: _DESK_POSITION.clone().set(0, _DESK_POSITION.y + 0.2, 0),
				point: _DESK_POSITION,
				bubbles: [
					{
						point: new THREE.Vector3(0, 0, 0),
						domElement: null,
					},
				],
			},
			{
				camera: _SHELVES_POSITION
					.clone()
					.set(
						_SHELVES_POSITION.x + 3,
						_SHELVES_POSITION.y + 0.8,
						_SHELVES_POSITION.z
					),
				point: _SHELVES_POSITION,
				bubbles: [
					{
						point: new THREE.Vector3(0, 0, 0),
						domElement: null,
					},
				],
			},
			{
				camera: _BOARD_POSITION
					.clone()
					.set(_BOARD_POSITION.x, _BOARD_POSITION.y, _BOARD_POSITION.z + 3.2),
				point: _BOARD_POSITION,
				bubbles: [
					{
						point: new THREE.Vector3(0, 0, 0),
						domElement: null,
					},
				],
			},
			{
				camera: _SUPPORTS_POSITION
					.clone()
					.set(
						_SUPPORTS_POSITION.x + 3,
						_SUPPORTS_POSITION.y + 0.8,
						_SUPPORTS_POSITION.z
					),
				point: _SUPPORTS_POSITION,
				bubbles: [
					{
						point: new THREE.Vector3(0, 0, 0),
						domElement: null,
					},
				],
			},
		];
	}
}
