<script setup lang="ts">
const props = withDefaults(
	defineProps<{ routes: { name: string; path: string; key: string }[] }>(),
	{
		routes: () => [],
	}
);
</script>

<template>
	<nav class="flex justify-center">
		<ul
			class="relative flex flex-col items-center justify-center w-3 space-y-[14vh] font-medium text-center text-light capitalize"
		>
			<li class="flex" v-for="route in props.routes">
				<NuxtLink
					class="relative rotate-90 opacity-70 hover:opacity-100 nav-link before:absolute before:h-[1px] before:bottom-0 before:transition-[width] before:w-0 before:hover:w-full before:bg-light before:right-0 before:hover:right-[none] before:hover:left-0"
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
