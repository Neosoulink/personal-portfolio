import GSAP from "gsap";

// EXPERIENCE
import { HomeExperience } from ".";

// CONFIG
import { Config } from "~/config";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";

/**
 * Class in charge of all the direct interactions with the DOM HTML elements.
 */
export class UI extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private _loadedResourcesProgressLineElements?: HTMLElement | null;
	private _loadedResourcesProgressElements?: HTMLElement | null;
	private _lastLoadedResourceElement?: HTMLElement | null;

	constructor() {
		super();

		const _LOADED_RESOURCES_PROGRESS_LINE_ELEMENT = document.getElementById(
			"loaded-resources-progress-line",
		);
		const _LOADED_RESOURCES_PROGRESS_ELEMENT = document.getElementById(
			"loaded-resources-progress",
		);
		const _LAST_LOADED_RESOURCE_ELEMENT = document.getElementById(
			"last-loaded-resource",
		);

		if (_LOADED_RESOURCES_PROGRESS_LINE_ELEMENT)
			this._loadedResourcesProgressLineElements =
				_LOADED_RESOURCES_PROGRESS_LINE_ELEMENT;
		if (_LOADED_RESOURCES_PROGRESS_ELEMENT)
			this._loadedResourcesProgressElements =
				_LOADED_RESOURCES_PROGRESS_ELEMENT;
		if (_LAST_LOADED_RESOURCE_ELEMENT)
			this._lastLoadedResourceElement = _LAST_LOADED_RESOURCE_ELEMENT;
	}

	construct() {
		// EVENTS
		this._experience.loader?.on("start", () => {
			this._lastLoadedResourceElement?.classList.remove("animate-pulse");
			if (this._loadedResourcesProgressLineElements)
				this._loadedResourcesProgressLineElements.style.width = "0%";
			if (this._loadedResourcesProgressElements)
				this._loadedResourcesProgressElements.innerHTML = "0%";
		});

		this._experience.loader?.on("progress", (progress: number, url: string) => {
			if (this._loadedResourcesProgressLineElements)
				this._loadedResourcesProgressLineElements.style.width = `${progress}%`;
			if (this._loadedResourcesProgressElements)
				this._loadedResourcesProgressElements.innerHTML = `${progress.toFixed(
					0,
				)}%`;
			if (this._lastLoadedResourceElement)
				this._lastLoadedResourceElement.innerHTML = url.replace(/^.*\//, "");
		});

		this._experience.loader?.on("load", () => {
			if (this._loadedResourcesProgressElements)
				this._loadedResourcesProgressElements.innerHTML = "100%";
			if (this._loadedResourcesProgressLineElements)
				this._loadedResourcesProgressLineElements.style.width = "100%";

			setTimeout(() => {
				if (this._lastLoadedResourceElement)
					this._lastLoadedResourceElement.innerHTML =
						"Resources Loaded Successfully";

				this.intro();
				this.emit("ready");
			}, 1000);
		});

		this._experience.app.resources.startLoading();
	}

	destruct() {
		this._loadedResourcesProgressLineElements = undefined;
		this._loadedResourcesProgressElements = undefined;
		this._lastLoadedResourceElement = undefined;
	}

	intro() {
		const _TIMELINE = GSAP.timeline();
		_TIMELINE.to("#landing-view-wrapper", {
			duration: Config.GSAP_ANIMATION_DURATION,
			ease: Config.GSAP_ANIMATION_EASE,
			opacity: 0,
			delay: 2,
			onComplete: () => {
				const _LANDING_VIEW_WRAPPER = document.getElementById(
					"landing-view-wrapper",
				);

				if (_LANDING_VIEW_WRAPPER?.style)
					_LANDING_VIEW_WRAPPER.style.display = "none";
			},
		});
	}
}
