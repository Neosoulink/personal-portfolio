//
import type { ExperienceFactory } from "./Experience.factory";

// INTERFACES
import type { ExperienceBase } from "@/interfaces/experienceBase";

/** Represent a class that depend on {@link ExperienceFactory}. */
export abstract class ExperienceBasedFactory implements ExperienceBase {
	protected abstract readonly _experience: ExperienceFactory;

	public abstract construct(): unknown;
	public abstract destruct(): unknown;
	public update() {}
}
