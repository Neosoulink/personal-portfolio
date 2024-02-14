<script setup lang="ts">
// EXPERIENCES
import { HomeExperience } from "~/experiences/home";

// STATIC
import { events, pages } from "~/static";

// DATA
const appCanvasId = "home-experience";
const availableRoutes = useState<{ name: string; path: string; key: string }[]>(
	"availableRoutes",
	() => []
);
const isExperienceConstructed = useState(
	"isExperienceConstructed",
	() => false
);
const isExperienceReady = useState<boolean>("isExperienceReady", () => false);
const isFreeCamera = useState<boolean>("isFreeCamera", () => false);
const isFocusMode = useState<boolean>("isFocusMode", () => false);
const isMarkersDisplayed = useState<boolean>("isMarkersDisplayed", () => false);
const isSoundMuted = useState<boolean>("isSoundMuted", () => false);

// EVENTS;
const onUiReady = () => {
	isExperienceReady.value = true;
};
const onCameraAnimationChange = () => {
	const _exp = new HomeExperience();
	isFreeCamera.value = !!(
		!_exp?.cameraAnimation?.enabled && _exp?.navigation?.view.enabled
	);
};
const onInteractionFocusStarted = () => (isFocusMode.value = true);
const onInteractionFocusEnded = () => (isFocusMode.value = false);
const onMarkersDisplayed = () => (isMarkersDisplayed.value = true);
const onMarkersRemoved = () => (isMarkersDisplayed.value = false);
const onSoundChanged = () => {
	isSoundMuted.value = !!new HomeExperience()?.sound?.isMuted;
};

const init = () => {
	if (!process.client || isExperienceConstructed.value) return;
	const _exp = new HomeExperience({
		domElementRef: `#${appCanvasId}`,
	});

	_exp.construct();
	isExperienceConstructed.value = true;

	const routes = _exp.router?.availableRoutes;
	availableRoutes.value = [];
	if (routes) {
		let safeRoutes = [];
		const routeKeys = Object.keys(routes);
		for (let i = 0; i < routeKeys.length; i++) {
			const route = routes[routeKeys[i]];
			const name = (route.name?.toString() ?? "Not defined").replace(
				/index\-?/,
				""
			);
			const value = {
				name: name.length === 0 ? "home" : name,
				path: "/" + route.path,
				key: route.meta?.key?.toString() ?? "",
			};

			if (route.meta?.key === pages.HOME_PAGE)
				availableRoutes.value.unshift(value);
			else if (route.meta?.key === pages.SKILL_PAGE)
				availableRoutes.value.push(value);
			else safeRoutes.push(value);
		}

		availableRoutes.value = [...availableRoutes.value, ...safeRoutes];
	}

	onSoundChanged();
	_exp.ui?.on(events.READY, onUiReady);
	_exp.ui?.on(events.MARKERS_DISPLAYED, onMarkersDisplayed);
	_exp.ui?.on(events.MARKERS_REMOVED, onMarkersRemoved);
	_exp.cameraAnimation?.on(events.CHANGED, onCameraAnimationChange);
	_exp.interactions?.on(
		events.INTERACTION_FOCUS_STARTED,
		onInteractionFocusStarted
	);
	_exp.interactions?.on(
		events.INTERACTION_FOCUS_ENDED,
		onInteractionFocusEnded
	);
	_exp.sound?.on(events.CHANGED, onSoundChanged);
};
const dispose = () => {
	const _exp = new HomeExperience();

	_exp.ui?.off(events.READY, onUiReady);
	_exp.ui?.off(events.MARKERS_DISPLAYED, onMarkersDisplayed);
	_exp.ui?.off(events.MARKERS_REMOVED, onMarkersRemoved);
	_exp.cameraAnimation?.off(events.CHANGED, onCameraAnimationChange);
	_exp.interactions?.off(
		events.INTERACTION_FOCUS_STARTED,
		onInteractionFocusStarted
	);
	_exp.interactions?.off(
		events.INTERACTION_FOCUS_ENDED,
		onInteractionFocusEnded
	);
	_exp.sound?.off(events.CHANGED, onSoundChanged);

	_exp.destruct();
	isExperienceConstructed.value = false;
};

useHead({
	title: "Nathan Mande - Home",
	link: [
		{
			href: "/notes/about",
			rel: "preload",
			as: "document",
		},
	],
	meta: [
		{
			name: "viewport",
			content:
				"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
		},
	],
});

prerenderRoutes(["/notes/about", "/notes/credits"]);
onMounted(init);
onBeforeUnmount(dispose);
onBeforeRouteUpdate((route) => {
	const _exp = new HomeExperience();
	isFocusMode.value = false;
	_exp?.router?.emit(events.CHANGED, route);
});
</script>

<template>
	<main
		class="relative overflow-hidden group-data-[device=pc]:h-screen w-safe h-safe bg-dark"
	>
		<LazyHomeLoader />

		<canvas :id="appCanvasId" class="fixed top-0 left-0 z-0 w-full h-full" />

		<LazyGContainer
			:class="`relative flex flex-col justify-between h-full sm:py-8 md:py-12 ${
				isFreeCamera ? 'pointer-events-none' : ''
			}`"
		>
			<LazyGHeader class="px-4 pt-5 sm:pt-0 sm:px-0" />

			<section class="flex flex-col flex-1 sm:flex-row">
				<LazyHomeNav />
				<LazyNuxtPage class="w-full h-full" />
			</section>

			<LazyHomeFooter />
		</LazyGContainer>
	</main>
</template>

<style lang="scss" scoped>
main {
	* {
		user-select: none;
	}
}
</style>
