import { Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import GSAP from "gsap";

/**
 * Traverse and apply `castShadow` & `receiveShadow` to the passed object children.
 *
 * @param object An {@link Object3D}.
 */
export const applyShadowToChild = (object: Object3D) => {
	object?.traverse((child) => {
		if (
			child instanceof Mesh &&
			child.material instanceof MeshStandardMaterial
		) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
};

/**
 * Lerp the first passed position with the second passed position.
 *
 * @param start The {@link Vector3} start position.
 * @param end The {@link Vector3} end position.
 * @param alpha The `alpha` value to lerp with.
 */
export const lerpPosition = (start: Vector3, end: Vector3, alpha = 0) => {
	const _START = start.clone();
	const _END = end.clone();

	return _START.lerpVectors(_START, _END, GSAP.utils.clamp(0, 1, alpha));
};
