<script setup lang="ts">
const isExperienceReady = useState<boolean>("isExperienceReady");
const isFreeCamera = useState<boolean>("isFreeCamera");

withDefaults(
	defineProps<{
		canDisplayLanding?: boolean;
		canDisplayBody?: boolean;
		landingHead?: string;
		landingFoot?: string;
		contentTitle?: string;
		contentBody: string;
	}>(),
	{ canDisplayBody: true }
);

const emits = defineEmits(["landingAnimationDone"]);
</script>

<template>
	<div
		v-if="isExperienceReady"
		:class="`relative flex items-end justify-center flex-1 w-full h-full sm:items-end sm:pb-10 sm:justify-end transition-opacity ${
			isFreeCamera ? 'opacity-0' : 'opacity-100'
		}`"
	>
		<HomeContentLanding
			v-if="!!canDisplayLanding"
			class="z-10 h-full sm:flex-1"
			@landing-animation-done="emits('landingAnimationDone')"
			:landing-foot="landingFoot"
			:landing-head="landingHead"
		/>

		<HomeContentBody
			v-if="!canDisplayLanding && !!canDisplayBody"
			class="w-full p-4 pb-0 bg-black sm:w-2/3 md:w-1/2 lg:w-[38%] text-light backdrop-blur-sm bg-opacity-20 sm:backdrop-blur-none sm:bg-transparent sm:p-0 sm:![text-shadow:_0_1px_3px_rgb(0_0_0_/_70%)] z-10"
			:title="contentTitle"
			:content="contentBody"
		/>
	</div>
</template>
