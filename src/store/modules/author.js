const state = () => ({
	skills: [
		{ percentage: 70, title: "JS | TS" },
		{ percentage: 75, title: "HTLM, CSS" },
		{ percentage: 65, title: "PHP(Poo)" },
		{ percentage: 65, title: "GraphQl" },
		{ percentage: 60, title: "SQL" },
		{ percentage: 65, title: "Nodejs" },
		{ percentage: 80, title: "Vuejs (& nuxtjs)" },
		{ percentage: 70, title: "React (& nextjs)" },
		{ percentage: 75, title: "React-native" },
		{ percentage: 60, title: "Laravel" },
	],
});

const getters = {
	getSkills(state) {
		return state.skills;
	},
};

const mutations = {
	SET_SKILLS(state, skills) {
		state.skills = skills;
	},
};

const actions = {};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
