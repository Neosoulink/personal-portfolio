<script lang="ts" setup>
// PROPS
const props = withDefaults(defineProps<{ progress?: number }>(), {
	progress: 0,
});

// STATES
const visibility = useState<boolean>("visibility", () => true);
</script>

<template>
	<div
		id="landing-view-wrapper"
		class="fixed top-0 h-screen w-screen overflow-hidden flex flex-col justify-center items-center bg-dark z-50"
		v-if="visibility"
	>
		<h1 class="text-8xl text-light mb-14">MYDEV JOURNEY</h1>

		<div class="w-1/6 bg-black progress">
			<div
				class="bg-light h-full w-1/3"
				:style="{ width: props.progress ?? 0 }"
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
.progress {
	height: 2px;
}
</style>
