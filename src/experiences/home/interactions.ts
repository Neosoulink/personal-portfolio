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
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// EXPERIENCES
import { HomeExperience } from ".";

// MODELS
import type { SelectableObject } from "~/common/models/experience-interaction.model";
import { Config } from "~/config";
import { events } from "~/static";

export class Interactions extends ExperienceBasedBlueprint {
	protected _experience = new HomeExperience();

	private readonly _mouseCoordinate = new Vector2();
	private readonly _focusedMouseCoordinate = new Vector2();
	private readonly _normalizedMouseCoordinate = new Vector2();
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
	private _enabled = false;

	public readonly passName = `${Interactions.name}_pass`;

	public raycaster = new Raycaster();
	public timeline = gsap.timeline({
		onComplete: () => {
			this.timeline.clear();
		},
	});
	public focusedObject?: SelectableObject;
	public outlinePass?: OutlinePass;
	public controls = true;

	private readonly _onPointerDownEvent = (e: PointerEvent) => {
		this._onPointerMoveEvent(e);

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

	private readonly _onPointerUpEvent = (e: PointerEvent) => {
		if (
			!e.isPrimary ||
			!this.controls ||
			!this.outlinePass?.selectedObjects.length ||
			!this._camera?.instance ||
			!this._navigation?.view ||
			!this._selectedObject?.uuid ||
			this.isFocusing ||
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

			const params = { lerpProgress: 0 };
			const prevNavLimits = this._navigation.view.limits;
			this._navigation.view.limits = false;

			return this.timeline
				.to(params, {
					lerpProgress: 1,
					duration,
					onStart: () => {
						this.emit(events.INTERACTION_FOCUS_STARTED);
					},
					onUpdate: () => {
						if (
							!this._lastCameraPosition ||
							!this._lastCameraTarget ||
							!currentObject.focusPoint
						)
							return;

						const lerpedPosition = lerpPosition(
							this._lastCameraPosition,
							currentObject.focusPoint,
							params.lerpProgress
						);
						const lerpedTarget = lerpPosition(
							this._lastCameraTarget,
							this._getFocusedPosition(currentObject),
							params.lerpProgress
						);

						this._navigation?.setTargetPosition(lerpedTarget);
						this._navigation?.setPositionInSphere(lerpedPosition);
					},
				})
				.add(() => {
					if (this._camera && currentObject.focusFov) {
						const { $getSizes } = useNuxtApp();
						const sizes = $getSizes();
						let fovFactor = 1;

						if (sizes.sw < sizes.vl) fovFactor = (sizes.vl / sizes.sw) * 1.25;

						this._camera.updateCameraFov(
							currentObject.focusFov * fovFactor,
							duration
						);
					}
				}, "<")
				.add(() => {
					if (currentObject) this.focusedObject = currentObject;
					if (this._navigation?.view)
						this._navigation.view.limits = prevNavLimits;

					// TODO: If you leave it like this in prod... wtf man
					const iframeElement =
						this._experience.world?.scene3?.pcScreenDomElement;
					if (iframeElement) {
						this._onIframeMouseMoveCleanUp = iframeMouseMoveDispatcher(
							iframeElement,
							(e) => {
								this._onPointerMoveEvent(e);
							}
						);
					}
					this.emit(events.INTERACTION_FOCUS_ANIMATION_DONE);
					this.emit(events.CHANGED);
				});
		}

		if (currentObject?.link) return router?.push(currentObject.link);

		if (currentObject?.externalLink)
			return window.open(currentObject.externalLink, "_blank");
	};

	private readonly _onPointerMoveEvent = (
		e: PointerEvent | IframeMouseMoveDispatcherEvent
	) => {
		if (
			(e instanceof PointerEvent && !e.isPrimary) ||
			!this.controls ||
			this.timeline.isActive() ||
			this._navigation?.timeline.isActive()
		)
			return;

		const clientX = e instanceof PointerEvent ? e.clientX : e.detail.clientX;
		const clientY = e instanceof PointerEvent ? e.clientY : e.detail.clientY;

		this._mouseCoordinate.x = (clientX / this._appSizes.width) * 2 - 1;
		this._mouseCoordinate.y = -(clientY / this._appSizes.height) * 2 + 1;

		this._normalizedMouseCoordinate.x = -(clientX / this._appSizes.width - 0.5);
		this._normalizedMouseCoordinate.y = clientY / this._appSizes.height - 0.5;

		this._checkIntersection();
	};

	private readonly _onRouteChange = () => {
		if (this._ui?.targetElement) this._ui.targetElement.style.cursor = "auto";
		this.stop();
	};

	private _onIframeMouseMoveCleanUp?: () => unknown;

	private _checkIntersection() {
		if (!this._camera?.instance) throw new Error("Wrong params");
		if (
			!this.enabled ||
			!this.outlinePass ||
			!this._intersectableContainer ||
			this.isFocusing
		)
			return;

		this.outlinePass.selectedObjects = [];
		this._selectedObject = undefined;
		if (this._ui?.targetElement) this._ui.targetElement.style.cursor = "auto";

		this.raycaster.setFromCamera(this._mouseCoordinate, this._camera.instance);

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

	public get enabled() {
		return this._enabled;
	}

	public get isFocusing() {
		return !!this.focusedObject;
	}

	public set enabled(b: boolean) {
		this._enabled = !!b;
		this.emit(
			this._enabled ? events.INTERACTION_STARTED : events.INTERACTION_ENDED
		);
		this.emit(events.CHANGED);
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

		this.emit(events.STARTED);
		this.emit(events.CHANGED);
		this._composer?.addPass(this.passName, this.outlinePass);
	}

	public stop() {
		this.outlinePass?.dispose();
		this.outlinePass = undefined;
		this.focusedObject = undefined;
		this._selectedObject = undefined;
		this.enabled = false;

		if (this._ui?.targetElement)
			this._ui.targetElement.style.pointerEvents = "auto";

		this._onIframeMouseMoveCleanUp?.();
		this._composer?.removePass(this.passName);
		this.emit(events.ENDED);
		this.emit(events.CHANGED);
	}

	public leaveFocusMode() {
		if (!this.isFocusing) return;

		this.focusedObject = undefined;
		this._selectedObject = undefined;

		if (this.outlinePass) {
			this.outlinePass.selectedObjects = [];
			this.outlinePass.edgeStrength = this._outlineDefault.strength;
		}
		if (this._ui?.targetElement)
			this._ui.targetElement.style.pointerEvents = "auto";
		if (!this._lastCameraPosition) return;

		const duration = Config.GSAP_ANIMATION_DURATION - 0.5;
		this._navigation
			?.updateCameraPosition(
				this._lastCameraPosition,
				this._lastCameraTarget,
				duration
			)
			.add(() => {
				this._camera?.resetFov();
				this._onIframeMouseMoveCleanUp?.();
			}, "<")
			.add(() => {
				this.emit(events.INTERACTION_FOCUS_ENDED);
				this.emit(events.INTERACTION_FOCUS_ANIMATION_DONE);
			});
		this.emit(events.CHANGED);
	}

	public construct() {
		window.addEventListener("pointermove", this._onPointerMoveEvent);
		this._ui?.targetElement?.addEventListener(
			"pointerdown",
			this._onPointerDownEvent
		);
		this._ui?.targetElement?.addEventListener(
			"pointerup",
			this._onPointerUpEvent
		);
		this._router?.on(events.CHANGED, this._onRouteChange);
	}

	public destruct() {
		this._onPointerMoveEvent &&
			window.removeEventListener("pointermove", this._onPointerMoveEvent);
		this._onPointerDownEvent &&
			this._ui?.targetElement?.removeEventListener(
				"pointerdown",
				this._onPointerDownEvent
			);
		this._onPointerUpEvent &&
			this._ui?.targetElement?.removeEventListener(
				"pointerup",
				this._onPointerUpEvent
			);

		this._onRouteChange &&
			this._router?.off(events.CHANGED, this._onRouteChange);
		this.emit(events.DESTRUCTED);
		this.removeAllListeners();
	}

	private _getFocusedPosition(object: SelectableObject) {
		if (!object.focusTarget || !object.focusRadius || !this._camera?.instance)
			return new Vector3();

		return new Vector3(
			object.focusTarget.x -
				object.focusRadius *
					Math.cos(
						this._focusedMouseCoordinate.x -
							this._camera.instance.rotation.y +
							Math.PI * 0.5 +
							Number(object.focusOffset?.x)
					),
			object.focusTarget.y -
				object.focusRadius *
					Math.sin(
						this._focusedMouseCoordinate.y + Number(object.focusOffset?.y)
					),
			object.focusTarget.z -
				object.focusRadius *
					Math.sin(
						this._focusedMouseCoordinate.x -
							this._camera.instance.rotation.y +
							Math.PI * 0.5 +
							Number(object.focusOffset?.z)
					)
		);
	}

	public update(): void {
		if (
			!this.enabled ||
			!this._camera ||
			!this.focusedObject ||
			this._navigation?.timeline.isActive() ||
			this.timeline.isActive()
		)
			return;

		this._focusedMouseCoordinate.x +=
			(this._normalizedMouseCoordinate.x - this._focusedMouseCoordinate.x) *
			0.1;
		this._focusedMouseCoordinate.y +=
			(this._normalizedMouseCoordinate.y - this._focusedMouseCoordinate.y) *
			0.1;

		const focusedPosition = this._getFocusedPosition(this.focusedObject);
		if (!focusedPosition) return;

		this._camera.setCameraLookAt(focusedPosition);
	}
}
