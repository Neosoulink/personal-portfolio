// EXPERIENCES
import HomeExperience from "..";

// FACTORIES
import { ExperienceBasedFactory } from "@/experiences/factories/ExperienceBased.factory";

export class Portal extends ExperienceBasedFactory {
	protected _experience = new HomeExperience();

	constructor() {
		super();
	}

	public construct() {}
	public destruct() {}
}
