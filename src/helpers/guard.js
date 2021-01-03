import vue from 'vue';

// Firebase*
import firebaseConfig from '../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/analytics';

export function initialize(store, router) {

	firebase.initializeApp(firebaseConfig());
	firebase.analytics();

	router.beforeEach((to, from, next) => {
		next();
	});

}
