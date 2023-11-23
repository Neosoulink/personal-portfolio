import * as THREE from "three";
import GSAP from "gsap";
import EventEmitter from "events";

// ---
import Experience from ".";

// INTERFACES
import type Base from "@/interfaces/BaseExperience";

export default class Loader extends EventEmitter implements Base {
	private readonly experience = new Experience();

	texturesMeshBasicMaterials: {
		[name: string]: THREE.MeshBasicMaterial;
	} = {};
	progress = 0;

	constructor() {
		super();

		// RESOURCES
		this.experience.app.resources.setDracoLoader("/decoders/draco/");
		this.experience.app.resources.setSources([
			{
				name: "scene_1_room",
				type: "gltfModel",
				path: "/3d_models/isometric_room/scene_1_room.glb",
			},
			{
				name: "scene_1_room_baked_texture",
				type: "texture",
				path: "/3d_models/isometric_room/scene_1_room_baked_texture.jpg",
			},
			{
				name: "typescript_logo",
				type: "texture",
				path: "textures/typescript_logo.jpg",
			},
		]);
	}

	construct() {
		~(this.experience.app.resources.loadingManager.onStart = () => {
			this.emit("start", (this.progress = 0));
		});

		~(this.experience.app.resources.loadingManager.onProgress = (
			itemUrl,
			itemsLoaded,
			itemsToLoad
		) => {
			this.emit(
				"progress",
				(this.progress = (itemsLoaded / itemsToLoad) * 100),
				itemUrl
			);
		});

		~(this.experience.app.resources.loadingManager.onLoad = () => {
			this.correctTextures();
			this.initMeshTextures();

			this.startIntro();
			this.emit("load", this.progress);
		});

		this.experience.app.resources.startLoading();
	}

	destruct() {
		Object.keys(this.texturesMeshBasicMaterials).forEach((key) =>
			this.texturesMeshBasicMaterials[key].dispose()
		);
		this.texturesMeshBasicMaterials = {};

		this.experience.app.resources.loadingManager.removeHandler(
			/onStart|onError|onProgress|onLoad/
		);
		this.experience.app.resources.setSources([]);
	}

	/** Correct resources texture color and flip faces. */
	correctTextures() {
		Object.keys(this.experience.app.resources.items).forEach((key) => {
			const ITEM = this.experience.app.resources.items[key];
			if (ITEM instanceof THREE.Texture) {
				ITEM.flipY = false;
				ITEM.colorSpace = THREE.SRGBColorSpace;
			}
		});
	}

	/** Initialize Mesh textures. */
	initMeshTextures() {
		if (this.experience.app?.resources.items) {
			const _ITEMS = this.experience.app.resources.items;
			const _ITEMS_KEYS = Object.keys(_ITEMS);

			_ITEMS_KEYS.forEach((key) => {
				const _ITEM = _ITEMS[key];

				if (_ITEM instanceof THREE.Texture) {
					this.texturesMeshBasicMaterials[key] = new THREE.MeshBasicMaterial({
						map: _ITEM,
						transparent: true,
					});
				}
			});
		}
	}

	/**
	 * Launch the intro animation of the experience.
	 *
	 * @deprecated Should use the one the {@link [UI](./UI.ts)} class
	 *
	 */
	startIntro() {
		this.experience.world?.construct();

		const _DEFAULT_PROPS = {
			duration: 3,
			ease: "M0,0 C0.001,0.001 0.002,0.003 0.003,0.004 0.142,0.482 0.284,0.75 0.338,0.836 0.388,0.924 0.504,1 1,1 ",
		};

		const _TIMELINE = GSAP.timeline();
		_TIMELINE.to("#landing-view-wrapper", {
			..._DEFAULT_PROPS,
			opacity: 0,
			delay: 2,
			onComplete: () => {
				const _LANDING_VIEW_WRAPPER = document.getElementById(
					"landing-view-wrapper"
				);

				if (_LANDING_VIEW_WRAPPER?.style)
					_LANDING_VIEW_WRAPPER.style.display = "none";
			},
		});

		if (
			this.experience.app.camera.instance &&
			this.experience.world &&
			this.experience.world.controls
		) {
			const { x, y, z } =
				this.experience.world?.controls?.cameraCurvePath.getPointAt(0);

			GSAP.to(this.experience.app.camera.instance.position, {
				...this.experience.world?.controls?.getGsapDefaultProps(),
				..._DEFAULT_PROPS,
				x,
				y,
				z,
				delay: _DEFAULT_PROPS.duration * 0.8,
				onUpdate: () => {
					this.experience.world?.controls?.setCameraLookAt(
						this.experience.world?.controls?.initialLookAtPosition
					);
				},
				onComplete: () => {
					setTimeout(() => {
						if (this.experience.world?.controls) {
							this.experience.world?.controls
								?.getGsapDefaultProps()
								.onComplete();

							this.experience.world.controls.autoCameraAnimation = true;
						}
					}, 1000);
				},
			});
		}
	}
}
