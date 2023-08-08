<script lang="ts" setup>
import packageJson from "../package.json";
</script>

<template>
	<div
		id="landing-view-wrapper"
		class="fixed top-0 h-screen w-screen flex flex-col justify-center items-center text-light bg-dark px-[50px] py-[40px] overflow-hidden z-[1000]"
	>
		<div class="w-full">
			<a href="/" class="text-lg uppercase">{{ packageJson.name }}</a>
		</div>

		<div class="flex-1 flex flex-col justify-center items-center w-full">
			<div class="w-1/6 bg-black mb-3 progress-container">
				<div
					id="loaded-resources-progress-line"
					class="h-full bg-light duration-700"
					style="width: 0%"
				/>
			</div>

			<p id="loaded-resources-progress" class="text-center text-sm">0%</p>
		</div>

		<div class="w-full flex justify-between items-center opacity-40 text-xs">
			<span
				>v{{ packageJson.version }} | Made with ❤ by
				<a
					:href="packageJson.repository.directory"
					target="_blank"
					class="underline hover:text-white"
					>@{{ packageJson.author }}</a
				></span
			>
			<span id="last-loaded-resource" class="animate-pulse"
				>⚙ Loading resources...</span
			>
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
