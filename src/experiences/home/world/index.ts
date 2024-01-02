import {
	Box3,
	CatmullRomCurve3,
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
import { WorldManager } from "./manager";
import { SceneContainerComponent } from "./scene-container.component";
import { Scene1Component } from "./scene-1.component";
import { Scene2Component } from "./scene-2.component";
import { Scene3Component } from "./scene-3.component";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";

// MODELS
import { events, errors, pages } from "~/static";

// MODELS
import type { Materials } from "~/common/experiences/experience-world.model";
import type { SceneConfig } from "./model";

// BLUEPRINTS
import type { SceneComponentBlueprint } from "~/blueprints/experiences/scene-component.blueprint";

export class World extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appCamera = this._experience.app.camera;
	private readonly _loader = this._experience.loader;

	private _manager?: WorldManager;
	private _commonMaterials: Materials = {};
	private _availablePageScenes: {
		[sceneKey: string]: SceneComponentBlueprint;
	} = {};
	private _mainSceneConfig: SceneConfig = {
		center: new Vector3(),
		position: new Vector3(),
		cameraPath: new CatmullRomCurve3([]),
	};
	private _projectedSceneConfig: SceneConfig = {
		center: new Vector3(),
		position: new Vector3(),
		cameraPath: new CatmullRomCurve3([]),
	};
	private _projectedSceneContainer?: Group;

	public readonly mainSceneKey = pages.HOME_PAGE;

	public sceneContainer?: SceneContainerComponent;
	public scene1?: Scene1Component;
	public scene2?: Scene2Component;
	public scene3?: Scene3Component;
	/** Represent the {@link Group `Group`} containing the experience. */
	public group?: Group;

	constructor() {
		super();

		this.sceneContainer = new SceneContainerComponent();
		this.scene1 = new Scene1Component();
		this.scene2 = new Scene2Component();
		this.scene3 = new Scene3Component();
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

	public get manager() {
		return this._manager;
	}

	public get commonMaterials() {
		return this._commonMaterials;
	}

	public get availablePageScenes() {
		return this._availablePageScenes;
	}

	public get projectedSceneContainer() {
		return this._projectedSceneContainer;
	}

	public get mainSceneConfig() {
		return this._mainSceneConfig;
	}

	public get projectedSceneConfig() {
		return this._projectedSceneConfig;
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
			this._manager?.destruct();

			this._experience.app.scene.remove(this.group);

			this.group?.clear();
			this.group = undefined;
			this.emit(events.DESTRUCTED, this);
		}
	}

	public async construct() {
		if (!(this._appCamera.instance instanceof PerspectiveCamera))
			throw new Error(undefined, { cause: errors.CAMERA_UNAVAILABLE });

		this.group = new Group();
		this._manager = new WorldManager();

		this._setCommonMaterials();

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

			this._mainSceneConfig.position.set(0, 0, 0);
			this._mainSceneConfig.center.set(
				this._mainSceneConfig.position.x,
				this._mainSceneConfig.position.y + 2.5,
				this._mainSceneConfig.position.z
			);
			this._mainSceneConfig.cameraPath.points = [
				new Vector3(0, 5.5, 21),
				new Vector3(12, 10, 12),
				new Vector3(21, 5.5, 0),
				new Vector3(12, 3.7, 12),
				new Vector3(0, 5.5, 21),
			];

			this._projectedSceneConfig.position.set(0, HEIGHT * -2, 0);
			this._projectedSceneConfig.center.set(
				this._projectedSceneConfig.position.x,
				this._projectedSceneConfig.position.y + 2,
				this._projectedSceneConfig.position.z
			);
			this._projectedSceneConfig.cameraPath.points = [
				new Vector3(0, 5.5, 21).add(this._projectedSceneConfig.position),
				new Vector3(12, 10, 12).add(this._projectedSceneConfig.position),
				new Vector3(21, 5.5, 0).add(this._projectedSceneConfig.position),
				new Vector3(12, 3.7, 12).add(this._projectedSceneConfig.position),
				new Vector3(0, 5.5, 21).add(this._projectedSceneConfig.position),
			];

			(this._projectedSceneContainer =
				this.sceneContainer.modelScene.clone()).position.copy(
				this._projectedSceneConfig.position
			);

			this.group?.add(
				this.sceneContainer.modelScene,
				this._projectedSceneContainer
			);
		}

		if (this.scene1?.modelScene) {
			this._availablePageScenes[pages.HOME_PAGE] = this.scene1;
			this.group?.add(this.scene1.modelScene);
		}

		if (this.scene2?.modelScene) {
			this.scene2.modelScene.position.copy(this.projectedSceneConfig.position);
			this._availablePageScenes[pages.SKILL_PAGE] = this.scene2;
			this.group?.add(this.scene2.modelScene);
		}

		if (this.scene3?.modelScene) {
			this.scene3.modelScene.position.copy(this.projectedSceneConfig.position);
			this._availablePageScenes[pages.CONTACT_PAGE] = this.scene3;
			this.group?.add(this.scene3.modelScene);
		}

		this._experience.app.scene.add(this.group);

		this._manager?.construct();
		this.emit(events.CONSTRUCTED, this);
	}

	public update() {
		this.scene1?.update();
		this.scene2?.update();
		this.scene3?.update();
		this.sceneContainer?.update();
		this._manager?.update();
		this.emit(events.UPDATED, this);
	}
}
