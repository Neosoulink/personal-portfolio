import { EventEmitter } from "events";

// BLUEPRINTS
import type { ExperienceFactory } from "./Experience.factory";

// INTERFACES
import type { ExperienceBase } from "@/interfaces/experienceBase";

/** Represent a class that depend on {@link ExperienceFactory}. */
export abstract class ExperienceBasedFactory
	extends EventEmitter
	implements ExperienceBase
{
	protected abstract readonly _experience: ExperienceFactory;

	public abstract construct(): unknown;
	public abstract destruct(): unknown;
	public update() {}
}
