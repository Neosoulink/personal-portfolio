import type { RouteRecordNormalized, RouteRecordRaw } from "#vue-router";
// EXPERIENCES
import { HomeExperience } from ".";

// STATIC
import { events, errors } from "~/static";

// MODELS
import { ExperienceBasedBlueprint } from "~/common/blueprints/experience-based.blueprint";

/** `NuxtJs` routing system pipe. */
export class Router extends ExperienceBasedBlueprint {
	protected _experience = new HomeExperience();

	private readonly _router = useRouter();
	private readonly _route = useRoute();
	private readonly _availableRoutes: { [routeName: string]: RouteRecordRaw } =
		{};

	private _currentRouteName?: string;

	constructor() {
		super();

		try {
			const routes = this._router.getRoutes();
			routes.forEach((route) => {
				if (route.name === undefined) throw new Error("", { cause: route });
			});
		} catch (_: any) {
			const cause = _.cause as RouteRecordNormalized | undefined;
			if (!cause?.children.length) return;

			cause.children.forEach((route) => {
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
		this.removeAllListeners();
	}
}
