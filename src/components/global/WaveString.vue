<script setup lang="ts">
const props = defineProps<{ string: string }>();
</script>

<template>
	<span class="flex flex-row">
		<div
			v-for="(l, i) in props.string.split('')"
			:key="i"
			class="transition-all drop-shadow-md"
		>
			{{ l }}
		</div>
	</span>
</template>

<style lang="scss" scoped>
@for $i from 1 through 12 {
	span:hover > div:nth-child(#{$i}) {
		transition-delay: 0.03s * ($i + 1);
		scale: 1;
		translate: 5px * ($i * 0.25);
	}
}
</style>
