import type { Object3D, Object3DEventMap, Vector3 } from "three";

export interface SelectableObject {
	object: Object3D<Object3DEventMap>;
	link?: string;
	focusPoint?: Vector3;
	focusTarget?: Vector3;
	focusFov?: number;
	onFocusedIn?: () => unknown;
	onFocusedOut?: () => unknown;
}
