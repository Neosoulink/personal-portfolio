<script lang="ts" setup>
// COMPOSAPLES
import { useMenuState } from "~/composables/menu";

// STATES
const isMenuOpen = useMenuState();
</script>

<template>
	<header
		class="flex flex-col items-end w-full px-4 pt-5 text-light justify-stretch xs:items-center xs:justify-between xs:flex-row sm:pt-0 sm:px-0"
	>
		<G-BrandLogo
			class="z-[60] w-full xs:w-auto flex items-start justify-start"
		/>

		<G-MenuButton
			class="z-40 mb-0 xs:mb-1"
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
