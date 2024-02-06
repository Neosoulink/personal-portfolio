<script lang="ts" setup>
// STATES
const isMenuOpen = useMenu();

withDefaults(
	defineProps<{
		showMenuIcon?: boolean;
		showLogo?: boolean;
		routes?: { title: string; path: string }[];
		logoLink?: string;
	}>(),
	{
		showMenuIcon: () => true,
		showLogo: () => true,
	}
);
</script>

<template>
	<header
		class="flex flex-col items-end w-full text-light justify-stretch xs:items-center xs:flex-row"
	>
		<LazyGBrandLogo
			v-if="showLogo"
			class="z-[60] w-full xs:w-auto flex items-start justify-start !pointer-events-auto flex-1"
			:link="logoLink"
		/>

		<div
			v-if="!showMenuIcon"
			class="flex flex-row items-center justify-end flex-1 space-x-2"
		>
			<NuxtLink v-for="(route, id) in routes" :key="id" :href="route.path">{{
				route.title
			}}</NuxtLink>
		</div>

		<LazyGMenuButton
			v-if="showMenuIcon"
			class="z-40 mb-0 xs:mb-1 !pointer-events-auto"
			:active="isMenuOpen"
			@click="
				() => {
					isMenuOpen = !isMenuOpen;
				}
			"
		/>
	</header>
</template>

<style lang="scss" scoped>
h1:hover img {
	scale: 1.05;
}

@for $i from 1 through 12 {
	h1:hover span > div:nth-child(#{$i}) {
		transition-delay: 0.03s * ($i + 1);
		scale: 1.05;
		translate: 5px * ($i * 0.25);
	}
}
</style>
