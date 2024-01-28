<script lang="ts" setup>
import packageJson from "~~/package.json";

// EXPERIENCE
import { UI } from "~/experiences/home/ui";

const states = reactive({ launchedTimes: 0 });

onMounted(() => {
	if (!process?.client) return;
	let localLaunchedTimes = localStorage.getItem("launched-times");
	states.launchedTimes = isNaN(Number(localLaunchedTimes))
		? 0
		: Number(localLaunchedTimes);

	if (!localLaunchedTimes) {
		localLaunchedTimes = "0";
		localStorage.setItem("launched-times", localLaunchedTimes);
	} else {
		states.launchedTimes = states.launchedTimes + 1;
		localStorage.setItem("launched-times", states.launchedTimes.toString());
	}
});
</script>

<template>
	<div
		:id="UI.loaderContainerId"
		class="fixed top-0 z-50 py-12 overflow-hidden h-safe w-safe text-light bg-dark"
	>
		<G-Container class="relative flex flex-col h-full">
			<section class="flex flex-col items-center justify-center flex-1">
				<p :id="UI.loadedResourcesProgressId" class="text-sm text-center">
					Loading...
				</p>

				<button
					:id="UI.loadedResourcesStartButtonId"
					class="hidden px-4 py-2 capitalize border-[1px] sm:border-[1.5px] rounded-md cursor-pointer text-md animate-pulse hover:animate-none active:opacity-40 border-light font-light"
				>
					Press to start
				</button>

				<!-- <span class="text-[8px] opacity-40 mt-2 text-center">
					You can use space or enter to start.
				</span> -->

				<span
					v-if="!!states.launchedTimes"
					v-show="states.launchedTimes > 5"
					class="text-[8px] opacity-40 mt-2 text-center"
					>You launched this app more then 5 times, Congratulation you unlocked
					this message.
				</span>
			</section>

			<section
				class="flex flex-col-reverse items-center justify-between w-full text-xs text-center pointer-events-none sm:flex-row opacity-40 sm:text-justify"
			>
				<div>
					<div
						:id="UI.lastLoadedResourceId"
						class="mb-4 capitalize sm:mb-2 animate-pulse"
					>
						Loading resources...
					</div>

					<div>
						v{{ packageJson.version }} | Made with ❤ by
						<a
							:href="packageJson.repository.directory"
							target="_blank"
							class="underline hover:text-white"
							>@{{ packageJson.author }}</a
						>
					</div>
				</div>

				<div class="w-8/12 bg-black h-[2px] mb-2 sm:mb-0 sm:rotate-180">
					<div
						:id="UI.loadedResourcesProgressLineId"
						class="h-full duration-700 bg-light"
						style="width: 0%"
					/>
				</div>
			</section>
		</G-Container>
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
</style>
