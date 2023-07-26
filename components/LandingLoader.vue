<script lang="ts" setup>
import packageJson from "../package.json";

// PROPS
const props = withDefaults(
	defineProps<{ progress?: number; loadedItem?: string }>(),
	{
		progress: 0,
	}
);
</script>

<template>
	<div
		id="landing-view-wrapper"
		class="fixed top-0 h-screen w-screen flex flex-col justify-center items-center text-light bg-dark px-[50px] py-[40px] overflow-hidden z-50"
	>
		<div class="w-full">
			<a href="/" class="text-lg uppercase">{{ packageJson.name }}</a>
		</div>

		<div class="flex-1 flex flex-col justify-center items-center w-full">
			<div class="w-1/6 bg-black mb-3 progress-container">
				<div
					class="h-full bg-light duration-700"
					:style="{ width: props.progress + '%' }"
				/>
			</div>
			<p class="text-center text-sm">{{ props.progress.toFixed(0) + "%" }}</p>
		</div>

		<div class="w-full flex justify-between items-center opacity-40 text-xs">
			<span
				>Made with ❤ by
				<a
					:href="packageJson.repository.directory"
					target="_blank"
					class="underline hover:text-white"
					>@{{ packageJson.author }}</a
				></span
			>
			<span v-if="progress === 0" class="animate-pulse">⚙ Loading resources...</span>
			<span v-if="progress > 0 && progress < 100">Loaded: {{ props.loadedItem }}</span>
			<span v-if="progress === 100">Resources loaded successfully</span>
		</div>
	</div>
</template>

<style scoped>
#landing-view-wrapper {
	height: 100dvh;
	width: 100dvw;
}
h1 {
	font-weight: 600;
}
.progress-container {
	height: 2px;
}
</style>
