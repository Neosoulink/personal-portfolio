const colors = require("tailwindcss/colors");
const theme = require("tailwindcss/defaultTheme");

delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/components/**/*.{js,vue,ts}",
		"./src/layouts/**/*.vue",
		"./src/pages/**/*.vue",
		"./src/plugins/**/*.{js,ts}",
		"./src/nuxt.config.{js,ts}",
		"./src/app.vue",
	],
	theme: {
		colors: {
			...colors,
			dark: "rgb(var(--dark))",
			light: "rgb(var(--light))",
			primary: {
				900: "rgb(var(--primary))",
			},
			secondary: {
				900: "rgb(var(--secondary))",
			},
			fontFamily: {
				...theme.fontFamily,
				exo: ["Exo", "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
			},
		},
		extend: {},
	},
	plugins: [],
};
