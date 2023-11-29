import QuickThree from "quick-threejs";

// INTERFACES
import type { ExperienceBase } from "@/interfaces/experienceBase";

export interface ExperienceProps {
	/** String dom element reference of the canvas. */
	domElementRef?: string;
	/* Start the project in debug mode */
	debug?: boolean;
	/** Event triggered when the scene is constructed. */
	onConstruct?: () => unknown;
	/** Event triggered when the scene is destructed. */
	onDestruct?: () => unknown;
}

export abstract class ExperienceFactory implements ExperienceBase {
	/**
	 * Self class reference. Used for *singleton* pattern.
	 *
	 * @inheritdoc Logic should be implemented in the child constructor, passing the `this` to the `_self`
	 * */
	protected static _self?: ExperienceFactory;
	protected _onConstruct?: () => unknown;
	protected _onDestruct?: () => unknown;
	/** [`quick-threejs`](https://www.npmjs.com/package/quick-threejs) instance. */
	readonly app!: QuickThree;
	/** To make the singleton logic, refer to the {@link ExperienceFactory._self `#_self`} declaration */
	constructor(_?: ExperienceProps | ExperienceFactory) {
		if (!(_ instanceof ExperienceFactory) && _) {
			this.app = new QuickThree(
				{
					enableDebug: true,
					axesSizes: _?.debug ? 5 : undefined,
					gridSizes: _?.debug ? 30 : undefined,
					withMiniCamera: _?.debug,
					camera: "Perspective",
				},
				_?.domElementRef
			);
			this._onConstruct = _?.onConstruct;
			this._onDestruct = _?.onDestruct;
		}
	}

	public abstract construct(): unknown;
	public abstract destruct(): unknown;
	public abstract update(): unknown;
}
