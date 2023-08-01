import * as THREE from "three";
import GSAP from "gsap";
import EventEmitter from "events";

// CLASSES
import Experience from ".";

export default class Preloader extends EventEmitter {
	private experience = new Experience();
	loadedResourcesProgressLineElements?: HTMLElement | null;
	loadedResourcesProgressElements?: HTMLElement | null;
	lastLoadedResourceElement?: HTMLElement | null;
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
			{
				name: "windows_10_lock_screen",
				type: "texture",
				path: "textures/windows_10_lock_screen.png",
			},
			{
				name: "windows_11_lock_screen",
				type: "texture",
				path: "textures/windows_11_lock_screen.jpg",
			},
			{
				name: "phone_lock_screen",
				type: "texture",
				path: "textures/phone_lock_screen.jpg",
			},
			{
				name: "github_screenshot",
				type: "texture",
				path: "textures/github_screenshot.png",
			},
			{
				name: "code_screenshot",
				type: "texture",
				path: "textures/code_screenshot.png",
			},
			{
				name: "typescript_logo",
				type: "texture",
				path: "textures/typescript_logo.jpg",
			},
			{
				name: "javascript_logo",
				type: "texture",
				path: "textures/javascript_logo.jpg",
			},
			{
				name: "profile_photo",
				type: "texture",
				path: "textures/profile_photo.jpg",
			},
		]);
	}

	construct() {
		const _LOADED_RESOURCES_PROGRESS_LINE_ELEMENT = document.getElementById(
			"loaded-resources-progress-line"
		);
		const _LOADED_RESOURCES_PROGRESS_ELEMENT = document.getElementById(
			"loaded-resources-progress"
		);
		const _LAST_LOADED_RESOURCE_ELEMENT = document.getElementById(
			"last-loaded-resource"
		);
		if (_LOADED_RESOURCES_PROGRESS_LINE_ELEMENT)
			this.loadedResourcesProgressLineElements =
				_LOADED_RESOURCES_PROGRESS_LINE_ELEMENT;
		if (_LOADED_RESOURCES_PROGRESS_ELEMENT)
			this.loadedResourcesProgressElements = _LOADED_RESOURCES_PROGRESS_ELEMENT;
		if (_LAST_LOADED_RESOURCE_ELEMENT)
			this.lastLoadedResourceElement = _LAST_LOADED_RESOURCE_ELEMENT;

		// EVENTS
		this.experience.app.resources.loadingManager.onStart = () => {
			this.progress = 0;
			this.lastLoadedResourceElement?.classList.remove("animate-pulse");
			if (this.loadedResourcesProgressLineElements)
				this.loadedResourcesProgressLineElements.style.width = "0%";
			if (this.loadedResourcesProgressElements)
				this.loadedResourcesProgressElements.innerHTML = "0%";
			this.emit("start", this.progress);
		};

		this.experience.app.resources.loadingManager.onProgress = (
			_itemUrl,
			itemsLoaded,
			itemsToLoad
		) => {
			this.progress = (itemsLoaded / itemsToLoad) * 100;

			if (this.loadedResourcesProgressLineElements)
				this.loadedResourcesProgressLineElements.style.width =
					this.progress + "%";
			if (this.loadedResourcesProgressElements)
				this.loadedResourcesProgressElements.innerHTML =
					this.progress.toFixed(0) + "%";
			if (this.lastLoadedResourceElement)
				this.lastLoadedResourceElement.innerHTML = _itemUrl.replace(
					/^.*\//,
					""
				);
			this.emit("progress", this.progress, _itemUrl);
		};

		this.experience.app.resources.loadingManager.onLoad = () => {
			this.correctTextures();
			this.setTexturesMeshBasicMaterials();

			if (this.loadedResourcesProgressElements)
				this.loadedResourcesProgressElements.innerHTML = "100%";
			if (this.loadedResourcesProgressLineElements)
				this.loadedResourcesProgressLineElements.style.width = "100%";

			setTimeout(() => {
				if (this.lastLoadedResourceElement)
					this.lastLoadedResourceElement.innerHTML =
						"Resources Loaded Successfully";
			}, 1000);

			this.startIntro();
			this.emit("load", this.progress);
		};

		this.experience.app.resources.startLoading();
	}

	destruct() {
		this.experience.app.resources.loadingManager.removeHandler(
			/onStart|onError|onProgress|onLoad/
		);
		this.experience.app.resources.setSources([]);
		this.loadedResourcesProgressLineElements = undefined;
		this.loadedResourcesProgressElements = undefined;
		this.lastLoadedResourceElement = undefined;
		Object.keys(this.texturesMeshBasicMaterials).forEach((key) =>
			this.texturesMeshBasicMaterials[key].dispose()
		);
		this.texturesMeshBasicMaterials = {};
	}

	/**
	 *
	 */
	correctTextures() {
		Object.keys(this.experience.app.resources.items).forEach((key) => {
			const ITEM = this.experience.app.resources.items[key];
			if (ITEM instanceof THREE.Texture) {
				ITEM.flipY = false;
				ITEM.colorSpace = THREE.SRGBColorSpace;
			}
		});
	}

	/**
	 *
	 */
	setTexturesMeshBasicMaterials() {
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
			this.experience.world.interactions
		) {
			const { x, y, z } =
				this.experience.world?.interactions?.cameraCurvePath.getPointAt(0);

			GSAP.to(this.experience.app.camera.instance.position, {
				...this.experience.world?.interactions?.getGsapDefaultProps(),
				..._DEFAULT_PROPS,
				x,
				y,
				z,
				delay: _DEFAULT_PROPS.duration * 0.8,
				onUpdate: () => {
					this.experience.world?.interactions?.setCameraLookAt(
						this.experience.world?.interactions?.initialLookAtPosition
					);
				},
				onComplete: () => {
					setTimeout(() => {
						if (this.experience.world?.interactions) {
							this.experience.world?.interactions
								?.getGsapDefaultProps()
								.onComplete();

							this.experience.world.interactions.autoCameraAnimation = true;
						}
					}, 1000);
				},
			});
		}
	}
}
