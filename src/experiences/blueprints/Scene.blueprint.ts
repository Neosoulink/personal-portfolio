import {
	Group,
	type CatmullRomCurve3,
	Mesh,
	Object3D,
	type Object3DEventMap,
	Material,
} from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "./ExperienceBased.blueprint";

// EXPERIENCES
import { HomeExperience } from "~/experiences/pages/Home";

// MODELS
import { CONSTRUCTED, DESTRUCTED, LOADED } from "~/common/event.model";
import { WRONG_PARAM } from "~/common/error.model";

// ERRORS
import { ErrorFactory } from "../errors/Error.factory";

// INTERFACES
import type {
	Materials,
	ModelChildrenMaterials,
} from "~/interfaces/experienceWorld";

// TODO: Link with the names of assets in the `app.loader` assets names
export interface SceneBlueprintProps {
	cameraPath: CatmullRomCurve3;
	modelName: string;
	childrenMaterials: ModelChildrenMaterials;
	onTraverseModelScene?: (child: Object3D<Object3DEventMap>) => unknown;
}

export abstract class SceneBlueprint extends ExperienceBasedBlueprint {
	/**
	 * Called each time the model scene is traversed.
	 *
	 * @param child Model scene child
	 */
	private _onTraverseModelScene?: SceneBlueprintProps["onTraverseModelScene"];

	protected readonly _experience = new HomeExperience();
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _loader = this._experience.loader;
	protected readonly _childrenMaterials: ModelChildrenMaterials;

	protected _world = this._experience.world;
	protected _availableMaterials: Materials = {};
	protected _model?: GLTF;

	public modelScene?: Group;
	public cameraPath: CatmullRomCurve3;

	constructor(_: SceneBlueprintProps) {
		super();
		this.cameraPath = _.cameraPath;

		this._childrenMaterials = _.childrenMaterials;

		this._experience.loader?.on(LOADED, () => {
			const _MODEL = this._experience.app.resources.items[_.modelName] as
				| GLTF
				| undefined;
			if (_MODEL?.scene) this._model = _MODEL;
		});

		this._onTraverseModelScene = _.onTraverseModelScene;
	}

	protected abstract _getAvailableMaterials(): Materials;

	/**
	 * Initialize the model scene
	 *
	 * > 🚧 Must be called before other initializers.
	 */
	protected _initModelScene() {
		this.modelScene = this._model?.scene.clone();
	}

	/**
	 * Initialize model materials
	 *
	 * > 🚧 Must be called after `{@link SceneBlueprintProps.modelScene}` has been initialized.
	 */
	protected _initModelMaterials() {
		if (!Object.keys(this._availableMaterials).length) return;

		this.modelScene?.traverse((child) => {
			this._onTraverseModelScene && this._onTraverseModelScene(child);

			if (
				!this._childrenMaterials[child.name] ||
				!(
					this._availableMaterials[
						this._childrenMaterials[child.name]
					] instanceof Material
				) ||
				!(child instanceof Mesh)
			)
				return;

			~(child.material =
				this._availableMaterials[this._childrenMaterials[child.name]]);
		});
	}

	public construct(callback?: () => void) {
		this._world = this._experience.world;
		this._initModelScene();

		if (!this.modelScene)
			throw new ErrorFactory(
				new Error("No model scene founded", { cause: WRONG_PARAM })
			);

		if (typeof callback === "function") callback();

		this._availableMaterials = {
			...this._world?.commonMaterials,
			...this._getAvailableMaterials(),
		};
		this._initModelMaterials();
		this.emit(CONSTRUCTED);
	}

	public destruct() {
		this.modelScene?.clear();
		this.modelScene?.removeFromParent();
		this.emit(DESTRUCTED);
	}

	public intro(): void {}

	public outro(): void {}

	public update(): void {}
}
