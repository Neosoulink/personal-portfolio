<script setup lang="ts">
import gsap from "gsap";

const timeline = gsap.timeline({
	onComplete: () => {
		timeline.clear();
	},
});
const landingContainerRef = ref<HTMLDivElement | undefined>();

defineProps<{
	landingHead?: string;
	landingFoot?: string;
}>();

const emits = defineEmits(["landingAnimationDone"]);

onMounted(() => {
	timeline
		.to(
			{},
			{
				duration: 1.8,
				onStart: () => {
					landingContainerRef.value?.classList.remove("opacity-0");
					landingContainerRef.value?.classList.add("active", "opacity-100");
				},
			}
		)
		.add(() => {
			landingContainerRef.value?.classList.remove(
				"opacity-100",
				"translate-x-0"
			);
			landingContainerRef.value?.classList.add(
				"opacity-0",
				"reversed",
				"translate-x-[2vh]"
			);
		}, ">10%")
		.add(() => {
			emits("landingAnimationDone");
		}, "+=1");
});

onBeforeUnmount(() => {
	if (timeline.isActive()) timeline.progress(1);
	timeline.clear();
});
</script>

<template>
	<div
		ref="landingContainerRef"
		class="select-none pointer-events-none flex-row flex items-center translate-x-0 justify-center h-full flex-1 transition-[opacity,transform] duration-1000 text-light group opacity-0"
	>
		<h2
			class="font-medium transition-[inherit] duration-[inherit] leading-tight uppercase text-8xl"
		>
			<span
				class="transition-[inherit] duration-[inherit] block -translate-x-[2vh] group-[.active]:translate-x-0"
				>{{ landingHead }}</span
			>
			<span
				class="transition-[inherit] duration-[inherit] delay-100 -translate-x-[2vh] group-[.active]:translate-x-0 block"
				>{{ landingFoot }}</span
			>
		</h2>

		<div
			class="right-0 relative w-3/12 h-2 mb-32 duration-[inherit] transition-[inherit] -translate-x-[2vh] group-[.active]:translate-x-0"
		>
			<div
				class="absolute w-0 h-full bg-light group-[.active.reversed]:right-0 group-[.active.reversed]:w-0 group-[.active]:w-full duration-[inherit] transition-[width]"
			/>
		</div>
	</div>
</template>
