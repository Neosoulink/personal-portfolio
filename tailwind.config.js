const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		colors: {
			...colors,
			dark: "var(--dark)",
			light: "var(--light)",
			primary: {
				900: "var(--primary)",
			},
			secondary: {
				900: "var(--secondary)",
			},
		},
		extend: {},
	},
	plugins: [],
};
