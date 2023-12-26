/**
 * Represent the base struct of all threejs experience classes in the application
 */
export interface ExperienceBase {
	construct: (callback?: () => unknown) => unknown;
	destruct: (callback?: () => unknown) => unknown;
	update?: (callback?: () => unknown) => unknown;
}
