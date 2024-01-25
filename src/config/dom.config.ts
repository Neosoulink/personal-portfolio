export class DomConfig {
	private static _supportsPassive = false;

	static set supportsPassive(val: boolean) {
		DomConfig._supportsPassive = !!val;
	}

	static get supportsPassive() {
		return !!DomConfig._supportsPassive;
	}

	static get wheelOption() {
		return DomConfig.supportsPassive ? { passive: false } : false;
	}

	static get wheelEvent() {
		return "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
	}
}
