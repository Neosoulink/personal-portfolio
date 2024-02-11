<script setup lang="ts">
import { LiquidBgExperience } from "~/experiences/liquid-bg";
import { events } from "~/static";

const isExperienceConstructed = ref(false);
const experienceId = "liquid_bg";
const emits = defineEmits(["ready"]);

const init = () => {
	if (!process.client || isExperienceConstructed.value) return;
	const _exp = new LiquidBgExperience({
		domElementRef: `#${experienceId}`,
	});

	_exp.world?.on(events.CONSTRUCTED, () => {
		emits("ready");

		isExperienceConstructed.value = true;
	});

	_exp.construct();
};
const dispose = () => new LiquidBgExperience().destruct();

onMounted(init);
onBeforeUnmount(dispose);
</script>

<template>
	<canvas
		:id="experienceId"
		class="fixed top-0 left-0 z-0 w-full h-full transition-opacity bg-dark opacity-0 animate-[1s_linear_show-with-transition_1s_forwards]"
	/>
</template>
