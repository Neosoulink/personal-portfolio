<script lang="ts" setup>
// EXPERIENCES
import { HomeExperience } from "~/experiences/home";

// STATIC
import { events } from "~/static";

// DATA
const appCanvasId = "home-experience";
const availableRoutes = useState<{ name: string; path: string; key: string }[]>(
	"availableRoutes",
	() => []
);
const isExperienceReady = useState<boolean>("isExperienceReady", () => false);
let experience: HomeExperience | undefined;

// EVENTS
const onUiReady = () => {
	isExperienceReady.value = true;
};
const init = () => {
	if (!process.client || experience) return;
	experience = new HomeExperience({
		domElementRef: `#${appCanvasId}`,
	});
	experience.construct();
	experience?.ui?.on(events.READY, onUiReady);

	const routes = experience.router?.availableRoutes;
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
};
const dispose = () => {
	if (!experience) return;
	experience?.ui?.off(events.READY, onUiReady);
	experience.destruct();
	experience = undefined;
};

onMounted(init);
onBeforeUnmount(dispose);
onBeforeRouteUpdate((route) => {
	experience?.router?.emit(events.CHANGED, route);
});
</script>

<template>
	<main
		class="relative overflow-hidden group-data-[device=pc]:h-screen w-safe h-safe bg-dark"
	>
		<HomeLoader />

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
