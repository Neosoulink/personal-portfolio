<script lang="ts" setup>
import gsap from "gsap";
import packageJson from "~~/package.json";

// EXPERIENCE
import type { HomeExperience } from "~/experiences/home";

// STATIC
import { events } from "~/static";

// CONFIG
import { Config } from "~/config";
import { DeviceConfig } from "~/config/device.config";

const props = defineProps<{ experience?: HomeExperience | undefined }>();
const timeline = gsap.timeline({
	onComplete: () => {
		timeline.clear();
	},
});

const loaderContainer = ref<HTMLElement | undefined>();
const loaderButton = ref<HTMLElement | undefined>();
const isLoadingStarted = ref(false);
const isLoadingCompleted = ref<boolean | undefined>();
const isLoadingEnded = ref(false);
const appLaunchedTimes = ref(0);
const loadingProgress = ref(0);
const loadedResources = ref<string[]>([]);

const initLaunchedTimes = () => {
	let localLaunchedTimes = localStorage.getItem("launchedTimes");

	if (!localLaunchedTimes) localLaunchedTimes = "0";
	appLaunchedTimes.value = Number(localLaunchedTimes) + 1;
	localStorage.setItem("launchedTimes", appLaunchedTimes.value.toString());
};

const onLoaderProgress = (progress: number, url: string) => {
	setTimeout(() => {
		loadingProgress.value = progress;
		loadedResources.value.unshift(url.replace(/.*\/|\..*/gi, ""));
	}, 10 * progress);
};

const onLoaderCompleted = () => {
	setTimeout(() => {
		loadingProgress.value = 100;
		isLoadingCompleted.value = true;
	}, 10 * 170);
};

const initUI = () => {
	if (!props.experience) return;

	// EVENTS
	isLoadingStarted.value = true;
	isLoadingCompleted.value = false;
	isLoadingEnded.value = false;
	loadingProgress.value = 0;
	loadedResources.value = [];

	props.experience.loader?.on(events.PROGRESSED, onLoaderProgress);
	props.experience.loader?.on(events.LOADED, onLoaderCompleted);
};

const intro = () => {
	if (!loaderContainer.value || !props.experience) return;
	if (timeline.isActive()) timeline.progress(1);

	props.experience.ui?.emit(events.LOADED);
	timeline.to(loaderContainer.value, {
		duration: Config.GSAP_ANIMATION_DURATION,
		ease: Config.GSAP_ANIMATION_EASE,
		opacity: 0,
		onComplete: () => {
			loaderContainer.value?.remove();
			props.experience?.ui?.emit(events.READY);
		},
	});
};

const onPressStart = () => {
	loaderButton.value?.classList.remove("animate-pulse");
	setTimeout(() => intro(), 200);
};

const watchStopHandle = watchEffect(
	() => {
		if (!props.experience) return;

		watchStopHandle();
		initUI();
		initLaunchedTimes();

		if (DeviceConfig.DEVICE !== "pc") return;

		const onKeypress = (e: KeyboardEvent) => {
			if (e.key !== "Enter" && e.key !== " ") return;
			onPressStart();
			window?.removeEventListener("keypress", onKeypress);
		};
		window?.addEventListener("keypress", onKeypress);
	},
	{
		flush: "post",
	}
);

onBeforeUnmount(() => {
	props.experience?.loader?.off(events.PROGRESSED, onLoaderProgress);
	props.experience?.loader?.off(events.LOADED, onLoaderCompleted);
});
</script>

<template>
	<div
		ref="loaderContainer"
		v-if="!isLoadingEnded"
		class="fixed top-0 z-50 py-12 overflow-hidden h-safe w-safe text-light bg-dark"
		@load="
			(e) => {
				console.log(e?.target);
				e;
			}
		"
	>
		<G-Container class="relative flex flex-col h-full">
			<section
				class="flex flex-col items-center justify-center flex-1 text-center"
			>
				<p v-if="!isLoadingCompleted" class="text-sm">
					{{
						isLoadingStarted ? `${loadingProgress.toFixed(0)}%` : "Loading..."
					}}
				</p>

				<div
					v-if="isLoadingCompleted"
					class="flex flex-col items-center opacity-0 animate-[.3s_linear_showWithTransition_forwards]"
				>
					<button
						ref="loaderButton"
						class="px-4 py-2 capitalize border-[1px] sm:border-[1.5px] rounded-md cursor-pointer text-md animate-pulse hover:animate-none active:opacity-40 border-light font-light"
						@click.once="onPressStart"
						@keyup="onPressStart"
					>
						Press to start
					</button>

					<span
						class="text-[10px] opacity-40 mt-2 text-center group-data-[device=mobile]:hidden"
					>
						You can press
						<strong
							><svg class="inline-block h-3 fill-light" viewBox="0 0 24 24">
								<path
									d="M21,9a1,1,0,0,0-1,1v3H4V10a1,1,0,0,0-2,0v4a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V10A1,1,0,0,0,21,9Z"
								/>
							</svg>
							Space</strong
						>
						or
						<strong
							><svg viewBox="0 0 24 24" class="inline-block h-3">
								<path
									d="M20 7V8.2C20 9.88016 20 10.7202 19.673 11.362C19.3854 11.9265 18.9265 12.3854 18.362 12.673C17.7202 13 16.8802 13 15.2 13H4M4 13L8 9M4 13L8 17"
									class="stroke-light"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Enter</strong
						>
						to start.
					</span>
				</div>

				<span
					v-if="!!appLaunchedTimes"
					v-show="appLaunchedTimes > 5"
					class="animate-[.1s_linear_showWithTransition_forwards] mt-2 sm:mt-1 text-[8px]"
				>
					<span class="opacity-40"
						>You launched this app more then 5 times, Congratulation you
						unlocked this message.
					</span>
				</span>
			</section>

			<section
				class="flex flex-col-reverse items-center justify-between w-full text-xs text-center sm:flex-row opacity-40 sm:text-justify"
			>
				<div>
					<div
						:class="`mb-4 capitalize sm:mb-2 ${
							isLoadingStarted ? '' : 'animate-pulse'
						}`"
					>
						{{
							isLoadingStarted || loadedResources?.length
								? isLoadingCompleted
									? "Resources Loaded Successfully"
									: `Loaded: ${loadedResources[0]}`
								: "Loading resources..."
						}}
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
						class="h-full duration-700 bg-light"
						:style="`width: ${loadingProgress}%`"
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
