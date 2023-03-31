<template>
	<nav class="bg-dark text-white w-screen absolute z-40">
		<Container className="flex flex-row justify-between items-center md:py-5 ">
			<h1 class="flex flex-row items-center text-2xl font-semibold">
				<div class="h-12 w-12 rounded-full bg-primary-900 mr-5" />
				Nathan Mande
			</h1>

			<ul class="flex flex-row list-none">
				<li v-for="(item, index) in links" :key="index" class="mr-4">
					<nuxt-link
						:to="item.path"
						class="cursor-pointer text-2xl font-medium opacity-60 hover:opacity-100"
						>{{ item.label }}</nuxt-link
					>
				</li>
			</ul>
		</Container>
	</nav>
</template>

<script lang="ts">
export default {
	data() {
		return {
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
		};
	},
};
</script>
