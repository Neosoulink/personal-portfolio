import { Texture, LinearSRGBColorSpace, VideoTexture } from "three";

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
import phoneScreenshotTexture from "~/assets/textures/phone_icons.png?url";
import monitor_a_screen_record from "~/assets/videos/monitor_a_screen_record.webm?url";
import monitor_b_screen_record from "~/assets/videos/monitor_b_screen_record.webm?url";
import phone_screen_record from "~/assets/videos/phone_screen_record.webm?url";
import { events } from "~/static";

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

			// VIDEO TEXTURES
			{
				name: "monitor_a_screen_record",
				type: "video",
				path: monitor_a_screen_record,
			},
			{
				name: "monitor_b_screen_record",
				type: "video",
				path: monitor_b_screen_record,
			},
			{
				name: "phone_screen_record",
				type: "video",
				path: phone_screen_record,
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
			{
				name: "phoneScreenshot",
				type: "texture",
				path: phoneScreenshotTexture,
			},
		]);
	}

	/** Correct resource textures color and flip faces. */
	private _correctTextures() {
		const _KEYS = Object.keys(this._appResources.items);
		for (let i = 0; i < _KEYS.length; i++) {
			const _ITEM = this._appResources.items[_KEYS[i]];
			if (_ITEM instanceof Texture) {
				if (!(_ITEM instanceof VideoTexture)) _ITEM.flipY = false;
				_ITEM.colorSpace = LinearSRGBColorSpace;
			}
		}
	}

	private _setAvailableTexture(): typeof this._availableTextures {
		const ITEMS = this._appResources.items;
		if (!(ITEMS && Object.keys(ITEMS).length)) return {};

		const _AVAILABLE_TEXTURES: typeof this._availableTextures = {};
		const _KEYS = Object.keys(ITEMS);
		for (let i = 0; i < _KEYS.length; i++) {
			const ITEM = ITEMS[_KEYS[i]];

			if (ITEM instanceof Texture) _AVAILABLE_TEXTURES[_KEYS[i]] = ITEM;
		}

		this._availableTextures = _AVAILABLE_TEXTURES;
		return this._availableTextures;
	}

	public get progress() {
		return this._progress;
	}

	public get availableTextures() {
		return this._availableTextures;
	}

	public construct() {
		const onStart = () => {
			this.emit(events.STARTED, this._progress);
		};
		const onProgress = (
			itemPath: string,
			itemsLoaded: number,
			itemsToLoad: number
		) => {
			this._progress = (itemsLoaded / itemsToLoad) * 100;

			this.emit(PROGRESSED, this._progress, itemPath);
		};
		const onLoad = () => {
			this._correctTextures();
			this._setAvailableTexture();

			// this._appResources.off("start", onStart);
			this._appResources.off("progress", onProgress);
			this._appResources.off("load", onLoad);
			this.emit(LOADED, this._progress);
		};

		this._progress = 0;
		this._appResources.on("start", onStart);
		this._appResources.on("progress", onProgress);
		this._appResources.on("load", onLoad);
		this._appResources.startLoading();
		this.emit(CONSTRUCTED, this._progress);
	}

	public destruct() {
		this._appResources.loadingManager.removeHandler(
			/onStart|onError|onProgress|onLoad/
		);
		const keys = Object.keys(this._appResources.items);

		for (let i = 0; i < keys.length; i++) {
			const item = this._appResources.items[keys[i]];
			if (item instanceof Texture) item.dispose();
		}

		this._appResources.setSources([]);
		this.removeAllListeners();
		this.emit(DESTRUCTED);
	}
}
