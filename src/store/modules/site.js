const localTheme = JSON.parse(localStorage.getItem('siteTheme'))

const state = () => ({
	currentTheme: (localTheme && localTheme.theme) ? localTheme.theme : 'primaryTheme',
	currentColor: (localTheme && localTheme.color) ? localTheme.color : '#04b4e0',
	themeList: {
		primaryTheme: "#04b4e0",
		dangerTheme: "#f03434",
		successTheme: "#00e640",
	}
});

const getters = {
	getTheme(state, theme = 'primaryTheme') {
		return state.themeList[theme]
	},
	getThemeList(state) {
		return state.themeList;
	},
	getCurrentTheme(state) {
		return state.currentTheme;
	},
	getCurrentColor(state) {
		return state.currentColor;
	}
};

const mutations = {
	SET_CURRENT_THEME(state, theme = 'primaryTheme') {
		if (
			typeof theme == 'string' &&
			state.themeList[theme] &&
			typeof state.themeList[theme] == 'string'
		) {
			localStorage.setItem('siteTheme', JSON.stringify({
				theme,
				color: state.themeList[theme]
			}))
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
