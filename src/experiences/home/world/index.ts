import {
	Box3,
	CatmullRomCurve3,
	Color,
	DoubleSide,
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
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// STATIC
import { events, errors, pages } from "~/static";

// MODELS
import type { Materials } from "~/common/models/experience-world.model";
import type { Marker } from "~/common/models/experience-ui.model";

// BLUEPRINTS
import type { SceneComponentBlueprint } from "../blueprints/scene-component.blueprint";

export class World extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appCamera = this._experience.app.camera;
	private readonly _loader = this._experience.loader;

	private _manager?: WorldManager;
	private _commonMaterials: Materials = {};
	private _availablePageScenes: {
		[sceneKey: string]: SceneComponentBlueprint;
	} = {};
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
		const availableTextures = this._loader?.availableTextures;

		if (!availableTextures) return;

		if (availableTextures.scene_container_baked_texture instanceof Texture)
			this._commonMaterials.scene_container = new MeshBasicMaterial({
				alphaMap: availableTextures.cloudAlphaMap,
				map: availableTextures.scene_container_baked_texture,
			});

		this._commonMaterials.glass = new MeshBasicMaterial({
			opacity: 0.5,
			color: new Color(0x000000),
			transparent: true,
			side: DoubleSide,
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
			this.removeAllListeners();
		}
	}

	private _correctCameraPath(paths: CatmullRomCurve3, center: Vector3) {
		const points = paths.points;
		for (const point of points) {
			point.add(center);
		}
		paths.points = points;
	}

	private _correctMarkersPosition(markers: Marker[], center: Vector3) {
		for (const marker of markers) {
			marker.position.add(center);
		}
	}

	public async construct() {
		if (!(this._appCamera.instance instanceof PerspectiveCamera))
			throw new Error(undefined, { cause: errors.CAMERA_UNAVAILABLE });

		this._manager = new WorldManager();
		this.group = new Group();

		this._setCommonMaterials();

		this.sceneContainer?.construct();
		this.scene1?.construct();
		this.scene2?.construct();
		this.scene3?.construct();

		if (!(this.sceneContainer?.modelScene instanceof Group)) return;

		const boundingBox = new Box3().setFromObject(
			this.sceneContainer.modelScene
		);
		// const width = boundingBox.max.x - boundingBox.min.x;
		const height = boundingBox.max.y - boundingBox.min.y;
		const projectedScenePosition = new Vector3(0, height * -2, 0);

		this._projectedSceneContainer = this.sceneContainer.modelScene.clone();
		this._projectedSceneContainer.position.copy(projectedScenePosition);

		this.group?.add(
			this.sceneContainer.modelScene,
			this._projectedSceneContainer
		);

		if (this.scene1?.modelScene) {
			this._availablePageScenes[pages.HOME_PAGE] = this.scene1;
			this.group?.add(this.scene1.modelScene);
		}

		if (this.scene2?.modelScene) {
			this.scene2.modelScene.position.copy(projectedScenePosition);
			this.scene2.center.add(projectedScenePosition);
			this._correctCameraPath(this.scene2.cameraPath, projectedScenePosition);
			this._correctMarkersPosition(this.scene2.markers, projectedScenePosition);
			this._availablePageScenes[pages.SKILL_PAGE] = this.scene2;
			this.group?.add(this.scene2.modelScene);
		}

		if (this.scene3?.modelScene) {
			this.scene3.modelScene.position.copy(projectedScenePosition);
			this.scene3.center.add(projectedScenePosition);
			this._correctCameraPath(this.scene3.cameraPath, projectedScenePosition);
			this._correctMarkersPosition(this.scene3.markers, projectedScenePosition);
			this._availablePageScenes[pages.CONTACT_PAGE] = this.scene3;
			this.group?.add(this.scene3.modelScene);
		}

		this._experience.app.scene.add(this.group);

		this._manager?.construct();
		this.emit(events.CONSTRUCTED, this);
	}

	public update() {
		this._manager?.update();
	}
}
