<script setup lang="ts">
import bgImg from "~/assets/img/bg.png";
</script>

<template>
	<NuxtLoadingIndicator color="#fff" />

	<div
		class="w-screen min-h-safe group-data-[device=pc]:!min-h-screen overflow-hidden bg-dark px-0 lg:px-60 layout relative"
		:style="{ backgroundImage: `url(${bgImg})` }"
	>
		<LazyGContainer class="top-0 min-h-screen px-4 py-1 mt-0 prose bg-dark prose-invert">
			<slot class="top-0 mt-0" />
		</LazyGContainer>
	</div>
</template>

<style scoped lang="scss">
div.layout {
	background-position: center;
	background-repeat: repeat;
	background-size: 500px;
	background-attachment: fixed;
}

.prose :deep(img) {
	border-radius: 10px;
	margin: auto;
}
</style>
