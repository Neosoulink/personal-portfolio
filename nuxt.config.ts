import glslify from "vite-plugin-glslify";

export default defineNuxtConfig({
	devtools: { enabled: true },
	ssr: false,
	app: {
		head: {
			title: "Nathan Mande's Site",
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
			meta: [
				{
					key: "description",
					name: "description",
					content: "A 3D experience representing Nathan Mande's room",
				},
				{ name: "format-detection", content: "telephone=no" },
				{ name: "x-ua-compatible", content: "IE=edge" },
				{ name: "og:site_name", content: "Nathan Mande's Site" },
				{ name: "og:type", content: "website" },
				{ name: "og:title", content: "Nathan Mande's website" },
				{
					name: "og:description",
					content: "A 3D experience representing Nathan Mande's room",
				},
				{ name: "og:image", content: "/imgs/screenshot.png" },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: "Nathan Mande's website" },
				{ name: "twitter:creator", content: "https://twitter.com/nsl_nathan" },
				{ name: "twitter:image", content: "/imgs/screenshot.png" },
				{
					name: "twitter:description",
					content: "A 3D experience representing Nathan Mande's room",
				},
				{ name: "application-name", content: "mydevjourney" },
			],
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
				{ rel: "manifest",  href: "/favicon/site.webmanifest" },

		],
		},
	},
	srcDir: "./src",
	components: [
		// ~/components/pages/home/Update.vue => <HomeUpdate />
		{ path: "~/components/pages" },

		// ~/components/layout/Theme.vue => <L-Theme />
		{ path: "~/components/layout", prefix: "L-" },

		// ~/components/global/Btn.vue => <G-Btn />
		{ path: "~/components/global", prefix: "G-" },

		"~/components",
	],
	modules: ["@nuxtjs/i18n", "@nuxt/content", "@nuxtjs/tailwindcss"],
	runtimeConfig: {
		GITHUB_TOKEN: process.env.GITHUB_TOKEN,
		GITHUB_USERNAME: process.env.GITHUB_USERNAME,
		GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME,
		public: {
			MODE: process.env.MODE,
			GITHUB_LINK: process.env.GITHUB_LINK,
			LINKEDIN_LINK: process.env.LINKEDIN_LINK,
			DISCORD_LINK: process.env.DISCORD_LINK,
			STACKOVERFLOW_LINK: process.env.STACKOVERFLOW_LINK,
			TWITTER_LINK: process.env.TWITTER_LINK,
			TELEGRAM_LINK: process.env.TELEGRAM_LINK,
			GITHUB_CONTENT_LINK: process.env.GITHUB_REPO_NAME,
		},
	},
	typescript: {
		typeCheck: true,
		strict: true,
	},
	spaLoadingTemplate: false,
	vite: {
		plugins: [glslify()],
	},
	i18n: {
		vueI18n: "./i18n.config.ts",
		customRoutes: "config",
		detectBrowserLanguage: false,
	},
	content: {
		highlight: {
			theme: "github-dark",
		},
	},
	tailwindcss: {},
	css: ["~/assets/styles/index.scss"],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});
