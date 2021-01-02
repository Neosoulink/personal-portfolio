import vue from 'vue';

export function initialize(store, router, fire) {

	firebase.firestore.collection('skills').get().then(ref => {
		store.commit('author/SET_SKILLS', ref.docs)
	}).catch(err => {
		console.log(err)
	})


	router.beforeEach((to, from, next) => {

		next();
	});

	vue.prototype.$http.interceptors.request.use(config => {
		return config;
	}, error => {
		// Do something with request error
		return Promise.reject(error);
	});

	vue.prototype.$http.interceptors.response.use(response => {
		return response;
	}, error => {
		if (error.response.status == 404) {
			router.replace('/404');
		}
		return Promise.reject(error);
	});

}
