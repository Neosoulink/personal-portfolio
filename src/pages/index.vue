<script lang="ts" setup>
// EXPERIENCES
import { HomeExperience } from "~/experiences/home";

// STATIC
import { events } from "~/static";

// DATA
const appCanvasId = "home-experience";
const isExperienceConstructed = useState(
	"isExperienceConstructed",
	() => false
);
const isExperienceReady = useState<boolean>("isExperienceReady", () => false);
const isFreeCamera = useState<boolean>("isFreeCamera", () => false);
const isFocusMode = useState<boolean>("isFocusMode", () => false);
const isMarkersDisplayed = useState<boolean>("isMarkersDisplayed", () => false);
const isSoundMuted = useState<boolean>("isSoundMuted", () => false);
const availableRoutes = ref<{ name: string; path: string; key: string }[]>([]);

// EVENTS
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
		<HomeLoader :isExperienceConstructed="isExperienceConstructed" />

		<canvas :id="appCanvasId" class="fixed top-0 left-0 z-0 w-full h-full" />

		<G-Container
			:class="`relative flex flex-col justify-between h-full sm:py-8 md:py-12 ${
				isFreeCamera ? 'pointer-events-none' : ''
			}`"
		>
			<HomeHeader />

			<section
				class="flex flex-col flex-1 sm:flex-row"
				v-if="!!isExperienceConstructed"
			>
				<HomeNav :routes="availableRoutes" />
				<NuxtPage class="relative flex" />
			</section>

			<HomeFooter v-if="!!isExperienceConstructed" />
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
