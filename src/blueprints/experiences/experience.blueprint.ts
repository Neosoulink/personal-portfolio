import QuickThree from "quick-threejs";

// MODELS
import type {
	Experience,
	ExperienceConstructorProps,
} from "~/common/experiences/experience.model";

export abstract class ExperienceBlueprint implements Experience {
	/**
	 * Self class reference. Used for *singleton* pattern.
	 *
	 * @inheritdoc Logic should be implemented in the child constructor, passing the `this` to the `_self`
	 * */
	protected static _self?: ExperienceBlueprint;
	protected _onConstruct?: () => unknown;
	protected _onDestruct?: () => unknown;
	/** [`quick-threejs`](https://www.npmjs.com/package/quick-threejs) instance. */
	readonly app!: QuickThree;
	/** To make the singleton logic, refer to the {@link ExperienceBlueprint._self `#_self`} declaration */
	constructor(_?: ExperienceConstructorProps | ExperienceBlueprint) {
		if (!(_ instanceof ExperienceBlueprint) && _) {
			this.app = new QuickThree(
				{
					enableDebug: _?.debug,
					axesSizes: _?.debug ? 5 : undefined,
					gridSizes: _?.debug ? 30 : undefined,
					withMiniCamera: _?.debug,
					camera: "Perspective",
				},
				_?.domElementRef,
			);
			this._onConstruct = _?.onConstruct;
			this._onDestruct = _?.onDestruct;
		}
	}

	public abstract construct(): unknown;
	public abstract destruct(): unknown;
	public abstract update(): unknown;
}
