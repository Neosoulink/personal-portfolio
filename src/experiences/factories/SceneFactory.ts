import { Group, type CatmullRomCurve3, Mesh } from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import EventEmitter from "events";

// EXPERIENCES
import HomeExperience from "@/experiences/pages/Home";

// INTERFACES
import { type ExperienceBase } from "@interfaces/experienceBase";

// TODO: Link with the names of assets in the `app.loader` assets names
export interface ModelChildrenTextures {
	childName: string;
	linkedTextureName: string;
}

export interface SceneFactoryProps {
	cameraPath: CatmullRomCurve3;
	modelName: string;
	modelChildrenTextures: ModelChildrenTextures[];
}

export abstract class SceneFactory
	extends EventEmitter
	implements ExperienceBase
{
	protected readonly _experience = new HomeExperience();
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _Loader = this._experience.loader;
	protected readonly _modelMeshes: { [name: string]: Mesh | undefined } = {};
	protected _modelChildrenTextures: ModelChildrenTextures[];
	protected _model?: GLTF;
	public modelScene?: Group;
	public cameraPath: CatmullRomCurve3;
	public readonly eventListNames = {
		constructed: "constructed",
		destructed: "destructed",
	};

	constructor(_: SceneFactoryProps) {
		super();
		const _MODEL = this._experience.app.resources.items[_.modelName] as
			| GLTF
			| undefined;
		if (_MODEL?.scene) this._model = _MODEL;
		this.cameraPath = _.cameraPath;
		this._modelChildrenTextures = _.modelChildrenTextures;
	}

	public abstract construct(): unknown;
	public abstract destruct(): unknown;
	public abstract update(): unknown;
	public abstract intro(): unknown;
	public abstract outro(): unknown;
	/** Protected method that serve to set scene textures. */
	protected _setModelMaterials() {
		const TEXTURES_MESH_BASIC_MATERIALS =
			this._Loader?.texturesMeshBasicMaterials;

		if (!TEXTURES_MESH_BASIC_MATERIALS) return;

		this.modelScene?.children.forEach((child) => {
			this._modelChildrenTextures.forEach((item) => {
				const CHILD_TEXTURE =
					TEXTURES_MESH_BASIC_MATERIALS[item.linkedTextureName];
				if (
					child instanceof Mesh &&
					child.name === item.childName &&
					CHILD_TEXTURE
				)
					~(child.material = CHILD_TEXTURE.clone());
			});
		});
	}
}
