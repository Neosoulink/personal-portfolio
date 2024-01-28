import { ErrorFactory } from "~/errors";

export type Theme = "dark" | "light" | undefined;

export default defineNuxtPlugin((nuxtApp) => {
	const setTheme = (theme: Theme) => {
		try {
			const safeTheme: Exclude<Theme, undefined> = theme || "dark";
			/* Tailwind support */
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.add(safeTheme);

			document.documentElement.setAttribute("data-theme", safeTheme);

			if (!safeTheme) return localStorage.removeItem("theme");
			localStorage.theme = theme;
		} catch (error) {
			new ErrorFactory(error);
		}
	};

	const onThemeChange = () => {
		setTheme(
			localStorage.theme === "dark" ||
				(!("theme" in localStorage) &&
					window.matchMedia("(prefers-color-scheme: dark)").matches)
				? "dark"
				: "light"
		);
	};

	const init = () => {
		onThemeChange();

		window
			.matchMedia("(prefers-color-scheme: dark)")
			.removeEventListener("change", onThemeChange);

		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", onThemeChange);
	};

	nuxtApp.vueApp.use(init);

	return {
		provide: {
			setTheme,
		},
	};
});
