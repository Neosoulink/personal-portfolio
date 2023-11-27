import { CatmullRomCurve3, Mesh, PerspectiveCamera, Vector3 } from "three";
import { type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import GSAP from "gsap";

// EXPERIENCES
import { SceneFactory } from "./SceneFactory";

// CONSTANTS
import { GSAP_DEFAULT_INTRO_PROPS } from "@/constants/ANIMATION";

export default class Scene_3 extends SceneFactory {
	protected readonly _appCamera = this._experience.app.camera;
	public modelMeshes: { [name: string]: Mesh | undefined } = {};

	constructor() {
		try {
			super({
				cameraPath: new CatmullRomCurve3([
					new Vector3(0, 5.5, 21),
					new Vector3(12, 10, 12),
					new Vector3(21, 5.5, 0),
					new Vector3(12, 3.7, 12),
					new Vector3(0, 5.5, 21),
				]),
			});
		} catch (error) {}
	}

	construct() {
		if (!this._appCamera.instance) return;

		const ISOMETRIC_ROOM = this._experience.app.resources.items.scene_1_room as
			| GLTF
			| undefined;

		this.cameraPath.getPointAt(0, this._appCamera.instance.position);
		this._appCamera.instance.position.y += 8;
		this._appCamera.instance.position.x -= 2;
		this._appCamera.instance.position.z += 10;

		this.model = ISOMETRIC_ROOM;
		this.group = this.model?.scene.clone();
		this.group && this._experience.world?.group?.add(this.group);

		this._setModelMeshes();
		this.emit("constructed");
	}

	destruct() {
		this.group?.clear();
		this.group?.removeFromParent();

		this.emit(this.eventListNames.destructed);
	}

	protected _setModelMeshes(): void {
		const _TEXTURES_MESH_BASIC_MATERIALS =
			this._experience.loader?.texturesMeshBasicMaterials;

		if (!_TEXTURES_MESH_BASIC_MATERIALS) return;

		this.group?.children.forEach((child) => {
			// Applying baked texture to Model
			if (
				child instanceof Mesh &&
				child.name === "scene_1_room" &&
				_TEXTURES_MESH_BASIC_MATERIALS.scene_1_room_baked_texture
			)
				~(child.material =
					_TEXTURES_MESH_BASIC_MATERIALS.scene_1_room_baked_texture);

			// Applying custom texture to Models objects
			if (
				child instanceof Mesh &&
				child.name === "pc-screen" &&
				_TEXTURES_MESH_BASIC_MATERIALS.typescript_logo
			)
				~((this.modelMeshes["pcScreen"] = child).material =
					_TEXTURES_MESH_BASIC_MATERIALS.typescript_logo);
		});
	}

	protected intro(): void {
		const WORLD_CONTROLS = this._experience.world?.controls;

		if (
			!(WORLD_CONTROLS && this._appCamera.instance instanceof PerspectiveCamera)
		)
			return;

		const { x, y, z } = this.cameraPath.getPointAt(0);

		GSAP.to(this._appCamera.instance.position, {
			...this._experience.world?.controls?.getGsapDefaultProps(),
			...GSAP_DEFAULT_INTRO_PROPS,
			x,
			y,
			z,
			delay: GSAP_DEFAULT_INTRO_PROPS.duration * 0.8,
			onUpdate: () => {
				WORLD_CONTROLS?.setCameraLookAt(WORLD_CONTROLS.initialLookAtPosition);
			},
			onComplete: () => {
				setTimeout(() => {
					if (this._experience.world?.controls) {
						WORLD_CONTROLS?.getGsapDefaultProps().onComplete();

						this._experience.world.controls.autoCameraAnimation = true;

						console.log(this._appCamera.instance?.position);
					}
				}, 1000);
			},
		});
	}

	protected outro(): void {}

	public update(): void {}
}
