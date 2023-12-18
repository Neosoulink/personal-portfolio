import type { RouteRecordNormalized, RouteRecordRaw } from "#vue-router";

// MODELS
import { CHANGED } from "~/experiences/common/Event.model";

// EXPERIENCES
import HomeExperience from ".";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "@/experiences/blueprints/ExperienceBased.blueprint";
import { WRONG_PARAM } from "~/experiences/common/error.model";

export class Navigation extends ExperienceBasedBlueprint {
	protected _experience = new HomeExperience();
	protected _router = useRouter();
	protected _route = useRoute();
	protected _availableRoutes: string[] = [];
	protected _currentRouteIndex: number = 0;

	constructor() {
		super();

		try {
			const ROUTES = this._router.getRoutes();
			ROUTES.forEach((route) => {
				if (route.name === undefined) throw new Error("", { cause: route });
			});
		} catch (_: any) {
			const CAUSE = _.cause as RouteRecordNormalized | undefined;
			if (!CAUSE?.children.length) return;

			this._availableRoutes = CAUSE.children.map(
				(route) => route.name?.toString() || ""
			);
		}

		this._setCurrentRouteIndexFromName(this._route.name?.toString());

		this.on(CHANGED, (route: RouteRecordNormalized) => {
			const ROUTE_NAME = route.name?.toString();
			this._setCurrentRouteIndexFromName(ROUTE_NAME);
		});
	}

	public get availableRoutes() {
		return this._availableRoutes;
	}

	public get currentRoute() {
		return this.availableRoutes[this._currentRouteIndex];
	}

	public get currentRouteIndex() {
		return this._currentRouteIndex;
	}

	protected _setCurrentRouteIndexFromName(routeName?: string) {
		if (!routeName || this._availableRoutes.indexOf(routeName) === -1)
			throw new Error("Route name not available", { cause: WRONG_PARAM });

		this._currentRouteIndex = this._availableRoutes.indexOf(routeName);
	}

	public construct(): void {}

	public destruct(): void {}

	public update(): void {}
}
