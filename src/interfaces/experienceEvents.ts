import { EventEmitter } from "events";
import type { ExperienceBase } from "./experienceBase";
/**
 * Represent All supported events of an experience class
 */
export interface ExperienceEvents extends ExperienceBase, EventEmitter {
	update?: () => unknown;
	resize?: () => unknown;
}
