export abstract class CommonConfig {
	static readonly ASSET_DIR = "/";
	static readonly GSAP_ANIMATION_DURATION = 2;
	static readonly GSAP_ANIMATION_EASE =
		"M0,0 C0.001,0.001 0.002,0.003 0.003,0.004 0.142,0.482 0.284,0.75 0.338,0.836 0.388,0.924 0.504,1 1,1";
	static readonly DEBUG = (() => {
		try {
			return useRuntimeConfig().public.env === "development";
		} catch (_) {
			return false;
		}
	})();
	static readonly FIXED_WINDOW_HEIGHT = (() => {
		try {
			return window.outerHeight;
		} catch (_) {
			return 0;
		}
	})();
	static readonly FIXED_WINDOW_WIDTH = (() => {
		try {
			return window.outerWidth;
		} catch (_) {
			return 0;
		}
	})();
}
