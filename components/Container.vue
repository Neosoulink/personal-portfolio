<template>
	<div class="mx-auto md:px-16 px-2" :class="className" :style="style">
		<slot />
	</div>
</template>

<script lang="ts">
export default {
	props: {
		style: Object,
		className: String,
	},
};
</script>
