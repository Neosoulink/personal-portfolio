import { CatmullRomCurve3, Vector3 } from "three";
import { gsap } from "gsap";

// EXPERIENCES
import { HomeExperience } from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";
import { Config } from "~/config";

export const defaultCameraPath = new CatmullRomCurve3([
	new Vector3(0, 5.5, 21),
	new Vector3(12, 10, 12),
	new Vector3(21, 5.5, 0),
	new Vector3(12, 3.7, 12),
	new Vector3(0, 5.5, 21),
]);

export class CameraAnimation extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _appSizes = this._experience.app.sizes;
	private readonly _camera = this._experience.camera;
	private readonly _world = this._experience.world;
	private readonly _navigation = this._experience.navigation;

	public enabled = false;
	public cameraPath = defaultCameraPath;
	public progress = {
		current: 0,
		target: 0,
		ease: 0.1,
	};
	public positionOnCurve = new Vector3();
	public reversed = false;
	public timeline = gsap.timeline();
	public mouseDowned = false;
	public cursorCoordinate = { x: 0, y: 0 };
	public normalizedCursorCoordinate = { x: 0, y: 0 };

	private _onWheel?: (e: WheelEvent) => unknown;
	private _onMousemove?: (e: MouseEvent) => unknown;
	private _onMousedown?: (e: MouseEvent) => unknown;
	private _onMouseUp?: (e: MouseEvent) => unknown;

	private _wheelEvent(e: WheelEvent) {
		if (!this.enabled) return;

		if (e.deltaY < 0) {
			this.progress.target += 0.05;
			this.reversed = false;

			return;
		}

		this.progress.target -= 0.05;
		this.reversed = true;
	}

	private _mouseMoveEvent(e: MouseEvent) {
		if (this.enabled && this.mouseDowned) {
			if (e.clientX < this.cursorCoordinate.x) {
				this.progress.target += 0.002;
				this.reversed = false;
			} else if (e.clientX > this.cursorCoordinate.x) {
				this.progress.target -= 0.002;
				this.reversed = true;
			}
		}

		if (!this.enabled) {
			this.normalizedCursorCoordinate.x =
				e.clientX / this._appSizes?.width - 0.5;
			this.normalizedCursorCoordinate.y =
				e.clientY / this._appSizes?.height - 0.5;
		}

		this.cursorCoordinate = { x: e.clientX, y: e.clientY };
	}

	private _mouseDownEvent(e: MouseEvent) {
		this.mouseDowned = true;
		// if (this.focusedPosition && !this.mouseOverBubble)
		// 	this._camera?.cameraZoomIn();
	}

	private _mouseUpEvent(e: MouseEvent) {
		this.mouseDowned = false;
		// if (this.focusedPosition && !this.mouseOverBubble)
		// 	this._experience.camera?.cameraZoomOut();
	}

	public construct() {
		this._onWheel = (e) => this._wheelEvent(e);
		this._onMousemove = (e) => this._mouseMoveEvent(e);
		this._onMousedown = (e) => this._mouseDownEvent(e);
		this._onMouseUp = (e) => this._mouseUpEvent(e);

		window.addEventListener("wheel", this._onWheel);
		window.addEventListener("mousemove", this._onMousemove);
		window.addEventListener("mousedown", this._onMousedown);
		window.addEventListener("mouseup", this._onMouseUp);
	}

	public destruct() {
		this._onWheel && window.removeEventListener("wheel", this._onWheel);
		this._onMousemove &&
			window.removeEventListener("mousemove", this._onMousemove);
		this._onMousedown &&
			window.removeEventListener("mousedown", this._onMousedown);
		this._onMouseUp && window.removeEventListener("mouseup", this._onMouseUp);
	}

	public enable() {
		if (this.timeline.isActive()) this.timeline.progress(1);
		if (this._navigation?.timeline.isActive())
			this._navigation.timeline.progress(1);
		if (this._navigation?.view) this._navigation.view.controls = false;

		this.cameraPath.getPointAt(this.progress.current, this.positionOnCurve);

		this._navigation
			?.updateCameraPosition(
				this.positionOnCurve,
				this._navigation.view.center,
				Config.GSAP_ANIMATION_DURATION * 0.8
			)
			.then(() => {
				this.enabled = true;
			});
	}

	public disable() {
		if (this.timeline.isActive()) this.timeline.progress(1);
		if (this._navigation?.timeline.isActive())
			this._navigation.timeline.progress(1);

		this.enabled = false;

		this._navigation
			?.updateCameraPosition(
				this.positionOnCurve.setY(this._camera?.lookAtPosition.y ?? 0),
				this._navigation.view.center,
				Config.GSAP_ANIMATION_DURATION * 0.5
			)
			.then(() => {
				if (this._navigation?.view) this._navigation.view.controls = true;
			});
	}

	public update(): void {
		if (
			!this.enabled ||
			this.timeline.isActive() ||
			this._navigation?.timeline.isActive() ||
			this._world?.manager?.timeline.isActive()
		)
			return;

		this.progress.current = gsap.utils.interpolate(
			this.progress.current,
			this.progress.target,
			this.progress.ease
		);
		this.progress.target =
			this.progress.target + (this.reversed ? -0.0001 : 0.0001);

		if (!this.cameraPath.closed) {
			if (this.progress.target > 1)
				setTimeout(() => {
					this.reversed = true;
				}, 1000);

			if (this.progress.target < 0)
				setTimeout(() => {
					this.reversed = false;
				}, 1000);

			this.progress.target = gsap.utils.clamp(0, 1, this.progress.target);
			this.progress.current = gsap.utils.clamp(0, 1, this.progress.current);
		}

		if (this.cameraPath.closed && this.progress.current < 0) {
			this.progress.target = 1;
			this.progress.current = 1;
		}

		this.cameraPath.getPointAt(this.progress.current % 1, this.positionOnCurve);
		this._navigation?.setPositionInSphere(this.positionOnCurve);
	}
}
