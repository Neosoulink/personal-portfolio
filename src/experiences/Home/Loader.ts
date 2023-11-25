import * as THREE from "three";
import GSAP from "gsap";
import EventEmitter from "events";

// ---
import Experience from ".";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";
import { type ExperienceEvents } from "@/interfaces/experienceEvents";

export default class Loader extends EventEmitter implements ExperienceBase {
	private readonly experience = new Experience();

	texturesMeshBasicMaterials: {
		[name: string]: THREE.MeshBasicMaterial;
	} = {};
	progress = 0;

	constructor() {
		super();

		// RESOURCES
		this.experience.app.resources.setDracoLoader("/decoders/draco/");
		this.experience.app.resources.setSources([
			{
				name: "scene_1_room",
				type: "gltfModel",
				path: "/3d_models/isometric_room/scene_1_room.glb",
			},
			{
				name: "scene_1_room_baked_texture",
				type: "texture",
				path: "/3d_models/isometric_room/scene_1_room_baked_texture.jpg",
			},
			{
				name: "typescript_logo",
				type: "texture",
				path: "textures/typescript_logo.jpg",
			},
		]);
	}

	construct() {
		~(this.experience.app.resources.loadingManager.onStart = () => {
			this.emit("start", (this.progress = 0));
		});

		~(this.experience.app.resources.loadingManager.onProgress = (
			itemUrl,
			itemsLoaded,
			itemsToLoad
		) => {
			this.emit(
				"progress",
				(this.progress = (itemsLoaded / itemsToLoad) * 100),
				itemUrl
			);
		});

		~(this.experience.app.resources.loadingManager.onLoad = () => {
			this.correctTextures();
			this.initMeshTextures();

			this.emit("load", this.progress);
		});

		this.experience.app.resources.startLoading();
	}

	destruct() {
		Object.keys(this.texturesMeshBasicMaterials).forEach((key) =>
			this.texturesMeshBasicMaterials[key].dispose()
		);
		this.texturesMeshBasicMaterials = {};

		this.experience.app.resources.loadingManager.removeHandler(
			/onStart|onError|onProgress|onLoad/
		);
		this.experience.app.resources.setSources([]);
	}

	/** Correct resources texture color and flip faces. */
	correctTextures() {
		Object.keys(this.experience.app.resources.items).forEach((key) => {
			const ITEM = this.experience.app.resources.items[key];
			if (ITEM instanceof THREE.Texture) {
				ITEM.flipY = false;
				ITEM.colorSpace = THREE.SRGBColorSpace;
			}
		});
	}

	/** Initialize Mesh textures. */
	initMeshTextures() {
		if (this.experience.app.resources.items) {
			const _ITEMS = this.experience.app.resources.items;
			const _ITEMS_KEYS = Object.keys(_ITEMS);

			_ITEMS_KEYS.forEach((key) => {
				const _ITEM = _ITEMS[key];

				if (_ITEM instanceof THREE.Texture) {
					this.texturesMeshBasicMaterials[key] = new THREE.MeshBasicMaterial({
						map: _ITEM,
						transparent: true,
					});
				}
			});
		}
	}
}
