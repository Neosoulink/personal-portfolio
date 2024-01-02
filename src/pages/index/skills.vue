<template>
	<div class="text-5xl font-bold top-1/2 text-red-50">
		<NuxtLink to="/contact">Page child 2 -> click to child 3</NuxtLink>
	</div>
</template>

<script setup lang="ts">
import { SKILL_PAGE } from "~/static/page.static";

definePageMeta({
	key: SKILL_PAGE,
});
</script>
