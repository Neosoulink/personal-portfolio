// CONFIGS
import { DeviceConfig } from "~/config/device.config";

// CONFIG

export default defineNuxtPlugin((nuxtApp) => {
	const setDimensions = () => {
		DeviceConfig.ua = window.navigator.userAgent.toLowerCase();

		/* Tailwind support */
		document.documentElement.classList.add("group");

		document.documentElement.setAttribute(
			"data-browser",
			DeviceConfig.checkBrowser() ?? ""
		);
		document.documentElement.setAttribute(
			"data-device",
			DeviceConfig.checkDevice() ?? ""
		);
		document.documentElement.setAttribute(
			"data-iphone",
			DeviceConfig.checkIPhone() ?? ""
		);
		document.documentElement.setAttribute(
			"data-os",
			DeviceConfig.checkOs() ?? ""
		);
	};

	const init = () => {
		setDimensions();
	};

	nuxtApp.vueApp.use(init);

	return {
		provide: {
			setDimensions,
		},
	};
});
