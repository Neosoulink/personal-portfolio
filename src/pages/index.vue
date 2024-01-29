<script lang="ts" setup>
// EXPERIENCES
import { HomeExperience } from "~/experiences/home";

// STATIC
import { events } from "~/static";

// DATA
const appCanvasId = "home-experience";
const experience = ref<HomeExperience | undefined>();
const availableRoutes = useState<{ name: string; path: string; key: string }[]>(
	"availableRoutes",
	() => []
);
const isExperienceReady = useState<boolean>("isExperienceReady", () => false);

// EVENTS
const onUiReady = () => {
	isExperienceReady.value = true;
};
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

	_exp?.ui?.on(events.READY, onUiReady);
	experience.value = _exp;
};
const dispose = () => {
	if (!experience.value) return;
	experience.value?.ui?.off(events.READY, onUiReady);
	experience.value.destruct();
	experience.value = undefined;
};

onMounted(init);
onBeforeUnmount(dispose);
onBeforeRouteUpdate((route) => {
	experience.value?.router?.emit(events.CHANGED, route);
});
</script>

<template>
	<main
		class="relative overflow-hidden group-data-[device=pc]:h-screen w-safe h-safe bg-dark"
	>
		<HomeLoader :experience="experience" />

		<canvas :id="appCanvasId" class="fixed top-0 left-0 w-full h-full" />

		<G-Container
			class="relative flex flex-col justify-between h-full py-5 sm:py-8 md:py-12"
		>
			<HomeHeader />

			<section class="flex flex-row flex-1">
				<HomeNav :routes="availableRoutes" />
				<NuxtPage
					v-if="!!experience"
					class="relative flex"
					:experience="experience"
				/>
			</section>

			<HomeFooter />
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
