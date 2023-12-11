import {
	CatmullRomCurve3,
	Color,
	Material,
	Mesh,
	MeshBasicMaterial,
	NoColorSpace,
	PerspectiveCamera,
	PlaneGeometry,
	RawShaderMaterial,
	Vector3,
	WebGLRenderTarget,
} from "three";
import GSAP from "gsap";

// BLUEPRINTS
import { SceneBlueprint } from "@/experiences/blueprints/Scene.blueprint";

// CONFIG

// SHADERS
import fragment from "./shaders/scene1/fragment.frag";
import vertex from "./shaders/scene1/vertex.vert";

// CONFIGS
import { Config } from "@/experiences/config/Config";

export default class Scene_1 extends SceneBlueprint {
	protected _renderer = this._experience.renderer;

	public pcScreenWebglTexture?: WebGLRenderTarget;
	public pcScreen?: Mesh;

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
					{
						childName: "scene_1_woods",
						linkedTextureName: "scene_1_woods_baked_texture",
					},
					{
						childName: "scene_1_floor",
						linkedTextureName: "scene_background_baked_texture",
					},
				],
			});
		} catch (error) {}
	}

	construct() {
		if (!this._appCamera.instance) return;
		this.modelScene = this._model?.scene.clone();

		if (!this.modelScene) return;

		try {
			this.modelScene.children.forEach((child) => {
				if (child.name === "scene_1_pc_screen")
					throw new Error("CHILD_FOUND", { cause: child });
			});
		} catch (_err) {
			if (_err instanceof Error && _err.cause instanceof Mesh) {
				const planeGeo = new PlaneGeometry(1.25, 0.6728);
				this.pcScreenWebglTexture = new WebGLRenderTarget(4096, 4096);
				this.pcScreen = new Mesh(planeGeo);
				this.pcScreen.material = new MeshBasicMaterial({
					map: this.pcScreenWebglTexture.texture,
				});

				// TODO:: Correctly setup the portal by passing the texture to the screen it self
				this.pcScreen.rotateY(Math.PI * 0.271);
				this.pcScreen.rotateX(Math.PI * -0.03);
				this.pcScreen.position.y -= 0.05;
				this.pcScreen.position.x -= 0.01;
				_err.cause.localToWorld(this.pcScreen.position);
				_err.cause.removeFromParent();

				this.modelScene.add(this.pcScreen);
			}
		}

		this._setModelMaterials();
		this.emit("constructed");
	}

	destruct() {
		if (!this.modelScene) return;

		GSAP.to((this.modelScene.children[0] as Mesh).material as Material, {
			duration: Config.GSAP_ANIMATION_DURATION,
			ease: Config.GSAP_ANIMATION_EASE,
			opacity: 0,
			onUpdate: () => {},
			onComplete: () => {
				this.modelScene?.clear();
				this.modelScene?.removeFromParent();
				this._renderer?.removeBeforeUpdateCallback(Scene_1.name + "_screen_pc");
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
			duration: Config.GSAP_ANIMATION_DURATION,
			ease: Config.GSAP_ANIMATION_EASE,
			x,
			y,
			z,
			delay: Config.GSAP_ANIMATION_DURATION * 0.8,
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
				if (
					child instanceof Mesh &&
					child.name === item.childName &&
					TEXTURES_MESH_BASIC_MATERIALS[item.linkedTextureName]
				) {
					const CHILD_TEXTURE =
						TEXTURES_MESH_BASIC_MATERIALS[item.linkedTextureName].clone();
					if (!CHILD_TEXTURE.map) return;

					const MAP_TEXTURE = CHILD_TEXTURE.map.clone();
					MAP_TEXTURE.colorSpace = NoColorSpace;

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
