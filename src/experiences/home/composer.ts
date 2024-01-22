import {
	EffectComposer,
	Pass,
} from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// EXPERIENCES
import { HomeExperience } from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";
import { events } from "~/static";

export class Composer extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();
	private readonly _appRender = this._experience.app.renderer;
	private readonly _appCamera = this._experience.app.camera;
	private readonly _appSizes = this._experience.app.sizes;
	private readonly _passes: { [name: string]: Pass } = {};

	private _effect?: EffectComposer;
	private _renderPass?: RenderPass;
	private _outputPass?: OutputPass;
	private _onResize?: () => unknown;

	public get effect() {
		return this._effect;
	}

	public get passes() {
		return this._passes;
	}

	public construct(): void {
		this._effect = new EffectComposer(this._appRender.instance);
		this._effect.setPixelRatio(this._appSizes.pixelRatio);
		this._effect.setSize(this._appSizes.width, this._appSizes.height);

		this._onResize = () => {
			this._effect?.setPixelRatio(this._appSizes.pixelRatio);
			this._effect?.setSize(this._appSizes.width, this._appSizes.height);
		};
		this._appSizes.on("resize", this._onResize);
	}

	public destruct(): void {
		this._onResize && this._appSizes.off("resize", this._onResize);
		this._effect?.dispose();
		this._effect = undefined;
	}

	public addPass(key: string, pass: Pass) {
		this._passes[key] = pass;

		if (!this._effect?.passes.length) {
			if (this._appCamera.instance) {
				this._renderPass = new RenderPass(
					this._experience.app.scene,
					this._appCamera.instance
				);
				this._effect?.addPass(this._renderPass);
			}

			this._outputPass = new OutputPass();
			this._effect?.addPass(this._outputPass);
			this.emit(events.STARTED);
		}

		this._effect?.addPass(this._passes[key]);
		this.emit(events.ADDED);
	}

	public removePass(key: string) {
		if (!this._passes[key]) return;

		this._effect?.removePass(this._passes[key]);
		this._passes[key].dispose();
		delete this._passes[key];

		this.emit(events.REMOVED);
		if (Object.keys(this._passes).length) return;
		this._renderPass && this._effect?.removePass(this._renderPass);
		this._outputPass && this._effect?.removePass(this._outputPass);
		this.emit(events.ENDED);
	}

	public update(): void {
		if (!this._effect?.passes.length) {
			this._appRender.enabled = true;
			return;
		}
		this._appRender.enabled = false;

		this._appRender.instance.setViewport(
			0,
			0,
			this._appSizes.width,
			this._appSizes.height
		);
		this._effect.render();
	}
}
