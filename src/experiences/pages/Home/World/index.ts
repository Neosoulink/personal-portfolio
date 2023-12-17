import { Group, Mesh, PerspectiveCamera } from "three";
// EXPERIENCE
import Experience from "..";
import WorldManager from "./world.manager";
import Scene_1 from "./Scene_1";
import Scene_2 from "./Scene_2";
import Scene_3 from "./Scene_3";
import SceneBackground from "./SceneBackground";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "@/experiences/blueprints/ExperienceBased.blueprint";

// MODELS
import { CONSTRUCTED, DESTRUCTED } from "@/experiences/common/Event.model";

// MODELS
import { CAMERA_UNAVAILABLE } from "@/experiences/common/error.model";

export default class World extends ExperienceBasedBlueprint {
	protected readonly _experience = new Experience();
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _renderer = this._experience.renderer;
	public scene1?: Scene_1;
	public scene2?: Scene_2;
	public scene3?: Scene_3;
	public sceneBackground?: SceneBackground;
	public manager?: WorldManager;
	/** Represent the ThreeJs `Group` containing the experience. */
	public group?: Group;

	constructor() {
		super();

		this.scene1 = new Scene_1();
		this.scene2 = new Scene_2();
		// this.scene3 = new Scene_3();
		this.sceneBackground = new SceneBackground();
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
			this.sceneBackground?.destruct();
			this.manager?.destruct();

			this._experience.app.scene.remove(this.group);

			this.group?.clear();
			this.group = undefined;
			this.emit(DESTRUCTED, this);
		}
	}

	public construct() {
		if (!(this._appCamera.instance instanceof PerspectiveCamera))
			throw new Error(undefined, { cause: CAMERA_UNAVAILABLE });

		this.group = new Group();
		this.manager = new WorldManager();

		this.scene1?.construct();
		this.scene2?.construct();
		// this.scene3.construct();
		this.sceneBackground?.construct();
		this.manager?.construct();

		this._experience.app.scene.add(this.group);
		this.emit(CONSTRUCTED, this);
	}

	public update() {
		this.manager?.update();
	}
}
