import * as THREE from "three";
import EventEmitter from "events";

// EXPERIENCE
import Experience from "..";
import Controls from "./Controls";
import Scene_1 from "./Scene_1";
import Scene_2 from "./Scene_2";
import Scene_3 from "./Scene_3";
import { SceneFactory } from "./SceneFactory";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

export default class World extends EventEmitter implements ExperienceBase {
	protected readonly _experience = new Experience();

	public controls?: Controls;
	public scenes?: SceneFactory[] = [];
	public currentSceneIndex?: number;
	/** Represent the ThreeJs `Group` containing the experience. */
	public group?: THREE.Group;

	constructor() {
		super();
	}

	public destruct() {
		if (this.group) {
			this.group.traverse((child) => {
				if (child instanceof THREE.Mesh) {
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
			if (
				!(
					this._experience.app.camera.instance instanceof
					THREE.PerspectiveCamera
				)
			)
				return;

			this.group = new THREE.Group();
			this.scenes?.push(new Scene_1(), new Scene_2(), new Scene_3());

			this.controls = new Controls();

			// ADD TO SCENE
			this.group.add(this.controls.cameraLookAtPointIndicator);
			this._experience.app.scene.add(this.group);
			this.nextScene();
		});
	}

	public nextScene() {
		if (!this.scenes || !this.scenes.length) return;
		const PREV_INDEX = this.currentSceneIndex;

		if (
			this.currentSceneIndex === undefined ||
			this.currentSceneIndex + 2 > this.scenes.length
		)
			this.currentSceneIndex = 0;
		else if (this.currentSceneIndex + 2 <= this.scenes.length)
			this.currentSceneIndex += 1;

		const CurrentScene = this.scenes[this.currentSceneIndex];

		if (PREV_INDEX === undefined) {
			CurrentScene.construct();
			CurrentScene.group && this.group?.add(CurrentScene.group);

			const onLoad = () => {
				CurrentScene.intro();
				this._experience.loader?.off("load", onLoad);
			};

			this._experience.ui?.on("ready", onLoad);
		} else if (PREV_INDEX >= 0 && PREV_INDEX <= 2) {
			const PrevScene = this.scenes[PREV_INDEX];
			PrevScene.group && this.group?.remove(PrevScene.group);
			CurrentScene.construct();

			const onDestructed = () => {
				console.log("destructed here", CurrentScene);
				CurrentScene.group && this.group?.add(CurrentScene.group);
				CurrentScene.intro();

				PrevScene.off("destructed", onDestructed);
			};

			PrevScene.destruct();
			PrevScene.on("destructed", onDestructed);
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
