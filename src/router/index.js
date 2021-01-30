import Vue from "vue";
import VueRouter from "vue-router";
;

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: () => import("../views/Home.vue"),
	},
	{
		path: "/about",
		name: "About",
		component: () => import("../views/About.vue"),
	},
	{
		path: "/resume",
		name: "Resume",
		component: () => import("../views/Resume.vue"),
	},
	{
		path: "/MyWork",
		name: "MyWork",
		component: () => import("../views/Portfolio.vue"),
	},
	{
		path: "/contact",
		name: "Contact",
		component: () => import("../views/Contact.vue"),
	},
	{
		path: "*",
		name: "Lost",
		component: () => import("../views/404.vue"),
	}
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;
