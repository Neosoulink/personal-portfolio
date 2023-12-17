import { Group, Mesh, PerspectiveCamera, Vector3 } from "three";
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
import { Config } from "@/experiences/config/Config";

export default class World extends ExperienceBasedBlueprint {
	protected readonly _experience = new Experience();
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _renderer = this._experience.renderer;
	private scene1?: Scene_1;
	private scene2?: Scene_2;
	private scene3?: Scene_3;
	private sceneBackground?: SceneBackground;

	public secondaryCamera?: PerspectiveCamera;
	public manager?: WorldManager;
	public currentSceneIndex?: number;
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

			this._experience.app.scene.remove(this.group);

			this.group?.clear();
			this.group = undefined;
			this.emit(DESTRUCTED, this);
		}
	}

	public construct() {
		if (!(this._appCamera.instance instanceof PerspectiveCamera)) return;

		this.group = new Group();
		this.manager = new Manager();
		this.secondaryCamera = new PerspectiveCamera(
			this._appCamera.instance.fov,
			Config.FIXED_WINDOW_WIDTH / Config.FIXED_WINDOW_HEIGHT,
			this._appCamera.instance.near,
			this._appCamera.instance.far
		);

		this.scene1?.construct();
		this.scene2?.construct();
		// this.scene3.construct();
		this.sceneBackground?.construct();

		if (
			this.scene1?.modelScene &&
			this.scene1.pcScreen &&
			this.scene1.pcScreenWebglTexture
		) {
			this._renderer?.addPortalAssets(Scene_1.name + "_pc_screen", {
				mesh: this.scene1.pcScreen,
				meshCamera: this.secondaryCamera,
				meshWebGLTexture: this.scene1.pcScreenWebglTexture,
			});

			this.group.add(this.scene1.modelScene);
		}

		if (this.scene2?.modelScene) {
			this.scene2.modelScene.position.setX(40);

			this.group.add(this.scene2.modelScene);
		}

		if (this.sceneBackground?.modelScene) {
			const scene_2_background = this.sceneBackground.modelScene.clone();

			scene_2_background.position.copy(
				this.scene2?.modelScene?.position ?? new Vector3()
			);
			this.group.add(this.sceneBackground.modelScene, scene_2_background);
		}

		// ==============
		this._appCamera.instance.position.set(0, 3, 0.5);
		this._appCamera.instance.position.copy(
			this._appCamera.instance.position.lerpVectors(
				this._appCamera.instance.position.clone(),
				(this.scene1?.pcScreen?.position ?? new Vector3()).clone(),
				0.85
			)
		);

		this._appCamera.instance.lookAt(
			this.scene1?.pcScreen?.position ?? new Vector3()
		);
		if (this._experience.app?.debug?.cameraControls)
			this._experience.app.debug.cameraControls.target = (
				this.scene1?.pcScreen?.position ?? new Vector3()
			).clone();

		// ==============

		this.secondaryCamera.position.copy(
			this.scene2?.modelScene?.position ?? new Vector3()
		);
		this.secondaryCamera.position.set(
			this.scene2?.modelScene?.position.x ?? 0,
			8,
			20
		);
		this.secondaryCamera.lookAt(
			this.scene2?.modelScene?.position ?? new Vector3()
		);

		this._experience.app.scene.add(this.group);
		this.emit(CONSTRUCTED, this);
	}

	public nextScene() {}

	public prevScene() {}

	public update() {
		// this.controls?.update();
	}
}
