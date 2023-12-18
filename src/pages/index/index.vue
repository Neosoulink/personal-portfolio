<template>
	<div class="fixed text-5xl font-bold top-1/2 text-red-50">
		<NuxtLink to="/skills">Page child 1 -> click to child 2</NuxtLink>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	key: (route) => route.fullPath,
});
</script>
