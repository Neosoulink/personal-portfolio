import glsl from "vite-plugin-glsl";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	devtools: { enabled: true },
	alias: {
		"@exp-factories/*": "../src/experiences/factories/*",
		"@exp-errors/*": "../src/experiences/errors/*",
		"@exp-pages/*": "../src/experiences/pages/*",
		"@interfaces/*": "../src/interfaces/*",
		"@constants/*": "../src/constants/*",
	},
	app: {
		head: {
			title: "nsl-me",
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ hid: "description", name: "description", content: "" },
				{ name: "format-detection", content: "telephone=no" },
			],
			link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
		},
	},
	modules: ["@nuxt/content", ""],
	css: ["~/assets/css/index.css"],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	srcDir: "./src",
	runtimeConfig: {
		public: {
			env: process.env.MODE,
		},
	},
	vite: {
		plugins: [glsl()],
	},
	typescript: {
		typeCheck: true,
		strict: true,
	},
});
