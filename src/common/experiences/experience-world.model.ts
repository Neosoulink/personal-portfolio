import { Material } from "three";

export type MaterialName = string;

export interface Materials {
	[material: MaterialName]: Material;
}

export interface ModelChildrenMaterials {
	[childName: string]: MaterialName;
}
