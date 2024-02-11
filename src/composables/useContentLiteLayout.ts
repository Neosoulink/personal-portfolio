export const useContentLiteLayout = () =>
	useState<{
		headerLinks?: { title: string; path: string }[];
	}>("contentLiteLayoutState", () => ({}));
