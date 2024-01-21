import {
	Object3D,
	Raycaster,
	Vector2,
	type Object3DEventMap,
	Vector3,
	Color,
} from "three";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { gsap } from "gsap";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";

// EXPERIENCES
import { HomeExperience } from ".";

// MODELS
import type { SelectableObject } from "~/common/experiences/interaction.model";
import { Config } from "~/config";
import { events } from "~/static";

export class Interactions extends ExperienceBasedBlueprint {
	protected _experience = new HomeExperience();

	private readonly mouseCoordinate = new Vector2();
	private readonly _outlineDefault = {
		strength: 2,
		glow: 1,
		thickness: 2,
		pulse: 4.5,
		visibleColor: "#fff",
		hiddenColor: "#fff",
	};

	private _appScene = this._experience.app.scene;
	private _appSizes = this._experience.app.sizes;
	private _composer = this._experience.composer;
	private _camera = this._experience.camera;
	private _navigation = this._experience.navigation;
	private _ui = this._experience.ui;
	private _router = this._experience.router;
	private _selectableObjects?: {
		[uuid: string]: SelectableObject;
	};
	private _selectableUuids: string[] = [];
	private _intersectableContainer?: Object3D<Object3DEventMap>;
	private _selectedObject?: Object3D<Object3DEventMap>;
	private _pointerDownSelectedObject?: Object3D<Object3DEventMap>;
	private _lastCameraPosition?: Vector3;
	private _lastCameraTarget?: Vector3;
	private _onPointerMove?: (e: PointerEvent) => unknown;
	private _onPointerDown?: (e: PointerEvent) => unknown;
	private _onPointerUp?: (e: PointerEvent) => unknown;
	private _onRouteChange?: () => unknown;

	public raycaster = new Raycaster();
	public timeline = gsap.timeline({
		onComplete: () => {
			this.timeline.clear();
		},
	});
	public focusedObject?: SelectableObject;
	public outlinePass?: OutlinePass;
	public enabled = false;
	public controls = true;

	private _checkIntersection() {
		if (!this._camera?.instance) throw new Error("Wrong params");
		if (!this.enabled || !this.outlinePass || !this._intersectableContainer)
			return;
		this.outlinePass.selectedObjects = [];
		this._selectedObject = undefined;
		if (this._ui?.targetElement) this._ui.targetElement.style.cursor = "auto";

		this.raycaster.setFromCamera(this.mouseCoordinate, this._camera.instance);

		const intersects = this.raycaster.intersectObject(
			this._intersectableContainer,
			true
		);
		const selectedObj =
			intersects[0]?.object.uuid &&
			this._selectableUuids.indexOf(intersects[0].object.uuid) !== -1
				? intersects[0]?.object
				: undefined;

		if (!selectedObj) return;

		this._selectedObject = selectedObj;
		this.outlinePass.selectedObjects = [selectedObj];
		if (this._ui?.targetElement)
			this._ui.targetElement.style.cursor = "pointer";
	}

	public start(
		selectables: SelectableObject[],
		intersectable: Object3D<Object3DEventMap> = this._appScene
	) {
		if (!this._camera?.instance || this.outlinePass)
			throw new Error("Wrong params");
		if (!selectables.length) return;
		if (this.timeline.isActive()) this.timeline.progress(1);

		this.enabled = true;
		this._intersectableContainer = intersectable;
		this._selectableUuids = [];
		const selectableObjects: Object3D[] = [];

		for (const _ of selectables) {
			const uuid = _.object.uuid;

			if (this._selectableObjects) this._selectableObjects[uuid] = _;
			else this._selectableObjects = { [uuid]: _ };

			this._selectableUuids.push(uuid);
			selectableObjects.push(_.object);
		}

		this.outlinePass = new OutlinePass(
			new Vector2(this._appSizes.width, this._appSizes.height),
			this._appScene,
			this._camera.instance,
			selectableObjects
		);
		this.outlinePass.visibleEdgeColor = new Color(
			this._outlineDefault.visibleColor
		);
		this.outlinePass.hiddenEdgeColor = new Color(
			this._outlineDefault.hiddenColor
		);

		this.timeline
			.fromTo(
				this.outlinePass,
				{
					edgeStrength: 0,
				},
				{
					edgeStrength: this._outlineDefault.strength + 2,
					repeat: 1,
					repeatDelay: 1,
					yoyo: true,
				}
			)
			.add(() => {
				if (!this.outlinePass) return;

				this.outlinePass.selectedObjects = [];
				this.outlinePass.edgeStrength = this._outlineDefault.strength;
				this.outlinePass.edgeGlow = this._outlineDefault.glow;
				this.outlinePass.edgeThickness = this._outlineDefault.thickness;
				this.outlinePass.pulsePeriod = this._outlineDefault.pulse;
			});

		this._composer?.addPass(`${Interactions.name}_pass`, this.outlinePass);
	}

