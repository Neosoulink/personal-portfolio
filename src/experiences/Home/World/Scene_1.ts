import {
	CatmullRomCurve3,
	Group,
	Mesh,
	PerspectiveCamera,
	Vector3,
} from "three";
import { type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import GSAP from "gsap";

// EXPERIENCES
import Experience from "..";

// CONSTANTS
import { GSAP_DEFAULT_INTRO_PROPS } from "@/constants/ANIMATION";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

export default class Scene_1 implements ExperienceBase {
	private readonly experience = new Experience();
	private readonly appCamera = this.experience.app.camera;
	model?: GLTF;
	modelGroup?: Group;
	modelMeshes: { [name: string]: Mesh | undefined } = {};
	cameraCurvePath = new CatmullRomCurve3([
		new Vector3(0, 5.5, 21),
		new Vector3(12, 10, 12),
		new Vector3(21, 5.5, 0),
		new Vector3(12, 3.7, 12),
		new Vector3(0, 5.5, 21),
	]);

	constructor() {
		const _ISOMETRIC_ROOM = this.experience.app.resources.items.scene_1_room as
			| GLTF
			| undefined;

		if (_ISOMETRIC_ROOM?.scene) {
			this.model = _ISOMETRIC_ROOM;
			this.modelGroup = this.model.scene;

			this.setModelMeshes();
		}
	}

	construct() {
		if (!this.appCamera.instance) return;

		this.cameraCurvePath.getPointAt(0, this.appCamera.instance.position);
		this.appCamera.instance.position.y += 8;
		this.appCamera.instance.position.x -= 2;
		this.appCamera.instance.position.z += 10;
	}

	destruct() {}

	private setModelMeshes() {
		const _TEXTURES_MESH_BASIC_MATERIALS =
			this.experience.loader?.texturesMeshBasicMaterials;

		if (!_TEXTURES_MESH_BASIC_MATERIALS) return;

		this.modelGroup?.children.forEach((child) => {
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

	intro() {
		const WORLD_CONTROLS = this.experience.world?.controls;

		if (
			!(WORLD_CONTROLS && this.appCamera.instance instanceof PerspectiveCamera)
		)
			return;

		const { x, y, z } = WORLD_CONTROLS.cameraCurvePath.getPointAt(0);

		GSAP.to(this.appCamera.instance.position, {
			...this.experience.world?.controls?.getGsapDefaultProps(),
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
					if (this.experience.world?.controls) {
						WORLD_CONTROLS?.getGsapDefaultProps().onComplete();

						this.experience.world.controls.autoCameraAnimation = true;

						console.log(this.appCamera.instance?.position);
					}
				}, 1000);
			},
		});
	}
}
