import { ErrorFactory } from "~/errors";

export default defineNuxtPlugin((nuxtApp) => {
	const setSizes = () => {
		try {
			const vh = window.innerHeight * 0.01;
			const vw = window.innerWidth * 0.01;
			document.documentElement.style.setProperty("--vh", `${vh}px`);
			document.documentElement.style.setProperty("--vw", `${vw}px`);
		} catch (error) {
			new ErrorFactory(error);
		}
	};

	const initStylesAddon = () => {
		setSizes();
		window.removeEventListener("resize", setSizes);
		window.addEventListener("resize", setSizes);
	};

	nuxtApp.vueApp.use(initStylesAddon);
});
