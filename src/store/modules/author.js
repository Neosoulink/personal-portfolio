const state = () => ({
	skills: [
		{ title: "JS(ES6-ES2020)", percentage: 70 },
		{ percentage: 70, title: "Laravel" },
		{ percentage: 75, title: "ReactNative" },
		{ title: "HTLM, CSS", percentage: 75 },
		{ percentage: 65, title: "Nodejs" },
		{ percentage: 85, title: "Vuejs (& nuxtjs)" },
		{ title: "WordPress", percentage: 65 },
		{ title: "React (& nextjs)", percentage: "65" },
		{ percentage: "80", title: "PHP(Poo)" }
	],
});

const getters = {
	getSkills(state) {
		return state.skills
	}
};

const mutations = {
	SET_SKILLS(state, skills) {
		state.skills = skills;
	}
};

const actions = {

};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
