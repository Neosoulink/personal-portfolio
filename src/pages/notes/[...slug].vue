<script setup lang="ts">
definePageMeta({
	layout: "content",
});
</script>

<template>
	<LazyGHeader
		:show-logo="false"
		:show-menu-icon="false"
		:routes="[
			{ title: 'About', path: '/notes/about/' },
			{ title: 'Credits', path: '/notes/credits' },
		]"
		class="mt-3"
	/>

	<ContentDoc>
		<template #not-found>
			<G-Not-Found />
		</template>
	</ContentDoc>
</template>
