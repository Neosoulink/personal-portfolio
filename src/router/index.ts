import * as Vue from "vue";
import * as VueRouter from "vue-router";

// COMPONENTS
import Home from "../views/home/index.vue";

const routes: VueRouter.RouterOptions["routes"] = [
	{ path: "/", component: Home, name: "root" },
];

const routeOptions: VueRouter.RouterOptions = {
	history: VueRouter.createWebHistory(),
	routes: routes,
};

export default VueRouter.createRouter(routeOptions);
