import { CatmullRomCurve3, Vector3 } from "three";

// EXPERIENCE
import { SceneFactory } from "./SceneFactory";

export default class Scene_2 extends SceneFactory {
	constructor() {
		super({
			cameraPath: new CatmullRomCurve3([
				new Vector3(0, 5.5, 21),
				new Vector3(21, 5.5, 0),
				new Vector3(0, 5.5, 21),
			]),
		});
	}

	public construct(): void {}
	public destruct(): void {}
	public intro(): void {}
	public outro(): void {}
	public update(): void {}
}
