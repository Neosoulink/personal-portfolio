import { MeshBasicMaterial, Texture, SRGBColorSpace } from "three";

// EXPERIENCE
import HomeExperience from ".";

// MODELS
import {
	CONSTRUCTED,
	DESTRUCTED,
	LOADED,
	PROGRESSED,
	STARTED,
} from "@/experiences/common/Event.model";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "@/experiences/blueprints/ExperienceBased.blueprint";

export default class Loader extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();
	protected readonly _appResources = this._experience.app.resources;

	texturesMeshBasicMaterials: {
		[name: string]: MeshBasicMaterial;
	} = {};
	progress = 0;

	constructor() {
		super();

		// RESOURCES
		this._appResources.setDracoLoader("/decoders/draco/");
		this._appResources.setSources([
			{
				name: "scene_1_room",
				type: "gltfModel",
				path: "/3d_models/isometric_room/scene_1_room.glb",
			},
			{
				name: "scene_background",
				type: "gltfModel",
				path: "/3d_models/isometric_room/scene_background.glb",
			},
			{
				name: "scene_1_room_baked_texture",
				type: "texture",
				path: "/3d_models/isometric_room/scene_1_room_baked_texture.jpg",
			},
			{
				name: "scene_1_woods_baked_texture",
				type: "texture",
				path: "/3d_models/isometric_room/scene_1_woods_baked_texture.jpg",
			},
			{
				name: "scene_background_baked_texture",
				type: "texture",
				path: "/3d_models/isometric_room/scene_background_baked_texture.jpg",
			},
		]);
	}

	construct() {
		~(this._appResources.loadingManager.onStart = () => {
			this.emit(STARTED, (this.progress = 0));
		});

		~(this._appResources.loadingManager.onProgress = (
			itemUrl,
			itemsLoaded,
			itemsToLoad
		) => {
			this.emit(
				PROGRESSED,
				(this.progress = (itemsLoaded / itemsToLoad) * 100),
				itemUrl
			);
		});

		~(this._appResources.loadingManager.onLoad = () => {
			this.correctTextures();
			this._initMeshTextures();

			this.emit(LOADED, this.progress);
		});

		this.emit(CONSTRUCTED, this.progress);
		this._appResources.startLoading();
	}

	destruct() {
		Object.keys(this.texturesMeshBasicMaterials).forEach((key) =>
			this.texturesMeshBasicMaterials[key].dispose()
		);
		this.texturesMeshBasicMaterials = {};

		this._appResources.loadingManager.removeHandler(
			/onStart|onError|onProgress|onLoad/
		);
		this._appResources.setSources([]);

		this.emit(DESTRUCTED);
	}

	/** Correct resources texture color and flip faces. */
	correctTextures() {
		Object.keys(this._appResources.items).forEach((key) => {
			const ITEM = this._appResources.items[key];
			if (ITEM instanceof Texture) {
				ITEM.flipY = false;
				ITEM.colorSpace = SRGBColorSpace;
			}
		});
	}

	/** Initialize Mesh textures. */
	protected _initMeshTextures() {
		if (this._appResources.items) {
			const _ITEMS = this._appResources.items;
			const _ITEMS_KEYS = Object.keys(_ITEMS);

			_ITEMS_KEYS.forEach((key) => {
				const _ITEM = _ITEMS[key];

				if (_ITEM instanceof Texture) {
					this.texturesMeshBasicMaterials[key] = new MeshBasicMaterial({
						map: _ITEM,
						transparent: true,
					});
				}
			});
		}
	}
}
