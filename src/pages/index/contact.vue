<template>
	<div class="fixed text-5xl font-bold top-1/2 text-red-50">
		<NuxtLink to="/">Page child 3 -> click to child 1</NuxtLink>
	</div>
</template>

<script setup lang="ts">
import { CONTACT_PAGE } from "~/common/page.model";

definePageMeta({
	key: CONTACT_PAGE,
});
</script>
