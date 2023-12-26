import {
	EffectComposer,
	Pass,
} from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// EXPERIENCES
import { HomeExperience } from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/experiences/blueprints/ExperienceBased.blueprint";

export class Composer extends ExperienceBasedBlueprint {
	protected readonly _experience = new HomeExperience();
	protected readonly _appRender = this._experience.app.renderer;
	protected readonly _appCamera = this._experience.app.camera;
	protected readonly _renderer = this._experience.renderer;
	protected readonly _appSizes = this._experience.app.sizes;
	protected readonly _passes: { [name: string]: Pass } = {};
	protected _effect?: EffectComposer;
	protected _renderPass?: RenderPass;
	protected _outputPass?: OutputPass;
	protected onResize?: () => unknown;

	public get effect() {
		return this._effect;
	}

	public construct(): void {
		this._effect = new EffectComposer(this._appRender.instance);
		this._effect.setPixelRatio(this._appSizes.pixelRatio);
		this._effect.setSize(this._appSizes.width, this._appSizes.height);

		this.onResize = () => {
			this._effect?.setPixelRatio(this._appSizes.pixelRatio);
			this._effect?.setSize(this._appSizes.width, this._appSizes.height);
		};
		this._appSizes.on("resize", this.onResize);
	}

	public destruct(): void {
		this.onResize && this._appSizes.off("resize", this.onResize);
		this._effect?.dispose();
		this._effect = undefined;
	}

	public addPass(key: string, pass: Pass) {
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
		}

		this._passes[key] = pass;
		this._effect?.addPass(this._passes[key]);
	}

	public removePass(key: string) {
		if (!this._passes[key]) return;

		this._effect?.removePass(this._passes[key]);
		this._passes[key].dispose();
		delete this._passes[key];

		if (Object.keys(this._passes).length) return;
		this._renderPass && this._effect?.removePass(this._renderPass);
		this._outputPass && this._effect?.removePass(this._outputPass);
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
