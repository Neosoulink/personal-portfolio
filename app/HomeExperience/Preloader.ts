import * as THREE from "three";
import GSAP from "gsap";
import ThreeApp from "quick-threejs";
import EventEmitter from "events";

// CLASSES
import Experience from ".";

export default class Preloader extends EventEmitter {
	private app = new ThreeApp();
	experience = new Experience();
	progress = 0;

	constructor() {
		super();

		// RESOURCES
		this.app.resources.setDracoLoader("/decoders/draco/");
		this.app.resources.setSources([
			{
				name: "isometric_room",
				type: "gltfModel",
				path: "/3d_models/isometric_room/isometric_room.glb",
			},
			{
				name: "baked_room_background",
				type: "texture",
				path: "/3d_models/isometric_room/baked-room-background.jpg",
			},
			{
				name: "baked_room_floor",
				type: "texture",
				path: "/3d_models/isometric_room/baked-room-floor.jpg",
			},
			{
				name: "baked_room_objects",
				type: "texture",
				path: "/3d_models/isometric_room/baked-room-objects.jpg",
			},
			{
				name: "baked_room_walls",
				type: "texture",
				path: "/3d_models/isometric_room/baked-room-walls.jpg",
			},
			{
				name: "baked_room_woods",
				type: "texture",
				path: "/3d_models/isometric_room/baked-room-woods.jpg",
			},
		]);
		this.app.resources.startLoading();
		this.experience?.construct();

		// EVENTS
		this.app.resources.loadingManager.onStart = () => {
			this.progress = 0;
			this.emit("start", this.progress);
		};

		this.app.resources.loadingManager.onProgress = (
			_itemUrl,
			itemsLoaded,
			itemsToLoad
		) => {
			this.progress = (itemsLoaded / itemsToLoad) * 100;
			this.emit("progress", this.progress, _itemUrl);
		};

		this.app.resources.loadingManager.onLoad = () => {
			this.correctTextures();
			this.start();
			this.emit("load", this.progress);
		};
	}

	correctTextures() {
		Object.keys(this.app.resources.items).forEach((key) => {
			const ITEM = this.app.resources.items[key];
			if (ITEM instanceof THREE.Texture) {
				ITEM.flipY = false;
				ITEM.colorSpace = THREE.SRGBColorSpace;
			}
		});
	}

	/**
	 * Launch the intro animation of the experience.
	 */
	start() {
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
				document
					.querySelector("#landing-view-wrapper")
					?.classList.add("hidden");
			},
		});

		if (this.app.camera.instance) {
			const { x, y, z } = this.experience.cameraCurvePath.getPointAt(0);

			GSAP.to(this.app.camera.instance.position, {
				...this.experience.getGsapDefaultProps(),
				..._DEFAULT_PROPS,
				x,
				y,
				z,
				delay: _DEFAULT_PROPS.duration * 0.8,
				onUpdate: () => {
					this.experience.setCameraLookAt(
						this.experience.initialLookAtPosition
					);
				},
				onComplete: () => {
					setTimeout(() => {
						this.experience.getGsapDefaultProps().onComplete();
						this.experience.autoCameraAnimation = true;
					}, 1000);
				},
			});
		}
	}
}
