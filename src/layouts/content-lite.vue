<script setup lang="ts">
const layoutState = useContentLiteLayout();
</script>

<template>
	<NuxtLoadingIndicator color="#fff" />

	<div class="relative flex justify-center-center bg-dark">
		<LazyGLiquidBg />

		<div
			class="flex flex-col px-4 py-5 mx-auto overflow-hidden prose w-dvw h-dvh text-light sm:py-10 prose-invert"
		>
			<LazyGHeader
				:show-logo="false"
				:show-menu-icon="false"
				:routes="
					layoutState.headerLinks ?? [
						{ title: 'About', path: '/notes/about' },
						{ title: 'Credits', path: '/notes/credits' },
					]
				"
				class="z-10 mb-5 sm:my-0 sm:mb-7"
			/>

			<div class="z-10 flex-1 overflow-y-auto">
				<slot />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.prose :deep(img) {
	border-radius: 10px;
	margin: auto;
	margin-top: -1.25rem;
}
</style>
