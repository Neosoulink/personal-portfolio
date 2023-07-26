import GSAP from "gsap";
import ThreeApp from "quick-threejs";
import EventEmitter from "events";

// CLASSES
import { Experience } from ".";

export default class Preloader extends EventEmitter {
	app = new ThreeApp();
	experience = new Experience();
	progress = 0;

	constructor() {
		super();

		this.experience?.construct();

		this.experience.loadingManager.onStart = () => {
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

		this.experience.loadingManager.onLoad = () => {
			setTimeout(() => {
				this.emit("load", this.progress);

				setTimeout(() => {
					this.start();
				}, 200);
			}, 1000);
		};
	}

	/**
	 * Launch the intro animation of the experience.
	 */
	start() {
		const _DEFAULT_PROPS = {
			duration: 2.5,
			ease: "M0,0 C0.001,0.001 0.002,0.003 0.003,0.004 0.142,0.482 0.284,0.75 0.338,0.836 0.388,0.924 0.504,1 1,1 ",
		};

		if (this.app.camera.instance) {
			const { x, y, z } = this.experience.cameraCurvePath.getPointAt(0);

			GSAP.to(this.app.camera.instance.position, {
				...this.experience.getGsapDefaultProps(),
				x,
				y,
				z,
				onUpdate: () => {
					this.experience.setCameraLookAt(
						this.experience.initialLookAtPosition
					);
				},
				..._DEFAULT_PROPS,
			});

			setTimeout(() => {
				this.experience.autoCameraAnimation = true;
			}, (_DEFAULT_PROPS.duration + 0.5) * 1000);
		}

		if (this.experience.cameraCurvePathProgress.target < 0) {
			this.experience.cameraCurvePathProgress.target = 1;
		}
	}
}
