<script lang="ts" setup>
import packageJson from "../package.json";

const state = reactive({
	links: [
		{
			label: "Projects",
			path: "/projects",
		},
		{
			label: "Blog",
			path: "/blog",
		},
	],
	isMenuOpen: false,
});
</script>

<template>
	<nav class="text-white w-screen relative z-40">
		<Container
			className="flex flex-row justify-between items-center md:mt-[50px] mt-6 "
		>
			<h1
				class="flex flex-row items-center text-2xl font-semibold drop-shadow-2xl"
			>
				<div
					class="h-10 w-10 rounded-full border border-light drop-shadow-md mr-3"
				/>
				<span class="font-bold drop-shadow-md uppercase text-lg">{{
					packageJson.name
				}}</span>
			</h1>

			<!-- <ul class="flex flex-row list-none">
				<li v-for="(item, index) in STATES.links" :key="index" class="mr-4">
					<nuxt-link
						:to="item.path"
						class="cursor-pointer text-2xl font-medium opacity-60 hover:opacity-100"
						>{{ item.label }}</nuxt-link
					>
				</li>
			</ul> -->
			<hamburger-menu-button
				:active="state.isMenuOpen"
				@click="
					() => {
						state.isMenuOpen = !state.isMenuOpen;
					}
				"
			/>
		</Container>
	</nav>
</template>
