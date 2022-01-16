const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		colors: {
			...colors,
			dark: "#121415",
			light: "#f4f7f5",
			primary: {
				900: "#5f4491",
			},
			secondary: {
				900: "#4a9cac",
			},
		},
		extend: {},
	},
	plugins: [],
};
