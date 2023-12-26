import {
	Color,
	Group,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Texture,
	Vector3,
} from "three";

// EXPERIENCE
import Experience from "..";
import WorldManager from "./world.manager";
import { SceneContainer } from "./SceneContainer";
import { Scene_1 } from "./Scene_1";
import { Scene_2 } from "./Scene_2";
import { Scene_3 } from "./Scene_3";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/experiences/blueprints/ExperienceBased.blueprint";

// MODELS
import { CONSTRUCTED, DESTRUCTED } from "~/experiences/common/Event.model";

// MODELS
import { CAMERA_UNAVAILABLE } from "~/experiences/common/error.model";

// INTERFACES
import type { Materials } from "~/interfaces/experienceWorld";

export default class World extends ExperienceBasedBlueprint {
	protected readonly _experience = new Experience();
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _renderer = this._experience.renderer;
	protected readonly _loader = this._experience.loader;

	public readonly commonMaterials: Materials = {};

	public scene1?: Scene_1;
	public scene2?: Scene_2;
	public scene3?: Scene_3;
	public sceneContainer?: SceneContainer;
	public manager?: WorldManager;
	/** Represent the ThreeJs `Group` containing the experience. */
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
			this.commonMaterials["scene_container"] = new MeshBasicMaterial({
				map: AVAILABLE_TEXTURES["scene_container_baked_texture"],
			});

		this.commonMaterials["glass"] = new MeshBasicMaterial({
			opacity: 0.5,
			color: new Color(0x000000),
			transparent: true,
		});
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
		this.manager?.construct();

		if (
			this.scene1?.modelScene &&
			this.scene1.pcScreen &&
			this.scene1.pcScreenWebglTexture
		) {
			this.group?.add(this.scene1.modelScene);
		}

		if (this.scene2?.modelScene) {
			this.scene2.modelScene.position.setX(40);

			this.group?.add(this.scene2.modelScene);
		}

		if (this.scene3?.modelScene) {
			this.scene3.modelScene.position.setZ(40);

			this.group?.add(this.scene3.modelScene);
		}

		if (this.sceneContainer?.modelScene) {
			const scene_2_container = this.sceneContainer.modelScene.clone();
			const scene_3_container = this.sceneContainer.modelScene.clone();

			scene_2_container.position.copy(
				this.scene2?.modelScene?.position ?? new Vector3()
			);

			scene_3_container.position.copy(
				this.scene3?.modelScene?.position ?? new Vector3()
			);

			this.group?.add(
				this.sceneContainer.modelScene,
				scene_2_container,
				scene_3_container
			);
		}

		this._experience.app.scene.add(this.group);
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
