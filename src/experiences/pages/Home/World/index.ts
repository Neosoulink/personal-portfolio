import { Group, Mesh, PerspectiveCamera } from "three";
import EventEmitter from "events";

// EXPERIENCE
import Experience from "..";
import Controls from "./Controls";
import Scene_1 from "./Scene_1";
import Scene_2 from "./Scene_2";
import Scene_3 from "./Scene_3";
import { SceneFactory } from "@/experiences/factories/SceneFactory";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

export default class World extends EventEmitter implements ExperienceBase {
	protected readonly _experience = new Experience();

	public controls?: Controls;
	public scenes?: SceneFactory[] = [];
	public currentSceneIndex?: number;
	/** Represent the ThreeJs `Group` containing the experience. */
	public group?: Group;

	constructor() {
		super();
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

			this.scenes?.forEach((group) => {
				group.destruct();
			});
			this._experience.app.scene.remove(this.group);

			this.group?.clear();
			this.group = undefined;
		}
	}

	public construct() {
		this._experience.loader?.on("load", () => {
			if (!(this._experience.app.camera.instance instanceof PerspectiveCamera))
				return;

			this.group = new Group();
			this.controls = new Controls();

			this.scenes?.push(new Scene_1(), new Scene_2(), new Scene_3());
			this._experience.app.scene.add(this.group);
			this.nextScene();
		});
	}

	public nextScene() {
		try {
			if (!this.scenes || !this.scenes.length) return;

			const PREV_INDEX = this.currentSceneIndex;

			~(() => {
				if (
					typeof this.currentSceneIndex === "number" &&
					this.currentSceneIndex + 2 <= this.scenes.length
				)
					this.currentSceneIndex += 1;
				else this.currentSceneIndex = 0;
			})();

			~(() => {
				const PrevScene =
					typeof PREV_INDEX === "number" ? this.scenes[PREV_INDEX] : PREV_INDEX;
				const CurrentScene = this.scenes[this.currentSceneIndex];

				const constructCurrentScene = () => {
					CurrentScene.construct();
					PrevScene?.off(
						PrevScene.eventListNames.destructed,
						constructCurrentScene
					);
				};

				if (PrevScene) {
					PrevScene.on(
						PrevScene.eventListNames.destructed,
						constructCurrentScene
					);

					PrevScene.destruct();
				} else constructCurrentScene();
			})();
		} catch (error) {
			// TODO: Add an error handler
			console.error(`🚧 ${World.name}->${this.nextScene.name}`, error);
		}
	}

	public prevScene() {
		if (!this.scenes) return;
		if (this.currentSceneIndex === undefined) this.currentSceneIndex = 0;
	}

	public setScene(index: number) {}

	public update() {
		this.controls?.update();

		// Current Scene update
		// ~(() => {
		// 	this.currentSceneIndex !== undefined &&
		// 		this.scenes !== undefined &&
		// 		this.scenes[this.currentSceneIndex]?.update();
		// })();
	}
}
