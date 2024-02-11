<script setup lang="ts">
definePageMeta({
	layout: "content-lite",
});
</script>

<template>
	<ContentDoc>
		<template #not-found>
			<G-Not-Found />
		</template>
	</ContentDoc>
</template>
