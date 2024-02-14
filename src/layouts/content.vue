<script setup lang="ts">
import { Config } from "~/config";

const layoutState = useContentLayout();
const route = useRoute();
</script>

<template>
	<NuxtLoadingIndicator color="#fff" />

	<div
		class="w-screen z-10 h-dvh n overflow-hidden relative flex flex-col sm:flex-row sm:justify-center px-0 lg:px-[10vw] text-light bg-dark"
	>
		<LazyGLiquidBg />

		<div
			v-if="layoutState.displayLeftSide"
			class="sm:relative sm:max-h-safe sm:group-data-[device=pc]:!max-h-screen text-sm sm:w-[30vw] lg:w-72 pt-[20px] sm:pt-0 sm:py-1 font-medium z-10"
		>
			<div
				class="top-0 sm:flex flex-col justify-center sm:h-full px-4 sm:px-5 sm:fixed sm:w-[30vw] lg:w-72"
			>
				<div
					v-if="layoutState.displayTitle"
					class="relative w-full mb-2 sm:mb-4 sm:min-h-[220px] sm:h-[50vh] sm:max-h-[300px]"
				>
					<div
						class="sm:absolute left-0 sm:w-[5px] motion-safe:animate-[.4s_ease-in-out_extend-height_forwards] s sm:bg-light flex justify-start items-start sm:ml-[70px] w-full h-auto"
					>
						<h1
							class="relative text-4xl font-medium tracking-wider uppercase rotate-0 xs:text-5xl sm:text-6xl sm:top-0 sm:-left-3 sm:rotate-90"
						>
							<span
								class="sm:absolute sm:w-[100vh] nav-link sm:tracking-normal"
								>{{
									layoutState.title.length
										? layoutState.title
										: route.name === "index"
										? ""
										: route.name
								}}</span
							>
						</h1>
					</div>
				</div>

				<div
					v-if="!!layoutState.subTitle?.length"
					:class="`flex flex-row mb-2 sm:mb-4 z-10 space-x-2 ${
						layoutState.displayTitle ? '' : 'sm:justify-center'
					}`"
				>
					<span>{{ layoutState.subTitle }}</span>
				</div>

				<div class="z-10" v-if="layoutState.displayNetworks">
					<div
						:class="`mb-2 opacity-60 text-sm ${
							layoutState.displayTitle ? '' : 'sm:text-center'
						}`"
					>
						{{ $t("mySocials") }}
					</div>

					<div
						:class="`flex flex-row space-x-2 font-medium ${
							layoutState.displayTitle ? '' : 'sm:justify-center'
						}`"
					>
						<a
							:href="Config.DISCORD_LINK"
							target="_blank"
							class="flex items-center justify-center transition-[background] bg-white rounded-full cursor-pointer w-8 h-8 bg-opacity-10 hover:bg-opacity-25 opacity-60 hover:opacity-100"
							><svg viewBox="0 0 656 500" class="w-5 h-5 fill-none">
								<path
									d="M555.899 42.3646C629.948 151.237 666.518 274.043 652.847 415.42C652.79 416.019 652.478 416.568 651.986 416.928C595.911 458.104 541.581 483.093 488.013 499.665C487.596 499.792 487.15 499.785 486.737 499.645C486.324 499.505 485.965 499.24 485.71 498.886C473.335 481.667 462.09 463.513 452.239 444.45C451.673 443.327 452.19 441.975 453.353 441.532C471.212 434.803 488.194 426.739 504.528 417.191C505.815 416.437 505.897 414.593 504.708 413.707C501.241 411.134 497.807 408.429 494.521 405.725C493.906 405.225 493.078 405.126 492.382 405.462C386.336 454.432 270.169 454.432 162.87 405.462C162.173 405.151 161.346 405.258 160.747 405.749C157.469 408.454 154.027 411.134 150.593 413.707C149.404 414.593 149.503 416.437 150.798 417.191C167.132 426.558 184.114 434.803 201.948 441.565C203.103 442.008 203.652 443.327 203.079 444.45C193.44 463.538 182.196 481.692 169.591 498.911C169.042 499.608 168.14 499.927 167.288 499.665C113.974 483.093 59.6442 458.104 3.56859 416.928C3.10143 416.568 2.7654 415.994 2.71623 415.396C-8.7087 293.106 14.5755 169.285 99.574 42.34C99.7789 42.004 100.09 41.7417 100.451 41.586C142.274 22.3914 187.08 8.2701 233.911 0.205448C234.764 0.0743153 235.616 0.467713 236.058 1.22173C241.845 11.4665 248.459 24.6043 252.934 35.3408C302.297 27.8007 352.43 27.8007 402.826 35.3408C407.301 24.8338 413.686 11.4665 419.447 1.22173C419.653 0.847668 419.971 0.547993 420.356 0.365485C420.742 0.182977 421.175 0.126965 421.595 0.205448C468.45 8.29469 513.256 22.416 555.047 41.586C555.415 41.7417 555.719 42.004 555.899 42.3646ZM278.029 274.879C278.545 238.727 252.188 208.813 219.101 208.813C186.285 208.813 160.182 238.465 160.182 274.879C160.182 311.285 186.802 340.937 219.101 340.937C251.926 340.937 278.029 311.285 278.029 274.879ZM495.889 274.879C496.406 238.727 470.048 208.813 436.97 208.813C404.146 208.813 378.042 238.465 378.042 274.879C378.042 311.285 404.662 340.937 436.97 340.937C470.048 340.937 495.889 311.285 495.889 274.879Z"
									class="fill-light"
								/>
							</svg>
						</a>

						<a
							:href="Config.TWITTER_LINK"
							target="_blank"
							class="flex items-center justify-center transition-[background] bg-white rounded-full cursor-pointer w-8 h-8 bg-opacity-10 hover:bg-opacity-25 opacity-60 hover:opacity-100"
							><svg class="w-5 h-5 fill-none" viewBox="0 0 500 500">
								<path
									d="M297.042 211.5L482.833 0H438.812L277.417 183.604L148.604 0H0L194.833 277.667L0 499.438H44.0208L214.354 305.5L350.417 499.438H499.021L297.042 211.5ZM236.729 280.104L216.958 252.438L59.8958 32.5H127.521L254.312 210.063L274 237.729L438.792 468.521H371.167L236.729 280.104Z"
									fill="white"
								/>
							</svg>
						</a>

						<a
							:href="Config.GITHUB_LINK"
							target="_blank"
							class="flex items-center justify-center transition-[background] bg-white rounded-full cursor-pointer w-8 h-8 bg-opacity-10 hover:bg-opacity-25 opacity-60 hover:opacity-100"
							><svg viewBox="0 0 513 500" fill="none" class="w-5 h-5 fill-none">
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M256.297 0C114.757 0 0 114.757 0 256.34C0 369.583 73.4365 465.653 175.298 499.561C188.119 501.907 192.791 493.993 192.791 487.188C192.791 481.119 192.578 464.991 192.45 443.606C121.146 459.093 106.107 409.239 106.107 409.239C94.4489 379.641 77.639 371.759 77.639 371.759C54.3654 355.845 79.3989 356.165 79.3989 356.165C105.126 357.988 118.661 382.585 118.661 382.585C141.529 421.751 178.658 410.434 193.26 403.885C195.596 387.32 202.199 376.025 209.537 369.615C152.622 363.151 92.7743 341.147 92.7743 242.933C92.7743 214.955 102.769 192.066 119.162 174.146C116.528 167.661 107.728 141.604 121.669 106.31C121.669 106.31 143.193 99.4193 192.162 132.591C212.609 126.906 234.538 124.058 256.329 123.962C278.099 124.058 300.029 126.906 320.508 132.591C369.444 99.4193 390.926 106.31 390.926 106.31C404.909 141.604 396.109 167.661 393.475 174.146C409.901 192.066 419.831 214.955 419.831 242.933C419.831 341.403 359.887 363.066 302.78 369.412C311.996 377.326 320.188 392.963 320.188 416.887C320.188 451.147 319.878 478.793 319.878 487.188C319.878 494.057 324.486 502.035 337.499 499.529C439.275 465.557 512.648 369.551 512.648 256.34C512.648 114.757 397.88 0 256.297 0Z"
									class="fill-light"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>

		<div
			class="z-10 flex flex-col flex-1 px-4 py-5 overflow-hidden prose sm:py-10 prose-invert"
		>
			<LazyGHeader
				:show-logo="false"
				:show-menu-icon="false"
				:routes="
					layoutState.headerLinks ?? [
						{ title: 'Home', path: '/' },
						{ title: 'Writing', path: '/writing' },
						{ title: 'Projects', path: '/projects' },
					]
				"
				class="mb-5 sm:my-0 sm:mb-10"
			/>

			<div class="flex-1 overflow-y-auto">
				<slot />
			</div>

			<LazyContentEditOnGithub class="font-medium" />
		</div>
	</div>
</template>
