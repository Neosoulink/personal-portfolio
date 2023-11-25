/**
 * Represent the base struct of all threejs experience classes in the application
 */
export interface ExperienceBase {
	construct: () => unknown;
	destruct: () => unknown;
	update?: () => unknown;
}
