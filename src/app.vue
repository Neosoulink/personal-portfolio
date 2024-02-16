<script setup lang="ts">
useServerSeoMeta({
	charset: "utf-8",
	xUaCompatible: "IE=edge",
	viewport: "width=device-width, initial-scale=1",
	title: "Nathan Mande's Site",
	description: "A 3D experience representing Nathan Mande's room",
	ogSiteName: "Nathan Mande's Site",
	ogTitle: "Nathan Mande's website",
	ogDescription: "A 3D experience representing Nathan Mande's room",
	ogImage: "/imgs/screenshot.png",
	ogType: "website",
	twitterCard: "summary_large_image",
	twitterCreator: "https://twitter.com/nsl_nathan",
	twitterImage: "/imgs/screenshot.png",
	twitterDescription: "A 3D experience representing Nathan Mande's room",
	robots: "index, skills, contact, projects, writing, notes/credits",
	colorScheme: "dark light",
});
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
