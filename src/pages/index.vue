<script lang="ts" setup>
// EXPERIENCES
import { HomeExperience } from "~/experiences/home";

// STATIC
import { events } from "~/static";

// DATA
const appCanvasId = "home-experience";
const experience = ref<HomeExperience | undefined>();
const availableRoutes = ref<{ name: string; path: string; key: string }[]>([]);
const isExperienceReady = useState<boolean>("isExperienceReady", () => false);
const isFreeCamera = useState<boolean>("isFreeCamera", () => false);
const isFocusMode = useState<boolean>("isFocusMode", () => false);
const isMarkersDisplayed = useState<boolean>("isMarkersDisplayed", () => false);

// EVENTS
const onUiReady = () => {
	isExperienceReady.value = true;
};
const onCameraAnimationChange = () => {
	isFreeCamera.value = !!(
		!experience.value?.cameraAnimation?.enabled &&
		experience.value?.navigation?.view.enabled
	);
};
const onInteractionFocusStarted = () => (isFocusMode.value = true);
const onInteractionFocusEnded = () => (isFocusMode.value = false);
const onMarkersDisplayed = () => (isMarkersDisplayed.value = true);
const onMarkersRemoved = () => (isMarkersDisplayed.value = false);

const init = () => {
	if (!process.client || experience.value) return;
	const _exp = new HomeExperience({
		domElementRef: `#${appCanvasId}`,
	});
	_exp.construct();

	const routes = _exp.router?.availableRoutes;
	if (routes)
		availableRoutes.value = Object.keys(routes).map((key) => {
			const name = (routes[key].name?.toString() ?? "Not defined").replace(
				/index\-?/,
				""
			);

			return {
				name: name.length === 0 ? "home" : name,
				path: "/" + routes[key].path,
				key: routes[key].meta?.key?.toString() ?? "",
			};
		});

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

	experience.value = _exp;
};
const dispose = () => {
	if (!experience.value) return;
	experience.value?.ui?.off(events.READY, onUiReady);
	experience.value.cameraAnimation?.off(
		events.CHANGED,
		onCameraAnimationChange
	);
	experience.value.cameraAnimation?.off(
		events.CHANGED,
		onCameraAnimationChange
	);
	experience.value.destruct();
	experience.value = undefined;
};

onMounted(init);
onBeforeUnmount(dispose);
onBeforeRouteUpdate((route) => {
	isFocusMode.value = false;
	experience.value?.router?.emit(events.CHANGED, route);
});
</script>

<template>
	<main
		class="relative overflow-hidden group-data-[device=pc]:h-screen w-safe h-safe bg-dark"
	>
		<HomeLoader :experience="experience" />

		<canvas :id="appCanvasId" class="fixed top-0 left-0 z-0 w-full h-full" />

		<G-Container
			:class="`relative flex flex-col justify-between h-full sm:py-8 md:py-12 ${
				isFreeCamera ? 'pointer-events-none' : ''
			}`"
		>
			<HomeHeader />

			<section class="flex flex-col flex-1 sm:flex-row" v-if="!!experience">
				<HomeNav :routes="availableRoutes" />
				<NuxtPage class="relative flex" />
			</section>

			<HomeFooter v-if="!!experience" />
		</G-Container>
	</main>
</template>

<style lang="scss">
main {
	* {
		user-select: none;
	}
}
</style>
