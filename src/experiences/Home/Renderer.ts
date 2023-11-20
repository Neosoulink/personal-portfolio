// EXPERIENCE
import HomeExperience from ".";

// INTERFACES
import type BaseExperience from "@/interfaces/BaseExperience";

/** Renderer */
export default class Renderer implements BaseExperience {
	private readonly app = new HomeExperience();

	constructor() {}

	construct() {}
	destruct() {}
}
