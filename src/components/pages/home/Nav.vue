<script setup lang="ts">
const props = withDefaults(
	defineProps<{ routes: { name: string; path: string; key: string }[] }>(),
	{
		routes: () => [],
	}
);
</script>

<template>
	<nav class="flex justify-center mt-5 sm:mt-0">
		<ul
			class="relative flex w-full sm:flex-col items-center justify-center sm:w-3 sm:space-y-[14vh] font-medium text-center text-light capitalize text-sm sm:text-base"
		>
			<li
				class="flex justify-center w-full sm:w-auto"
				v-for="route in props.routes"
			>
				<NuxtLink
					class="relative rotate-0 sm:rotate-90 opacity-70 hover:opacity-100 nav-link before:absolute before:h-[1px] before:bottom-0 before:transition-[width] before:w-0 before:hover:w-full before:bg-light before:right-0 before:hover:right-[none] before:hover:left-0 tracking-wider sm:tracking-normal"
					exact-active-class="!opacity-100 before:!w-full"
					:href="route.path"
					:key="route.key"
					>{{ route.name }}</NuxtLink
				>
			</li>
		</ul>
	</nav>
</template>

<style scoped lang="scss"></style>
