import { Texture, LinearSRGBColorSpace, CubeTexture } from "three";

// EXPERIENCE
import { HomeExperience } from ".";

// MODELS
import {
	CONSTRUCTED,
	DESTRUCTED,
	LOADED,
	PROGRESSED,
	STARTED,
} from "~/common/event.model";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/experiences/blueprints/experience-based.blueprint";

export class Loader extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();
	private readonly _appResources = this._experience.app.resources;

	private _progress = 0;
	private _availableTextures: { [name: string]: Texture } = {};

	constructor() {
		super();

		// RESOURCES
		this._appResources.setDracoLoader("/decoders/draco/");
		this._appResources.setSources([
			// SCENE 1
			{
				name: "scene_1",
				type: "gltfModel",
				path: "/models/scene_1/model.glb",
			},
			{
				name: "scene_1_lights_baked_texture",
				type: "texture",
				path: "/models/scene_1/lights_baked_texture.jpg",
			},
			{
				name: "scene_1_no_lights_baked_texture",
				type: "texture",
				path: "/models/scene_1/no_lights_baked_texture.jpg",
			},
			{
				name: "scene_1_woods_lights_baked_texture",
				type: "texture",
				path: "/models/scene_1/woods_lights_baked_texture.jpg",
			},
			{
				name: "scene_1_woods_no_lights_baked_texture",
				type: "texture",
				path: "/models/scene_1/woods_no_lights_baked_texture.jpg",
			},
			{
				name: "scene_1_tree_baked_texture",
				type: "texture",
				path: "/models/scene_1/tree_baked_texture.jpg",
			},

			// SCENE 2
			{
				name: "scene_2",
				type: "gltfModel",
				path: "/models/scene_2/model.glb",
			},
			{
				name: "scene_2_baked_texture",
				type: "texture",
				path: "/models/scene_2/baked_texture.jpg",
			},

			// SCENE 3
			{
				name: "scene_3",
				type: "gltfModel",
				path: "/models/scene_3/model.glb",
			},
			{
				name: "scene_3_baked_texture",
				type: "texture",
				path: "/models/scene_3/baked_texture.jpg",
			},

			// SCENE CONTAINER
			{
				name: "scene_container",
				type: "gltfModel",
				path: "/models/scene_container/model.glb",
			},
			{
				name: "scene_container_baked_texture",
				type: "texture",
				path: "/models/scene_container/baked_texture.jpg",
			},

			// OTHER TEXTURES
			{
				name: "cloudAlphaMap",
				type: "texture",
				path: "/textures/cloudAlphaMap.jpg",
			},
			{
				name: "rocksAlphaMap",
				type: "texture",
				path: "/textures/rocksAlphaMap.png",
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
