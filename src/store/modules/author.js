
const state = () => ({
	skills: [],
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
