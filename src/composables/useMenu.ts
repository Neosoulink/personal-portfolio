export const useMenu = () =>
	useState<boolean>("menu-visibility", () => false);
