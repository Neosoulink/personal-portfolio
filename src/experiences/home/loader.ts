import { Texture, LinearSRGBColorSpace, CubeTexture } from "three";

// EXPERIENCE
import { HomeExperience } from ".";

// STATIC
import {
	CONSTRUCTED,
	DESTRUCTED,
	LOADED,
	PROGRESSED,
	STARTED,
} from "~/static/event.static";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";

// ASSETS
import scene_1_model from "~/assets/models/scene_1/model.glb?url";
import scene_1_lights_baked_texture from "~/assets/models/scene_1/lights_baked_texture.jpg?url";
import scene_1no_lights_baked_texture from "~/assets/models/scene_1/no_lights_baked_texture.jpg?url";
import scene_1_woods_lights_baked_texture from "~/assets/models/scene_1/woods_lights_baked_texture.jpg?url";

import scene_1_woods_no_lights_baked_texture from "~/assets/models/scene_1/woods_no_lights_baked_texture.jpg?url";

import scene_1_tree_baked_texture from "~/assets/models/scene_1/tree_baked_texture.jpg?url";
import scene_2_model from "~/assets/models/scene_2/model.glb?url";
import scene_2_baked_texture from "~/assets/models/scene_2/baked_texture.jpg?url";
import scene_3_model from "~/assets/models/scene_3/model.glb?url";
import scene_3_baked_texture from "~/assets/models/scene_3/baked_texture.jpg?url";
import scene_container_model from "~/assets/models/scene_container/model.glb?url";
import scene_container_baked_texture from "~/assets/models/scene_container/baked_texture.jpg?url";
import cloudAlphaMapTexture from "~/assets/textures/cloudAlphaMap.jpg?url";
import rocksAlphaMapTexture from "~/assets/textures/rocksAlphaMap.jpg?url";

export class Loader extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();
	private readonly _appResources = this._experience.app.resources;

	private _progress = 0;
	private _availableTextures: { [name: string]: Texture } = {};

	constructor() {
		super();

		// RESOURCES
		this._appResources.setDracoLoader("/decoders/draco-gltf/");
		this._appResources.setSources([
			// SCENE 1
			{
				name: "scene_1",
				type: "gltfModel",
				path: scene_1_model,
			},
			{
				name: "scene_1_lights_baked_texture",
				type: "texture",
				path: scene_1_lights_baked_texture,
			},
			{
				name: "scene_1_no_lights_baked_texture",
				type: "texture",
				path: scene_1no_lights_baked_texture,
			},
			{
				name: "scene_1_woods_lights_baked_texture",
				type: "texture",
				path: scene_1_woods_lights_baked_texture,
			},
			{
				name: "scene_1_woods_no_lights_baked_texture",
				type: "texture",
				path: scene_1_woods_no_lights_baked_texture,
			},
			{
				name: "scene_1_tree_baked_texture",
				type: "texture",
				path: scene_1_tree_baked_texture,
			},

			// SCENE 2
			{
				name: "scene_2",
				type: "gltfModel",
				path: scene_2_model,
			},
			{
				name: "scene_2_baked_texture",
				type: "texture",
				path: scene_2_baked_texture,
			},

			// SCENE 3
			{
				name: "scene_3",
				type: "gltfModel",
				path: scene_3_model,
			},
			{
				name: "scene_3_baked_texture",
				type: "texture",
				path: scene_3_baked_texture,
			},

			// SCENE CONTAINER
			{
				name: "scene_container",
				type: "gltfModel",
				path: scene_container_model,
			},
			{
				name: "scene_container_baked_texture",
				type: "texture",
				path: scene_container_baked_texture,
			},

			// OTHER TEXTURES
			{
				name: "cloudAlphaMap",
				type: "texture",
				path: cloudAlphaMapTexture,
			},
			{
				name: "rocksAlphaMap",
				type: "texture",
				path: rocksAlphaMapTexture,
			},
		]);
	}

	/** Correct resource textures color and flip faces. */
	private _correctTextures() {
		Object.keys(this._appResources.items).forEach((key) => {
			const ITEM = this._appResources.items[key];
			if (ITEM instanceof Texture) {
				ITEM.flipY = false;
				ITEM.colorSpace = LinearSRGBColorSpace;
			}
		});
	}

	private _setAvailableTexture(): typeof this._availableTextures {
		const ITEMS = this._appResources.items;
		if (!(ITEMS && Object.keys(ITEMS).length)) return {};

		const AVAILABLE_TEXTURES: typeof this._availableTextures = {};

		Object.keys(ITEMS).forEach((key) => {
			const ITEM = ITEMS[key];

			ITEM instanceof Texture && (AVAILABLE_TEXTURES[key] = ITEM);
		});

		return (this._availableTextures = AVAILABLE_TEXTURES);
	}

	public get progress() {
		return this._progress;
	}

	public get availableTextures() {
		return this._availableTextures;
	}

	public construct() {
		~(this._appResources.loadingManager.onStart = () => {
			this.emit(STARTED, (this._progress = 0));
		});

		~(this._appResources.loadingManager.onProgress = (
			itemUrl,
			itemsLoaded,
			itemsToLoad
		) => {
			this.emit(
				PROGRESSED,
				(this._progress = (itemsLoaded / itemsToLoad) * 100),
				itemUrl
			);
		});

		~(this._appResources.loadingManager.onLoad = () => {
			this._correctTextures();
			this._setAvailableTexture();

			this.emit(LOADED, this._progress);
		});

		this._appResources.startLoading();
		this.emit(CONSTRUCTED, this._progress);
	}

	public destruct() {
		this._appResources.loadingManager.removeHandler(
			/onStart|onError|onProgress|onLoad/
		);

		Object.keys(this._appResources.items).forEach((key) => {
			const ITEM = this._appResources.items[key];
			if (ITEM instanceof Texture || ITEM instanceof CubeTexture)
				ITEM.dispose();
			if (ITEM instanceof CubeTexture) ITEM.dispose();
		});

		this._appResources.setSources([]);

		this.emit(DESTRUCTED);
	}
}
