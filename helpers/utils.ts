import * as THREE from "three";

var supportsPassive = false;
var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent =
	"onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

export function preventDefault(e: Event) {
	e.preventDefault();
}

export function preventDefaultForScrollKeys(e: KeyboardEvent) {
	// left: 37, up: 38, right: 39, down: 40,
	// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
	let keys = [" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "End", "Home"];

	if (keys.includes(e.key)) {
		preventDefault(e);
		return false;
	}
}

// modern Chrome requires { passive: false } when adding event
export function disableChromPassive() {
	try {
		window.addEventListener(
			"test",
			() => {},
			Object.defineProperty({}, "passive", {
				get: function () {
					supportsPassive = true;
				},
			})
		);
	} catch (e) {}
}

// call this to Disable
export function disableScroll() {
	window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
	window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
	window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
	window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

// call this to Enable
export function enableScroll() {
	window.removeEventListener("DOMMouseScroll", preventDefault, false);
	window.removeEventListener(wheelEvent, preventDefault);
	window.removeEventListener("touchmove", preventDefault);
	window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

export const traverseToApplyShadowToChildThreeObject = (group: THREE.Object3D) => {
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
