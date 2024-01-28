<script setup lang="ts">
const isExperienceReady = useState<boolean>("isExperienceReady");

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
		class="relative flex items-end justify-center flex-1 w-full h-full pb-10 sm:justify-end"
	>
		<HomeContentLanding
			v-if="!!canDisplayLanding"
			@landing-animation-done="emits('landingAnimationDone')"
			:landing-foot="landingFoot"
			:landing-head="landingHead"
		/>

		<HomeContentBody
			v-if="!canDisplayLanding && !!canDisplayBody"
			class="w-1/2 text-light"
			:title="contentTitle"
			:content="contentBody"
		/>
	</div>
</template>
