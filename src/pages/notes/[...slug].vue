<script setup lang="ts">
definePageMeta({
	layout: "content",
});

const layoutState = useContentLayout();

definePageMeta({
	layout: "content",
});

onBeforeMount(async () => {
	layoutState.value.displayLeftSide = false;
});
</script>

<template>
	<ContentDoc>
		<template #not-found>
			<G-Not-Found />
		</template>
	</ContentDoc>
</template>
