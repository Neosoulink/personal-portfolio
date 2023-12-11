import { EventEmitter } from "events";

// BLUEPRINTS
import type { ExperienceBlueprint } from "./Experience.blueprint";

// INTERFACES
import type { ExperienceBase } from "@/interfaces/experienceBase";

/** Represent a class that depend on {@link ExperienceBlueprint}. */
export abstract class ExperienceBasedBlueprint
	extends EventEmitter
	implements ExperienceBase
{
	protected abstract readonly _experience: ExperienceBlueprint;

	public abstract construct(): unknown;
	public abstract destruct(): unknown;
	public update() {}
}
