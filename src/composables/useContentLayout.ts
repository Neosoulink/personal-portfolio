export const useContentLayout = () =>
	useState<{
		displayLeftSide: boolean;
		displayTitle: boolean;
		displayNetworks: boolean;
		title: string;
		subTitle?: string;
		headerLinks?: { title: string; path: string }[];
	}>("contentLayoutState", () => ({
		displayLeftSide: false,
		displayTitle: true,
		displayNetworks: true,
		title: "",
	}));
