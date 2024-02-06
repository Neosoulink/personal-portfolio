const theme = require("tailwindcss/defaultTheme");

const safeHeight = "calc(var(--vh, 1vh) * 100)";
const safeWidth = "calc(var(--vw, 1vw) * 100)";

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./src/components/**/*.{js,vue,ts}",
		"./src/layouts/**/*.{js,vue,ts}",
		"./src/pages/**/*.{js,vue,ts}",
	],
	theme: {
		...theme,
		colors: {
			transparent: "transparent",
			white: "#fff",
			black: "#000",
			dark: "rgb(var(--dark))",
			light: "rgb(var(--light))",
			primary: "rgb(var(--primary))",
			secondary: "rgb(var(--secondary))",
		},
		fontFamily: {
			exo: ["Exo", "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
		},
		screens: {
			...theme.screens,
			xs: "340px",
		},
		extend: {
			...theme.extend,
			minHeight: {
				safe: safeHeight,
			},
			minWidth: {
				safe: safeWidth,
			},
			height: {
				safe: safeHeight,
			},
			width: {
				safe: safeWidth,
			},
			maxHeight: {
				safe: safeHeight,
			},
			maxWidth: {
				safe: safeWidth,
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
