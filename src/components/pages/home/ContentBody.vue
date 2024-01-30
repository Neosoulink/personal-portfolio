<script setup lang="ts">
defineProps<{ content: string; title?: string }>();
</script>

<template>
	<div
		class="flex flex-col items-start opacity-0 animate-[0.5s_linear_showWithTransition_forwards] border-light text-[4vw] xs:text-[12px] sm:text-sm"
	>
		<h3
			v-if="!!title"
			class="mb-2 text-[4.5vw] xs:text-base sm:text-lg capitalize border-b-2"
		>
			{{ title }}
		</h3>

		<div
			class="text-justify leading-[160%] transition-[opacity] duration-[0.4s]"
		>
			<span v-for="(l, i) in content.split('')" :key="i">{{ l }}</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "sass:list";

$delays: 0.6, 0.7, 0.4, 0.65, 0.8, 0.6, 0.9, 0.55, 0.5, 0.7;
$length: 10;

div {
	> span {
		opacity: 0;

		@for $i from 0 through 1 {
			&:nth-of-type(2n - #{$i}) {
				animation: #{0.2 * ($i + 1)}s linear showWithTransition forwards;
			}
		}

		@for $i from 1 through $length {
			&:nth-of-type(10n - #{$length - $i }) {
				animation-delay: #{list.nth($delays, $i)}s !important;
			}
		}
	}
}
</style>
