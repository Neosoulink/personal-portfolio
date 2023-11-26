import type { CatmullRomCurve3 } from "three";

// EXPERIENCES
import HomeExperience from "..";

// INTERFACES
import { type ExperienceBase } from "@/interfaces/experienceBase";

export interface SceneFactoryProps {
	cameraPath: CatmullRomCurve3;
}

export abstract class SceneFactory implements ExperienceBase {
	protected readonly _experience = new HomeExperience();
	public cameraPath: CatmullRomCurve3;

	constructor(_: SceneFactoryProps) {
		this.cameraPath = _.cameraPath;
	}

	public abstract construct(): unknown;
	public abstract destruct(): unknown;
	public abstract update(): unknown;
	public abstract intro(): unknown;
	public abstract outro(): unknown;
}
