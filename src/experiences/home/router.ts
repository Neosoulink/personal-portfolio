import type { RouteRecordNormalized, RouteRecordRaw } from "#vue-router";
// EXPERIENCES
import { HomeExperience } from ".";

// STATIC
import { events, errors } from "~/static";

// BLUEPRINTS
import { ExperienceBasedBlueprint } from "~/blueprints/experiences/experience-based.blueprint";

export class Router extends ExperienceBasedBlueprint {
	protected _experience = new HomeExperience();
	protected _router = useRouter();
	protected _route = useRoute();
	protected _availableRoutes: { [routeName: string]: RouteRecordRaw } = {};
	protected _currentRouteName?: string;

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

			CAUSE.children.forEach((route) => {
				this._availableRoutes[route.name?.toString() ?? ""] = route;
			});
		}

		this._setCurrentRouteIndexFromName(this._route.name?.toString());

		this.on(events.CHANGED, (route: RouteRecordNormalized) => {
			const ROUTE_NAME = route.name?.toString();
			this._setCurrentRouteIndexFromName(ROUTE_NAME);
		});
	}

	private _setCurrentRouteIndexFromName(routeName?: string) {
		if (!routeName || !this._availableRoutes[routeName])
			throw new Error("Route name not available", {
				cause: errors.WRONG_PARAM,
			});

		this._currentRouteName = routeName;
	}

	public get availableRoutes() {
		return this._availableRoutes;
	}

	public get currentRoute() {
		if (!this._currentRouteName) return undefined;

		return this.availableRoutes[this._currentRouteName];
	}

	public get currentRouteName() {
		return this._currentRouteName;
	}

	public get currentRouteKey() {
		if (!this._currentRouteName) return undefined;

		return this.availableRoutes[this._currentRouteName].meta?.key;
	}

	public construct(): void {
		this.emit(events.CONSTRUCTED);
	}

	public destruct(): void {
		this.emit(events.DESTRUCTED);
	}

	public update(): void {
		this.emit(events.UPDATED);
	}
}
