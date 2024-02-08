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
		class="flex flex-col items-start justify-between w-full text-light xs:items-center xs:flex-row "
	>
		<LazyGBrandLogo
			v-if="showLogo"
			class="z-[60] xs:w-auto flex items-start justify-start !pointer-events-auto"
			:link="logoLink"
		/>

		<div
			v-if="!showMenuIcon"
			class="flex flex-row items-center justify-end flex-1 space-x-2 uppercase"
		>
			<NuxtLink
				class="no-underline relative opacity-70 hover:opacity-100 nav-link before:absolute before:h-[1px] before:bottom-0 before:transition-[width] before:w-0 before:hover:w-full before:bg-light before:right-0 before:hover:right-[none] before:hover:left-0 tracking-wider sm:tracking-normal"
				exact-active-class="!opacity-100 before:!w-full"
				v-for="(route, id) in routes"
				:key="id"
				:href="route.path"
				>{{ route.title }}</NuxtLink
			>
		</div>

		<LazyGMenuButton
			v-if="showMenuIcon"
			class="z-40 mb-0 xs:mb-1 !pointer-events-auto self-end"
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
