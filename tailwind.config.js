const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
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
		},
		extend: {},
	},
	plugins: [],
};
