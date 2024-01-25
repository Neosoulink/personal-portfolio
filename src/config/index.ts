export class Config {
	static readonly ASSET_DIR = "/";
	static readonly GSAP_ANIMATION_DURATION = 1.8;
	static readonly GSAP_ANIMATION_EASE =
		"M0,0 C0.001,0.001 0.002,0.003 0.003,0.004 0.142,0.482 0.284,0.75 0.338,0.836 0.388,0.924 0.504,1 1,1";
	static readonly DEBUG = (() => {
		try {
			return useRuntimeConfig().public.MODE === "development";
		} catch {
			return false;
		}
	})();
	static readonly FIXED_WINDOW_HEIGHT = (() => {
		try {
			return window.outerHeight;
		} catch {
			return 0;
		}
	})();
	static readonly FIXED_WINDOW_WIDTH = (() => {
		try {
			return window.outerWidth;
		} catch {
			return 0;
		}
	})();

	static readonly GITHUB_LINK: string = (() => {
		try {
			return useRuntimeConfig().public.GITHUB_LINK;
		} catch {
			return "https://google.com";
		}
	})();
	static readonly LINKEDIN_LINK: string = (() => {
		try {
			return useRuntimeConfig().public.LINKEDIN_LINK;
		} catch {
			return "https://google.com";
		}
	})();
	static readonly DISCORD_LINK: string = (() => {
		try {
			return useRuntimeConfig().public.DISCORD_LINK;
		} catch {
			return "https://google.com";
		}
	})();
	static readonly STACKOVERFLOW_LINK: string = (() => {
		try {
			return useRuntimeConfig().public.STACKOVERFLOW_LINK;
		} catch {
			return "https://google.com";
		}
	})();

	static readonly TWITTER_LINK: string = (() => {
		try {
			return useRuntimeConfig().public.TWITTER_LINK;
		} catch {
			return "https://google.com";
		}
	})();

	static readonly TELEGRAM_LINK: string = (() => {
		try {
			return useRuntimeConfig().public.TELEGRAM_LINK;
		} catch {
			return "https://google.com";
		}
	})();
}
