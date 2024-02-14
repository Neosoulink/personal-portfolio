<script setup lang="ts">
useServerSeoMeta({
	title: "nsl-me",
	charset: "utf-8",
	viewport: "width=device-width, initial-scale=1",
	ogTitle: "Nathan Mande's website",
	description: "A 3D experience representing Nathan Mande's room",
	ogDescription: "A 3D experience representing Nathan Mande's room",
	ogImage: "/imgs/screenshot.png",
	twitterCard: "summary_large_image",
	robots: "index, skills, contact, projects, writing, notes/credits",
	colorScheme: "dark light",
	twitterCreator: 'https://twitter.com/nsl_nathan'
});
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
