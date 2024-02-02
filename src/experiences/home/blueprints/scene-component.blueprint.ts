import {
	Group,
	Mesh,
	Object3D,
	type Object3DEventMap,
	Material,
	CatmullRomCurve3,
	Vector3,
	Line,
	BufferGeometry,
	LineBasicMaterial,
} from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// EXPERIENCES
import { HomeExperience } from "~/experiences/home";

// STATIC
import { errors, events } from "~/static";

// ERRORS
import { ErrorFactory } from "~/errors";

// MODELS
import type {
	Materials,
	ModelChildrenMaterials,
} from "~/common/models/experience-world.model";
import type { NavigationView } from "~/common/models/experience-navigation.model";
import type { SelectableObject } from "~/common/models/experience-interaction.model";

// CONFIG
import { Config } from "~/config";

// TODO: Link with the names of assets in the `app.loader` assets names
export interface SceneBlueprintProps {
	modelName: string;
	childrenMaterials: ModelChildrenMaterials;
	onTraverseModelScene?: (child: Object3D<Object3DEventMap>) => unknown;
	markers?: {
		position: Vector3;
		title: string;
		content: string;
	}[];
}

export abstract class SceneComponentBlueprint extends ExperienceBasedBlueprint {
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
	protected _model?: GLTF;
	protected _modelScene?: Group;
	protected _availableMaterials: Materials = {};

	public readonly navigationLimits?: {
		spherical: Exclude<NavigationView["spherical"], undefined>["limits"];
		target: Exclude<NavigationView["target"], undefined>["limits"];
	} = undefined;
	public readonly markers: Exclude<SceneBlueprintProps["markers"], undefined>;
	public readonly cameraPath = new CatmullRomCurve3();
	public readonly center = new Vector3();

	public timeline?: gsap.core.Timeline;
	public selectableObjects: SelectableObject[] = [];

	constructor(_: SceneBlueprintProps) {
		super();

		this._childrenMaterials = _.childrenMaterials;

		this._experience.loader?.on(events.LOADED, () => {
			const _MODEL = this._experience.app.resources.items[_.modelName] as
				| GLTF
				| undefined;
			if (_MODEL?.scene) this._model = _MODEL;
		});

		this._onTraverseModelScene = _.onTraverseModelScene;

		this.markers = _.markers ?? [];
	}

	public get modelScene() {
		return this._modelScene;
	}

	protected abstract _getAvailableMaterials(): Materials;

	/**
	 * Initialize the model scene
	 *
	 * > 🚧 Must be called before other initializers.
	 */
	protected _initModelScene() {
		this._modelScene = this._model?.scene.clone();
	}

	/**
	 * Initialize model materials
	 *
	 * > 🚧 Must be called after `{@link SceneBlueprintProps.modelScene}` has been initialized.
	 */
	protected _initModelMaterials() {
		if (!Object.keys(this._availableMaterials).length) return;

		this.modelScene?.traverse((child) => {
			this._onTraverseModelScene?.(child);

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

			child.material =
				this._availableMaterials[this._childrenMaterials[child.name]];
		});
	}

	public construct(callback?: () => void) {
		this._world = this._experience.world;
		this._initModelScene();

		if (!this.modelScene)
			throw new ErrorFactory(
				new Error("No model scene founded", { cause: errors.WRONG_PARAM })
			);

		if (typeof callback === "function") callback();

		if (Config.DEBUG && this.cameraPath.points.length)
			this._modelScene?.add(
				new Line(
					new BufferGeometry().setFromPoints(this.cameraPath.getPoints(50)),
					new LineBasicMaterial({
						color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
					})
				)
			);

		this._availableMaterials = this._getAvailableMaterials();
		this._initModelMaterials();
		this.emit(events.CONSTRUCTED);
	}

	public destruct() {
		this.modelScene?.clear();
		this.modelScene?.removeFromParent();
		this.emit(events.DESTRUCTED);
	}

	public intro(): gsap.core.Timeline | undefined {
		return this.timeline;
	}

	public outro(): gsap.core.Timeline | undefined {
		return this.timeline;
	}

	public initSelectableObjects(): void {}

	public update(): void {}
}
