import { PerspectiveCamera, type Vector3 } from "three";
import gsap from "gsap";

// EXPERIENCE
import { HomeExperience } from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";
import { errors, events } from "~/static";

/**
 * Class in charge of all the direct interactions with the DOM HTML elements.
 */
export class UI extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appCamera = this._experience.app.camera;

	private _cssTargetElement?: HTMLElement;
	private _activeMarkers: {
		coordinates: Vector3;
		element: HTMLElement;
		position: Vector3;
	}[] = [];

	public readonly timeline = gsap.timeline({
		onComplete: () => {
			this.timeline.clear();
		},
	});
	public readonly targetElement = this._experience.app.canvas;
	public readonly targetElementParent = this.targetElement?.parentElement;

	public markersContainer?: HTMLDivElement;
	public markers: {
		position: Vector3;
		title: string;
		content: string;
	}[] = [];
	public currentOveredMark?: HTMLDivElement;

	public get isMarkersDisplayed() {
		return !!this._activeMarkers.length;
	}

	public get cssTargetElement(): HTMLElement | undefined {
		return this._cssTargetElement;
	}

	public set cssTargetElement(element: HTMLElement) {
		this._cssTargetElement = element;
		this._cssTargetElement.classList.add(
			"fixed",
			"top-0",
			"left-0",
			"w-full",
			"h-full"
		);

		this.targetElement &&
			this.targetElementParent?.insertBefore(
				this._cssTargetElement,
				this.targetElement
			);
	}

	public construct() {
		if (this.targetElement) {
			this.markersContainer = document.createElement("div");
			this.targetElementParent?.insertBefore(
				this.markersContainer,
				this.targetElement
			);
		}
		this.emit(events.CONSTRUCTED);
	}

	public destruct() {}

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
