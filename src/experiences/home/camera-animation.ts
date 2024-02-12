import { CatmullRomCurve3, Vector3 } from "three";
import { gsap } from "gsap";

// EXPERIENCES
import { HomeExperience } from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// CONFIG
import { Config } from "~/config";

// STATIC
import { events } from "~/static";

export const defaultCameraPath = new CatmullRomCurve3([
	new Vector3(0, 5.5, 21),
	new Vector3(12, 10, 12),
	new Vector3(21, 5.5, 0),
	new Vector3(12, 3.7, 12),
	new Vector3(0, 5.5, 21),
]);

export class CameraAnimation extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();

	private readonly _ui = this._experience.ui;
	private readonly _navigation = this._experience.navigation;

	private _enabled = false;
	private _onWheel?: (e: WheelEvent) => unknown;

	public cameraPath = defaultCameraPath;
	public progressCurrent = 0;
	public progressTarget = 0;
	public progressEase = 0.1;
	public positionOnCurve = new Vector3();
	public reversed = false;
	public isSliding = false;

	public get enabled() {
		return this._enabled;
	}

	public set enabled(b: boolean) {
		this._enabled = !!b;
		this.emit(events.CHANGED);
	}

	private _wheelEvent(e: WheelEvent) {
		if (
			!this._enabled ||
			this._navigation?.timeline.isActive() ||
			this.isSliding
		)
			return;

		if (e.deltaY < 0) {
			this.progressTarget += 0.05;
			this.reversed = false;

			return;
		}

		this.progressTarget -= 0.05;
		this.reversed = true;
	}

	public construct() {
		this._onWheel = (e) => this._wheelEvent(e);

		this._ui?.on(events.WHEEL, this._onWheel);
	}

	public destruct() {
		this.emit(events.DESTRUCTED);
		this.removeAllListeners();
	}

	public enable(direct?: boolean) {
		if (this._navigation?.timeline.isActive())
			this._navigation.timeline.progress(1);
		this.enabled = true;

		if (direct) return;

		if (this._navigation?.view) this._navigation.view.controls = false;
		this.cameraPath.getPointAt(this.progressCurrent % 1, this.positionOnCurve);

		return this._navigation
			?.updateCameraPosition(
				this.positionOnCurve,
				this._navigation.view.center,
				Config.GSAP_ANIMATION_DURATION * 0.4
			)
			.add(() => {
				this.emit(events.STARTED, this);
			});
	}

	public disable() {
		if (
			Object.keys(this._experience.composer?.passes ?? {}).length ||
			this._navigation?.timeline.isActive()
		)
			return;

		this.enabled = false;
		if (this._navigation?.view) this._navigation.view.controls = true;

		return this._navigation
			?.updateCameraPosition(
				lerpPosition(this.positionOnCurve, this._navigation.view.center, 0.1),
				this._navigation.view.center,
				Config.GSAP_ANIMATION_DURATION * 0.2
			)
			.add(() => {
				this.emit(events.ENDED, this);
			});
	}

	public update(): void {
		if (
			!this._enabled ||
			this._navigation?.timeline.isActive() ||
			this._experience.world?.manager?.timeline.isActive() ||
			this._experience.interactions?.focusedObject
		)
			return;

		this.progressCurrent = gsap.utils.interpolate(
			this.progressCurrent,
			this.progressTarget,
			this.progressEase
		);

		if (!this.isSliding)
			this.progressTarget =
				this.progressTarget + (this.reversed ? -0.0001 : 0.0001);
		if (this.reversed && this.progressTarget > this.progressCurrent)
			this.reversed = false;
		if (!this.reversed && this.progressTarget < this.progressCurrent)
			this.reversed = true;

		if (!this.cameraPath.closed) {
			if (this.progressTarget > 1) this.reversed = true;
			if (this.progressTarget < 0) this.reversed = false;

			this.progressTarget = gsap.utils.clamp(0, 1, this.progressTarget);
			this.progressCurrent = gsap.utils.clamp(0, 1, this.progressCurrent);
		}

		if (this.cameraPath.closed && this.progressCurrent < 0) {
			this.progressTarget += 1;
			this.progressCurrent += 1;
		}

		if (this.cameraPath.closed && this.progressCurrent > 1) {
			this.progressTarget -= 1;
			this.progressCurrent -= 1;
		}

		this.cameraPath.getPointAt(this.progressCurrent, this.positionOnCurve);
		this._navigation?.setPositionInSphere(this.positionOnCurve);
		this.emit(events.UPDATED);
	}
}
