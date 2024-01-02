import { CatmullRomCurve3, Vector3 } from "three";

export interface SceneConfig {
	position: Vector3;
	center: Vector3;
	cameraPath: CatmullRomCurve3;
}
