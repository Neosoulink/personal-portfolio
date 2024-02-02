<script lang="ts" setup>
import gsap from "gsap";
import packageJson from "~~/package.json";

// EXPERIENCE
import { HomeExperience } from "~/experiences/home";

// STATIC
import { events } from "~/static";

// CONFIG
import { Config } from "~/config";
import { DeviceConfig } from "~/config/device.config";

const isExperienceConstructed = useState("isExperienceConstructed");
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
const isButtonPressable = ref(true);

const initLaunchedTimes = () => {
	let localLaunchedTimes = localStorage.getItem("launchedTimes");

	if (!localLaunchedTimes) localLaunchedTimes = "0";
	appLaunchedTimes.value = Number(localLaunchedTimes) + 1;
	localStorage.setItem("launchedTimes", appLaunchedTimes.value.toString());
};

const onLoadStart = () => {
	isLoadingStarted.value = true;
	isLoadingCompleted.value = false;
	isLoadingEnded.value = false;
	loadingProgress.value = 0;
	loadedResources.value = [];
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
	const _exp = new HomeExperience();
	if (!_exp) return;

	// EVENTS
	onLoadStart();
	_exp.loader?.on(events.PROGRESSED, onLoaderProgress);
	_exp.loader?.on(events.LOADED, onLoaderCompleted);
};

const intro = () => {
	if (!loaderContainer.value || !isExperienceConstructed.value) return;
	if (timeline.isActive()) timeline.progress(1);
	const _exp = new HomeExperience();

	_exp.ui?.emit(events.LOADED);
	timeline.to(loaderContainer.value, {
		duration: Config.GSAP_ANIMATION_DURATION,
		ease: Config.GSAP_ANIMATION_EASE,
		opacity: 0,
		onComplete: () => {
			loaderContainer.value?.remove();
			_exp?.ui?.emit(events.READY);
		},
	});
};

const onPressStart = () => {
	if (!isButtonPressable.value) return;
	isButtonPressable.value = false;
	console.log(isButtonPressable.value)
	window?.removeEventListener("keypress", onKeypress);
	setTimeout(() => intro(), 200);
};

const onKeypress = (e: KeyboardEvent) => {
	if (!isLoadingCompleted.value || (e.key !== "Enter" && e.key !== " ")) return;
	onPressStart();
};

const watchStopHandle = watchEffect(
	() => {
		if (!isExperienceConstructed.value) return;

		watchStopHandle();
		initUI();
		initLaunchedTimes();

		if (DeviceConfig.DEVICE !== "pc") return;

		window?.addEventListener("keypress", onKeypress);
	},
	{
		flush: "post",
	}
);

onBeforeUnmount(() => {
	const _exp = new HomeExperience();
	_exp?.loader?.off(events.PROGRESSED, onLoaderProgress);
	_exp?.loader?.off(events.LOADED, onLoaderCompleted);
});
</script>

<template>
	<div
		ref="loaderContainer"
		v-if="!isLoadingEnded"
		class="fixed top-0 z-50 py-12 overflow-hidden h-safe w-safe text-light bg-dark"
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
						:class="`px-4 py-2 capitalize border-[1px] sm:border-[1.5px] rounded-md cursor-pointer text-md hover:animate-none active:opacity-40 border-light font-light ${
							isButtonPressable ? 'animate-pulse' : 'pointer-events-none'
						}`"
						@click.once="onPressStart"
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
					<span
						class="text-[10px] mt-1 opacity-40 text-center group-data-[device=mobile]:hidden"
						>Better experience with
						<strong>
							<svg
								viewBox="0 0 668 664"
								class="inline-block h-[10px] mb-[2px] fill-light"
							>
								<path
									d="M25.6606 553.693C11.9939 553.693 0.660608 542.36 0.660608 528.693V338.693C-1.00606 248.359 32.6606 163.026 95.3273 99.026C157.994 35.3594 241.994 0.359375 332.327 0.359375C516.993 0.359375 667.327 150.693 667.327 335.36V525.36C667.327 539.027 655.993 550.36 642.327 550.36C628.66 550.36 617.327 539.027 617.327 525.36V335.36C617.327 178.359 489.66 50.3594 332.327 50.3594C255.327 50.3594 183.994 80.026 130.994 134.026C77.6606 188.359 49.3273 260.693 50.6606 338.027V528.36C50.6606 542.36 39.6606 553.693 25.6606 553.693Z"
								/>
								<path
									d="M132 346.973H127.666C57.6665 346.973 0.666504 403.973 0.666504 473.973V536.64C0.666504 606.64 57.6665 663.64 127.666 663.64H132C202 663.64 259 606.64 259 536.64V473.973C259 403.973 202 346.973 132 346.973Z"
								/>
								<path
									d="M540.333 346.973H536C466 346.973 409 403.973 409 473.973V536.64C409 606.64 466 663.64 536 663.64H540.333C610.333 663.64 667.333 606.64 667.333 536.64V473.973C667.333 403.973 610.333 346.973 540.333 346.973Z"
								/>
							</svg>

							headphones.</strong
						></span
					>
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
