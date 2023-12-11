import * as THREE from "three";

export const traverseToApplyShadowToChildThreeObject = (
	group: THREE.Object3D
) => {
	group?.traverse((child) => {
		if (
			child instanceof THREE.Mesh &&
			child.material instanceof THREE.MeshStandardMaterial
		) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
};
