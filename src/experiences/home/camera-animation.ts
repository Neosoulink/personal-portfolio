import { CatmullRomCurve3, Vector3 } from "three";
import { gsap } from "gsap";

// EXPERIENCES
import { HomeExperience } from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";
import { Config } from "~/config";
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

	private readonly _navigation = this._experience.navigation;

	private _world = this._experience.world;
	private _onWheel?: (e: WheelEvent) => unknown;

	public enabled = false;
	public cameraPath = defaultCameraPath;
	public progressCurrent = 0;
	public progressTarget = 0;
	public progressEase = 0.1;
	public positionOnCurve = new Vector3();
	public reversed = false;
	public isSliding = false;

	private _wheelEvent(e: WheelEvent) {
		if (
			!this.enabled ||
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

	private _doneAnimations() {
		if (this._navigation?.timeline.isActive())
			this._navigation.timeline.progress(1);
		if (this._world?.manager?.timeline.isActive())
			this._world.manager.timeline.progress(1);
	}

	public construct() {
		this._world = this._experience.world;
		this._onWheel = (e) => this._wheelEvent(e);

		window.addEventListener("wheel", this._onWheel);
	}

	public destruct() {
		this._onWheel && window.removeEventListener("wheel", this._onWheel);
	}

	public enable(direct?: boolean) {
		this._doneAnimations();
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
		this._doneAnimations();

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
			!this.enabled ||
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

		this.cameraPath.getPointAt(this.progressCurrent % 1, this.positionOnCurve);
		this._navigation?.setPositionInSphere(this.positionOnCurve);
		this.emit(events.UPDATED);
	}
}
