import { PerspectiveCamera, Vector3 } from "three";
import gsap from "gsap";

// EXPERIENCE
import { HomeExperience } from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// MODELS
import type { Marker } from "~/common/models/experience-ui.model";

// STATIC
import { errors, events } from "~/static";

/** Class in charge of all the direct interactions with the DOM HTML elements. */
export class UI extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appCamera = this._experience.app.camera;

	private _cssTargetElement?: HTMLElement;
	private _activeMarkers: {
		coordinates: Vector3;
		element: HTMLElement;
		position: Vector3;
	}[] = [];
	private _isMarkersAnimating = false;
	private _onStateChange?: () => unknown;

	public _markersContainer?: HTMLDivElement;
	public _markers: Marker[] = [];

	public readonly timeline = gsap.timeline({
		onComplete: () => {
			this.timeline.clear();
		},
	});
	public readonly targetElement = this._experience.app.canvas;
	public readonly targetElementParent = this.targetElement?.parentElement;

	public get isMarkersDisplayed() {
		return !!this._activeMarkers.length;
	}
	public get cssTargetElement(): typeof this._cssTargetElement {
		return this._cssTargetElement;
	}
	public get markersContainer(): typeof this._markersContainer {
		return this._markersContainer;
	}
	public get markers(): typeof this._markers {
		return this._markers;
	}

	public set cssTargetElement(
		cssTargetElement: Exclude<typeof this._cssTargetElement, undefined | null>
	) {
		if (!(cssTargetElement instanceof HTMLElement)) {
			throw new Error(`Unable to set "cssTargetElement"`, {
				cause: errors.WRONG_PARAM,
			});
		}

		this._cssTargetElement = cssTargetElement;
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
		this.emit(events.CHANGED);
	}
	public set markersContainer(
		markersContainer: Exclude<typeof this._markersContainer, undefined | null>
	) {
		if (!(markersContainer instanceof HTMLElement)) {
			throw new Error(`Unable to set "markersContainer"`, {
				cause: errors.WRONG_PARAM,
			});
		}

		this._markersContainer = markersContainer;
		this.emit(events.CHANGED);
	}
	public set markers(markers: typeof this.markers) {
		if (typeof markers !== "object") return;

		const safeMarkers: typeof markers = [];
		for (let i = 0; i < markers.length; i++) {
			if (
				!(markers[i].position instanceof Vector3) ||
				typeof markers[i].icon !== "string" ||
				typeof markers[i].content !== "string"
			)
				throw new Error("Unable to set Markers", {
					cause: [errors.WRONG_PARAM, markers],
				});

			safeMarkers.push(markers[i]);
		}

		this._markers = safeMarkers;
		this.emit(events.MARKERS_ADDED);
		this.emit(events.CHANGED);
	}

	public construct() {
		if (this.targetElement) {
			this.markersContainer = document.createElement("div");
			this.targetElementParent?.insertBefore(
				this.markersContainer,
				this.targetElement
			);
		}
		this._onStateChange = () => {
			this.removeMarkers();
		};
		this._experience.router?.on(events.CHANGED, this._onStateChange);
		this._experience.interactions?.on(
			events.INTERACTION_FOCUS_STARTED,
			this._onStateChange
		);
		this.emit(events.CONSTRUCTED);
	}

	public destruct() {
		if (this._onStateChange) {
			this._experience.router?.off(events.CHANGED, this._onStateChange);
			this._experience.interactions?.off(
				events.INTERACTION_FOCUS_STARTED,
				this._onStateChange
			);
		}
		this.emit(events.DESTRUCTED);
		this.removeAllListeners();
	}

	public displayMarks() {
		if (!this._markersContainer)
			throw new Error("Marker container not found", {
				cause: errors.WRONG_PARAM,
			});

		if (!this.markers?.length || this._isMarkersAnimating) return;

		this._isMarkersAnimating = true;
		this._activeMarkers = [];
		this.markers.map((marker, index) => {
			const markerElement = document.createElement("div");
			const icon = document.createElement("span");
			const contentElement = document.createElement("span");

			markerElement.className = `exp-marker exp-marker-${index}`;
			icon.className = "icon";
			icon.textContent = marker.icon;
			contentElement.className = "content";
			contentElement.textContent = marker.content;

			markerElement.appendChild(icon);
			markerElement.appendChild(contentElement);

			this._activeMarkers.push({
				coordinates: marker.position,
				element: markerElement,
				position: marker.position,
			});
			this._markersContainer?.appendChild(markerElement);

			this.emit(events.CHANGED);
			setTimeout(() => {
				markerElement.classList.add("visible");
				this.emit(events.MARKER_ADDED);
			}, index * 80);
		});

		setTimeout(() => {
			this.emit(events.MARKERS_DISPLAYED);
			this._isMarkersAnimating = false;
		}, this._markers.length * 80);
	}

	public removeMarkers() {
		if (!this._activeMarkers.length || this._isMarkersAnimating) return;

		this._isMarkersAnimating = true;
		for (let i = this._activeMarkers.length - 1; i >= 0; i--) {
			const { element } = this._activeMarkers[i];

			setTimeout(() => {
				element.classList.remove("visible");
				this.emit(events.MARKER_REMOVED);
				this._activeMarkers = [];
			}, (this._activeMarkers.length - 1 - i) * 80);
		}

		setTimeout(() => {
			if (this._markersContainer) this._markersContainer.innerText = "";
			this._isMarkersAnimating = false;
			this.emit(events.MARKERS_REMOVED);
		}, this._activeMarkers.length * 80);

		this.emit(events.CHANGED);
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
