<template>
	<main class="w-full h-safe bg-dark">
		<HomeLoader />

		<canvas :id="states.domRef" class="fixed top-0 left-0 w-full h-full" />

		<div class="fixed font-bold top-1/2 text-red-50">
			<NuxtLink to="/" class="mr-3">Page child 1</NuxtLink>
			<NuxtLink to="/skills" class="mr-3">Page child 2</NuxtLink>
			<NuxtLink to="/contact">Page child 3</NuxtLink>

			<div class="block mb-4" />

			<NuxtPage />
		</div>
	</main>
</template>

<script lang="ts" setup>
// EXPERIENCES
import { HomeExperience } from "~/experiences/home";

// STATIC
import { events } from "~/static";

// DATA
const states = reactive<{
	experience?: HomeExperience;
	domRef: string;
}>({ domRef: "home-experience" });

// FUNCTIONS
const initExperience = () => {
	if (!process.client) return;

	const Experience = new HomeExperience({
		domElementRef: `#${states.domRef}`,
	});

	Experience.construct();
	states.experience = Experience;
};

const endExperience = () => {
	if (!states.experience) return;

	states.experience.destruct();
	states.experience = undefined;
};

// HOOKS
onMounted(() => {
	!states.experience && setTimeout(initExperience, 500);
});

onBeforeUnmount(() => setTimeout(endExperience, 500));

onBeforeRouteUpdate((route) => {
	states.experience?.router?.emit(events.CHANGED, route);
});
</script>
