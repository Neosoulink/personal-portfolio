import { Material, Vector3 } from "three";

export type MaterialName = string;

export interface Materials {
	[material: MaterialName]: Material;
}

export interface ModelChildrenMaterials {
	[childName: string]: MaterialName;
}

export interface SceneConfig {
	position: Vector3;
	center: Vector3;
}
