import { useRoute } from "vue-router";

export const useHashUrl = () => {
	const ROUTE = useRoute();
	const STATES = reactive<{ current?: string }>({});

	watch(ROUTE, async (newState) => {
		STATES.current = (newState?.hash ?? "").replace("#", "");
	});

	return STATES;
};
