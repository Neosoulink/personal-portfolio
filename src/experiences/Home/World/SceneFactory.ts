import { Group, type CatmullRomCurve3 } from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import EventEmitter from "events";

// EXPERIENCES
import HomeExperience from "..";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

export interface SceneFactoryProps {
	cameraPath: CatmullRomCurve3;
}

export abstract class SceneFactory
	extends EventEmitter
	implements ExperienceBase
{
	protected readonly _experience = new HomeExperience();
	protected readonly _appCamera = this._experience.app.camera;
	public readonly eventListNames = {
		constructed: "constructed",
		destructed: "destructed",
	};
	public model?: GLTF;
	public group?: Group;
	public cameraPath: CatmullRomCurve3;

	constructor(_: SceneFactoryProps) {
		super();
		this.cameraPath = _.cameraPath;
	}

	public abstract construct(): unknown;
	public abstract destruct(): unknown;
	public abstract update(): unknown;
	protected abstract intro(): unknown;
	protected abstract outro(): unknown;
	protected abstract _setModelMeshes(): void;
}
