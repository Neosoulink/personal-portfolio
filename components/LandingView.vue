<script lang="ts" setup>
// PROPS
const props = withDefaults(
	defineProps<{ progress?: number; display?: boolean }>(),
	{
		progress: 0,
		display: false,
	}
);
</script>

<template>
	<div
		id="landing-view-wrapper"
		class="fixed top-0 h-screen w-screen overflow-hidden flex flex-col justify-center items-center text-center bg-dark z-50"
		v-if="props.display"
	>
		<h1 class="text-8xl text-light mb-14">MYDEV JOURNEY</h1>

		<div class="w-1/6 bg-black progress-container">
			<div
				class="bg-light h-full duration-700"
				:style="{ width: props.progress + '%' }"
			/>
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
