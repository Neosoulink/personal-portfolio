// EXPERIENCE
import HomeExperience from ".";

// INTERFACES
import { type ExperienceBase } from "../../interfaces/experienceBase";

/**
 * Class in charge of all DOM HTML interactions (HTML user interface)
 */
export default class UI implements ExperienceBase {
	private readonly experience = new HomeExperience();

	loadedResourcesProgressLineElements?: HTMLElement | null;
	loadedResourcesProgressElements?: HTMLElement | null;
	lastLoadedResourceElement?: HTMLElement | null;
	modelBubblesContainerElement = document.querySelector<HTMLDivElement>(
		"#mode-bubbles-container"
	);

	constructor() {
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
		this.experience.loader?.on("start", () => {
			this.lastLoadedResourceElement?.classList.remove("animate-pulse");
			if (this.loadedResourcesProgressLineElements)
				this.loadedResourcesProgressLineElements.style.width = "0%";
			if (this.loadedResourcesProgressElements)
				this.loadedResourcesProgressElements.innerHTML = "0%";
		});

		this.experience.loader?.on("progress", (progress: number, url: string) => {
			if (this.loadedResourcesProgressLineElements)
				this.loadedResourcesProgressLineElements.style.width = progress + "%";
			if (this.loadedResourcesProgressElements)
				this.loadedResourcesProgressElements.innerHTML =
					progress.toFixed(0) + "%";
			if (this.lastLoadedResourceElement)
				this.lastLoadedResourceElement.innerHTML = url.replace(/^.*\//, "");
		});

		this.experience.loader?.on("load", () => {
			if (this.loadedResourcesProgressElements)
				this.loadedResourcesProgressElements.innerHTML = "100%";
			if (this.loadedResourcesProgressLineElements)
				this.loadedResourcesProgressLineElements.style.width = "100%";

			setTimeout(() => {
				if (this.lastLoadedResourceElement)
					this.lastLoadedResourceElement.innerHTML =
						"Resources Loaded Successfully";
			}, 1000);
		});

		this.experience.app.resources.startLoading();
	}

	destruct() {
		this.loadedResourcesProgressLineElements = undefined;
		this.loadedResourcesProgressElements = undefined;
		this.lastLoadedResourceElement = undefined;
	}
}
