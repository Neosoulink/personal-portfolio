/** Represent the base structure of all experience classes in the application. */
export interface Experience {
	construct: (callback?: () => unknown) => unknown;
	destruct: (callback?: () => unknown) => unknown;
	update?: (callback?: () => unknown) => unknown;
}

export interface ExperienceConstructorProps {
	/** String dom element reference of the canvas. */
	domElementRef?: string;
	/* Start the project in debug mode */
	debug?: boolean;
	/** Event triggered when the scene is constructed. */
	onConstruct?: () => unknown;
	/** Event triggered when the scene is destructed. */
	onDestruct?: () => unknown;
}
