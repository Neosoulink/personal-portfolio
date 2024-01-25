import gsap from "gsap";

// EXPERIENCE
import { HomeExperience } from ".";

// CONFIG
import { Config } from "~/config";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";
import { PerspectiveCamera, type Vector3 } from "three";
import { errors, events } from "~/static";

/**
 * Class in charge of all the direct interactions with the DOM HTML elements.
 */
export class UI extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appCamera = this._experience.app.camera;

	private _loadedResourcesProgressLine?: HTMLElement | null;
	private _loadedResourcesProgress?: HTMLElement | null;
	private _loadedResourcesStartButton?: HTMLElement | null;
	private _lastLoadedResource?: HTMLElement | null;
	private _loaderContainer?: HTMLElement | null;
	private _activeMarkers: {
		coordinates: Vector3;
		element: HTMLElement;
		position: Vector3;
	}[] = [];

	public static readonly loaderContainerId = "home-loader-container";
	public static readonly loadedResourcesProgressLineId =
		"loaded-resources-progress-line";
	public static readonly loadedResourcesProgressId =
		"loaded-resources-progress";
	public static readonly loadedResourcesStartButtonId =
		"loaded-resources-start-button";
	public static readonly lastLoadedResourceId = "last-loaded-resource";

	public readonly timeline = gsap.timeline();
	public readonly targetElement = this._experience.app.canvas;
	public readonly targetElementParent = this.targetElement?.parentElement;

	public markersContainer?: HTMLDivElement;
	public markers: {
		position: Vector3;
		title: string;
		content: string;
	}[] = [];
	public currentOveredMark?: HTMLDivElement;

	constructor() {
		super();

		this._loaderContainer = document.getElementById(UI.loaderContainerId);
		this._loadedResourcesProgressLine = document.getElementById(
			UI.loadedResourcesProgressLineId
		);
		this._loadedResourcesProgress = document.getElementById(
			UI.loadedResourcesProgressId
		);
		this._loadedResourcesStartButton = document.getElementById(
			UI.loadedResourcesStartButtonId
		);
		this._lastLoadedResource = document.getElementById(UI.lastLoadedResourceId);
	}

	public get isMarkersDisplayed() {
		return !!this._activeMarkers.length;
	}

	construct() {
		if (this.targetElement) {
			this.markersContainer = document.createElement("div");
			this.targetElementParent?.insertBefore(
				this.markersContainer,
				this.targetElement
			);
		}

		// EVENTS
		this._experience.loader?.on(events.STARTED, () => {
			this._lastLoadedResource?.classList.remove("animate-pulse");
			if (this._loadedResourcesProgressLine)
				this._loadedResourcesProgressLine.style.width = "0%";
			if (this._loadedResourcesProgress)
				this._loadedResourcesProgress.innerText = "0%";
		});

		this._experience.loader?.on(
			events.PROGRESSED,
			(progress: number, url: string) => {
				setTimeout(() => {
					if (this._loadedResourcesProgressLine)
						this._loadedResourcesProgressLine.style.width = `${progress}%`;
					if (this._loadedResourcesProgress)
						this._loadedResourcesProgress.innerText = `${progress.toFixed(0)}%`;
					if (this._lastLoadedResource)
						this._lastLoadedResource.innerText = `Loaded: ${url.replace(
							/.*\/|\..*/gi,
							""
						)}`;
				}, 10 * progress);
			}
		);

		this._experience.loader?.on(events.LOADED, () => {
			setTimeout(() => {
				if (this._loadedResourcesProgressLine)
					this._loadedResourcesProgressLine.style.width = "100%";
				if (this._loadedResourcesProgress)
					this._loadedResourcesProgress.innerText = "100%";
				if (this._lastLoadedResource)
					this._lastLoadedResource.innerText = "Resources Loaded Successfully";
			}, 1500);

			setTimeout(() => {
				this._loadedResourcesProgress?.remove();
				this._loadedResourcesStartButton?.classList.remove("hidden");

				const onClickButton = () => {
					this._loadedResourcesStartButton?.classList.remove("animate-pulse");
					this._loadedResourcesStartButton?.removeEventListener(
						"click",
						onClickButton
					);
					this.intro();
					this.emit(events.LOADED);
				};
				const onTouchStart = () => {
					this._loadedResourcesStartButton?.classList.remove("animate-pulse");
					this._loadedResourcesStartButton?.removeEventListener(
						"touchstart",
						onTouchStart
					);
				};

				this._loadedResourcesStartButton?.addEventListener(
					"touchstart",
					onTouchStart,
					{ passive: true }
				);
				this._loadedResourcesStartButton?.addEventListener(
					"click",
					onClickButton
				);
			}, 2000);
		});
	}

	destruct() {
		this._loadedResourcesProgressLine = undefined;
		this._loadedResourcesProgress = undefined;
		this._lastLoadedResource = undefined;
	}

	intro() {
		if (!this._loaderContainer) return;
		if (this.timeline.isActive()) this.timeline.progress(1);

		this.timeline.to(this._loaderContainer, {
			duration: Config.GSAP_ANIMATION_DURATION,
			ease: Config.GSAP_ANIMATION_EASE,
			opacity: 0,
			onComplete: () => {
				this._loaderContainer?.remove();
			},
		});
	}

	public displayMarks() {
		if (!this.markersContainer)
			throw new Error("Marker container not found", {
				cause: errors.WRONG_PARAM,
			});

		this.markers?.map((marker, index) => {
			const markerElement = document.createElement("div");
			const titleElement = document.createElement("span");
			const contentElement = document.createElement("span");

			markerElement.className = `exp-marker exp-marker-${index}`;
			markerElement.onmouseenter = () => {
				this.currentOveredMark = markerElement;
			};
			markerElement.onmouseleave = () => {
				this.currentOveredMark = undefined;
			};
			markerElement.title = marker.title;
			titleElement.className = "title";
			titleElement.textContent = marker.title;
			contentElement.className = "content";
			contentElement.textContent = marker.content;

			markerElement.appendChild(titleElement);
			markerElement.appendChild(contentElement);

			this._activeMarkers.push({
				coordinates: marker.position,
				element: markerElement,
				position: marker.position,
			});

			this.markersContainer?.appendChild(markerElement);

			setTimeout(() => markerElement.classList.add("visible"), index * 80);
		});
	}

	public removeMarkers() {
		if (!this._activeMarkers.length) return;

		for (let i = this._activeMarkers.length - 1; i >= 0; i--) {
			const { element } = this._activeMarkers[i];

			setTimeout(
				() => element.classList.remove("visible"),
				(this._activeMarkers.length - 1 - i) * 80
			);
		}
		setTimeout(() => {
			if (this.markersContainer) this.markersContainer.innerText = "";
		}, this._activeMarkers.length * 80);
		this._activeMarkers = [];
	}

	public update(): void {
		if (!(this._appCamera.instance instanceof PerspectiveCamera)) return;

		for (const marker of this._activeMarkers) {
			const position = marker.position
				.clone()
				.project(this._appCamera.instance);

			const translateX = position.x * this._experience.app.sizes.width * 0.5;
			const translateY = -(
				position.y *
				this._experience.app.sizes.height *
				0.5
			);

			marker.element.style.transform = `translate(${translateX}px, ${translateY}px)`;
		}
	}
}
