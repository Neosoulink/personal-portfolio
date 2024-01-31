import { EventEmitter } from "events";

// MODELS
import type { ExperienceBlueprint } from "./experience.blueprint";

// MODELS
import type { Experience } from "~/common/models/experience.model";

/** Represent a class that depend on {@link ExperienceBlueprint}. */
export abstract class ExperienceBasedBlueprint
	extends EventEmitter
	implements Experience
{
	protected abstract readonly _experience: ExperienceBlueprint;

	public abstract construct(): unknown;
	public abstract destruct(): unknown;
	public update() {}
}
