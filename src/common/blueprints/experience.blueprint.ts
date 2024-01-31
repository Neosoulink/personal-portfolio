import QuickThree from "quick-threejs";
import { EventEmitter } from "events";

// MODELS
import type {
	Experience,
	ExperienceConstructorProps,
} from "~/common/models/experience.model";

/**
 * Modules root, representing the 3D experience.
 */
export abstract class ExperienceBlueprint
	extends EventEmitter
	implements Experience
{
	/**
	 * Self class reference. Used for *singleton* pattern.
	 *
	 * @inheritdoc Logic should be implemented in the child constructor, passing the `this` to the `_self`
	 * */
	protected static _self?: ExperienceBlueprint;

	/** [`quick-threejs`](https://www.npmjs.com/package/quick-threejs) instance. */
	readonly app!: QuickThree;

	/**
	 * **⚠ IMPORTANT**:
	 *
	 * In order to make singleton approach working,
	 * the {@link ExperienceBlueprint._self `#_self`} property
	 * should be initialized from the child class.
	 *
	 * Right after the `super` method call, something like the following
	 * code should be implemented:
	 *
	 * ```ts
	 * super(...);
	 *
	 * if (HomeExperience._self) return HomeExperience._self;
			HomeExperience._self = this;
	 * ```
	 */
	constructor(_?: ExperienceConstructorProps | ExperienceBlueprint) {
		super();

		if (_ instanceof ExperienceBlueprint || !_) return this;

		this.app = new QuickThree(
			{
				enableDebug: _?.debug,
				axesSizes: _?.debug ? 5 : undefined,
				gridSizes: _?.debug ? 30 : undefined,
				withMiniCamera: _?.debug,
				camera: _?.camera || "Perspective",
			},
			_?.domElementRef
		);
	}

	public abstract construct(): unknown;
	public abstract destruct(): unknown;
	public abstract update(): unknown;
}
