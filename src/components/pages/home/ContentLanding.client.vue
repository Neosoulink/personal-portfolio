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
	setTimeout(() => {
		timeline
			.to(
				{},
				{
					duration: 2,
					onStart: () => {
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
	}, 100);
});

onBeforeUnmount(() => {
	if (timeline.isActive()) timeline.progress(1);
	timeline.clear();
});
</script>

<template>
	<div
		ref="landingContainerRef"
		class="flex flex-col justify-center transition-all duration-1000 translate-x-0 opacity-0 sm:flex-row sm:items-center text-light group"
	>
		<h2
			class="font-medium transition-[inherit] duration-[inherit] leading-tight uppercase text-[10vw] sm:text-[8vw] lg:text-8xl sm:mr-3 md:mr-5"
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
			class="right-0 relative w-[30vw] sm:w-3/12 sm:h-2 h-1 duration-[inherit] transition-[inherit] -translate-x-[2vh] group-[.active]:translate-x-0 mb-[8vw] sm:mb-[10vw] lg:mb-24"
		>
			<div
				class="absolute w-0 h-full bg-light group-[.active.reversed]:right-0 group-[.active.reversed]:w-0 group-[.active]:w-full duration-[inherit] transition-[width]"
			/>
		</div>
	</div>
</template>
