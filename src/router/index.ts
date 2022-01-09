import * as Vue from "vue";
import * as VueRouter from "vue-router";

// COMPONENTS
import Home from "../views/Home.vue";

// INTERFACES
interface Route {
	path: string;
	component: Vue.Component;
	name?: string;
}

const routes: Route[] = [{ path: "/", component: Home, name: "root" }];

const routeOptions: VueRouter.RouterOptions = {
	history: VueRouter.createWebHashHistory(),
	routes: routes,
};

export default VueRouter.createRouter(routeOptions);
