import {
	CatmullRomCurve3,
	Color,
	LinearSRGBColorSpace,
	Material,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	RawShaderMaterial,
	Vector3,
	WebGLRenderTarget,
} from "three";
import GSAP from "gsap";

// EXPERIENCES
import { SceneFactory } from "@/experiences/factories/SceneFactory";

// CONSTANTS
import { GSAP_DEFAULT_INTRO_PROPS } from "@/constants/ANIMATION";

// SHADERS
import fragment from "./shaders/scene1/fragment.frag";
import vertex from "./shaders/scene1/vertex.vert";

export default class Scene_1 extends SceneFactory {
	protected _renderer = this._experience.renderer;

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
				modelName: "scene_1_room",
				modelChildrenTextures: [
					{
						childName: "scene_1_room",
						linkedTextureName: "scene_1_room_baked_texture",
					},
				],
			});
		} catch (error) {}
	}

	construct() {
		if (!this._appCamera.instance) return;
		this.modelScene = this._model?.scene.clone();
		if (!this.modelScene) return;

		this.cameraPath.getPointAt(0, this._appCamera.instance.position);
		this._appCamera.instance.position.y += 8;
		this._appCamera.instance.position.x -= 2;
		this._appCamera.instance.position.z += 10;

		try {
			this.modelScene.children.forEach((child) => {
				if (child.name === "scene_1_room_pc_screen")
					throw new Error("CHILD_FOUND", { cause: child });
			});
		} catch (_err) {
			if (_err instanceof Error && _err.cause instanceof Mesh) {
				const mesh = _err.cause;
				const camera = new PerspectiveCamera(75, 1.0, 0.1, 500.0);
				const texture = new WebGLRenderTarget(256, 256);
				mesh.material = new MeshBasicMaterial({ map: texture.texture });

				this._renderer?.addPortalMeshAssets(Scene_1.name + "_screen_pc", {
					mesh,
					camera,
					texture,
				});
			}
		}

		this._setModelMaterials();
		this._experience.world?.group?.add(this.modelScene);

		this.emit("constructed");
	}

	destruct() {
		if (!this.modelScene) return;

		GSAP.to((this.modelScene.children[0] as Mesh).material as Material, {
			...GSAP_DEFAULT_INTRO_PROPS,
			opacity: 0,
			onUpdate: () => {},
			onComplete: () => {
				this.modelScene?.clear();
				this.modelScene?.removeFromParent();
				this.emit(this.eventListNames.destructed);
			},
		});
	}

	public intro(): void {
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

	public outro(): void {}

	public update(): void {}

	protected _setModelMaterials() {
		const TEXTURES_MESH_BASIC_MATERIALS =
			this._Loader?.texturesMeshBasicMaterials;

		if (!TEXTURES_MESH_BASIC_MATERIALS) return;

		this.modelScene?.children.forEach((child) => {
			this._modelChildrenTextures.forEach((item) => {
				const CHILD_TEXTURE =
					TEXTURES_MESH_BASIC_MATERIALS[item.linkedTextureName].clone();

				if (
					child instanceof Mesh &&
					child.name === item.childName &&
					CHILD_TEXTURE.map
				) {
					const MAP_TEXTURE = CHILD_TEXTURE.map.clone();
					MAP_TEXTURE.colorSpace = LinearSRGBColorSpace;

					~(child.material = new RawShaderMaterial({
						uniforms: {
							uBakedTexture: { value: MAP_TEXTURE },
							uTime: { value: 0 },
							uColor: { value: new Color(0x00ff00) },
						},
						fragmentShader: fragment,
						vertexShader: vertex,
						transparent: true,
					}));
				}
			});
		});
	}
}
