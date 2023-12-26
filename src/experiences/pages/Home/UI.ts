import GSAP from "gsap";

// EXPERIENCE
import { HomeExperience } from ".";

// CONFIG
import { Config } from "@/experiences/config/Config";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "@/experiences/blueprints/ExperienceBased.blueprint";

/**
 * Class in charge of all DOM HTML interactions (HTML user interface)
 */
export default class UI extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	loadedResourcesProgressLineElements?: HTMLElement | null;
	loadedResourcesProgressElements?: HTMLElement | null;
	lastLoadedResourceElement?: HTMLElement | null;
	modelBubblesContainerElement = document.querySelector<HTMLDivElement>(
		"#mode-bubbles-container"
	);

	constructor() {
		super();

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
	}

	construct() {
		// EVENTS
		this._experience.loader?.on("start", () => {
			this.lastLoadedResourceElement?.classList.remove("animate-pulse");
			if (this.loadedResourcesProgressLineElements)
				this.loadedResourcesProgressLineElements.style.width = "0%";
			if (this.loadedResourcesProgressElements)
				this.loadedResourcesProgressElements.innerHTML = "0%";
		});

		this._experience.loader?.on("progress", (progress: number, url: string) => {
			if (this.loadedResourcesProgressLineElements)
				this.loadedResourcesProgressLineElements.style.width = progress + "%";
			if (this.loadedResourcesProgressElements)
				this.loadedResourcesProgressElements.innerHTML =
					progress.toFixed(0) + "%";
			if (this.lastLoadedResourceElement)
				this.lastLoadedResourceElement.innerHTML = url.replace(/^.*\//, "");
		});

		this._experience.loader?.on("load", () => {
			if (this.loadedResourcesProgressElements)
				this.loadedResourcesProgressElements.innerHTML = "100%";
			if (this.loadedResourcesProgressLineElements)
				this.loadedResourcesProgressLineElements.style.width = "100%";

			setTimeout(() => {
				if (this.lastLoadedResourceElement)
					this.lastLoadedResourceElement.innerHTML =
						"Resources Loaded Successfully";

				this.intro();
				this.emit("ready");
			}, 1000);
		});

		this._experience.app.resources.startLoading();
	}

	destruct() {
		this.loadedResourcesProgressLineElements = undefined;
		this.loadedResourcesProgressElements = undefined;
		this.lastLoadedResourceElement = undefined;
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
					"landing-view-wrapper"
				);

				if (_LANDING_VIEW_WRAPPER?.style)
					_LANDING_VIEW_WRAPPER.style.display = "none";
			},
		});
	}
}
