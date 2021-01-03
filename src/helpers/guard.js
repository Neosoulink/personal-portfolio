import vue from 'vue';

// Firebase*
import firebaseConfig from '../config/firebase.config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';

export function initialize(store, router) {

	firebase.initializeApp(firebaseConfig());
	firebase.analytics();

	firebase.firestore().collection('skills').get().then(async ref => {
		let skills = [];
		 await ref.docs.forEach((skill) => {
			skills.push({
				percentage: skill.data().percentage,
				title: skill.data().title
			})
		});
		store.commit('author/SET_SKILLS', skills)
	}).catch(err => {
		console.log(err)
	})

	router.beforeEach((to, from, next) => {
		next();
	});

}
