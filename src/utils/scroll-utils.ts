import { Config } from "@/experiences/config/Config";
import { preventDefault } from "./common-utils";

export function preventDefaultForScrollKeys(e: KeyboardEvent) {
	const keys = [
		" ",
		"ArrowUp",
		"ArrowDown",
		"PageUp",
		"PageDown",
		"End",
		"Home",
	];

	if (keys.includes(e.key)) {
		preventDefault(e);
		return false;
	}
}

/* Modern Chrome requires { passive: false } when adding event */
export function disableChromePassive() {
	try {
		window.addEventListener(
			"test",
			() => {},
			Object.defineProperty({}, "passive", {
				get: function () {
					Config.supportsPassive = true;
				},
			})
		);
	} catch (e) {}
}

export function disableScroll() {
	window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
	window.addEventListener(
		Config.wheelEvent,
		preventDefault,
		Config.wheelOption
	);
	window.addEventListener("touchmove", preventDefault, Config.wheelOption);
	window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

export function enableScroll() {
	window.removeEventListener("DOMMouseScroll", preventDefault, false);
	window.removeEventListener(Config.wheelEvent, preventDefault);
	window.removeEventListener("touchmove", preventDefault);
	window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}
