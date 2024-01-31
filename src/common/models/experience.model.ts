import type { EventEmitter } from "events";
import type { InitThreeProps } from "quick-threejs";

/** Represent the base structure of all experience classes in the application. */
export interface Experience extends EventEmitter {
	construct: (callback?: () => unknown) => unknown;
	destruct: (callback?: () => unknown) => unknown;
	update?: (callback?: () => unknown) => unknown;
}

export interface ExperienceConstructorProps {
	/** String dom element reference of the canvas. */
	domElementRef?: string;
	/** Start the project in debug mode */
	debug?: InitThreeProps["enableDebug"];
	/** Initial camera type */
	camera?: InitThreeProps["camera"];
}