	public stop() {
		this.outlinePass?.dispose();
		this.outlinePass = undefined;
		this.focusedObject = undefined;
		this._selectedObject = undefined;
		this.enabled = false;

		if (this._ui?.targetElement)
			this._ui.targetElement.style.pointerEvents = "auto";

		this._composer?.removePass(`${Interactions.name}_pass`);
	}

	public leaveFocusMode() {
		if (!this.focusedObject) return;

		this.focusedObject = undefined;
		this._selectedObject = undefined;

		if (this.outlinePass) {
			this.outlinePass.selectedObjects = [];
			this.outlinePass.edgeStrength = this._outlineDefault.strength;
		}

		if (this._ui?.targetElement)
			this._ui.targetElement.style.pointerEvents = "auto";

		if (this._lastCameraPosition) {
			const duration = Config.GSAP_ANIMATION_DURATION - 0.5;
			this._navigation
				?.updateCameraPosition(
					this._lastCameraPosition,
					this._lastCameraTarget,
					duration
				)
				.add(() => {
					this._camera?.resetFov();
				}, "<");
		}
	}

	private _onPointerDownEvent = (e: PointerEvent) => {
		if (
			!e.isPrimary ||
			!this.controls ||
			!this.outlinePass?.selectedObjects.length ||
			!this._camera?.instance ||
			!this._selectedObject?.uuid
		)
			return;

		this._pointerDownSelectedObject = this._selectedObject;
	};

	private _onPointerUpEvent = (e: PointerEvent) => {
		if (
			!e.isPrimary ||
			!this.controls ||
			!this.outlinePass?.selectedObjects.length ||
			!this._camera?.instance ||
			!this._selectedObject?.uuid ||
			this._pointerDownSelectedObject?.uuid !== this._selectedObject.uuid
		)
			return;

		this._pointerDownSelectedObject = undefined;
		const router = useRouter();
		const currentObject = this._selectableObjects?.[this._selectedObject.uuid];

		if (
			currentObject?.focusPoint &&
			currentObject.focusTarget &&
			!(currentObject.link || currentObject?.externalLink)
		) {
			const duration = Config.GSAP_ANIMATION_DURATION - 0.5;
			this._lastCameraPosition = this._camera.instance.position.clone();
			this._lastCameraTarget = this._camera.lookAtPosition.clone();

			if (this.outlinePass) this.outlinePass.edgeStrength = 0;
			if (this._ui?.targetElement)
				this._ui.targetElement.style.pointerEvents = "none";

			return this._navigation
				?.updateCameraPosition(
					currentObject.focusPoint,
					currentObject.focusTarget,
					duration
				)
				.add(() => {
					if (this._camera && currentObject.focusFov)
						this._camera.updateCameraFov(currentObject.focusFov, duration);
				}, "<")
				.add(() => {
					if (currentObject) this.focusedObject = currentObject;
				});
		}

		if (currentObject?.link) return router?.push(currentObject.link);

		if (currentObject?.externalLink)
			return window.open(currentObject.externalLink, "_blank");
	};

	public construct() {
		this._onPointerMove = (e) => {
			if (
				!e.isPrimary ||
				!this.controls ||
				this.timeline.isActive() ||
				this._navigation?.timeline.isActive()
			)
				return;

			this._pointerDownSelectedObject = undefined;
			this.mouseCoordinate.x = (e.clientX / this._appSizes.width) * 2 - 1;
			this.mouseCoordinate.y = -(e.clientY / this._appSizes.height) * 2 + 1;

			this._checkIntersection();
		};

		this._onPointerDown = this._onPointerDownEvent;
		this._onPointerUp = this._onPointerUpEvent;

		this._onRouteChange = () => {
			if (this._ui?.targetElement) this._ui.targetElement.style.cursor = "auto";
			this.stop();
		};

		this._ui?.targetElement?.addEventListener(
			"pointermove",
			this._onPointerMove
		);
		this._ui?.targetElement?.addEventListener(
			"pointerdown",
			this._onPointerDown
		);
		this._ui?.targetElement?.addEventListener("pointerup", this._onPointerUp);
		this._router?.on(events.CHANGED, this._onRouteChange);
	}

	public destruct() {
		this._onPointerMove &&
			this._ui?.targetElement?.removeEventListener(
				"pointermove",
				this._onPointerMove
			);

		this._onPointerDown &&
			this._ui?.targetElement?.removeEventListener(
				"pointerup",
				this._onPointerDown
			);

		this._onRouteChange &&
			this._router?.off(events.CHANGED, this._onRouteChange);
	}

	public update(): void {}
}
