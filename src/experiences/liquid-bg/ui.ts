// EXPERIENCE
import { LiquidBgExperience } from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

// STATIC
import { errors, events } from "~/static";

/** Class in charge of all the direct interactions with the DOM HTML elements. */
export class UI extends ExperienceBasedBlueprint {
	protected readonly _experience = new LiquidBgExperience();

	private readonly _appSizes = this._experience.app.sizes;
	private readonly _onPointerMove = (e: PointerEvent) => {
		const x = (e.clientX / this._appSizes.width) * 2 - 1;
		const y = -(e.clientY / this._appSizes.height) * 2 + 1;

		this.emit(events.POINTER_MOVE, e, x, y);
	};
	private readonly _onDeviceOrientation = (e: DeviceOrientationEvent) => {
		const beta = Number(e.beta) / 180;
		const gamma = -Number(e.gamma) / 90;

		this.emit(events.DEVICE_ORIENTATION, e, gamma, beta);
	};

	public readonly targetElement = this._experience.app.canvas;
	public readonly targetElementParent = this.targetElement?.parentElement;

	public construct() {
		window.addEventListener("pointermove", this._onPointerMove);
		window.addEventListener(
			"deviceorientation",
			this._onDeviceOrientation,
			false
		);

		this.emit(events.CONSTRUCTED);
	}

	public destruct() {
		window.removeEventListener("pointermove", this._onPointerMove);
		window.removeEventListener("deviceorientation", this._onDeviceOrientation);

		this.emit(events.DESTRUCTED);
		this.removeAllListeners();
	}
}
