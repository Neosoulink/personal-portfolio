import vue from 'vue';

// Firebase*
import firebaseConfig from '../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';

export function initialize(store, router) {

	firebase.initializeApp(firebaseConfig());
	firebase.analytics();

	firebase.firestore().collection('skills').get().then(ref => {
		//console.log(ref.docs)
		store.commit('author/SET_SKILLS', ref.docs)
	}).catch(err => {
		console.log(err)
	})

	router.beforeEach((to, from, next) => {
		next();
	});

}
