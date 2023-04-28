import * as THREE from "three";
import EventEmitter from "events";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// CLASSES
import ThreeApp from "..";

// TYPES
import type { SourceType } from "./../sources";

export interface ResourcesConstructor extends SourceType {}
export type LoadedItemType = GLTF | THREE.Texture | THREE.CubeTexture;

export default class Resources extends EventEmitter {
	app: ThreeApp;
	sources: ResourcesConstructor[];
	items: { [name: SourceType['name']]: LoadedItemType } = {};
	toLoad = 0;
	loaded = 0;
	loaders: {
		gltfLoader?: GLTFLoader;
		textureLoader?: THREE.TextureLoader;
		cubeTextureLoader?: THREE.CubeTextureLoader;
	} = {};

	constructor(sources: ResourcesConstructor[]) {
		super();

		this.app = new ThreeApp();
		this.sources = sources;

		this.toLoad = this.sources.length;

		this.setLoaders();
		this.startLoading();
	}

	setLoaders() {
		this.loaders.gltfLoader = new GLTFLoader();
		this.loaders.textureLoader = new THREE.TextureLoader();
		this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
	}

	startLoading() {
		for (const source of this.sources) {
			if (source.type === "gltfModel" && typeof source.path === "string") {
				this.loaders.gltfLoader?.load(source.path, (file) => {
					this.sourceLoaded(source, file);
				});
			} else if (source.type === "texture" && typeof source.path === "string") {
				this.loaders.textureLoader?.load(source.path, (file) => {
					this.sourceLoaded(source, file);
				});
			} else if (
				source.type === "cubeTexture" &&
				typeof source.path === "object"
			) {
				this.loaders.cubeTextureLoader?.load(source.path, (file) => {
					this.sourceLoaded(source, file);
				});
			}
		}
	}

	sourceLoaded(source: SourceType, file: LoadedItemType) {
		this.items[source.name] = file;
		this.loaded++;

		if (this.loaded === this.toLoad) {
			this.emit("ready", true);
		}
	}
}
