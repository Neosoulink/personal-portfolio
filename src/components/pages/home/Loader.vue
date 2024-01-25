<script lang="ts" setup>
// @ts-ignore <No types supports>
import { getData, setData } from "nuxt-storage/local-storage";
import packageJson from "~~/package.json";

// EXPERIENCE
import { UI } from "~/experiences/home/ui";

let localLaunchedTimes = getData("launched-times");
let launchedTimes = Number(localLaunchedTimes);

if (!localLaunchedTimes) {
	localLaunchedTimes = "0";
	setData("launched-times", localLaunchedTimes);
} else {
	launchedTimes = launchedTimes + 1;
	setData("launched-times", launchedTimes.toString());
}
</script>

<template>
	<div
		:id="UI.loaderContainerId"
		class="fixed top-0 h-safe w-safe flex flex-col text-light bg-dark px-6 sm:px-10 md:px-14 py-12 overflow-hidden z-[9999]"
	>
		<section class="flex flex-col items-start">
			<h1 class="flex flex-row items-center">
				<img
					src="~/assets/img/logo.png"
					class="mb-[2px] mr-3 rounded-full h-7 min-w-7 drop-shadow-md"
				/>
				<G-WaveString
					class="text-lg font-normal uppercase cursor-pointer"
					:string="packageJson.name"
				/>
			</h1>
			<span
				v-if="!!localLaunchedTimes"
				v-show="launchedTimes > 5"
				class="text-[8px] opacity-40"
				>You launched this app more then 5 times, Congratulation you unlocked
				this message.
			</span>
		</section>

		<section class="flex items-center justify-center flex-1">
			<p :id="UI.loadedResourcesProgressId" class="text-sm text-center">
				Loading...
			</p>

			<button
				:id="UI.loadedResourcesStartButtonId"
				class="hidden px-4 py-2 capitalize border-[1px] sm:border-[1.5px] rounded-md cursor-pointer text-md animate-pulse hover:animate-none active:opacity-40 border-light font-light"
			>
				Press to start
			</button>
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
