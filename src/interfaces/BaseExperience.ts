/**
 * Represent the base struct of all threejs experience classes in the application
 */
export default interface BaseExperience {
	construct: () => unknown;
	destruct: () => unknown;
}
