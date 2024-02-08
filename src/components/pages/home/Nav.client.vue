<script setup lang="ts">
const availableRoutes =
	useState<{ name: string; path: string; key: string }[]>("availableRoutes");
const isFocusMode = useState<boolean>("isFocusMode");
</script>

<template>
	<nav
		:class="`flex justify-center transition-opacity mt-5 sm:mt-0 ${
			isFocusMode ? 'opacity-40' : ''
		}`"
	>
		<ul
			class="relative flex w-full sm:flex-col items-center justify-center sm:w-3 sm:space-y-[14vh] font-medium text-center text-light text-sm sm:text-base uppercase"
		>
			<li
				class="flex justify-center w-full sm:w-auto !pointer-events-auto rotate-0 sm:rotate-90"
				v-for="route in availableRoutes"
			>
				<LazyNuxtLink
					class="relative opacity-70 hover:opacity-100 nav-link before:absolute before:h-[1px] before:bottom-0 before:transition-[width] before:w-0 before:hover:w-full before:bg-light before:right-0 before:hover:right-[none] before:hover:left-0 tracking-wider sm:tracking-normal"
					exact-active-class="!opacity-100 before:!w-full"
					:href="route.path"
					:key="route.key"
					>{{ $t(route.name) }}</LazyNuxtLink
				>
			</li>
		</ul>
	</nav>
</template>
