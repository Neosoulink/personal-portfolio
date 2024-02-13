import { Texture, LinearSRGBColorSpace, VideoTexture } from "three";
import type { LoadedItem, Source } from "quick-threejs/lib/utils/Resources";
import { events as quickEvents } from "quick-threejs/lib/static";

// EXPERIENCE
import { HomeExperience } from ".";

// STATIC
import {
	CHANGED,
	CONSTRUCTED,
	DESTRUCTED,
	LOADED,
	PROGRESSED,
	STARTED,
} from "~/static/event.static";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// ASSETS
import scene_1_model from "~/assets/models/scene_1/model.glb?url";
import scene_1_lights_baked_texture from "~/assets/models/scene_1/lights_baked_texture.jpg?url";
import scene_1_no_lights_baked_texture from "~/assets/models/scene_1/no_lights_baked_texture.jpg?url";
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

import computer_startup_audio from "~/assets/sounds/computer_startup.mp3?url";
import keyboard_typing_audio from "~/assets/sounds/keyboard_typing.mp3?url";
import empty_room_audio from "~/assets/sounds/empty_room_ambient_noise.mp3?url";

/**
 * [`quick-threejs#Resource`](https://www.npmjs.com/package/quick-threejs)
 * Subset module. In charge of managing resources to load.
 */
export class Loader extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appResources = this._experience.app.resources;

	private _progress = 0;
	private _availableTextures: { [name: string]: Texture } = {};
	private _availableAudios: { [name: string]: AudioBuffer } = {};

	constructor() {
		super();

		// RESOURCES
		this._appResources.setDracoLoader(
			"https://www.gstatic.com/draco/versioned/decoders/1.4.3/"
		);
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
				path: scene_1_no_lights_baked_texture,
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

			// AUDIO
			{
				name: "computer_startup_audio",
				type: "audio",
				path: computer_startup_audio,
			},
			{
				name: "keyboard_typing_audio",
				type: "audio",
				path: keyboard_typing_audio,
			},
			{
				name: "empty_room_audio",
				type: "audio",
				path: empty_room_audio,
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

	private _initAvailableResource(source: Source, file: LoadedItem) {
		if (file instanceof Texture) {
			this.correctTextures(file);
			this._availableTextures[source.name] = file;
		}

		if (file instanceof AudioBuffer) this._availableAudios[source.name] = file;

		this.emit(CHANGED);
	}

	public get progress() {
		return this._progress;
	}

	public get availableTextures() {
		return this._availableTextures;
	}

	public get availableAudios() {
		return this._availableAudios;
	}

	/** Correct resource textures color and flip faces. */
	public correctTextures(item: Texture) {
		if (item instanceof Texture) {
			if (!(item instanceof VideoTexture)) item.flipY = false;
			item.colorSpace = LinearSRGBColorSpace;
		}
	}

	public construct() {
		const onStart = () => {
			this.emit(STARTED, this._progress);
		};
		const onProgress = (
			itemsLoaded: number,
			itemsToLoad: number,
			source: Source,
			file: LoadedItem
		) => {
			this._progress = (itemsLoaded / itemsToLoad) * 100;
			this.emit(PROGRESSED, this._progress, source.path);
			this._initAvailableResource(source, file);
		};

		const onLoad = () => {
			this._appResources.off("start", onStart);
			this._appResources.off("progress", onProgress);
			this._appResources.off("load", onLoad);
			this.emit(LOADED, this._progress);
		};

		this._progress = 0;
		this._appResources.on(quickEvents.STARTED, onStart);
		this._appResources.on(quickEvents.PROGRESSED, onProgress);
		this._appResources.on(quickEvents.LOADED, onLoad);
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

		this.emit(DESTRUCTED);
		this.removeAllListeners();
	}
}
