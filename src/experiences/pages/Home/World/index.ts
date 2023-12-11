import { Group, Mesh, PerspectiveCamera, Vector3 } from "three";

// EXPERIENCE
import Experience from "..";
import Controls from "./Controls";
import Scene_1 from "./Scene_1";
import Scene_2 from "./Scene_2";
import Scene_3 from "./Scene_3";
import SceneBackground from "./SceneBackground";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "@/experiences/blueprints/ExperienceBased.blueprint";

export default class World extends ExperienceBasedBlueprint {
	protected readonly _experience = new Experience();
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _renderer = this._experience.renderer;
	private scene1?: Scene_1;
	private scene2?: Scene_2;
	private scene3?: Scene_3;
	private sceneBackground?: SceneBackground;

	public secondaryCamera?: PerspectiveCamera;
	public controls?: Controls;
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
		}
	}

	public construct() {
		if (!(this._experience.app.camera.instance instanceof PerspectiveCamera))
			return;

		this.group = new Group();
		this.controls = new Controls();
		this.secondaryCamera = new PerspectiveCamera(
			(this._appCamera.instance as PerspectiveCamera).fov,
			(this._appCamera.instance as PerspectiveCamera).aspect,
			(this._appCamera.instance as PerspectiveCamera).near,
			(this._appCamera.instance as PerspectiveCamera).far
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
			this._renderer?.addPortalMeshAssets(Scene_1.name + "_pc_screen", {
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
			this.sceneBackground.modelScene &&
				this.group.add(this.sceneBackground.modelScene);
		}

		this.secondaryCamera.position.copy(
			this.scene2?.modelScene?.position ?? new Vector3()
		);
		this.secondaryCamera.position.set(
			this.scene2?.modelScene?.position.x ?? 0,
			8,
			30
		);
		this.secondaryCamera.lookAt(
			this.scene2?.modelScene?.position ?? new Vector3()
		);

		this._experience.app.scene.add(this.group);
		this.emit("constructed", this);
	}

	public nextScene() {}

	public prevScene() {}

	public update() {
		this.controls?.update();
	}
}
