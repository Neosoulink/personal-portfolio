import Vue from 'vue';
import Vuex from 'vuex';
import site from './modules/site';
import author from './modules/author';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
	modules: {
		author,
		site
	},
	strict: debug,
});
