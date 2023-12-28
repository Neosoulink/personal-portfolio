import {
	Box3,
	Color,
	Group,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Texture,
	Vector3,
} from "three";

// EXPERIENCE
import { HomeExperience } from "..";
import WorldManager from "./world.manager";
import { SceneContainer } from "./SceneContainer";
import { Scene_1 } from "./Scene_1";
import { Scene_2 } from "./Scene_2";
import { Scene_3 } from "./Scene_3";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/experiences/blueprints/ExperienceBased.blueprint";

// MODELS
import { CONSTRUCTED, DESTRUCTED } from "~/common/event.model";
import { CAMERA_UNAVAILABLE } from "~/common/error.model";
import { CONTACT_PAGE, HOME_PAGE, SKILL_PAGE } from "~/common/page.model";

// INTERFACES
import type { Materials } from "~/interfaces/experienceWorld";
import type { SceneBlueprint } from "~/experiences/blueprints/Scene.blueprint";

export default class World extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appCamera = this._experience.app.camera;
	private readonly _loader = this._experience.loader;

	private _commonMaterials: Materials = {};
	private _availablePageScenes: { [sceneKey: string]: SceneBlueprint } = {};
	private _projectedModelsPosition = new Vector3();
	private _projectedSceneContainer?: Group;

	public readonly mainSceneKey = HOME_PAGE;

	public sceneContainer?: SceneContainer;
	public scene1?: Scene_1;
	public scene2?: Scene_2;
	public scene3?: Scene_3;
	public manager?: WorldManager;
	/** Represent the {@link Group `Group`} containing the experience. */
	public group?: Group;

	constructor() {
		super();

		this.sceneContainer = new SceneContainer();
		this.scene1 = new Scene_1();
		this.scene2 = new Scene_2();
		this.scene3 = new Scene_3();
	}

	private _setCommonMaterials() {
		const AVAILABLE_TEXTURES = this._loader?.availableTextures;

		if (!AVAILABLE_TEXTURES) return;

		if (AVAILABLE_TEXTURES["scene_container_baked_texture"] instanceof Texture)
			this._commonMaterials["scene_container"] = new MeshBasicMaterial({
				alphaMap: AVAILABLE_TEXTURES["cloudAlphaMap"],
				map: AVAILABLE_TEXTURES["scene_container_baked_texture"],
			});

		this._commonMaterials["glass"] = new MeshBasicMaterial({
			opacity: 0.5,
			color: new Color(0x000000),
			transparent: true,
		});
	}

	public get commonMaterials() {
		return this._commonMaterials;
	}

	public get availablePageScenes() {
		return this._availablePageScenes;
	}

	public get projectedModelsPosition() {
		return this._projectedModelsPosition;
	}

	public get projectedSceneContainer() {
		return this._projectedSceneContainer;
	}

	public destruct() {
		if (this.group) {
			this.group.traverse((child) => {
				if (child instanceof Mesh) {
					child.geometry.dispose();

					for (const key in child.material) {
						const value = child.material[key];

						if (value && typeof value.dispose === "function") {
							value.dispose();
						}
					}
				}
			});

			this.scene1?.destruct();
			this.scene2?.destruct();
			this.scene3?.destruct();
			this.sceneContainer?.destruct();
			this.manager?.destruct();

			this._experience.app.scene.remove(this.group);

			this.group?.clear();
			this.group = undefined;
			this.emit(DESTRUCTED, this);
		}
	}

	public async construct() {
		if (!(this._appCamera.instance instanceof PerspectiveCamera))
			throw new Error(undefined, { cause: CAMERA_UNAVAILABLE });

		this._setCommonMaterials();

		this.group = new Group();
		this.manager = new WorldManager();

		this.sceneContainer?.construct();
		this.scene1?.construct();
		this.scene2?.construct();
		this.scene3?.construct();

		if (this.sceneContainer?.modelScene instanceof Group) {
			const BOUNDING_BOX = new Box3().setFromObject(
				this.sceneContainer.modelScene
			);
			// const WIDTH = BOUNDING_BOX.max.x - BOUNDING_BOX.min.x;
			const HEIGHT = BOUNDING_BOX.max.y - BOUNDING_BOX.min.y;

			this._projectedModelsPosition.set(0, HEIGHT * -2, 0);

			this._projectedSceneContainer = this.sceneContainer.modelScene.clone();
			this._projectedSceneContainer.position.copy(
				this._projectedModelsPosition
			);

			this.group?.add(
				this.sceneContainer.modelScene,
				this._projectedSceneContainer
			);
		}

		if (this.scene1?.modelScene) {
			this.group?.add(this.scene1.modelScene);
			this._availablePageScenes[HOME_PAGE] = this.scene1;
		}

		if (this.scene2?.modelScene) {
			this.scene2.modelScene.position.copy(this.projectedModelsPosition);

			this._availablePageScenes[SKILL_PAGE] = this.scene2;
			this.group?.add(this.scene2.modelScene);
		}

		if (this.scene3?.modelScene) {
			this.scene3.modelScene.position.copy(this.projectedModelsPosition);

			this._availablePageScenes[CONTACT_PAGE] = this.scene3;
			this.group?.add(this.scene3.modelScene);
		}

		this._experience.app.scene.add(this.group);

		this.manager?.construct();
		this.emit(CONSTRUCTED, this);
	}

	public update() {
		this.scene1?.update();
		this.scene2?.update();
		this.scene3?.update();
		this.sceneContainer?.update();
		this.manager?.update();
	}
}
