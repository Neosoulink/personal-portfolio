export const useMenuState = () =>
	useState<boolean>("menu-visibility", () => false);
