import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { initialize } from './helpers/guard';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueParticles from 'vue-particles';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'vue2-animate/dist/vue2-animate.min.css';
import './assets/less/index.less';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueParticles);

library.add(fas, fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;
initialize(store, router);

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
