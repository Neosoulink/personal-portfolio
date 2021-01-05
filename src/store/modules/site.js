const state = () => ({
	currentTheme: null,
	currentColor : null,
	themeList: {
		primaryTheme: "#04b4e0",
		dangerTheme: "#f03434",
		successTheme: "#f5f5f5",
	}
});

const getters = {
	getTheme(state, theme = 'primaryTheme') {
		return state.themeList[theme]
	}
};

const mutations = {
	SET_CURRENT_THEME(state, theme = 'primaryTheme') {
		if (
			typeof theme == 'string' &&
			state.themeList[theme] &&
			typeof state.themeList[theme] == 'string'
		) {
			state.currentTheme = theme;
			state.currentColor = state.themeList[theme];
		}
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
